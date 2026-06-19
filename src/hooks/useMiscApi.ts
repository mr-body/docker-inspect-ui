import { useQuery, useMutation } from "@tanstack/react-query";
import {
  healthAction,
  logsTailAction,
  execAction,
} from "@/service/docker-api";

export function useHealth() {
  return useQuery({
    queryKey: ["docker", "health"],
    queryFn: async () => await healthAction(),
  });
}

export function useLogsTail(identifier: string, tail: number = 200) {
  return useQuery({
    queryKey: ["docker", "logs", identifier, tail],
    queryFn: async () => await logsTailAction({ identifier, tail }),
    enabled: !!identifier,
    refetchInterval: 5000, // Optional: Poll for new logs every 5s
  });
}

export function useExec() {
  return useMutation({
    mutationFn: async (params: { container: string; command: string }) => await execAction(params),
  });
}
