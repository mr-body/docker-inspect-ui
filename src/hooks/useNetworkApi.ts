import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  networksAction,
  networkAction,
  networkRemoveAction,
  networkConnectAction,
  networkDisconnectAction,
} from "@/service/docker-api";

export function useNetworks() {
  return useQuery({
    queryKey: ["docker", "networks"],
    queryFn: async () => await networksAction(),
  });
}

export function useNetwork(id: string) {
  return useQuery({
    queryKey: ["docker", "network", id],
    queryFn: async () => await networkAction(id),
    enabled: !!id,
  });
}

export function useNetworkRemove() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => await networkRemoveAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docker", "networks"] });
    },
  });
}

export function useNetworkConnect() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { id: string; container: string }) => await networkConnectAction(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["docker", "network", variables.id] });
    },
  });
}

export function useNetworkDisconnect() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { id: string; container: string }) => await networkDisconnectAction(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["docker", "network", variables.id] });
    },
  });
}
