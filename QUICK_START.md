# Quick Start Guide

## Project Complete! ✅

You now have a fully functional Vue 3 Single Page Application with:

- ✅ Strictly typed TypeScript (zero `any` types)
- ✅ DummyJSON API integration with composables
- ✅ Responsive ProductCard and FilterBar components
- ✅ Pinia shopping cart with localStorage persistence
- ✅ Dark/Light theme toggle with Tailwind CSS
- ✅ Full TypeScript support throughout

---

## Installation & Running

### Step 1: Install Dependencies

```bash
cd "GUI project"
npm install
```

This installs:

- **vue**: Core Vue 3 framework
- **pinia**: State management
- **vite**: Build tool & dev server
- **tailwindcss**: Utility-first CSS
- **typescript**: Type checking

### Step 2: Start Development Server

```bash
npm run dev
```

This:

- Starts local dev server (usually http://localhost:5173)
- Opens browser automatically
- Enables hot module reloading (HMR)

### Step 3: Build for Production

```bash
npm run build
```

Output: `dist/` folder ready to deploy to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting

---

## File Structure at a Glance

```
GUI project/
├── src/
│   ├── components/
│   │   ├── ProductCard.vue          # Product display card
│   │   └── FilterBar.vue            # Search & filter input
│   ├── composables/
│   │   ├── useProducts.ts           # Fetch & manage products
│   │   └── useTheme.ts              # Dark/light mode
│   ├── stores/
│   │   └── cartStore.ts             # Pinia cart (localStorage)
│   ├── types/
│   │   └── api.ts                   # All TypeScript interfaces
│   ├── App.vue                      # Root component
│   ├── main.ts                      # Entry point
│   ├── index.css                    # Tailwind imports
│   └── vite-env.d.ts               # Vue type definitions
├── public/                          # Static assets
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript strict mode
├── tailwind.config.js              # Dark mode enabled
├── vite.config.ts                  # Vite configuration
├── README.md                        # Full documentation
├── ARCHITECTURE.md                  # Feature explanations
├── DARK_MODE_GUIDE.md              # Theme setup
└── QUICK_START.md                  # This file

```

---

## Key Features Explained

### 1. Type-Safe API Interfaces

**File:** `src/types/api.ts`

```ts
interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  images: string[];
  // ... all fields typed
}
```

✅ **Zero `any` types** - Full compile-time safety

### 2. Async Data Fetching

**File:** `src/composables/useProducts.ts`

```ts
const { products, isLoading, error, fetchProducts } = useProducts();

onMounted(async () => {
  await fetchProducts({ limit: 30 });
});
```

✅ **Handles:** Loading states, errors, pagination, searching

### 3. ProductCard Component

**File:** `src/components/ProductCard.vue`

```
[Image with discount badge]
[Category tag]
[Title]
[Rating with stars]
[Stock status]
[Price (with original crossed out)]
[Add to Cart] [Details]
```

✅ **Responsive:** 1 column (mobile) → 4 columns (desktop)
✅ **Dark mode:** All `dark:` classes included
✅ **Emits events:** Up to parent

### 4. FilterBar Component

**File:** `src/components/FilterBar.vue`

- Search input (debounced 300ms)
- Category dropdown
- Clear button
- Search info display

✅ **Emits:** `search`, `category-change` events

### 5. Pinia Shopping Cart

**File:** `src/stores/cartStore.ts`

```ts
const cart = useCartStore();

// Add to cart
cart.addToCart(product, 1);

// Get totals
console.log(cart.totalPrice); // $149.99
console.log(cart.totalItems); // 5 items
console.log(cart.items); // All items in cart

// Clear
cart.clearCart();
```

✅ **Persistence:** Automatically saves to localStorage
✅ **No setup needed:** Just call `cart.initializeCart()` on app startup

### 6. Dark Mode Theme

**File:** `src/composables/useTheme.ts`

```ts
const { isDark, toggleTheme, setTheme } = useTheme();

// Toggle
toggleTheme(); // switches light ↔ dark

// Set specific mode
setTheme("dark"); // force dark
setTheme("light"); // force light
setTheme("system"); // follow OS
```

✅ **No CSS changes needed:** Use `dark:` prefix + Tailwind classes
✅ **localStorage:** Persists preference
✅ **System detection:** Respects OS preference

---

## Common Tasks

### Add a Product to Cart

```ts
import { useCartStore } from "@/stores/cartStore";

const cart = useCartStore();

const handleAddToCart = (product: Product) => {
  cart.addToCart(product, 1);
};
```

### Search Products

```ts
import { useProducts } from "@/composables/useProducts";

const products = useProducts();

const handleSearch = async (query: string) => {
  await products.searchProducts(query);
};
```

### Access Cart Total

```ts
<template>
  <p>Total: ${{ cart.totalPrice.toFixed(2) }}</p>
  <p>Items: {{ cart.totalItems }}</p>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';

const cart = useCartStore();
</script>
```

### Toggle Dark Mode

```vue
<button @click="theme.toggleTheme">
  {{ theme.isDark ? '☀️ Light' : '🌙 Dark' }}
</button>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const theme = useTheme();
</script>
```

### Apply Dark Styles

```vue
<!-- Simple example -->
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">Title</h1>
</div>

<!-- ProductCard example -->
<div
  class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
>
  <img src="..." class="object-cover" />
  <h3 class="text-gray-900 dark:text-white">Product Name</h3>
  <button class="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700">
    Add to Cart
  </button>
</div>
```

---

## API Used

### DummyJSON Products API

Free, no authentication required.

**Endpoints:**

- Get all: `https://dummyjson.com/products?limit=30&skip=0`
- Search: `https://dummyjson.com/products/search?q=laptop`
- Category: `https://dummyjson.com/products/category/electronics`

**Response example:**

```json
{
  "products": [
    {
      "id": 1,
      "title": "iPhone 9",
      "price": 549,
      "discountPercentage": 12.96,
      "rating": 4.69,
      "stock": 94,
      "category": "smartphones",
      "thumbnail": "https://...",
      "images": ["https://..."]
    }
  ],
  "total": 194,
  "skip": 0,
  "limit": 30
}
```

---

## Next Steps / Enhancement Ideas

### 1. Add Product Detail Page

```ts
// Create pages/ProductDetail.vue
// Use route params to fetch single product
// Show full description, all images, reviews
```

### 2. User Authentication

```ts
// Add login/register
// Save user preferences
// Display order history
```

### 3. Checkout Page

```ts
// Order form
// Payment integration (Stripe, PayPal)
// Order confirmation
```

### 4. Product Reviews

```ts
// Display product reviews
// Allow users to add reviews
// Rating filter
```

### 5. Wishlist

```ts
// Create second Pinia store
// Add to wishlist
// Save to localStorage
```

### 6. Admin Dashboard

```ts
// Add products
// Edit inventory
// View orders
```

---

## Troubleshooting

### Port 5173 already in use?

```bash
npm run dev -- --port 3000
```

### TypeScript errors?

```bash
npm run lint
```

### Build failing?

```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run build
```

### Dark mode not working?

1. Check browser DevTools → Elements
2. Look for `class="dark"` on `<html>`
3. Check localStorage for `app-theme`
4. Verify `tailwind.config.js` has `darkMode: 'class'`

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
# Follow prompts
```

### Netlify

```bash
npm run build
# Drag dist/ folder to Netlify
```

### GitHub Pages

```bash
# Build
npm run build

# Push dist/ to gh-pages branch
```

---

## File Reference

| File                             | What It Does                                  |
| -------------------------------- | --------------------------------------------- |
| `src/types/api.ts`               | All TypeScript interfaces (no `any`!)         |
| `src/composables/useProducts.ts` | Fetch products, search, manage loading/errors |
| `src/composables/useTheme.ts`    | Dark/light mode toggle                        |
| `src/stores/cartStore.ts`        | Cart state + localStorage                     |
| `src/components/ProductCard.vue` | Display single product                        |
| `src/components/FilterBar.vue`   | Search & category filter                      |
| `src/App.vue`                    | Main app layout                               |
| `tailwind.config.js`             | Dark mode enabled (`class` strategy)          |
| `tsconfig.json`                  | TypeScript strict mode                        |
| `vite.config.ts`                 | Build configuration                           |
| `package.json`                   | Dependencies & scripts                        |

---

## Documentation Files

- **README.md** - Complete project documentation
- **ARCHITECTURE.md** - Deep dive into features & design
- **DARK_MODE_GUIDE.md** - Detailed dark mode setup
- **QUICK_START.md** - This file!

---

## Ready to Code? 🚀

```bash
npm install
npm run dev
```

Your app will open at http://localhost:5173

Start by:

1. Click "Add to Cart" on a product
2. Toggle dark mode with the Moon/Sun icon
3. Search for products in the FilterBar
4. Check your cart in the top-right

Happy coding!
