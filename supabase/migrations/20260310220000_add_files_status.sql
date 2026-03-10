ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS files_status text NOT NULL DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS files_detected_at timestamptz;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS files_detection_method text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS files_last_checked_at timestamptz;
