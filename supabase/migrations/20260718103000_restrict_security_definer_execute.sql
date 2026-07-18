-- Supabase default privileges may grant functions directly to anon and
-- authenticated. SECURITY DEFINER helpers must expose only their intended API.

REVOKE EXECUTE ON FUNCTION public.can_reply_to_message_thread(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_admin_trainer_profiles() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_own_trainer_dashboard_profile() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_own_trainer_message_profile() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_own_trainer_profile() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_own_trainer_subscription_status() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_public_trainer_contact_info(text) FROM anon;

REVOKE EXECUTE ON FUNCTION public.enforce_message_read_update() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_message_sender_identity() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_trainer_profile_review() FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION public.can_reply_to_message_thread(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_trainer_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_own_trainer_dashboard_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_own_trainer_message_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_own_trainer_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_own_trainer_subscription_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_trainer_contact_info(text) TO authenticated;
