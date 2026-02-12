
-- Add invoice-related columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS needs_invoice boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS invoice_company_name text,
ADD COLUMN IF NOT EXISTS invoice_address text,
ADD COLUMN IF NOT EXISTS invoice_tax_id text,
ADD COLUMN IF NOT EXISTS invoice_email text,
ADD COLUMN IF NOT EXISTS invoice_phone text,
ADD COLUMN IF NOT EXISTS invoice_number text,
ADD COLUMN IF NOT EXISTS invoice_series text DEFAULT 'W';

-- Create invoice counter table for Series W sequential numbering
CREATE TABLE public.invoice_counters (
  series text PRIMARY KEY,
  last_number integer NOT NULL DEFAULT 0
);

-- Insert initial counter for Series W
INSERT INTO public.invoice_counters (series, last_number) VALUES ('W', 0);

-- Enable RLS
ALTER TABLE public.invoice_counters ENABLE ROW LEVEL SECURITY;

-- Only allow reading (not direct modification by clients)
CREATE POLICY "Allow public select on invoice_counters"
ON public.invoice_counters
FOR SELECT
USING (true);

-- Create a function to get the next invoice number atomically
CREATE OR REPLACE FUNCTION public.get_next_invoice_number(p_series text DEFAULT 'W')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next_number integer;
  v_invoice_number text;
BEGIN
  UPDATE invoice_counters
  SET last_number = last_number + 1
  WHERE series = p_series
  RETURNING last_number INTO v_next_number;

  IF v_next_number IS NULL THEN
    INSERT INTO invoice_counters (series, last_number) VALUES (p_series, 1);
    v_next_number := 1;
  END IF;

  v_invoice_number := p_series || '-' || LPAD(v_next_number::text, 4, '0');
  RETURN v_invoice_number;
END;
$$;
