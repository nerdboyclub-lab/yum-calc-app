CREATE OR REPLACE FUNCTION public.next_order_number()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$    
DECLARE
  today_date date := (now() AT TIME ZONE 'Asia/Tashkent')::date;
  max_num    integer;
BEGIN
  SELECT COALESCE(MAX(order_number), 0)
  INTO max_num
  FROM public.orders
  WHERE (created_at AT TIME ZONE 'Asia/Tashkent')::date = today_date
    AND order_number IS NOT NULL;

  RETURN max_num + 1;
END;
$function$;