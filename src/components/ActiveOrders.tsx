import { useState } from "react";
import { ActiveOrder } from "@/hooks/useActiveOrders";
import { Minus, Plus, Trash2, CheckCircle, Edit3, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface ActiveOrdersProps {
  orders: ActiveOrder[];
  loading: boolean;
  onMarkPaid: (orderId: string) => Promise<void>;
  onDelete: (orderId: string) => Promise<void>;
  onUpdate: (
    orderId: string,
    updates: {
      items: { name: string; quantity: number; price: number; volume?: string }[];
      total: number;
      payment_method?: string;
    }
  ) => Promise<void>;
}

const paymentLabels: Record<string, string> = {
  cash: "💵 Наличные",
  card: "💳 Карта",
  payme_click: "📱 Payme/Click",
};

const ActiveOrders = ({ orders, loading, onMarkPaid, onDelete, onUpdate }: ActiveOrdersProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItems, setEditItems] = useState<{ name: string; quantity: number; price: number; volume?: string }[]>([]);
  const [editPayment, setEditPayment] = useState<string>("cash");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (loading) return null;
  if (orders.length === 0) return null;

  const startEdit = (order: ActiveOrder) => {
    setEditingId(order.id);
    setExpandedId(order.id);
    setEditItems(order.items.map((i) => ({ ...i })));
    setEditPayment(order.payment_method);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditItems([]);
  };

  const saveEdit = async (orderId: string) => {
    const filtered = editItems.filter((i) => i.quantity > 0);
    if (filtered.length === 0) {
      toast.error("Заказ не может быть пустым");
      return;
    }
    const total = filtered.reduce((s, i) => s + i.price * i.quantity, 0);
    setActionLoading(orderId);
    try {
      await onUpdate(orderId, { items: filtered, total, payment_method: editPayment });
      toast.success("Заказ обновлён");
      setEditingId(null);
    } catch {
      toast.error("Ошибка обновления");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePay = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await onMarkPaid(orderId);
      toast.success("Заказ оплачен и отправлен в Telegram!");
    } catch {
      toast.error("Ошибка оплаты");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Удалить заказ?")) return;
    setActionLoading(orderId);
    try {
      await onDelete(orderId);
      toast.success("Заказ удалён");
    } catch {
      toast.error("Ошибка удаления");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="px-4 mb-4">
      <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-accent inline-block" />
        Активные заказы
        <span className="text-xs font-body font-normal text-muted-foreground">({orders.length})</span>
      </h2>

      <div className="space-y-3">
        {orders.map((order) => {
          const isExpanded = expandedId === order.id;
          const isEditing = editingId === order.id;
          const isLoading = actionLoading === order.id;

          return (
            <div
              key={order.id}
              className="bg-card/80 border border-gold/15 rounded-2xl overflow-hidden animate-fade-in"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <p className="font-display font-bold text-foreground">
                    Заказ №{order.order_number}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.items.length} позиций · {order.total.toLocaleString("ru-RU")} сум · {paymentLabels[order.payment_method] || order.payment_method}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-gold/10">
                  {/* Items */}
                  <div className="space-y-1.5 pt-3">
                    {(isEditing ? editItems : order.items).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex-1 min-w-0">
                          <span className="text-foreground">{item.name}</span>
                          {item.volume && <span className="text-muted-foreground ml-1">({item.volume})</span>}
                        </div>

                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                const updated = [...editItems];
                                if (updated[idx].quantity > 1) {
                                  updated[idx] = { ...updated[idx], quantity: updated[idx].quantity - 1 };
                                } else {
                                  updated.splice(idx, 1);
                                }
                                setEditItems(updated);
                              }}
                              className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                            >
                              {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                            </button>
                            <span className="w-5 text-center font-bold text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => {
                                const updated = [...editItems];
                                updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
                                setEditItems(updated);
                              }}
                              className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <span className="text-gold font-semibold min-w-[50px] text-right text-xs">
                              {(item.price * item.quantity).toLocaleString("ru-RU")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            ×{item.quantity} — {(item.price * item.quantity).toLocaleString("ru-RU")} сум
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Edit payment */}
                  {isEditing && (
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Способ оплаты</label>
                      <RadioGroup
                        value={editPayment}
                        onValueChange={setEditPayment}
                        className="flex gap-3 flex-wrap"
                      >
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <RadioGroupItem value="cash" />
                          <span className="text-xs text-foreground">💵 Наличные</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <RadioGroupItem value="card" />
                          <span className="text-xs text-foreground">💳 Карта</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <RadioGroupItem value="payme_click" />
                          <span className="text-xs text-foreground">📱 Payme/Click</span>
                        </label>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm text-muted-foreground">Итого</span>
                    <span className="font-display font-bold text-foreground">
                      {(isEditing
                        ? editItems.reduce((s, i) => s + i.price * i.quantity, 0)
                        : order.total
                      ).toLocaleString("ru-RU")}{" "}
                      <span className="text-xs font-normal text-muted-foreground">сум</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(order.id)}
                          disabled={isLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold py-2 rounded-xl transition-colors disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Сохранить"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground bg-muted/30 rounded-xl transition-colors"
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(order)}
                          disabled={isLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-muted/40 hover:bg-muted/60 text-foreground text-sm font-medium py-2 rounded-xl transition-colors"
                        >
                          <Edit3 className="w-4 h-4" /> Редактировать
                        </button>
                        <button
                          onClick={() => handlePay(order.id)}
                          disabled={isLoading}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors disabled:opacity-50"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Оплачен
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={isLoading}
                          className="px-3 py-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveOrders;
