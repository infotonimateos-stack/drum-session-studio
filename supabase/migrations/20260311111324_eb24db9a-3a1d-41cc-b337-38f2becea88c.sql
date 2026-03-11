CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  quote_number TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  contact_email TEXT,
  phone TEXT,
  business_name TEXT,
  vat_number TEXT,
  full_address TEXT,
  city TEXT,
  state_province TEXT,
  postal_code TEXT,
  country_code TEXT NOT NULL DEFAULT 'ES',
  client_type TEXT NOT NULL DEFAULT 'particular',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  song_count INTEGER NOT NULL DEFAULT 1,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_rule TEXT NOT NULL DEFAULT 'spain_peninsula',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  validity_days INTEGER NOT NULL DEFAULT 30,
  valid_until DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'expired', 'converted')),
  converted_order_id UUID REFERENCES public.orders(id),
  notes TEXT,
  payment_terms TEXT DEFAULT 'PayPal o transferencia bancaria'
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.quotes FOR ALL USING (true);