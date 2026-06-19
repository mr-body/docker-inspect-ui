import { useMutation } from "@tanstack/react-query";
import { logoutAction } from "@/service/auth-actions";
import { useAuth } from "@/provider/AuthProvider";
import { useRouter } from "next/navigation";

export function useSignOut() {
  const { checkSession } = useAuth();

  const mutation = useMutation({
    mutationFn: logoutAction,
    onSuccess: async () => {
      await checkSession();
      window.location.href = "/sign-in"
    },
    onError: (err) => {
      console.error("Failed to sign out", err);
    },
  });

  return {
    signOut: mutation.mutate,
    loading: mutation.isPending,
  };
}