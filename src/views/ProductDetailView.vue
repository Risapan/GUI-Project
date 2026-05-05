<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types'
import { Loader2, ArrowLeft, Star, ShoppingCart, Check, Shield, Truck } from 'lucide-vue-next'

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const router = useRouter()
const { fetchProductById, loading, error } = useProducts()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const selectedImage = ref('')
const quantity = ref(1)

const loadProduct = async () => {
  const data = await fetchProductById(props.id)
  if (data) {
    product.value = data
    selectedImage.value = data.images[0] || data.thumbnail
  }
}

onMounted(loadProduct)

watch(() => props.id, loadProduct)

const addToCart = () => {
  if (product.value) {
    cartStore.addItem(product.value, quantity.value)
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Back Button -->
    <button 
      @click="router.back()" 
      class="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200 mb-8 font-medium group"
    >
      <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
      Back to Products
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32">
      <Loader2 class="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p class="text-slate-500 dark:text-slate-400 font-medium text-lg">Loading product details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !product" class="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-8 rounded-2xl text-center max-w-lg mx-auto">
      <p class="font-medium text-xl mb-3">Product not found</p>
      <p>{{ error || 'The product you are looking for does not exist.' }}</p>
      <button @click="router.push('/')" class="mt-6 px-6 py-3 bg-rose-100 dark:bg-rose-800 hover:bg-rose-200 dark:hover:bg-rose-700 rounded-xl transition-colors duration-200 font-medium">
        Go to Home
      </button>
    </div>

    <!-- Product Details -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      <!-- Image Gallery -->
      <div class="flex flex-col gap-4">
        <!-- Main Image -->
        <div class="aspect-square bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center p-8 relative">
          <img 
            :src="selectedImage" 
            :alt="product.title" 
            class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
          />
          <div v-if="product.discountPercentage > 0" class="absolute top-6 right-6 bg-rose-500 text-white font-bold px-4 py-2 rounded-full shadow-lg text-lg">
            -{{ Math.round(product.discountPercentage) }}%
          </div>
        </div>
        
        <!-- Thumbnails -->
        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" v-if="product.images.length > 1">
          <button 
            v-for="img in product.images" 
            :key="img"
            @click="selectedImage = img"
            class="flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200"
            :class="selectedImage === img ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20' : 'border-transparent opacity-70 hover:opacity-100 bg-slate-100 dark:bg-slate-800'"
          >
            <img :src="img" :alt="product.title" class="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col">
        <!-- Breadcrumbs / Category -->
        <div class="text-sm text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase mb-3">
          {{ product.category }}
        </div>
        
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
          {{ product.title }}
        </h1>
        
        <!-- Rating & Reviews -->
        <div class="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-1">
            <Star class="w-5 h-5 fill-amber-400 text-amber-400" />
            <span class="font-bold text-slate-900 dark:text-white text-lg">{{ product.rating }}</span>
          </div>
          <span class="text-slate-400">•</span>
          <a href="#reviews" class="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
            {{ product.reviews?.length || 0 }} Reviews
          </a>
          <span class="text-slate-400">•</span>
          <span class="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <Check class="w-4 h-4" /> In Stock
          </span>
        </div>

        <!-- Price -->
        <div class="mb-8 flex items-end gap-4">
          <span class="text-5xl font-black text-slate-900 dark:text-white">${{ product.price.toFixed(2) }}</span>
          <span v-if="product.discountPercentage > 0" class="text-2xl text-slate-400 line-through mb-1">
            ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
          </span>
        </div>

        <p class="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
          {{ product.description }}
        </p>

        <!-- Add to Cart Actions -->
        <div class="flex flex-col sm:flex-row gap-4 mb-10">
          <!-- Quantity -->
          <div class="flex items-center justify-between border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 sm:w-32 bg-white dark:bg-slate-800 shadow-sm">
            <button @click="quantity > 1 && quantity--" class="text-slate-500 hover:text-blue-600 p-2 focus:outline-none">-</button>
            <span class="font-bold text-lg w-8 text-center">{{ quantity }}</span>
            <button @click="quantity++" class="text-slate-500 hover:text-blue-600 p-2 focus:outline-none">+</button>
          </div>
          
          <button 
            @click="addToCart"
            class="flex-1 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-[0.98]"
          >
            <ShoppingCart class="w-6 h-6" />
            Add to Cart
          </button>
        </div>

        <!-- Features -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Shield class="w-6 h-6 text-emerald-500" />
            <span class="font-medium">{{ product.warrantyInformation }}</span>
          </div>
          <div class="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Truck class="w-6 h-6 text-blue-500" />
            <span class="font-medium">{{ product.shippingInformation }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
