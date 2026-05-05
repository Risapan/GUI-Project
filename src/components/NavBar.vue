<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { ShoppingBag, Moon, Sun, Store } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const cartStore = useCartStore()

const cartItemCount = computed(() => cartStore.totalItems)
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors duration-200 shadow-md">
            <Store class="w-5 h-5" />
          </div>
          <span class="font-bold text-xl text-slate-900 dark:text-white tracking-tight">Apex</span>
        </router-link>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          
          <!-- Theme Toggle -->
          <button 
            @click="toggleDark()"
            class="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle Dark Mode"
          >
            <Moon v-if="!isDark" class="w-5 h-5" />
            <Sun v-else class="w-5 h-5" />
          </button>

          <!-- Cart Icon -->
          <router-link to="/cart" class="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <ShoppingBag class="w-6 h-6" />
            <span 
              v-if="cartItemCount > 0"
              class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-rose-500 rounded-full shadow-sm"
            >
              {{ cartItemCount }}
            </span>
          </router-link>

        </div>
      </div>
    </div>
  </nav>
</template>
