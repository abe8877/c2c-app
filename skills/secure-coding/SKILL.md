```markdown
---
name: manekey-secure-coding
description: Trigger this skill whenever writing, modifying, or reviewing Next.js Server Actions, Route Handlers (APIs), or Supabase database queries. It enforces MANEKEY's mandatory security policies: 1. Strict RBAC authorization checks. 2. Prohibition of `SELECT *` (DTO pattern).
---

# MANEKEY Secure Coding Guidelines

When writing or modifying code for the MANEKEY project, you MUST strictly adhere to the following enterprise-grade security rules. Never output code that violates these principles.

## 1. サーバーアクション・APIでの権限の二重チェック (Strict RBAC Authorization)
All Server Actions and Route Handlers that mutate data or access sensitive information MUST verify the user's role before execution. Do not rely solely on UI hiding or DB RLS.

**❌ Bad (Vulnerable Code):**
```typescript
export async function updateCreatorTier(creatorId: string, tier: string) {
  const supabase = createClient(cookies());
  await supabase.from('creators').update({ tier }).eq('id', creatorId);
}
✅ Good (Secure Code):
code
TypeScript
export async function updateCreatorTier(creatorId: string, tier: string) {
  const supabase = createClient(cookies());
  
  // 1. 認証と権限(Role)のチェックを必ず行う
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: roleData } = await supabase.from('user_roles')
    .select('role').eq('user_id', user.id).single();
    
  if (!roleData || !['super_admin', 'ops_manager'].includes(roleData.role)) {
    throw new Error("Forbidden: Admin access required");
  }

  // 2. 処理の実行
  await supabase.from('creators').update({ tier }).eq('id', creatorId);
}
2. SELECT * の使用禁止 (Prohibit SELECT *)
When querying Supabase, NEVER use .select('*'). You must explicitly declare only the columns required by the UI (DTO pattern) to prevent accidental leakage of PII (Personally Identifiable Information) or internal flags to the browser.
❌ Bad (Data Leakage Risk):
code
TypeScript
const { data } = await supabase.from('creators').select('*').eq('tier', 'S');
✅ Good (DTO Pattern):
code
TypeScript
// 画面表示に必要なカラムだけを明示的に指定する
const { data } = await supabase.from('creators')
  .select('id, tiktok_handle, category, vibe_cluster, avatar_url, followers')
  .eq('tier', 'S');
3. 環境変数の保護 (Environment Variable Safety)
Never expose service role keys or sensitive API keys to the client. Do not prefix secrets with NEXT_PUBLIC_ unless absolutely necessary for public access (like the Anon Key).