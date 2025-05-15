// src/Hooks/useServiceContent.js

import { useQuery, useMutation } from '@tanstack/react-query';
import {
  fetchProducts,
  fetchProductDetails,
  uploadProduct,
  updateProduct,
} from '@/Api/ServiceData.api';

const FIVE_MINUTES = 1000 * 60 * 5;

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
 * Hook: fetch a single product detail by id
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
 * Hook: create new product
 */
export function useUploadProduct() {
  return useMutation({
    mutationFn: (formData) => uploadProduct(formData),
  });
}

/**
 * Hook: update existing product
 */
export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({ id, formData }) => updateProduct(id, formData),
  });
}
