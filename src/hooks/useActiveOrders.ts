import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ActiveOrder {
  id: string;
  order_number: number;
  items: { name: string; quantity: number; price: number; volume?: string }[];
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
}

const POLL_INTERVAL = 5000;

export function useActiveOrders() {
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(
        data.map((o: any) => ({
          id: o.id,
          order_number: o.order_number,
          items: o.items as any[],
          total: o.total,
          payment_method: o.payment_method,
          status: o.status,
          created_at: o.created_at,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const markAsPaid = useCallback(
    async (orderId: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      // Update status to paid
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId);

      if (updateError) {
        throw updateError;
      }

      // Send to Telegram
      const { error: tgError } = await supabase.functions.invoke("send-telegram-order", {
        body: {
          items: order.items,
          total: order.total,
          order_number: order.order_number,
          payment_method: order.payment_method,
          order_id: orderId,
        },
      });

      if (tgError) {
        // Revert status on Telegram failure
        await supabase.from("orders").update({ status: "draft" }).eq("id", orderId);
        throw tgError;
      }

      await fetchOrders();
    },
    [orders, fetchOrders]
  );

  const deleteOrder = useCallback(
    async (orderId: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw error;
      await fetchOrders();
    },
    [fetchOrders]
  );

  const updateOrder = useCallback(
    async (
      orderId: string,
      updates: {
        items: { name: string; quantity: number; price: number; volume?: string }[];
        total: number;
        payment_method?: string;
      }
    ) => {
      const { error } = await supabase
        .from("orders")
        .update({
          items: updates.items,
          total: updates.total,
          ...(updates.payment_method ? { payment_method: updates.payment_method } : {}),
        })
        .eq("id", orderId);
      if (error) throw error;
      await fetchOrders();
    },
    [fetchOrders]
  );

  return { orders, loading, fetchOrders, markAsPaid, deleteOrder, updateOrder };
}
