```markdown
---
name: insiders-secure-coding
description: Trigger this skill whenever writing, modifying, or reviewing Next.js Server Actions, Route Handlers (APIs), or Supabase database queries. It enforces INSIDERS' mandatory security policies: 1. Strict RBAC authorization checks. 2. Prohibition of `SELECT *` (DTO pattern). 3. PII & Payment Data Minimization.
---

# INSIDERS. Secure Coding Guidelines

When writing or modifying code for the INSIDERS. project, you MUST strictly adhere to the following enterprise-grade security rules. Never output code that violates these principles.

## 1. サーバーアクション・APIでの権限の二重チェック (Strict RBAC Authorization)
All Server Actions and Route Handlers that mutate data or access sensitive information MUST verify the user's role before execution. Do not rely solely on UI hiding or DB RLS.

**❌ Bad (Vulnerable Code):**
```typescript
export async function updateCreatorTier(creatorId: string, tier: string) {
  const supabase = await createServerClient(/* ... */);
  await supabase.from('creators').update({ tier }).eq('id', creatorId);
}
✅ Good (Secure Code for INSIDERS):
code
TypeScript
export async function updateCreatorTier(creatorId: string, tier: string) {
  const supabase = await createServerClient(/* ... */);
  
  // 1. 認証と権限(Role)のチェックを必ず行う
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  // 2. 運営(Admin)のチェックは @nots-inc.com ドメインで行う
  const isNotsAdmin = user.email?.endsWith('@nots-inc.com');
  if (!isNotsAdmin) {
    throw new Error("Forbidden: Admin access required");
  }

  // 3. 処理の実行
  await supabase.from('creators').update({ tier }).eq('id', creatorId);
}
2. SELECT * の使用禁止と個人情報の隔離 (Prohibit SELECT * & PII Isolation)
When querying Supabase, NEVER use .select('*'). You must explicitly declare only the columns required by the UI (DTO pattern) to prevent accidental leakage of PII (Personally Identifiable Information) or internal flags to the browser.
Specifically for INSIDERS: NEVER expose real_name, contact_id, or email to the Advertiser UI. These are strictly for Admin/Ops use.
❌ Bad (Data Leakage Risk):
code
TypeScript
const { data } = await supabase.from('creators').select('*').eq('tier', 'S');
✅ Good (DTO Pattern & PII Protection):
code
TypeScript
// 広告主画面に必要なカラムだけを明示的に指定する（本名やLINE IDは絶対に含めない）
const { data } = await supabase.from('creators')
  .select('id, tiktok_handle, tier, vibe_tags, avatar_url, nationality')
  .eq('tier', 'S');
3. 決済情報と環境変数の保護 (Payment Data & Environment Safety)
決済情報の非保持: NEVER design database tables to store raw credit card numbers or bank account details. Rely solely on Stripe Customer IDs (cus_...) and Stripe Connect Account IDs (acct_...).
環境変数: Never expose service role keys or sk_live_... / sk_test_... Stripe keys to the client. Do not prefix secrets with NEXT_PUBLIC_ unless absolutely necessary for public access (like the Supabase Anon Key).
4. ローカル環境のフェイルセーフ (Graceful Degradation in Local Dev)
When implementing Vercel KV (Redis) for Rate Limiting in middleware.ts, always check for the existence of environment variables to prevent local development environments from crashing.
code
TypeScript
// ✅ Good: Check env vars before applying rate limit
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { success } = await ratelimit.limit(ip);
    if (!success) return new NextResponse('Too Many Requests', { status: 429 });
} else {
    console.warn('Skipping rate limit in local dev');
}