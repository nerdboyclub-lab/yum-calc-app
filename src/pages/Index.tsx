import { useState } from "react";
import MenuHeader from "@/components/MenuHeader";
import CategoryNav from "@/components/CategoryNav";
import MenuItemCard from "@/components/MenuItemCard";
import TotalBar from "@/components/TotalBar";
import { menuItems, categories } from "@/data/menu";
import { useCart } from "@/hooks/useCart";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const { cart, addItem, removeItem, getQuantity, totalItems, clearCart } = useCart();

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);
  const activeCategoryName = categories.find((c) => c.id === activeCategory)?.name || "";

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <MenuHeader />
      <CategoryNav activeCategory={activeCategory} onSelect={setActiveCategory} />

      <main className="px-4 pt-4 pb-28">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-primary inline-block" />
          {activeCategoryName}
        </h2>

        <div className="space-y-3" key={activeCategory}>
          {filteredItems.map((item, i) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={getQuantity(item.id)}
              onAdd={() => addItem(item.id)}
              onRemove={() => removeItem(item.id)}
              index={i}
            />
          ))}
        </div>
      </main>

      <TotalBar cart={cart} totalItems={totalItems} onClear={clearCart} />
    </div>
  );
};

export default Index;
