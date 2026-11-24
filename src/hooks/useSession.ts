// story: e01s03
import { useCallback, useEffect, useState } from "react";
import type { Models } from "appwrite";
import { appwriteConfigured, createAccount } from "../lib/appwrite";

export type SessionState = {
  loading: boolean;
  user: Models.User<Models.Preferences> | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

export function useSession(): SessionState {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

  const refresh = useCallback(async () => {
    if (!appwriteConfigured()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setUser(await createAccount().get());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await createAccount().deleteSession("current");
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { loading, user, refresh, signOut };
}
