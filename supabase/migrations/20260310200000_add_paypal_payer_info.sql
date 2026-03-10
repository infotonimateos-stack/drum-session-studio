ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paypal_payer_info jsonb;
