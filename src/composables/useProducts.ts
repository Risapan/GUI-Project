import { ref, computed, Ref } from 'vue';
import type { Product, ProductsApiResponse, FetchProductsOptions, ApiError } from '../types/api';

const API_BASE_URL = 'https://dummyjson.com/products';

interface UseProductsReturn {
  products: Ref<Product[]>;
  isLoading: Ref<boolean>;
  error: Ref<ApiError | null>;
  total: Ref<number>;
  filteredProducts: Readonly<Ref<Product[]>>;
  fetchProducts: (options?: FetchProductsOptions) => Promise<void>;
  fetchByCategory: (category: string, limit?: number) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  clearError: () => void;
}

export function useProducts(): UseProductsReturn {
  const products = ref<Product[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<ApiError | null>(null);
  const total = ref<number>(0);
  const allProducts = ref<Product[]>([]);
  const searchQuery = ref<string>('');

  const filteredProducts = computed(() => {
    if (!searchQuery.value.trim()) {
      return products.value;
    }
    
    const query = searchQuery.value.toLowerCase();
    return products.value.filter((product: Product) =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  const fetchProducts = async (options?: FetchProductsOptions): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      
      if (options?.limit) {
        params.append('limit', options.limit.toString());
      }
      if (options?.skip !== undefined) {
        params.append('skip', options.skip.toString());
      }

      const url = options?.searchQuery
        ? `${API_BASE_URL}/search?q=${encodeURIComponent(options.searchQuery)}&${params.toString()}`
        : `${API_BASE_URL}?${params.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: ProductsApiResponse = await response.json();
      products.value = data.products;
      allProducts.value = data.products;
      total.value = data.total;
      searchQuery.value = '';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      error.value = {
        message: errorMessage,
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
        timestamp: Date.now(),
      };
      products.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchByCategory = async (category: string, limit?: number): Promise<void> => {
    if (!category.trim()) {
      await fetchProducts({ limit });
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      if (limit) {
        params.append('limit', limit.toString());
      }

      const url = `${API_BASE_URL}/category/${encodeURIComponent(category)}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Category fetch failed: ${response.statusText}`);
      }

      const data: ProductsApiResponse = await response.json();
      products.value = data.products;
      allProducts.value = data.products;
      total.value = data.total;
      searchQuery.value = '';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category products';
      error.value = {
        message: errorMessage,
        status: err instanceof Error && 'status' in err ? (err as any).status : undefined,
        timestamp: Date.now(),
      };
      products.value = allProducts.value;
    } finally {
      isLoading.value = false;
    }
  };

  const searchProducts = async (query: string): Promise<void> => {
    searchQuery.value = query;

    if (!query.trim()) {
      products.value = allProducts.value;
      total.value = allProducts.value.length;
      isLoading.value = false;
      searchQuery.value = '';
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data: ProductsApiResponse = await response.json();
      products.value = data.products;
      total.value = data.total;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      error.value = {
        message: errorMessage,
        timestamp: Date.now(),
      };
      products.value = allProducts.value;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  return {
    products,
    isLoading,
    error,
    total,
    filteredProducts,
    fetchProducts,
    fetchByCategory,
    searchProducts,
    clearError,
  };
}
