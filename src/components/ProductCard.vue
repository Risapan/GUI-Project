<template>
  <div
    @click="emitViewDetails"
    class="group h-full rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col cursor-pointer"
  >
    <!-- Image Container -->
    <div class="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-if="product.discountPercentage > 0" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
        -{{ Math.floor(product.discountPercentage) }}%
      </div>
      <div class="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
        {{ product.category }}
      </div>
    </div>

    <!-- Content Container -->
    <div class="flex-1 p-4 flex flex-col">
      <!-- Title -->
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 h-10">
        {{ product.title }}
      </h3>

      <!-- Description -->
      <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 flex-grow">
        {{ product.description }}
      </p>

      <!-- Rating -->
      <div class="flex items-center mb-3">
        <div class="flex text-yellow-400">
          <span v-for="i in 5" :key="i" class="text-lg">
            {{ i <= Math.round(product.rating) ? '★' : '☆' }}
          </span>
        </div>
        <span class="ml-2 text-xs text-gray-600 dark:text-gray-400">
          {{ product.rating.toFixed(1) }}
        </span>
      </div>

      <!-- Stock Status -->
      <div class="mb-3">
        <span
          :class="[
            'text-xs font-semibold',
            product.stock > 10 ? 'text-green-600 dark:text-green-400' : product.stock > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
          ]"
        >
          {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
        </span>
      </div>

      <!-- Price Section -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
        <div class="flex items-baseline gap-2">
          <span class="text-lg font-bold text-gray-900 dark:text-white">
            ${{ Math.ceil(product.price * (1 - product.discountPercentage / 100)) }}
          </span>
          <span v-if="product.discountPercentage > 0" class="text-sm text-gray-500 dark:text-gray-400 line-through">
            ${{ product.price }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 mt-auto">
        <button
          @click.stop="emitAddToCart"
          :disabled="product.stock === 0"
          :class="[
            'flex-1 py-2 px-3 rounded font-semibold text-sm transition-colors duration-200',
            product.stock === 0
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
          ]"
        >
          {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
        </button>
        <button
          @click.stop="emitViewDetails"
          class="flex-1 py-2 px-3 rounded font-semibold text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../types/api';

interface Props {
  product: Product;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'add-to-cart': [product: Product];
  'view-details': [productId: number];
}>();

const emitAddToCart = (): void => {
  emit('add-to-cart', props.product);
};

const emitViewDetails = (): void => {
  emit('view-details', props.product.id);
};
</script>
