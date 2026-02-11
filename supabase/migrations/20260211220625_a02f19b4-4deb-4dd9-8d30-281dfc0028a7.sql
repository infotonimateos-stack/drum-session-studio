
-- Fix: drop the overly permissive service role policy and restrict public access
DROP POLICY "Service role full access" ON public.orders;

-- Only allow inserts from public (no read/update/delete)
-- Service role bypasses RLS anyway, so no explicit policy needed for admin
