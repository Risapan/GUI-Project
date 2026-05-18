# Product Store - Vue 3 Single Page Application

A fully responsive, type-safe e-commerce SPA built with Vue 3, TypeScript, Tailwind CSS, and Pinia.

## Project Structure

```
src/
├── components/          # Vue 3 components
│   ├── ProductCard.vue  # Responsive product card with Tailwind CSS
│   └── FilterBar.vue    # Search and filter component
├── composables/         # Vue 3 Composition API composables
│   ├── useProducts.ts   # Handles product fetching with DummyJSON API
│   └── useTheme.ts      # Dark/light theme toggle logic
├── stores/              # Pinia stores
│   └── cartStore.ts     # Shopping cart with localStorage persistence
├── types/               # TypeScript interfaces
│   └── api.ts           # Strictly typed API response interfaces
├── App.vue              # Root component
├── main.ts              # App entry point
└── index.css            # Tailwind CSS imports
```

## Key Features

### 1. **Strictly Typed TypeScript Interfaces** (`src/types/api.ts`)

- Complete type definitions for DummyJSON `/products` API
- No `any` types - fully type-safe
- Includes `Product`, `ProductsApiResponse`, `FetchProductsOptions`, and error types

### 2. **Async Data Fetching** (`src/composables/useProducts.ts`)

- Vue 3 Composition API composable
- Fetches data from DummyJSON API using standard `fetch`
- Supports search, filtering, and pagination
- Full error handling with typed error responses
- Computed property for client-side filtering

### 3. **ProductCard Component** (`src/components/ProductCard.vue`)

- Responsive grid layout with Tailwind CSS
- Displays product image, price, rating, stock status
- Discount badge and category tags
- "Add to Cart" and "Details" action buttons
- Dark mode support with `dark:` modifier

### 4. **FilterBar Component** (`src/components/FilterBar.vue`)

- Search input with debouncing
- Category filter dropdown
- Search info display
- Clear search button
- Emits search string and category to parent

### 5. **Pinia Shopping Cart Store** (`src/stores/cartStore.ts`)

- Full CRUD operations for cart items
- Automatic localStorage persistence
- Computed totals (items, price)
- Quantity management
- Initialized on app mount

### 6. **Dark/Light Theme Toggle** (`src/composables/useTheme.ts`)

- Uses Tailwind's `dark:` modifier
- System preference detection
- localStorage persistence
- Smooth transitions
- Three modes: 'light', 'dark', 'system'

## Installation & Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation Steps

```bash
# Navigate to project directory
cd "GUI project"

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

### Tailwind CSS Dark Mode

The project is configured for dark mode using the `class` strategy in `tailwind.config.js`:

```js
export default {
  darkMode: "class", // Add 'dark' class to html element to enable dark mode
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
};
```

**Usage in components:**

```vue
<!-- Light mode: bg-white, Dark mode: bg-gray-900 -->
<div class="bg-white dark:bg-gray-900">
  Content
</div>
```

### Theme Setup in App

The `useTheme()` composable manages theme state:

```ts
const { theme, isDark, setTheme, toggleTheme } = useTheme();

// Toggle between light/dark
toggleTheme();

// Set specific theme
setTheme('dark');

// Use in templates
<div :class="isDark ? 'dark' : ''">...</div>
```

## Component Integration Example

### In Parent View

```vue
<template>
  <FilterBar @search="handleSearch" @category-change="handleCategoryChange" />

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
import { useProducts } from "./composables/useProducts";
import { useCartStore } from "./stores/cartStore";

const products = useProducts();
const cart = useCartStore();

const handleSearch = async (query: string) => {
  await products.searchProducts(query);
};

const handleAddToCart = (product) => {
  cart.addToCart(product, 1);
};
</script>
```

## API Integration

### DummyJSON API Endpoints

- **Get all products**: `https://dummyjson.com/products?limit=30`
- **Search products**: `https://dummyjson.com/products/search?q=iphone`
- **Get by category**: `https://dummyjson.com/products/category/electronics`

### Example Response Structure (Typed)

```ts
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  images: string[];
  thumbnail: string;
  // ... more fields (all typed)
}
```

## Pinia Store Usage

### Initialize Cart on App Start

```ts
import { useCartStore } from "./stores/cartStore";

const cart = useCartStore();

onMounted(() => {
  cart.initializeCart(); // Load from localStorage
});
```

### Add/Remove Items

```ts
// Add to cart
cart.addToCart(product, quantity);

// Remove from cart
cart.removeFromCart(productId);

// Update quantity
cart.updateQuantity(productId, newQuantity);

// Clear cart
cart.clearCart();
```

### Access Cart Data

```ts
// Get reactive totals
const total = cart.totalPrice; // Computed
const itemCount = cart.totalItems; // Computed

// Get all items
const items = cart.items; // Ref<CartItem[]>
```

## localStorage Keys

- **cart**: `shopping-cart`
- **theme**: `app-theme`

## TypeScript Configuration

The project uses strict TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

## Responsive Design

All components use Tailwind CSS breakpoints:

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

Example from ProductCard:

```vue
<!-- 1 column on mobile, 2 on sm, 3 on md, 4 on lg -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
```

## Development Best Practices

### 1. **Type Safety**

- Avoid `any` types
- Use interfaces for all data structures
- Enable strict mode in TypeScript

### 2. **Component Organization**

- Keep components focused and single-responsibility
- Use `<script setup>` for simpler syntax
- Emit events for parent-child communication

### 3. **State Management**

- Use Pinia stores for global state
- Use composables for reusable logic
- Persist important state to localStorage

### 4. **Performance**

- Use `v-show` for frequent toggles
- Debounce search input
- Lazy load images when needed

## Build & Deploy

```bash
# Production build
npm run build

# Output: dist/ folder ready for deployment

# Preview production build locally
npm run preview
```

## License

MIT
