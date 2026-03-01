
-- Add email_status column to orders table
ALTER TABLE public.orders ADD COLUMN email_status text NOT NULL DEFAULT 'pending';

-- Add email_sent_at timestamp
ALTER TABLE public.orders ADD COLUMN email_sent_at timestamp with time zone;
