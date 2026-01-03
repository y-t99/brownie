import useSWR from "swr";

import type { User } from "@/lib/types";

type SessionResponse = { user: User } | { user: null };

export function useUser() {
  const { data, isLoading } = useSWR<SessionResponse>("/auth/session");
  const user = data && "user" in data ? data.user : null;
  return { user, isLoading };
}

