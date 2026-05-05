<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '../types'
import { ShoppingCart, Star } from 'lucide-vue-next'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>()

const isHovered = ref(false)
</script>

<template>
  <div 
    class="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Image Section -->
    <div class="relative w-full pt-[100%] bg-slate-100 dark:bg-slate-900 overflow-hidden">
      <img 
        :src="product.thumbnail" 
        :alt="product.title" 
        class="absolute top-0 left-0 w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-500"
        :class="{ 'scale-110': isHovered }"
      />
      
      <!-- Discount Badge -->
      <div v-if="product.discountPercentage > 10" class="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md">
        -{{ Math.round(product.discountPercentage) }}%
      </div>
      
      <!-- Category Tag -->
      <div class="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-800 dark:text-slate-200 text-xs font-medium px-2 py-1 rounded-md capitalize shadow-sm">
        {{ product.category }}
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-5 flex flex-col flex-grow">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-lg leading-tight text-slate-900 dark:text-white line-clamp-2" :title="product.title">
          {{ product.title }}
        </h3>
      </div>
      
      <p class="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">
        {{ product.description }}
      </p>

      <!-- Rating -->
      <div class="flex items-center space-x-1 mb-4">
        <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ product.rating }}</span>
        <span class="text-xs text-slate-400">({{ product.reviews?.length || 0 }})</span>
      </div>

      <!-- Price & Action -->
      <div class="flex items-center justify-between mt-auto">
        <div class="flex flex-col">
          <span class="text-xl font-bold text-slate-900 dark:text-white">${{ product.price.toFixed(2) }}</span>
          <span v-if="product.discountPercentage > 0" class="text-xs text-slate-400 line-through">
            ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
          </span>
        </div>
        
        <button 
          @click.prevent="emit('add-to-cart', product)"
          class="flex items-center justify-center p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 shadow-md hover:shadow-lg active:scale-95"
          aria-label="Add to cart"
        >
          <ShoppingCart class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
