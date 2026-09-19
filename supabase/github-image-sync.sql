-- GitHub 圖片同步：上傳後觸發 .github/workflows/sync-images.yml，網站改讀倉庫圖片。
-- 在 GitHub 建立 classic PAT（repo 權限），只在 Supabase SQL Editor 填 token，不要寫進這個檔案。

insert into public.site_settings (key, value) values
  ('github_repo', 'marcosouza216/ink-house'),
  ('github_token', '')
on conflict (key) do nothing;

-- 在 Supabase SQL Editor 執行（不要把 token 存進 Git）：
-- update public.site_settings set value = 'ghp_你的token' where key = 'github_token';
