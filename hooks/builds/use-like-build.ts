import { useMutation, useQueryClient } from "@tanstack/react-query"
import { likeBuild } from "@/lib/api/builds"

export const useLikeBuild = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => likeBuild(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["builds"] })
    },
  })
}
