import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  isOpen: boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        const existingItem = get().items.find(wishlistItem => wishlistItem.id === item.id);
        
        if (!existingItem) {
          set({
            items: [...get().items, item]
          });
        }
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        });
      },
      
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
      
      openWishlist: () => {
        set({ isOpen: true });
      },
      
      closeWishlist: () => {
        set({ isOpen: false });
      }
    }),
    {
      name: 'trynex-wishlist',
    }
  )
);
