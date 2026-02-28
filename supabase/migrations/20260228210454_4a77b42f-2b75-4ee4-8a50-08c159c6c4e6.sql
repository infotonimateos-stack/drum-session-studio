
-- Add personal data columns to orders table
ALTER TABLE public.orders ADD COLUMN first_name text;
ALTER TABLE public.orders ADD COLUMN last_name text;
ALTER TABLE public.orders ADD COLUMN contact_email text;
