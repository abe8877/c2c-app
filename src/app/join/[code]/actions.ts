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
                throw new Error("無効な招待コードです。URLが正しいかご確認ください。");
            }
            if (creatorData.is_onboarded || creatorData.status === 'onboarded') {
                throw new Error("この招待コードは既に使用されています。");
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
            throw new Error("アカウントの作成に失敗しました。既に登録済みのメールアドレスの可能性があります。");
        }

        // 3. 厳格なRBAC適用（user_rolesへcreatorとしてINSERT）
        const { error: roleError } = await supabaseAdmin.from('user_roles').insert({
            user_id: authData.user.id,
            role: 'creator'
        });

        if (roleError) {
            console.error("Role insert error:", roleError);
            throw new Error("権限の付与に失敗しました。");
        }

        let finalAvatarUrl = avatarUrl;

        // 4. Storageへの安全な画像アップロード (Service Role)
        if (avatarFile && avatarFile.size > 0) {
            if (!avatarFile.type.startsWith('image/')) {
                throw new Error("画像ファイルを選択してください。");
            }
            const extension = avatarFile.name.split('.').pop() || 'png';
            const filePath = `creator_${authData.user.id}_${Date.now()}.${extension}`;

            const { error: uploadError } = await supabaseAdmin.storage
                .from('avatars')
                .upload(filePath, avatarFile, {
                    contentType: avatarFile.type,
                });

            if (uploadError) {
                console.error("Upload error:", uploadError);
                throw new Error("画像のアップロードに失敗しました。");
            }

            const { data: { publicUrl } } = supabaseAdmin.storage
                .from('avatars')
                .getPublicUrl(filePath);

            finalAvatarUrl = publicUrl;
        }

        // 5. creatorsテーブルをUPDATEまたはINSERT
        if (isApply) {
            const generatedCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            const { data: newCreator, error: insertError } = await supabaseAdmin
                .from('creators')
                .insert({
                    user_id: authData.user.id,
                    email: email,
                    portfolio_video_url: portfolioUrl,
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

            if (insertError) {
                console.error("Creator insert failed:", insertError);
                throw new Error("プロフィールの作成に失敗しました。");
            }
            creatorId = newCreator.id;
        } else {
            const { error: updateError } = await supabaseAdmin
                .from('creators')
                .update({
                    user_id: authData.user.id,
                    email: email,
                    portfolio_video_url: portfolioUrl,
                    avatar_url: finalAvatarUrl,
                    real_name: realName,
                    nationality: nationality,
                    contact_app: contactApp,
                    contact_id: contactId,
                    vibe_tags: vibeTags,
                    status: 'onboarded',
                    is_onboarded: true,
                    updated_at: new Date().toISOString(),
                })
                .eq('invite_code', inviteCode);

            if (updateError) {
                console.error("Creator update failed:", updateError);
                throw new Error("プロフィールの更新に失敗しました。");
            }
        }

        // 6. オートメール / サムネイル生成Webhookのトリガー (サムネイルがない場合のみ)
        const { triggerN8nWebhook } = await import('@/app/actions/creator');
        if (!finalAvatarUrl && creatorId) {
            triggerN8nWebhook(creatorId, portfolioUrl);
        }

        // 7. ダッシュボードへリダイレクト
        redirect('/creator');
    });
};