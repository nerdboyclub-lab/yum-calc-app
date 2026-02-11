import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID)
      throw new Error("Telegram env missing");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY)
      throw new Error("Supabase env missing");

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "No items provided" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // считаем сумму
    const total = items.reduce(
      (sum, i) =>
        sum + Number(i.price || 0) * Number(i.quantity || 0),
      0
    );

    // сохраняем заказ
    const { data: order, error } = await supabase
      .from("orders")
      .insert({ total_sum: total })
      .select()
      .single();

    if (error) throw error;

    // отправляем уведомление о заказе
    let message = `🧾 <b>Новый заказ</b>\n\n`;
    items.forEach((item, i) => {
      const subtotal =
        Number(item.price || 0) * Number(item.quantity || 0);
      message += `${i + 1}. ${item.name} × ${
        item.quantity
      } — ${subtotal.toLocaleString("ru-RU")} сум\n`;
    });

    message += `\n💰 <b>Итого: ${total.toLocaleString(
      "ru-RU"
    )} сум</b>`;

    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    // ====== АВТО ОТЧЁТ В 21:25 ======

    const offset = 5 * 60 * 60 * 1000; // UTC+5
    const now = new Date();
    const local = new Date(now.getTime() + offset);

    const hours = local.getUTCHours();
    const minutes = local.getUTCMinutes();

    if (hours === 21 && minutes === 28) {
      const startLocal = new Date(
        Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 0, 0, 0)
      );
      const endLocal = new Date(
        Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + 1, 0, 0, 0)
      );

      const startUTC = new Date(startLocal.getTime() - offset).toISOString();
      const endUTC = new Date(endLocal.getTime() - offset).toISOString();

      const { data } = await supabase
        .from("orders")
        .select("total_sum, created_at")
        .gte("created_at", startUTC)
        .lt("created_at", endUTC);

      const count = data?.length ?? 0;
      const sum = (data ?? []).reduce(
        (acc, o) => acc + Number(o.total_sum || 0),
        0
      );

      const report =
        `📊 <b>Отчёт за день (Ташкент)</b>\n\n` +
        `🧾 Заказов: <b>${count}</b>\n` +
        `💰 Сумма: <b>${sum.toLocaleString("ru-RU")} сум</b>`;

      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: report,
            parse_mode: "HTML",
          }),
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: corsHeaders }
    );
  }
});
