import { defineStore } from 'pinia';
import { ref, computed, Ref } from 'vue';
import type { Product } from '../types/api';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'shopping-cart';

export const useCartStore = defineStore('cart', () => {
  // State
  const items: Ref<CartItem[]> = ref<CartItem[]>([]);

  // Initialize from localStorage
  const initializeCart = (): void => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        items.value = JSON.parse(stored) as CartItem[];
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      items.value = [];
    }
  };

  // Persist to localStorage
  const persistCart = (): void => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value));
    } catch (error) {
      console.error('Failed to persist cart to localStorage:', error);
    }
  };

  // Getters
  const totalItems = computed((): number => {
    return items.value.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  });

  const totalPrice = computed((): number => {
    return items.value.reduce((sum: number, item: CartItem) => {
      const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100);
      return sum + discountedPrice * item.quantity;
    }, 0);
  });

  const itemCount = computed((): number => {
    return items.value.length;
  });

  // Actions
  const addToCart = (product: Product, quantity: number = 1): void => {
    const existingItem = items.value.find((item: CartItem) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({
        product,
        quantity,
      });
    }

    persistCart();
  };

  const removeFromCart = (productId: number): void => {
    const index = items.value.findIndex((item: CartItem) => item.product.id === productId);
    if (index > -1) {
      items.value.splice(index, 1);
      persistCart();
    }
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = items.value.find((i: CartItem) => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      persistCart();
    }
  };

  const clearCart = (): void => {
    items.value = [];
    persistCart();
  };

  const getCartItem = (productId: number): CartItem | undefined => {
    return items.value.find((item: CartItem) => item.product.id === productId);
  };

  return {
    // State
    items,

    // Getters
    totalItems,
    totalPrice,
    itemCount,

    // Actions
    initializeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
  };
});
