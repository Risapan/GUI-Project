<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import { ShoppingCart, Trash2, ArrowLeft, Plus, Minus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <button 
      @click="router.back()" 
      class="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200 mb-8 font-medium group"
    >
      <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
      Continue Shopping
    </button>

    <div class="flex items-center gap-3 mb-8">
      <ShoppingCart class="w-8 h-8 text-blue-600 dark:text-blue-400" />
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Cart</h1>
    </div>

    <!-- Empty Cart -->
    <div v-if="cartStore.items.length === 0" class="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
      <ShoppingCart class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
      <h2 class="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Your cart is empty</h2>
      <p class="text-slate-500 dark:text-slate-400 mb-8">Looks like you haven't added anything yet.</p>
      <router-link to="/" class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200">
        Start Shopping
      </router-link>
    </div>

    <!-- Cart Items -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Items List -->
      <div class="lg:col-span-2 space-y-4">
        <div 
          v-for="item in cartStore.items" 
          :key="item.product.id"
          class="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <!-- Product Image -->
          <div class="w-24 h-24 flex-shrink-0 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden p-2">
            <img :src="item.product.thumbnail" :alt="item.product.title" class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
          </div>

          <!-- Product Info -->
          <div class="flex-grow text-center sm:text-left">
            <router-link :to="{ name: 'product-detail', params: { id: item.product.id } }" class="font-bold text-lg text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1">
              {{ item.product.title }}
            </router-link>
            <div class="text-slate-500 dark:text-slate-400 text-sm mt-1">{{ item.product.category }}</div>
            <div class="text-lg font-bold text-slate-900 dark:text-white mt-2">${{ item.product.price.toFixed(2) }}</div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <div class="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900">
              <button 
                @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                class="p-2 text-slate-500 hover:text-blue-600 transition-colors focus:outline-none"
              >
                <Minus class="w-4 h-4" />
              </button>
              <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
              <button 
                @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                class="p-2 text-slate-500 hover:text-blue-600 transition-colors focus:outline-none"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>
            
            <button 
              @click="cartStore.removeItem(item.product.id)"
              class="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors focus:outline-none"
              title="Remove item"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
          
          <div class="space-y-4 text-slate-600 dark:text-slate-300">
            <div class="flex justify-between">
              <span>Subtotal ({{ cartStore.totalItems }} items)</span>
              <span class="font-medium text-slate-900 dark:text-white">${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-medium">Free</span>
            </div>
          </div>
          
          <div class="border-t border-slate-200 dark:border-slate-700 my-6 pt-6">
            <div class="flex justify-between items-center mb-6">
              <span class="text-lg font-bold text-slate-900 dark:text-white">Total</span>
              <span class="text-2xl font-black text-slate-900 dark:text-white">${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            
            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              Checkout
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
