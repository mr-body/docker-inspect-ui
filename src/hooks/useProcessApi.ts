import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  processesAction,
  processStopAction,
  processRestartAction,
} from "@/service/docker-api";

export function useProcesses() {
  return useQuery({
    queryKey: ["docker", "process"],
    queryFn: async () => await processesAction(),
  });
}

export function useProcessStop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => await processStopAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docker", "process"] });
    },
  });
}

export function useProcessRestart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => await processRestartAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docker", "process"] });
    },
  });
}
