// src/Hooks/useServiceContent.js

import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/Api/ServiceData.api';

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
