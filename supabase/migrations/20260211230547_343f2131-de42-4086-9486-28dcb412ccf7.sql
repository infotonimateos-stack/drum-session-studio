-- Add 'transfer' to payment_method check constraint
ALTER TABLE public.orders DROP CONSTRAINT orders_payment_method_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check CHECK (payment_method = ANY (ARRAY['stripe'::text, 'paypal'::text, 'transfer'::text]));

-- Add 'awaiting_transfer' to payment_status check constraint
ALTER TABLE public.orders DROP CONSTRAINT orders_payment_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_status_check CHECK (payment_status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text, 'awaiting_transfer'::text]));
