export interface MenuItem {
  id: string;
  name: string;
  volume: string;
  price: number;
  image?: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const categories: Category[] = [
  { id: "coffee", name: "Кофе", emoji: "☕" },
  { id: "tea", name: "Чай", emoji: "🍵" },
  { id: "ice-coffee", name: "Айс Кофе", emoji: "🧊" },
  { id: "cold", name: "Холодные напитки", emoji: "🥤" },
  { id: "milkshakes", name: "Милкшейки", emoji: "🥛" },
];

export const menuItems: MenuItem[] = [
  // Кофе
  { id: "espresso", name: "Эспрессо", volume: "50мл", price: 21000, category: "coffee" },
  { id: "americano", name: "Американо", volume: "150мл", price: 25000, category: "coffee" },
  { id: "americano-spice", name: "Американо & специи", volume: "300мл", price: 30000, category: "coffee" },
  { id: "cappuccino-s", name: "Капучино", volume: "200мл", price: 25000, category: "coffee" },
  { id: "cappuccino-l", name: "Капучино", volume: "300мл", price: 38000, category: "coffee" },
  { id: "mokachino", name: "Мокачино", volume: "300мл", price: 40000, category: "coffee" },
  { id: "latte", name: "Латте", volume: "300мл", price: 28000, category: "coffee" },
  { id: "latte-lady", name: "Латте Леди", volume: "300мл", price: 35000, category: "coffee" },
  { id: "latte-nutella", name: "Латте Нутелла", volume: "300мл", price: 32000, category: "coffee" },
  { id: "latte-halva", name: "Латте Халва", volume: "300мл", price: 32000, category: "coffee" },
  { id: "latte-sumalak", name: "Латте Сумалак", volume: "300мл", price: 32000, category: "coffee" },
  { id: "flat-white", name: "Флет уайт", volume: "300мл", price: 30000, category: "coffee" },
  { id: "raf", name: "Раф", volume: "300мл", price: 40000, category: "coffee" },
  { id: "raf-pistachio", name: "Раф Фисташковый", volume: "300мл", price: 45000, category: "coffee" },
  { id: "raf-peanut", name: "Раф Арахис", volume: "300мл", price: 40000, category: "coffee" },
  { id: "raf-citrus", name: "Раф Цитрусовый", volume: "300мл", price: 40000, category: "coffee" },
  { id: "cocoa", name: "Какао", volume: "300мл", price: 27000, category: "coffee" },

  // Чай
  { id: "tea-black", name: "Чёрный чай", volume: "400мл", price: 15000, category: "tea" },
  { id: "tea-green", name: "Зелёный чай", volume: "400мл", price: 15000, category: "tea" },
  { id: "tea-fruit", name: "Фруктовый чай", volume: "400мл", price: 22000, category: "tea" },
  { id: "tea-sea-buckthorn", name: "Облепиховый чай", volume: "400мл", price: 25000, category: "tea" },
  { id: "tea-ginger", name: "Имбирный чай", volume: "400мл", price: 25000, category: "tea" },
  { id: "tea-matcha", name: "Матча Латте", volume: "300мл", price: 35000, category: "tea" },

  // Айс Кофе
  { id: "ice-americano", name: "Айс Американо", volume: "350мл", price: 28000, category: "ice-coffee" },
  { id: "ice-latte", name: "Айс Латте", volume: "350мл", price: 32000, category: "ice-coffee" },
  { id: "ice-cappuccino", name: "Айс Капучино", volume: "350мл", price: 32000, category: "ice-coffee" },
  { id: "ice-raf", name: "Айс Раф", volume: "350мл", price: 42000, category: "ice-coffee" },
  { id: "ice-mokachino", name: "Айс Мокачино", volume: "350мл", price: 42000, category: "ice-coffee" },

  // Холодные напитки
  { id: "lemonade-classic", name: "Лимонад Классик", volume: "400мл", price: 22000, category: "cold" },
  { id: "lemonade-strawberry", name: "Лимонад Клубника", volume: "400мл", price: 25000, category: "cold" },
  { id: "lemonade-mango", name: "Лимонад Манго", volume: "400мл", price: 25000, category: "cold" },
  { id: "lemonade-mojito", name: "Мохито", volume: "400мл", price: 25000, category: "cold" },
  { id: "fresh-orange", name: "Фреш Апельсин", volume: "300мл", price: 30000, category: "cold" },

  // Милкшейки
  { id: "shake-vanilla", name: "Ванильный шейк", volume: "400мл", price: 35000, category: "milkshakes" },
  { id: "shake-chocolate", name: "Шоколадный шейк", volume: "400мл", price: 35000, category: "milkshakes" },
  { id: "shake-strawberry", name: "Клубничный шейк", volume: "400мл", price: 38000, category: "milkshakes" },
  { id: "shake-banana", name: "Банановый шейк", volume: "400мл", price: 35000, category: "milkshakes" },
  { id: "shake-oreo", name: "Орео шейк", volume: "400мл", price: 40000, category: "milkshakes" },
];
