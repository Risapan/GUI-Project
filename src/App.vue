<template>
  <div :class="theme.isDark ? 'dark' : ''" class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-extrabold uppercase tracking-tight text-gray-900 dark:text-white">APEX STORE</h1>
          
          <div class="flex items-center gap-4">
            <!-- Cart Badge -->
            <div class="relative">
              <button
                @click="showCart = !showCart"
                class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span v-if="cart.totalItems > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {{ cart.totalItems }}
                </span>
              </button>
            </div>

            <!-- Theme Toggle -->
            <button
              @click="theme.toggleTheme"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              :title="`Switch to ${theme.isDark ? 'light' : 'dark'} mode`"
            >
              <svg v-if="theme.isDark" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <svg v-else class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto">
      <!-- Filter Bar -->
      <FilterBar
        @search="handleSearch"
        @category-change="handleCategoryChange"
      />

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-96">
        <div class="text-center">
          <div class="mb-4 inline-block">
            <div class="w-12 h-12 rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 animate-spin"></div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mx-4 my-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center justify-between">
          <p class="text-red-800 dark:text-red-200">{{ error?.message }}</p>
          <button
            @click="clearError"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors duration-200"
          >
            Dismiss
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else class="px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-400 text-lg">No products found. Try a different search.</p>
        </div>

        <div v-else>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Showing <span class="font-semibold">{{ filteredProducts.length }}</span> of <span class="font-semibold">{{ total }}</span> products
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
              @add-to-cart="handleAddToCart"
              @view-details="handleViewDetails"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Cart Sidebar (Simple Implementation) -->
    <div
      v-if="showCart"
      class="fixed inset-0 z-50 overflow-hidden"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showCart = false"></div>
      <div class="absolute right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
          <button @click="showCart = false" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div v-if="cart.items.length === 0" class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400">Your cart is empty</p>
        </div>

        <div v-else>
          <div class="space-y-4 mb-6">
            <div v-for="item in cart.items" :key="item.product.id" class="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
              <img :src="item.product.thumbnail" :alt="item.product.title" class="w-16 h-16 object-cover rounded" />
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm">{{ item.product.title }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">${{ (item.product.price * (1 - item.product.discountPercentage / 100)).toFixed(2) }} x {{ item.quantity }}</p>
              </div>
              <button @click="cart.removeFromCart(item.product.id)" class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex items-center justify-between mb-4">
              <span class="font-semibold text-gray-900 dark:text-white">Total:</span>
              <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">${{ cart.totalPrice.toFixed(2) }}</span>
            </div>
            <button
              @click="handleCheckout"
              class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded font-semibold transition-colors duration-200"
            >
              Checkout
            </button>
            <button
              @click="cart.clearCart"
              class="w-full mt-2 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded font-semibold transition-colors duration-200"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <div v-if="showDetails && selectedProduct" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedProduct.title }}</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ selectedProduct.category }}</p>
          </div>
          <button @click="closeDetails" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
          <div class="space-y-4">
            <img :src="selectedProduct.thumbnail" :alt="selectedProduct.title" class="w-full h-80 rounded-2xl object-cover bg-gray-100 dark:bg-gray-800" />
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4">
                <p class="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Price</p>
                <p class="mt-2 text-xl font-semibold text-gray-900 dark:text-white">${{ (selectedProduct.price * (1 - selectedProduct.discountPercentage / 100)).toFixed(2) }}</p>
              </div>
              <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4">
                <p class="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Stock</p>
                <p class="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{{ selectedProduct.stock }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-5">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p class="text-sm leading-6 text-gray-600 dark:text-gray-300">{{ selectedProduct.description }}</p>
            </div>

            <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-5 space-y-3">
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Rating</span>
                <span>{{ selectedProduct.rating.toFixed(1) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Discount</span>
                <span>{{ selectedProduct.discountPercentage }}%</span>
              </div>
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>SKU</span>
                <span>{{ selectedProduct.sku }}</span>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <button @click="handleAddToCart(selectedProduct)" class="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200">Add to Cart</button>
              <button @click="closeDetails" class="w-full py-3 rounded-2xl border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ProductCard from './components/ProductCard.vue';
import FilterBar from './components/FilterBar.vue';
import { useProducts } from './composables/useProducts';
import { useTheme } from './composables/useTheme';
import { useCartStore } from './stores/cartStore';
import type { Product } from './types/api';

const {
  products,
  isLoading,
  error,
  total,
  filteredProducts,
  fetchProducts,
  fetchByCategory,
  searchProducts,
  clearError,
} = useProducts();
const theme = useTheme();
const cart = useCartStore();
const showCart = ref<boolean>(false);
const selectedProduct = ref<Product | null>(null);
const showDetails = ref<boolean>(false);

const closeDetails = (): void => {
  selectedProduct.value = null;
  showDetails.value = false;
};

onMounted(async () => {
  cart.initializeCart();
  await fetchProducts({ limit: 30 });
});

const handleSearch = async (query: string): Promise<void> => {
  if (query.trim()) {
    await searchProducts(query);
  } else {
    await fetchProducts({ limit: 30 });
  }
};

const handleCategoryChange = async (category: string): Promise<void> => {
  if (category) {
    await fetchByCategory(category, 30);
  } else {
    await fetchProducts({ limit: 30 });
  }
};

const handleAddToCart = (product: Product): void => {
  cart.addToCart(product, 1);
  // Optional: Show toast notification
  console.log(`Added ${product.title} to cart`);
};

const handleViewDetails = (productId: number): void => {
  const product = products.value.find((p: Product) => p.id === productId);
  if (product) {
    selectedProduct.value = product;
    showDetails.value = true;
  }
};

const handleCheckout = (): void => {
  console.log('Checkout with items:', cart.items);
  // Implement checkout logic here
  alert('Checkout functionality would be implemented here. Total: $' + cart.totalPrice.toFixed(2));
};
</script>
