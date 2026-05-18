<template>
  <div class="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <!-- Search Input -->
        <div class="w-full sm:flex-1">
          <div class="relative">
            <input
              v-model="searchInput"
              @input="handleSearchInput"
              type="text"
              placeholder="Search products by name, description, or category..."
              class="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
            />
            <svg
              class="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- Clear Button -->
        <button
          v-if="searchInput.trim()"
          @click="clearSearch"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
        >
          Clear Search
        </button>

        <!-- Category Filter (Optional Enhancement) -->
        <select
          v-model="selectedCategory"
          @change="handleCategoryChange"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
        >
          <option value="">All Categories</option>
          <option value="smartphones">Smartphones</option>
          <option value="laptops">Laptops</option>
          <option value="fragrances">Fragrances</option>
          <option value="skin-care">Skin Care</option>
          <option value="groceries">Groceries</option>
          <option value="home-decoration">Home Decoration</option>
          <option value="furniture">Furniture</option>
          <option value="tops">Tops</option>
        </select>
      </div>

      <!-- Search Info -->
      <div v-if="searchInput.trim() || selectedCategory" class="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Searching for: <span class="font-semibold text-gray-900 dark:text-white">{{ getSearchLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const searchInput = ref<string>('');
const selectedCategory = ref<string>('');
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const emit = defineEmits<{
  search: [query: string];
  'category-change': [category: string];
}>();

const getSearchLabel = computed(() => {
  const parts: string[] = [];
  if (searchInput.value.trim()) {
    parts.push(`"${searchInput.value}"`);
  }
  if (selectedCategory.value) {
    parts.push(`category: ${selectedCategory.value}`);
  }
  return parts.join(' + ');
});

const handleSearchInput = (): void => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    emit('search', searchInput.value.trim());
  }, 300);
};

const handleCategoryChange = (): void => {
  emit('category-change', selectedCategory.value);
};

const clearSearch = (): void => {
  searchInput.value = '';
  selectedCategory.value = '';
  emit('search', '');
  emit('category-change', '');
};
</script>
