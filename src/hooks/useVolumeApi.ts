import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  volumesAction,
  volumeAction,
  volumeFilesAction,
  volumeRemoveAction,
  volumeBackupUrlAction,
} from "@/service/docker-api";

export function useVolumes() {
  return useQuery({
    queryKey: ["docker", "volumes"],
    queryFn: async () => await volumesAction(),
  });
}

export function useVolume(name: string) {
  return useQuery({
    queryKey: ["docker", "volume", name],
    queryFn: async () => await volumeAction(name),
    enabled: !!name,
  });
}

export function useVolumeFiles(name: string, path: string = "/") {
  return useQuery({
    queryKey: ["docker", "volume-files", name, path],
    queryFn: async () => await volumeFilesAction({ name, path }),
    enabled: !!name,
  });
}

export function useVolumeRemove() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (name: string) => await volumeRemoveAction(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docker", "volumes"] });
    },
  });
}

// Note: volumeBackupUrl is a synchronous utility in the api that just returns a URL
// However since it uses process.env.SERVER now, it's an async server action.
export function useVolumeBackupUrl(name: string) {
  return useQuery({
    queryKey: ["docker", "volume-backup-url", name],
    queryFn: async () => await volumeBackupUrlAction(name),
    enabled: !!name,
  });
}
