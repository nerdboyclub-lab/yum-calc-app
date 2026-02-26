ALTER TABLE public.orders ADD COLUMN status text NOT NULL DEFAULT 'paid';

-- Update the trigger function to set status on new orders
-- (existing orders keep 'paid' by default, new ones will be set by the app)