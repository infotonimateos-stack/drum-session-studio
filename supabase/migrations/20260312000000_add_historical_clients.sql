-- Historical clients: imported from 13 years of recording data (FileMaker + contacts)
CREATE TABLE IF NOT EXISTS public.historical_clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  alt_names TEXT[] DEFAULT '{}',
  roles TEXT[] DEFAULT '{}',
  emails TEXT[] DEFAULT '{}',
  phones TEXT[] DEFAULT '{}',
  organization TEXT,
  nif TEXT,
  city TEXT,
  country TEXT,
  address TEXT,
  sessions INTEGER DEFAULT 0,
  total_revenue NUMERIC(10,2) DEFAULT 0,
  bands TEXT[] DEFAULT '{}',
  first_session DATE,
  last_session DATE,
  sources TEXT[] DEFAULT '{}',
  notes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- GIN indexes for array overlap matching
CREATE INDEX idx_hc_emails ON public.historical_clients USING GIN (emails);
CREATE INDEX idx_hc_phones ON public.historical_clients USING GIN (phones);
CREATE INDEX idx_hc_name ON public.historical_clients USING btree (lower(name));

-- RLS: only accessible via service_role (admin-api)
ALTER TABLE public.historical_clients ENABLE ROW LEVEL SECURITY;

-- Matching function: find historical clients by email or phone overlap
CREATE OR REPLACE FUNCTION match_historical_clients(p_emails TEXT[], p_phones TEXT[])
RETURNS SETOF historical_clients
LANGUAGE sql STABLE
AS $$
  SELECT *
  FROM historical_clients
  WHERE emails && p_emails
     OR phones && p_phones;
$$;
