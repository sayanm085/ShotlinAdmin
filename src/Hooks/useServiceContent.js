// src/Hooks/useServiceContent.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProducts,
  fetchProductDetails,
  uploadProduct,
  updateProduct,
  deleteProduct,
} from '@/Api/ServiceData.api';

const FIVE_MINUTES = 1000 * 60 * 5;

/**
 * Fetch paginated products list
 */
export function useServiceContent({ search, category, page = 1, limit = 20 }) {
  return useQuery({
    queryKey: ['products', { search, category, page, limit }],
    queryFn: () => fetchProducts({ search, category, page, limit }),
    staleTime: FIVE_MINUTES,
    cacheTime: FIVE_MINUTES * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

/**
 * Fetch a single product’s details
 */
export function useProductDetails(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductDetails(id),
    enabled: Boolean(id),
    staleTime: FIVE_MINUTES,
    cacheTime: FIVE_MINUTES * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

/**
 * Upload a brand new product
 */
export function useUploadProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => uploadProduct(formData),
    onSuccess: () => {
      // Invalidate product list so it refetches with new entry
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/**
 * Update an existing product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => updateProduct(id, formData),
    onSuccess: () => {
      // Refresh both list and details
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

/**
 * Delete a product by ID.
 * Invalidates the products list on success.
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
