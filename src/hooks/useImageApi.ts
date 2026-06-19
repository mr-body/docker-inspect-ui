import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  imagesAction,
  imageRemoveAction,
  imageRunAction,
} from "@/service/docker-api";

export function useImages() {
  return useQuery({
    queryKey: ["docker", "images"],
    queryFn: async () => await imagesAction(),
  });
}

export function useImageRemove() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => await imageRemoveAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docker", "images"] });
    },
  });
}

export function useImageRun() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { image: string; name?: string; ports?: string; volumes?: string }) => 
      await imageRunAction(payload),
    onSuccess: () => {
      // Invalidate processes since running an image creates a new process
      queryClient.invalidateQueries({ queryKey: ["docker", "process"] });
    },
  });
}
