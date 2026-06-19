import { useAuth } from "@/provider/AuthProvider";

export function useSession() {
  const { isAuthenticated, username, checkSession, access_token } = useAuth();

  return {
    isAuthenticated,
    user: username ? { username } : null,
    access_token,
    refresh: checkSession,
  };
}
