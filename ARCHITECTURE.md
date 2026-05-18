# Vue 3 SPA Architecture & Advanced Features

## Table of Contents

1. [Pinia Shopping Cart Store](#pinia-shopping-cart-store)
2. [Dark/Light Theme Implementation](#dark-light-theme)
3. [Type-Safe API Integration](#type-safe-api)
4. [Component Architecture](#component-architecture)

---

## Pinia Shopping Cart Store

### Overview

The Pinia cart store manages a persistent shopping cart with localStorage synchronization. It follows Vue 3's Composition API pattern and is fully type-safe.

### File: `src/stores/cartStore.ts`

#### Store Structure

```ts
export interface CartItem {
  product: Product;
  quantity: number;
}
```

#### State Management

```ts
const items = ref<CartItem[]>([]);
```

The store maintains:

- **items**: Array of cart items with quantities
- **total items**: Computed count of all items
- **total price**: Computed sum with discounts applied

#### Key Methods

##### 1. `initializeCart()`

Loads cart from localStorage on app startup:

```ts
const cart = useCartStore();

onMounted(() => {
  cart.initializeCart(); // Restores previous session cart
});
```

**How it works:**

- Reads from key `'shopping-cart'`
- Parses JSON array of CartItem objects
- Handles errors gracefully if data is corrupted

##### 2. `addToCart(product, quantity)`

Adds or updates item in cart:

```ts
const handleAddToCart = (product: Product) => {
  cart.addToCart(product, 1);
};
```

**Logic:**

- Checks if product already in cart
- If exists: increments quantity
- If new: adds new CartItem
- Automatically persists to localStorage

##### 3. `removeFromCart(productId)`

Removes item completely from cart:

```ts
cart.removeFromCart(productId);
```

##### 4. `updateQuantity(productId, quantity)`

Updates item quantity (removes if quantity ≤ 0):

```ts
cart.updateQuantity(productId, 5);
```

##### 5. `clearCart()`

Empties entire cart:

```ts
cart.clearCart();
```

#### Computed Properties

**`totalItems`** - Total quantity of all items:

```ts
console.log(cart.totalItems); // e.g., 5
```

**`totalPrice`** - Cart total with discount applied:

```ts
console.log(cart.totalPrice); // e.g., 149.99
```

Calculation: `price * (1 - discountPercentage / 100) * quantity`

**`itemCount`** - Number of unique items:

```ts
console.log(cart.itemCount); // e.g., 3
```

#### localStorage Persistence

Cart is automatically saved after each operation:

```ts
// Triggered on every add/remove/update
const persistCart = (): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value));
};
```

**Storage Format:**

```json
{
  "shopping-cart": [
    {
      "product": { id, title, price, ... },
      "quantity": 2
    },
    ...
  ]
}
```

#### Usage in Components

**ProductCard.vue:**

```vue
<script setup lang="ts">
import { useCartStore } from "../stores/cartStore";

const cart = useCartStore();

const emitAddToCart = () => {
  cart.addToCart(props.product, 1);
};
</script>
```

**App.vue (Cart Sidebar):**

```vue
<template>
  <div class="cart-sidebar">
    <div v-for="item in cart.items" :key="item.product.id">
      <img :src="item.product.thumbnail" />
      <span>{{ item.product.title }}</span>
      <span
        >${{
          item.product.price *
          (1 - item.product.discountPercentage / 100) *
          item.quantity
        }}</span
      >
    </div>
    <p>Total: ${{ cart.totalPrice.toFixed(2) }}</p>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "./stores/cartStore";

const cart = useCartStore();

onMounted(() => {
  cart.initializeCart();
});
</script>
```

---

## Dark/Light Theme Implementation

### Overview

The theme system uses Tailwind CSS's `dark:` modifier with a composable that manages theme state and DOM updates.

### File: `src/composables/useTheme.ts`

#### Theme Modes

```ts
type Theme = "light" | "dark" | "system";
```

- **light**: Force light mode
- **dark**: Force dark mode
- **system**: Follow OS preference (default)

#### Hook Structure

```ts
const { theme, isDark, setTheme, toggleTheme } = useTheme();
```

#### Core Functionality

##### 1. Theme Detection

```ts
const getSystemPreference = (): boolean => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};
```

Uses `prefers-color-scheme` media query to detect system preference.

##### 2. Computing isDark

```ts
const isDark = computed((): boolean => {
  if (theme.value === "dark") return true;
  if (theme.value === "light") return false;
  return getSystemPreference(); // system mode
});
```

##### 3. Applying Theme to DOM

```ts
const applyTheme = (): void => {
  const html = document.documentElement;
  if (isDark.value) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
};
```

Adds/removes `dark` class to `<html>` element.

##### 4. localStorage Persistence

```ts
const persistTheme = (): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme.value);
};
```

Saves theme preference with key `'app-theme'`.

### Tailwind Configuration

**`tailwind.config.js`:**

```js
export default {
  darkMode: "class", // Uses CSS class strategy
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
};
```

**Key setting:** `darkMode: 'class'` enables the `dark:` prefix in utilities.

### Using Dark Mode in Components

#### 1. Using Helper Composable

```vue
<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <button @click="toggleTheme">
    {{ isDark ? "Light Mode" : "Dark Mode" }}
  </button>
</template>
```

#### 2. Using Tailwind Classes

```vue
<template>
  <!-- Tailwind applies dark: styles when .dark class is on html -->
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <h1 class="text-2xl font-bold">Title</h1>
    <p class="text-gray-600 dark:text-gray-400">Description</p>
  </div>
</template>
```

#### 3. Common Dark Mode Patterns

```vue
<!-- Background colors -->
<div class="bg-white dark:bg-gray-800"></div>

<!-- Text colors -->
<p class="text-gray-900 dark:text-white"></p>

<!-- Border colors -->
<div class="border border-gray-200 dark:border-gray-700"></div>

<!-- Hover states -->
<button class="hover:bg-gray-100 dark:hover:bg-gray-700"></button>

<!-- Shadow -->
<div class="shadow-md dark:shadow-2xl"></div>
```

### System Theme Change Detection

```ts
// Listen for system theme changes
if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    if (theme.value === "system") {
      applyTheme(); // Reapply if in system mode
    }
  });
}
```

The app automatically responds when user changes system theme.

### Complete Theme Toggle Button Example

```vue
<template>
  <button
    @click="theme.toggleTheme"
    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    :title="`Switch to ${theme.isDark ? 'light' : 'dark'} mode`"
  >
    <!-- Sun icon for dark mode -->
    <svg v-if="theme.isDark" class="w-6 h-6" fill="currentColor">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <!-- ... more lines ... -->
    </svg>

    <!-- Moon icon for light mode -->
    <svg v-else class="w-6 h-6" fill="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const theme = useTheme();
</script>
```

---

## Type-Safe API Integration

### Strictly Typed Interfaces

**File: `src/types/api.ts`**

All types for DummyJSON `/products` API:

```ts
export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  // ... etc
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
```

### Zero `any` Types

Every API response and error is fully typed. The composable ensures type safety:

```ts
// TypeScript catches API errors at compile time
const fetchProducts = async (options?: FetchProductsOptions): Promise<void> => {
  const data: ProductsApiResponse = await response.json();
  // Type inference works throughout
  products.value = data.products; // Type: Product[]
};
```

### API Endpoints

```ts
const API_BASE_URL = 'https://dummyjson.com/products';

// Fetch products with options
GET https://dummyjson.com/products?limit=30&skip=0

// Search products
GET https://dummyjson.com/products/search?q=laptop

// Get specific category
GET https://dummyjson.com/products/category/electronics
```

---

## Component Architecture

### Component Hierarchy

```
App.vue
├── header
│   ├── Cart Badge (useCartStore)
│   └── Theme Toggle (useTheme)
├── FilterBar.vue
│   ├── Search Input
│   ├── Category Select
│   └── Clear Button
└── Grid
    └── ProductCard.vue (repeated)
        ├── Image
        ├── Product Info
        ├── Rating
        ├── Price
        └── Actions (Add to Cart, Details)
```

### Data Flow

```
App.vue (root)
│
├─→ useProducts() [composable]
│   └─→ Fetch API, manage state
│       └─→ Pass products to ProductCard
│
├─→ useCartStore() [Pinia]
│   └─→ Global state management
│       └─→ Available to all components
│
└─→ useTheme() [composable]
    └─→ Manage dark/light mode
        └─→ Apply class to html element
```

### Reactive Props & Emits

**ProductCard.vue:**

```ts
// Props
defineProps<{ product: Product }>();

// Emits
emit("add-to-cart", product);
emit("view-details", productId);
```

**FilterBar.vue:**

```ts
// Emits
emit("search", queryString);
emit("category-change", categoryString);
```

### Event Handling Chain

```
User clicks "Add to Cart" (ProductCard)
  ↓
ProductCard emits 'add-to-cart' event
  ↓
App.vue receives event (handleAddToCart)
  ↓
cart.addToCart(product, 1) called
  ↓
Pinia store updates state & saves to localStorage
  ↓
UI updates (cart badge, sidebar)
```

---

## Best Practices Summary

### 1. Type Safety

✅ Use strict TypeScript (`noImplicitAny: true`)
✅ Define interfaces for all data structures
❌ Never use `any`

### 2. State Management

✅ Use Pinia for global state (cart)
✅ Use composables for reusable logic (useProducts)
✅ Persist important state to localStorage

### 3. Component Design

✅ Keep components small and focused
✅ Use `<script setup>` for cleaner code
✅ Emit events for parent-child communication

### 4. Styling

✅ Use Tailwind CSS utility classes
✅ Use `dark:` prefix for dark mode
✅ Group related classes (colors, spacing, etc.)

### 5. Performance

✅ Debounce search input (300ms)
✅ Use lazy evaluation in computed properties
✅ Optimize re-renders with `v-show` vs `v-if`

---

## Advanced Customization

### Adding More Filters

Extend `FilterBar.vue`:

```vue
<script setup lang="ts">
const priceRange = ref([0, 1000]);
const sortBy = ref("relevance");

const emit = defineEmits<{
  "price-change": [min: number, max: number];
  "sort-change": [sort: string];
}>();
</script>

<template>
  <input v-model.number="priceRange[0]" type="range" min="0" max="1000" />
  <select v-model="sortBy" @change="emit('sort-change', sortBy)">
    <option value="relevance">Most Relevant</option>
    <option value="price-low">Price: Low to High</option>
    <option value="price-high">Price: High to Low</option>
    <option value="rating">Highest Rated</option>
  </select>
</template>
```

### Adding Product Detail Page

Create `ProductDetail.vue` with full TypeScript support:

```ts
const product = computed<Product | undefined>(() => {
  return products.value.find((p) => p.id === route.params.id);
});
```

### Checkout Integration

Extend cart checkout:

```ts
const handleCheckout = async () => {
  // 1. Validate cart
  if (cart.items.length === 0) {
    alert("Cart is empty");
    return;
  }

  // 2. Process payment (integrate Stripe, PayPal, etc.)
  const paymentResult = await processPayment({
    total: cart.totalPrice,
    items: cart.items,
  });

  // 3. Clear cart on success
  if (paymentResult.success) {
    cart.clearCart();
    router.push("/success");
  }
};
```

---

## File Reference

| File                             | Purpose                |
| -------------------------------- | ---------------------- |
| `src/types/api.ts`               | API type definitions   |
| `src/composables/useProducts.ts` | Data fetching logic    |
| `src/composables/useTheme.ts`    | Theme management       |
| `src/stores/cartStore.ts`        | Shopping cart state    |
| `src/components/ProductCard.vue` | Product display        |
| `src/components/FilterBar.vue`   | Search & filter        |
| `src/App.vue`                    | Root component         |
| `tailwind.config.js`             | Tailwind configuration |
| `tsconfig.json`                  | TypeScript strict mode |
| `index.html`                     | HTML entry point       |
