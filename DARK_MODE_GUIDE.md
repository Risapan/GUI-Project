# Dark Mode Setup Guide

## Quick Start

The dark mode implementation is already configured in your project. Here's how to use it:

## 1. Tailwind Configuration

Your `tailwind.config.js` has dark mode enabled:

```js
export default {
  darkMode: "class", // Key setting
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
};
```

**What `class` means:** Tailwind will apply dark styles when the `.dark` class is added to the `<html>` element.

## 2. Using Dark Mode Classes

In any component, add the `dark:` prefix to utilities:

```vue
<template>
  <!-- Light: white background, Dark: gray-900 background -->
  <div class="bg-white dark:bg-gray-900">
    <!-- Light: black text, Dark: white text -->
    <h1 class="text-gray-900 dark:text-white">Title</h1>

    <!-- Light: gray-600 text, Dark: gray-400 text -->
    <p class="text-gray-600 dark:text-gray-400">Description</p>
  </div>
</template>
```

## 3. Theme Toggle Button

The theme toggle is built into the header in `App.vue`:

```vue
<button
  @click="theme.toggleTheme"
  class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
>
  <!-- Sun icon shown in dark mode, Moon icon in light mode -->
  <svg v-if="theme.isDark" class="w-6 h-6"><!-- Sun SVG --></svg>
  <svg v-else class="w-6 h-6"><!-- Moon SVG --></svg>
</button>
```

Click this button to toggle between dark and light modes.

## 4. How It Works Behind the Scenes

### Step 1: Initialize Theme

```ts
import { useTheme } from "./composables/useTheme";

const { initializeTheme } = useTheme();
initializeTheme(); // Called in main.ts
```

This:

- Checks localStorage for saved theme
- Detects system preference if no saved theme
- Applies the appropriate class to `<html>`

### Step 2: Apply to DOM

```ts
const applyTheme = (): void => {
  const html = document.documentElement;
  if (isDark.value) {
    html.classList.add("dark"); // Enables dark: styles
  } else {
    html.classList.remove("dark"); // Disables dark: styles
  }
};
```

### Step 3: Save Preference

```ts
const persistTheme = (): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme.value);
};
```

Your theme preference persists across browser sessions.

## 5. Using the Theme Composable

In any component:

```vue
<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const { theme, isDark, setTheme, toggleTheme } = useTheme();

// isDark is a readonly computed boolean
console.log(isDark.value); // true or false

// Toggle between dark and light
toggleTheme();

// Set specific theme
setTheme("dark"); // Force dark mode
setTheme("light"); // Force light mode
setTheme("system"); // Follow OS preference (default)
</script>

<template>
  <div :class="isDark ? 'dark' : ''">
    <!-- Component content -->
  </div>
</template>
```

## 6. Theme Modes Explained

### Light Mode (`setTheme('light')`)

```
- Light mode always active
- Stored in localStorage
- All dark: utilities ignored
```

### Dark Mode (`setTheme('dark')`)

```
- Dark mode always active
- Stored in localStorage
- All dark: utilities applied
```

### System Mode (`setTheme('system')`)

```
- Follows OS/browser preference
- Stored in localStorage
- Changes automatically if system setting changes
```

## 7. Common Dark Mode Patterns

### Colors

```vue
<!-- Light: gray-900 (dark text), Dark: white (light text) -->
<span class="text-gray-900 dark:text-white">Text</span>

<!-- Light: white bg, Dark: gray-800 bg -->
<div class="bg-white dark:bg-gray-800"></div>

<!-- Light: gray-200 border, Dark: gray-700 border -->
<button class="border border-gray-200 dark:border-gray-700"></button>
```

### Hover States

```vue
<!-- Light hover, Dark hover -->
<button class="hover:bg-gray-100 dark:hover:bg-gray-700"></button>
```

### Shadows

```vue
<!-- Enhanced shadow in dark mode -->
<div class="shadow-sm dark:shadow-xl"></div>
```

### Opacity

```vue
<!-- More opaque background in dark mode -->
<div class="bg-white/50 dark:bg-gray-900/80"></div>
```

## 8. Storage Details

### Stored Data

```json
{
  "app-theme": "dark" // or "light" or "system"
}
```

### Retrieving Value

```ts
const savedTheme = localStorage.getItem("app-theme");
// Returns: 'light' | 'dark' | 'system' | null
```

### Clearing

```ts
localStorage.removeItem("app-theme");
// Theme resets to system preference
```

## 9. Detecting System Preference

The app automatically detects if user prefers dark mode:

```ts
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
```

When theme is set to `'system'`, the app uses this value.

## 10. Real-World Examples

### ProductCard Component

```vue
<!-- Card container -->
<div
  class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
>
  <!-- Title -->
  <h3 class="text-gray-900 dark:text-white">Product Name</h3>
  
  <!-- Description -->
  <p class="text-gray-600 dark:text-gray-400">Description</p>
  
  <!-- Button -->
  <button class="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700">
    Add to Cart
  </button>
</div>
```

### FilterBar Component

```vue
<input
  class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
  placeholder="Search..."
/>
```

### App Header

```vue
<header
  class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
>
  <h1 class="text-gray-900 dark:text-white">Product Store</h1>
</header>
```

## 11. Troubleshooting

### Dark mode not applying?

1. Check that `tailwind.config.js` has `darkMode: 'class'`
2. Verify `dark:` classes are in your CSS
3. Check browser console for `<html class="dark">`

### Styles not persisting between sessions?

1. Check localStorage is enabled in browser
2. Use DevTools → Application → Local Storage
3. Look for `app-theme` key

### System preference not detected?

1. Check OS settings for dark mode preference
2. Only works when theme is set to `'system'`
3. Some browsers require page refresh

## 12. Advanced: Custom Dark Colors

Extend Tailwind config to use custom colors:

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f9fafb",
          900: "#0a0e27",
          // ... more custom colors
        },
      },
    },
  },
  darkMode: "class",
};
```

Then use in components:

```vue
<div class="bg-dark-900 dark:bg-dark-900">...</div>
```

## 13. Browser Support

✅ Works in all modern browsers (Chrome, Firefox, Safari, Edge)
✅ Graceful fallback to light mode in older browsers
✅ System preference detection also works in most modern browsers

---

**That's it!** Your dark mode is fully configured and ready to use. Just use the `dark:` prefix in any Tailwind class to apply dark mode styles.
