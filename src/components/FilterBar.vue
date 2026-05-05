<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, SlidersHorizontal, X } from 'lucide-vue-next'

const props = defineProps<{
  categories: string[],
  searchQuery: string,
  selectedCategory: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:selectedCategory', value: string): void
}>()

const localSearchQuery = computed({
  get: () => props.searchQuery,
  set: (val) => emit('update:searchQuery', val)
})

const isFilterOpen = ref(false)

const selectCategory = (category: string) => {
  emit('update:selectedCategory', category === props.selectedCategory ? '' : category)
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-8">
    <div class="flex flex-col md:flex-row gap-4 items-center">
      
      <!-- Search Input -->
      <div class="relative w-full md:flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-5 w-5 text-slate-400" />
        </div>
        <input 
          v-model="localSearchQuery"
          type="text" 
          placeholder="Search products by title, description..." 
          class="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
        />
        <button 
          v-if="localSearchQuery"
          @click="localSearchQuery = ''"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- Filter Toggle -->
      <button 
        @click="isFilterOpen = !isFilterOpen"
        class="flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-slate-700 dark:text-slate-200 font-medium transition-colors duration-200 w-full md:w-auto justify-center"
      >
        <SlidersHorizontal class="w-5 h-5" />
        <span>Categories</span>
      </button>
    </div>

    <!-- Categories Expansion -->
    <div 
      v-show="isFilterOpen"
      class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 transition-all duration-300"
    >
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectCategory('')"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          :class="!selectedCategory ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
        >
          All Products
        </button>
        <button
          v-for="category in categories" 
          :key="category"
          @click="selectCategory(category)"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 capitalize"
          :class="selectedCategory === category ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
        >
          {{ category }}
        </button>
      </div>
    </div>
  </div>
</template>
