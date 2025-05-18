import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '@/Api/CustomersData.api'

const FIVE_MINUTES = 1000 * 60 * 5

export function useFetchUsers({ search, unverified, period, page = 1, limit = 10 }) {
  return useQuery({
    queryKey: ['users', { search, unverified, period, page, limit }],
    queryFn: () => fetchUsers({ search, unverified, period, page, limit }),
    staleTime: FIVE_MINUTES,
    cacheTime: FIVE_MINUTES * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
