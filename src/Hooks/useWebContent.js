import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchWebContent,
  updateHeroContent,
  updateBrandPartnersContent,
  updateServicesContent,
  updateWhyChooseUsContent,
  updateFAQsContent,
} from '@/Api/WebContent.api'

// ✅ Main web content query
export function useWebContent() {
  return useQuery({
    queryKey: ['webContent'],
    queryFn: fetchWebContent,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

// ✅ Mutation: Hero Section
export function useUpdateHeroContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateHeroContent,
    onSuccess: (updatedHero) => {
      queryClient.setQueryData(['webContent'], old =>
        old ? { ...old, hero: updatedHero } : old
      )
      queryClient.invalidateQueries({ queryKey: ['webContent'] })
    },
  })
}

// ✅ Mutation: Brand Partners
export function useUpdateBrandPartners() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateBrandPartnersContent,
    onSuccess: (newList) => {
      queryClient.setQueryData(['webContent'], old =>
        old ? { ...old, BrandPartners: newList } : old
      )
      queryClient.invalidateQueries({ queryKey: ['webContent'] })
    },
  })
}

// ✅ Mutation: Services Content
export function useUpdateServicesContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateServicesContent,
    onSuccess: (updatedServices) => {
      queryClient.setQueryData(['webContent'], old =>
        old ? { ...old, Services: updatedServices } : old
      )
      queryClient.invalidateQueries({ queryKey: ['webContent'] })
    },
  })
}

// ✅ Mutation: Why Choose Us
export function useUpdateWhyChooseUsContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateWhyChooseUsContent,
    onSuccess: (updated) => {
      queryClient.setQueryData(['webContent'], old =>
        old ? { ...old, WhyChooseUs: updated } : old
      )
      queryClient.invalidateQueries({ queryKey: ['webContent'] })
    },
  })
}

// ✅ Mutation: FAQs
export function useUpdateFAQs() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateFAQsContent,
    onSuccess: (updated) => {
      queryClient.setQueryData(['webContent'], old =>
        old ? { ...old, FAQs: updated } : old
      )
      queryClient.invalidateQueries({ queryKey: ['webContent'] })
    },
  })
}
