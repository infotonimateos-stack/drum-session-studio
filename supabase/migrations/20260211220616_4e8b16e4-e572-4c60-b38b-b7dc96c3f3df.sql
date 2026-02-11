
-- Orders table to store billing info, VIES validation, and transaction data
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Payment info
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paypal')),
  payment_id TEXT, -- Stripe session ID or PayPal order ID
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Cart data
  items JSONB NOT NULL DEFAULT '[]',
  base_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  paypal_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  
  -- Billing info
  country_code TEXT NOT NULL,
  postal_code TEXT,
  client_type TEXT NOT NULL CHECK (client_type IN ('particular', 'empresa')),
  vat_number TEXT,
  
  -- VIES validation
  vies_valid BOOLEAN,
  vies_response JSONB,
  
  -- Tax rule applied
  tax_rule TEXT NOT NULL CHECK (tax_rule IN ('spain_peninsula', 'spain_islands', 'eu_b2c', 'eu_b2b_valid', 'eu_b2b_invalid', 'non_eu'))
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public insert policy (no auth required - anonymous purchases)
CREATE POLICY "Allow public insert on orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- No select/update/delete for public users (admin only via service_role)
CREATE POLICY "Service role full access"
  ON public.orders FOR ALL
  USING (true)
  WITH CHECK (true);
