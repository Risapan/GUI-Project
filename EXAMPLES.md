# Practical Code Examples

This file contains real-world code examples demonstrating how to use each feature.

---

## Table of Contents

1. [Using useProducts Composable](#1-using-useproducts-composable)
2. [Working with ProductCard](#2-working-with-productcard)
3. [Implementing FilterBar](#3-implementing-filterbar)
4. [Cart Store Operations](#4-cart-store-operations)
5. [Dark Mode Implementation](#5-dark-mode-implementation)
6. [TypeScript Best Practices](#6-typescript-best-practices)
7. [Complete App Integration](#7-complete-app-integration)

---

## 1. Using useProducts Composable

### Example 1.1: Basic Product Fetching

```ts
import { useProducts } from "@/composables/useProducts";
import { onMounted } from "vue";

export default {
  setup() {
    const products = useProducts();

    onMounted(async () => {
      // Fetch first 30 products
      await products.fetchProducts({ limit: 30 });
    });

    return { products };
  },
};
```

### Example 1.2: Pagination

```ts
const products = useProducts();

const page = ref(1);
const itemsPerPage = 10;

const loadPage = async (pageNum: number) => {
  const skip = (pageNum - 1) * itemsPerPage;
  await products.fetchProducts({
    limit: itemsPerPage,
    skip: skip,
  });
  page.value = pageNum;
};

const nextPage = async () => {
  if (products.total.value > page.value * itemsPerPage) {
    await loadPage(page.value + 1);
  }
};
```

### Example 1.3: Search with Debouncing

```ts
import { ref, watch } from "vue";
import { useProducts } from "@/composables/useProducts";

const searchQuery = ref("");
const products = useProducts();
let searchTimeout: ReturnType<typeof setTimeout>;

watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(async () => {
    if (newQuery.trim()) {
      await products.searchProducts(newQuery);
    } else {
      await products.fetchProducts({ limit: 30 });
    }
  }, 300); // 300ms delay
});
```

### Example 1.4: Error Handling

```ts
const products = useProducts();

const tryFetchProducts = async () => {
  try {
    await products.fetchProducts();

    if (products.error.value) {
      console.error("Fetch error:", products.error.value.message);
      // Show error toast/alert to user
      showError(products.error.value.message);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

// Or use computed to react to errors
const hasError = computed(() => products.error.value !== null);
```

### Example 1.5: Filtered Products Using Composable

```ts
import { useProducts } from "@/composables/useProducts";
import { computed, ref } from "vue";

const products = useProducts();
const priceFilter = ref(500);

// Filter products client-side
const affordableProducts = computed(() => {
  return products.filteredProducts.value.filter(
    (product) => product.price <= priceFilter.value,
  );
});
```

---

## 2. Working with ProductCard

### Example 2.1: Basic ProductCard Usage

```vue
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="handleAddToCart"
      @view-details="handleViewDetails"
    />
  </div>
</template>

<script setup lang="ts">
import ProductCard from "@/components/ProductCard.vue";
import { useProducts } from "@/composables/useProducts";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/types/api";

const products = useProducts();
const cart = useCartStore();

const handleAddToCart = (product: Product) => {
  cart.addToCart(product, 1);
  console.log(`Added ${product.title} to cart`);
};

const handleViewDetails = (productId: number) => {
  // Navigate to detail page or show modal
  console.log(`View details for product ${productId}`);
};
</script>
```

### Example 2.2: Skeleton Loading State

```vue
<template>
  <div
    v-if="products.isLoading"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
  >
    <!-- Skeleton cards -->
    <div
      v-for="i in 12"
      :key="i"
      class="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 animate-pulse"
    ></div>
  </div>

  <div
    v-else-if="products.filteredProducts.length === 0"
    class="text-center py-12"
  >
    <p class="text-gray-600 dark:text-gray-400">No products found</p>
  </div>

  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <ProductCard
      v-for="product in products.filteredProducts"
      :key="product.id"
      :product="product"
      @add-to-cart="handleAddToCart"
      @view-details="handleViewDetails"
    />
  </div>
</template>
```

### Example 2.3: Show Toast on Add to Cart

```ts
// Create a simple toast store (or use Pinia)
const showToast = (message: string, duration = 3000) => {
  const toastMessage = ref(message);
  const visible = ref(true);

  setTimeout(() => {
    visible.value = false;
  }, duration);

  return { toastMessage, visible };
};

const handleAddToCart = (product: Product) => {
  cart.addToCart(product, 1);

  const { toastMessage } = showToast(`✓ Added ${product.title} to cart`);
  // Display toast in template
};
```

---

## 3. Implementing FilterBar

### Example 3.1: Complete FilterBar Integration

```vue
<template>
  <FilterBar @search="handleSearch" @category-change="handleCategoryChange" />
</template>

<script setup lang="ts">
import FilterBar from "@/components/FilterBar.vue";
import { useProducts } from "@/composables/useProducts";

const products = useProducts();

const handleSearch = async (query: string) => {
  if (query.trim()) {
    await products.searchProducts(query);
  } else {
    // Reset to all products
    await products.fetchProducts({ limit: 30 });
  }
};

const handleCategoryChange = async (category: string) => {
  if (category) {
    await products.searchProducts(category);
  } else {
    await products.fetchProducts({ limit: 30 });
  }
};
</script>
```

### Example 3.2: Advanced Filtering

```ts
// Store multiple filters
const filters = reactive({
  search: "",
  category: "",
  priceRange: [0, 1000],
  minRating: 0,
  inStockOnly: false,
});

const applyFilters = async () => {
  let filteredProducts = products.filteredProducts.value;

  // Apply price filter
  filteredProducts = filteredProducts.filter(
    (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
  );

  // Apply rating filter
  filteredProducts = filteredProducts.filter(
    (p) => p.rating >= filters.minRating,
  );

  // Apply stock filter
  if (filters.inStockOnly) {
    filteredProducts = filteredProducts.filter((p) => p.stock > 0);
  }

  return filteredProducts;
};

const displayedProducts = computed(() => applyFilters());
```

---

## 4. Cart Store Operations

### Example 4.1: Initializing and Using Cart

```ts
import { useCartStore } from "@/stores/cartStore";
import { onMounted } from "vue";

export default {
  setup() {
    const cart = useCartStore();

    onMounted(() => {
      // Load saved cart from localStorage
      cart.initializeCart();
    });

    return { cart };
  },
};
```

### Example 4.2: Displaying Cart Items

```vue
<template>
  <div v-if="cart.items.length === 0" class="text-center py-8">
    <p class="text-gray-600 dark:text-gray-400">Your cart is empty</p>
  </div>

  <div v-else>
    <!-- Cart Items List -->
    <div
      v-for="item in cart.items"
      :key="item.product.id"
      class="flex gap-4 p-4 border-b"
    >
      <!-- Product Image -->
      <img
        :src="item.product.thumbnail"
        :alt="item.product.title"
        class="w-20 h-20 object-cover rounded"
      />

      <!-- Product Info -->
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900 dark:text-white">
          {{ item.product.title }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          ${{ calculatePrice(item.product) }} x {{ item.quantity }}
        </p>
      </div>

      <!-- Quantity Control -->
      <div class="flex items-center gap-2">
        <button
          @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
          class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          -
        </button>
        <span class="px-4">{{ item.quantity }}</span>
        <button
          @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
          class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          +
        </button>
      </div>

      <!-- Remove Button -->
      <button
        @click="cart.removeFromCart(item.product.id)"
        class="text-red-600 dark:text-red-400 hover:text-red-700"
      >
        Remove
      </button>
    </div>

    <!-- Cart Summary -->
    <div class="border-t pt-4 mt-4">
      <div class="flex justify-between items-center mb-4 text-xl font-bold">
        <span>Total:</span>
        <span class="text-blue-600 dark:text-blue-400"
          >${{ cart.totalPrice.toFixed(2) }}</span
        >
      </div>
      <button
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
      >
        Checkout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/types/api";

const cart = useCartStore();

const calculatePrice = (product: Product) => {
  return (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
};
</script>
```

### Example 4.3: Cart Operations

```ts
const cart = useCartStore();

// Add to cart
cart.addToCart(product, 1);

// Add multiple items
cart.addToCart(product, 5);

// Update quantity
cart.updateQuantity(productId, 10);

// Remove item
cart.removeFromCart(productId);

// Get specific item
const cartItem = cart.getCartItem(productId);
console.log(cartItem?.quantity);

// Clear entire cart
cart.clearCart();

// Access cart data
console.log(cart.items); // All items
console.log(cart.totalItems); // Total quantity
console.log(cart.totalPrice); // Total price
console.log(cart.itemCount); // Number of unique items
```

### Example 4.4: Persist Custom Data to Cart

```ts
// Extend CartItem interface in your code
interface ExtendedCartItem {
  product: Product;
  quantity: number;
  notes: string; // Custom field
  giftWrap: boolean;
}

// When adding to cart with custom data
const addWithNotes = (product: Product, quantity: number, notes: string) => {
  // Store in separate map or extend the cart structure
  const itemId = product.id;
  if (!itemNotes.has(itemId)) {
    itemNotes.set(itemId, notes);
  }
  cart.addToCart(product, quantity);
};
```

---

## 5. Dark Mode Implementation

### Example 5.1: Theme Toggle in Header

```vue
<template>
  <header
    class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
  >
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Product Store
      </h1>

      <button
        @click="theme.toggleTheme"
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        :title="`Switch to ${theme.isDark ? 'light' : 'dark'} mode`"
      >
        <!-- Sun icon for dark mode, Moon for light mode -->
        <svg
          v-if="theme.isDark"
          class="w-6 h-6 text-yellow-500"
          fill="currentColor"
        >
          <!-- Sun SVG -->
          <circle cx="12" cy="12" r="5"></circle>
        </svg>
        <svg v-else class="w-6 h-6 text-gray-700" fill="currentColor">
          <!-- Moon SVG -->
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const theme = useTheme();
</script>
```

### Example 5.2: Conditional Styling Based on Theme

```vue
<template>
  <!-- Using theme state -->
  <div :style="{ backgroundColor: theme.isDark ? '#111827' : '#ffffff' }">
    Content
  </div>

  <!-- Using Tailwind dark: prefix (preferred) -->
  <div class="bg-white dark:bg-gray-900">Content</div>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const theme = useTheme();
</script>
```

### Example 5.3: Setting Specific Theme Mode

```ts
import { useTheme } from "@/composables/useTheme";

const theme = useTheme();

// Force dark mode
const enableDarkMode = () => {
  theme.setTheme("dark");
};

// Force light mode
const enableLightMode = () => {
  theme.setTheme("light");
};

// Follow system preference
const useSystemTheme = () => {
  theme.setTheme("system");
};

// Toggle between light and dark (respects current mode)
const toggleTheme = () => {
  theme.toggleTheme();
};
```

### Example 5.4: Theme Selector Component

```vue
<template>
  <div class="space-y-2">
    <label class="block text-sm font-semibold text-gray-900 dark:text-white"
      >Theme</label
    >

    <div class="flex gap-2">
      <button
        v-for="mode in ['light', 'dark', 'system']"
        :key="mode"
        @click="theme.setTheme(mode as any)"
        :class="[
          'px-4 py-2 rounded font-medium transition-colors',
          theme.theme === mode
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
        ]"
      >
        {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const theme = useTheme();
</script>
```

---

## 6. TypeScript Best Practices

### Example 6.1: Strictly Typed Function

```ts
// ❌ Bad - Using any
const fetchData = async (url: any): Promise<any> => {
  const response = await fetch(url);
  return response.json();
};

// ✅ Good - Fully typed
import type { ProductsApiResponse } from "@/types/api";

const fetchProducts = async (url: string): Promise<ProductsApiResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json() as Promise<ProductsApiResponse>;
};
```

### Example 6.2: Type Guards

```ts
import type { Product, ApiError } from "@/types/api";

// Type guard function
const isProduct = (value: unknown): value is Product => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "title" in value &&
    "price" in value
  );
};

// Usage
const handleData = (data: unknown) => {
  if (isProduct(data)) {
    console.log(`Product: ${data.title}`);
  } else {
    console.log("Not a product");
  }
};
```

### Example 6.3: Typed Event Handlers

```ts
import type { Product } from "@/types/api";

interface Props {
  product: Product;
}

// Strictly typed event emitters
const emit = defineEmits<{
  "add-to-cart": [product: Product];
  remove: [productId: number];
  rate: [rating: number];
}>();

// Type-safe event handler
const handleClick = (): void => {
  const props = defineProps<Props>();
  emit("add-to-cart", props.product);
};
```

### Example 6.4: Computed Properties with Types

```ts
import { computed, ref, Ref } from "vue";
import type { Product } from "@/types/api";

interface State {
  products: Ref<Product[]>;
  searchQuery: Ref<string>;
}

const createFilteredProducts = (state: State) => {
  return computed((): Product[] => {
    const query = state.searchQuery.value.toLowerCase();
    return state.products.value.filter((product) =>
      product.title.toLowerCase().includes(query),
    );
  });
};
```

---

## 7. Complete App Integration

### Example 7.1: Main App Component (App.vue)

```vue
<template>
  <div
    :class="theme.isDark ? 'dark' : ''"
    class="min-h-screen bg-white dark:bg-gray-900"
  >
    <!-- Header -->
    <header
      class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            🛍️ Product Store
          </h1>

          <div class="flex items-center gap-4">
            <!-- Cart Icon -->
            <button
              @click="showCart = !showCart"
              class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              <span
                v-if="cart.totalItems > 0"
                class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full"
              >
                {{ cart.totalItems }}
              </span>
            </button>

            <!-- Theme Toggle -->
            <button
              @click="theme.toggleTheme"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <svg v-if="theme.isDark" class="w-6 h-6" fill="currentColor">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
              </svg>
              <svg v-else class="w-6 h-6" fill="currentColor">
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                ></path>
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
      <div
        v-if="products.isLoading"
        class="flex justify-center items-center py-16"
      >
        <div class="text-center">
          <div class="inline-block mb-4">
            <div
              class="w-12 h-12 rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 animate-spin"
            ></div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            Loading amazing products...
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="products.error"
        class="mx-4 my-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      >
        <p class="text-red-800 dark:text-red-200 mb-2">
          {{ products.error.message }}
        </p>
        <button
          @click="products.clearError"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
        >
          Dismiss
        </button>
      </div>

      <!-- Products Grid -->
      <div v-else class="px-4 sm:px-6 lg:px-8 py-8">
        <div
          v-if="products.filteredProducts.length === 0"
          class="text-center py-12"
        >
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            No products found. Try adjusting your search.
          </p>
        </div>

        <div v-else>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Showing
            <span class="font-semibold">{{
              products.filteredProducts.length
            }}</span>
            of <span class="font-semibold">{{ products.total }}</span> products
          </p>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <ProductCard
              v-for="product in products.filteredProducts"
              :key="product.id"
              :product="product"
              @add-to-cart="handleAddToCart"
              @view-details="handleViewDetails"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Cart Sidebar -->
    <Transition name="slide">
      <div v-if="showCart" class="fixed inset-0 z-50 overflow-hidden">
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="showCart = false"
        ></div>

        <div
          class="absolute right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Cart
            </h2>
            <button
              @click="showCart = false"
              class="text-gray-500 dark:text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <!-- Cart content here (see Example 4.2) -->
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ProductCard from "./components/ProductCard.vue";
import FilterBar from "./components/FilterBar.vue";
import { useProducts } from "./composables/useProducts";
import { useTheme } from "./composables/useTheme";
import { useCartStore } from "./stores/cartStore";
import type { Product } from "./types/api";

const products = useProducts();
const theme = useTheme();
const cart = useCartStore();
const showCart = ref(false);

onMounted(async () => {
  cart.initializeCart();
  await products.fetchProducts({ limit: 30 });
});

const handleSearch = async (query: string) => {
  if (query.trim()) {
    await products.searchProducts(query);
  } else {
    await products.fetchProducts({ limit: 30 });
  }
};

const handleCategoryChange = async (category: string) => {
  if (category) {
    await products.searchProducts(category);
  } else {
    await products.fetchProducts({ limit: 30 });
  }
};

const handleAddToCart = (product: Product) => {
  cart.addToCart(product, 1);
};

const handleViewDetails = (productId: number) => {
  const product = products.products.value.find((p) => p.id === productId);
  if (product) {
    console.log("Viewing product:", product);
  }
};
</script>
```

---

## Quick Reference

### Import Patterns

```ts
// Composables
import { useProducts } from "@/composables/useProducts";
import { useTheme } from "@/composables/useTheme";

// Stores
import { useCartStore } from "@/stores/cartStore";

// Types
import type { Product, ProductsApiResponse } from "@/types/api";
```

### Common Patterns

```ts
// Initialize data
onMounted(async () => {
  cart.initializeCart();
  await products.fetchProducts();
});

// Search with debounce
watch(searchQuery, async (newQuery) => {
  debounceSearch(newQuery);
});

// Computed totals
const total = computed(() => cart.totalPrice);

// Handle errors
if (products.error.value) {
  showErrorNotification(products.error.value.message);
}
```

---

**These examples cover the most common use cases. Refer to the repository files for complete implementations!**
