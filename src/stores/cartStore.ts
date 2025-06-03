import { create } from 'zustand';

interface CartItem {
  id: number;
  nome: string;
  preço: string;
  descrição: string;
  imagem: string;
  imagens: string[];
  quantity: number;
  tempo_entrega_minutos: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addToCart: (newItem) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          ),
        };
      }

      return { items: [...state.items, newItem] };
    });
  },


  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter(item => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ items: [] }),
}));
