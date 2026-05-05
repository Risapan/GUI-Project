<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProducts } from '../composables/useProducts'
import { useCartStore } from '../stores/cart'
import FilterBar from '../components/FilterBar.vue'
import ProductCard from '../components/ProductCard.vue'
import { Loader2 } from 'lucide-vue-next'

const { products, loading, error, fetchProducts } = useProducts()
const cartStore = useCartStore()

const searchQuery = ref('')
const selectedCategory = ref('')

onMounted(() => {
  fetchProducts()
})

const categories = computed(() => {
  const cats = new Set(products.value.map(p => p.category))
  return Array.from(cats).sort()
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value ? product.category === selectedCategory.value : true
    
    return matchesSearch && matchesCategory
  })
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Discover Products</h1>
      <p class="text-slate-500 dark:text-slate-400">Find the best deals on premium items.</p>
    </div>

    <FilterBar 
      :categories="categories"
      v-model:searchQuery="searchQuery"
      v-model:selectedCategory="selectedCategory"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <Loader2 class="w-10 h-10 text-blue-600 animate-spin mb-4" />
      <p class="text-slate-500 dark:text-slate-400 font-medium">Loading amazing products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-6 rounded-2xl text-center">
      <p class="font-medium text-lg mb-2">Oops! Something went wrong.</p>
      <p>{{ error }}</p>
      <button @click="fetchProducts" class="mt-4 px-4 py-2 bg-rose-100 dark:bg-rose-800 hover:bg-rose-200 dark:hover:bg-rose-700 rounded-lg transition-colors duration-200">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
      <p class="text-slate-500 dark:text-slate-400 text-lg">No products found matching your criteria.</p>
      <button @click="searchQuery = ''; selectedCategory = ''" class="mt-4 text-blue-600 hover:text-blue-700 font-medium">
        Clear filters
      </button>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <router-link 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :to="{ name: 'product-detail', params: { id: product.id } }"
        class="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded-2xl block h-full"
      >
        <ProductCard 
          :product="product" 
          @add-to-cart="cartStore.addItem" 
        />
      </router-link>
    </div>
  </div>
</template>
