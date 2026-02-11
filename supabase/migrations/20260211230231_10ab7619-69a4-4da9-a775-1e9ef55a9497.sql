-- Allow public select on orders (needed to retrieve order ID after insert)
CREATE POLICY "Allow public select on orders"
ON public.orders
FOR SELECT
USING (true);
