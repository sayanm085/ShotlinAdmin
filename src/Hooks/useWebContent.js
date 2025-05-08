// src/hooks/useWebContent.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWebContent, updateHeroContent } from '@/Api/WebContent.api';

export function useWebContent() {
  return useQuery({
    queryKey: ['webContent'],
    queryFn: fetchWebContent,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateHeroContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => updateHeroContent(formData),
    onSuccess: (updatedHero) => {
      // 1) merge the updated hero into the cache
      qc.setQueryData(['webContent'], (old) =>
        old ? { ...old, hero: updatedHero } : old
      );
      // 2) invalidate so that persisted cache and any dependent queries refetch
      qc.invalidateQueries(['webContent']);
    },
  });
}
