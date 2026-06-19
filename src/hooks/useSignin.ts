import { useMutation } from "@tanstack/react-query";
import { loginAction } from "@/service/auth-actions";
import { useAuth } from "@/provider/AuthProvider";

export function useSignin() {
  const { checkSession } = useAuth();

  const mutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      return await loginAction(username, password);
    },

    onSuccess: async (success) => {
      if (success) {
        await checkSession();
      } else {
        throw new Error("Invalid credentials");
      }
    },
  });

  return mutation;
}