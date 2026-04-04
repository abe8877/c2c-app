'use server';

import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { publicAction } from '@/lib/actions/safe-action';

export const submitCreatorApplication = async (formData: FormData) => {
    return publicAction(formData, async (payload) => {
        const supabase = await createServerClient();

        // 1. フォームデータの取得
        const inviteCode = payload.get('inviteCode') as string;
        const email = payload.get('email') as string;
        const password = payload.get('password') as string;
        const portfolioUrl = payload.get('portfolio_video_url') as string;
        const avatarUrl = payload.get('avatar_url') as string;
        const realName = payload.get('real_name') as string;
        const nationality = payload.get('nationality') as string;
        const contactApp = payload.get('contact_app') as string;
        const contactId = payload.get('contact_id') as string;
        const vibeTagsJson = payload.get('vibe_tags') as string;
        const vibeTags = vibeTagsJson ? JSON.parse(vibeTagsJson) : [];
        const avatarFile = payload.get('avatar_file') as File | null;

        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const isApply = inviteCode === 'apply';
        let creatorId: string | null = null;

        // 2. 招待コードの有効性を検証 (Auth作成前に必ず実行)
        if (!isApply) {
            const { data: creatorData, error: creatorCheckError } = await supabaseAdmin
                .from('creators')
                .select('id, is_onboarded, status')
                .eq('invite_code', inviteCode)
                .single();

            if (creatorCheckError || !creatorData) {
                console.error("Invite code check error:", creatorCheckError);
                return { success: false, error: "無効な招待コードです。URLが正しいかご確認ください。" };
            }
            if (creatorData.is_onboarded || creatorData.status === 'onboarded') {
                return { success: false, error: "この招待コードは既に使用されています。" };
            }
            creatorId = creatorData.id;
        }

        // 3. Supabaseでアカウント作成（サインアップ）
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError || !authData.user) {
            console.error("Auth error:", authError);
            return { success: false, error: "アカウントの作成に失敗しました。既に登録済みのメールアドレスの可能性があります。" };
        }

        const userId = authData.user.id;

        // 4. 厳格なRBAC適用（user_rolesへcreatorとしてINSERT）
        const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({
                user_id: userId,
                role: 'creator',
                status: 'active'
            });

        // 🔥 デバッグログ: user_rolesのINSERTエラーを出力
        if (roleError) {
            console.error("🔥 [DEBUG] user_roles INSERT Error:", roleError);
            return { success: false, error: `権限付与エラー: ${roleError.message}` };
        }

        let finalAvatarUrl = avatarUrl;

        // 5. Storageへの安全な画像アップロード (Service Role)
        if (avatarFile && avatarFile.size > 0) {
            if (!avatarFile.type.startsWith('image/')) {
                return { success: false, error: "画像ファイルを選択してください。" };
            }
            const extension = avatarFile.name.split('.').pop() || 'png';
            const filePath = `creator_${userId}_${Date.now()}.${extension}`;

            const { error: uploadError } = await supabaseAdmin.storage
                .from('avatars')
                .upload(filePath, avatarFile, {
                    contentType: avatarFile.type,
                });

            if (uploadError) {
                console.error("Upload error:", uploadError);
                return { success: false, error: "画像のアップロードに失敗しました。" };
            }

            const { data: { publicUrl } } = supabaseAdmin.storage
                .from('avatars')
                .getPublicUrl(filePath);

            finalAvatarUrl = publicUrl;
        }

        // 6. creatorsテーブルをUPDATEまたはINSERT
        if (isApply) {
            const generatedCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            const { data: newCreator, error: insertError } = await supabaseAdmin
                .from('creators')
                .insert({
                    auth_id: userId, // 🔴 user_id から auth_id に修正
                    email: email,
                    portfolio_video_urls: [portfolioUrl], // 🔴 複数形にし、配列 [ ] で囲む
                    avatar_url: finalAvatarUrl,
                    real_name: realName,
                    nationality: nationality,
                    contact_app: contactApp,
                    contact_id: contactId,
                    vibe_tags: vibeTags,
                    status: 'under_review',
                    is_onboarded: true,
                    invite_code: generatedCode,
                    tier: 'B' // 一般応募はTier Bから
                })
                .select('id')
                .single();

            // 🔥 デバッグログ: creatorsのINSERTエラーを出力
            if (insertError) {
                console.error("🔥 [DEBUG] creators INSERT Error:", insertError);
                return { success: false, error: `クリエイター登録エラー: ${insertError.message}` };
            }
            creatorId = newCreator.id;
        } else {
            const { error: updateError } = await supabaseAdmin
                .from('creators')
                .update({
                    auth_id: userId, // 🔴 user_id から auth_id に修正
                    email: email,
                    portfolio_video_urls: [portfolioUrl], // 🔴 複数形にし、配列 [ ] で囲む
                    avatar_url: finalAvatarUrl,
                    real_name: realName,
                    nationality: nationality,
                    contact_app: contactApp,
                    contact_id: contactId,
                    vibe_tags: vibeTags,
                    status: 'onboarded', // 招待組はここでオンボーディング完了
                    is_onboarded: true,
                    updated_at: new Date().toISOString(),
                })
                .eq('invite_code', inviteCode);

            // 🔥 デバッグログ: creatorsのUPDATEエラーを出力
            if (updateError) {
                console.error("🔥 [DEBUG] creators UPDATE Error:", updateError);
                return { success: false, error: `クリエイター更新エラー: ${updateError.message}` };
            }
        }

        // 7. オートメール / サムネイル生成Webhookのトリガー (サムネイルがない場合のみ)
        const { triggerN8nWebhook } = await import('@/app/actions/creator');
        if (!finalAvatarUrl && creatorId) {
            triggerN8nWebhook(creatorId, portfolioUrl);
        }

        // 8. ダッシュボードへリダイレクト
        redirect('/creator');
    });
};