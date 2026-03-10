ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS work_status text NOT NULL DEFAULT 'new';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS deadline date;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS work_notes text;
