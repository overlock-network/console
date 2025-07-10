import { useEffect, useState } from "react";

export function useSessionToken(key: string) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(key);
    if (stored) setToken(stored);
  }, [key]);

  const saveToken = (t: string) => {
    sessionStorage.setItem(key, t);
    setToken(t);
  };

  return { token, setToken: saveToken };
}
