import { create } from 'zustand';

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  selectedColor?: {
    name: string;
    code: string;
  };
  selectedSize?: {
    name: string;
    code: string;
  };
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, colorCode?: string) => void;
  updateQuantity: (id: number, colorCode: string | undefined, quantity: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addToCart: (newItem) =>
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        item =>
          item.id === newItem.id &&
          (!item.selectedColor?.code || item.selectedColor?.code === newItem.selectedColor?.code) &&
          (!item.selectedSize?.code || item.selectedSize?.code === newItem.selectedSize?.code)
      );


      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return { items: updatedItems };
      }

      return { items: [...state.items, newItem] };
    }),

  removeFromCart: (id, colorCode) =>
    set((state) => ({
      items: state.items.filter(
        item =>
          !(item.id === id &&
            (colorCode ? item.selectedColor?.code === colorCode : !item.selectedColor))
      ),
    })),

  updateQuantity: (id, colorCode, quantity) =>
    set((state) => ({
      items: state.items.map(item =>
        item.id === id &&
          (colorCode ? item.selectedColor?.code === colorCode : !item.selectedColor)
          ? { ...item, quantity }
          : item
      ),
    })),
}));
