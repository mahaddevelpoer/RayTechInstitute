# Automatic static publishing

The site builds public pages from a Supabase snapshot and deploys them to Firebase Hosting. The `secure-dispatch` Edge Function now supports both direct admin publish triggers and Supabase Database Webhook events.

## One-time Supabase setup

1. Deploy `supabase/functions/secure-dispatch/index.ts` to project `btxrkhwyugzliswznkpx`.
2. Add these Supabase Edge Function secrets:

   - `GITHUB_DISPATCH_TOKEN`: a GitHub fine-grained token for `mahaddevelpoer/RayTechInstitute` with repository Contents read/write permission, used only for `repository_dispatch`.
   - `GITHUB_REPOSITORY`: `mahaddevelpoer/RayTechInstitute`.
   - `CONTENT_WEBHOOK_SECRET`: a long random value used by the database webhook.

3. Create a Supabase Database Webhook for INSERT, UPDATE, and DELETE on the content tables (`blogs`, `gazettes`, `notes`, `past_papers`, `classes`, `subjects`, `mcqs`, and `video_mcqs`).
4. Point it to:

   `https://btxrkhwyugzliswznkpx.supabase.co/functions/v1/secure-dispatch`

5. Send the header `x-content-webhook-secret` with the same `CONTENT_WEBHOOK_SECRET` value. The webhook body can be Supabase's standard event envelope; the function converts it to GitHub event type `content-published`.

The GitHub workflow already listens for that event. On each successful build it regenerates `src/data/staticOverrides.ts`, creates `public/sitemap.xml` with every current detail URL, builds all static detail pages, and deploys Firebase Hosting.

## Manual deployment command

```bash
npx supabase functions deploy secure-dispatch --project-ref btxrkhwyugzliswznkpx --no-verify-jwt
```

Do not put the GitHub token in the frontend, repository, or `.env.local`.
