
-- Add telegram_message_id to track sent messages for editing
ALTER TABLE public.orders ADD COLUMN telegram_message_id bigint;

-- Allow updating orders (needed to store telegram_message_id)
CREATE POLICY "Anyone can update orders"
ON public.orders
FOR UPDATE
USING (true);
