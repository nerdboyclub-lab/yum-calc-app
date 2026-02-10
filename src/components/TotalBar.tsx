import { menuItems } from "@/data/menu";
import { ShoppingBag, Trash2 } from "lucide-react";

interface TotalBarProps {
  cart: Record<string, number>;
  totalItems: number;
  onClear: () => void;
}

const TotalBar = ({ cart, totalItems, onClear }: TotalBarProps) => {
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((m) => m.id === id);
    return sum + (item?.price || 0) * qty;
  }, 0);

  if (totalItems === 0) return null;

  return (
    <div className="total-bar animate-slide-up">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-6 h-6 text-gold" />
            <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] px-1">
              {totalItems}
            </span>
          </div>
          <div>
            <p className="text-xs text-gold-light/70">Итого</p>
            <p className="text-lg font-display font-bold text-cream">
              {totalPrice.toLocaleString("ru-RU")} <span className="text-xs font-body font-normal text-gold-light/60">сум</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
          aria-label="Очистить корзину"
        >
          <Trash2 className="w-4.5 h-4.5 text-gold-light/60" />
        </button>
      </div>
    </div>
  );
};

export default TotalBar;
