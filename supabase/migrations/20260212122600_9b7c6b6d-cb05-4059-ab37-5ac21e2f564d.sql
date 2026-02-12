
-- Migrate invoice_tax_id data into vat_number where vat_number is null
UPDATE public.orders 
SET vat_number = invoice_tax_id 
WHERE invoice_tax_id IS NOT NULL AND vat_number IS NULL;

-- Rename existing columns to match new schema
ALTER TABLE public.orders RENAME COLUMN needs_invoice TO is_professional_invoice;
ALTER TABLE public.orders RENAME COLUMN invoice_company_name TO business_name;
ALTER TABLE public.orders RENAME COLUMN invoice_address TO full_address;
ALTER TABLE public.orders RENAME COLUMN invoice_email TO billing_email;
ALTER TABLE public.orders RENAME COLUMN invoice_phone TO billing_phone;

-- Add new columns
ALTER TABLE public.orders ADD COLUMN city text;
ALTER TABLE public.orders ADD COLUMN state_province text;

-- Drop redundant column (data already migrated to vat_number)
ALTER TABLE public.orders DROP COLUMN invoice_tax_id;

-- Drop old invoice-prefixed columns that are now renamed
-- invoice_number and invoice_series remain as-is (they're invoice metadata, not billing data)
