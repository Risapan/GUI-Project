import { ref } from 'vue'
import type { Product, ProductsResponse } from '../types'

export function useProducts() {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      // Fetching up to 100 products to have a good set of data to filter
      const response = await fetch('https://dummyjson.com/products?limit=100')
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`)
      }
      const data: ProductsResponse = await response.json()
      products.value = data.products
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unknown error occurred'
      }
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id: number | string): Promise<Product | null> => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`)
      if (!response.ok) {
        throw new Error(`Error fetching product: ${response.statusText}`)
      }
      const data: Product = await response.json()
      return data
    } catch (err: unknown) {
       if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unknown error occurred'
      }
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById
  }
}
