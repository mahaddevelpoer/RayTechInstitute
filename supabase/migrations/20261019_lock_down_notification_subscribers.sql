-- Prevent direct anonymous writes to notification subscriptions.
-- The public browser flow validates origin and token shape in the
-- secure-dispatch Edge Function before using the service role to write.
ALTER TABLE public.notification_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Insert Notification Subscribers" ON public.notification_subscribers;
