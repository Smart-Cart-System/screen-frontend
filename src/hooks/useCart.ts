import { useState, useEffect } from "react";

interface CartHook {
  cartId: string | null;
  setCartId: (id: string) => void;
  sessionId: string | null;
  setSessionId: (id: string) => void;
  token: string | null;
  setToken: (token: string) => void;
  resetSession: () => void;
}

export const useCart = (): CartHook => {
  const [cartId, setCartIdState] = useState<string | null>(null);
  const [sessionId, setSessionIdState] = useState<string | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  // Load values from localStorage on mount and listen for changes
  useEffect(() => {
    const loadFromStorage = () => {
      const storedCartId = localStorage.getItem("cart_id");
      const storedSessionId = localStorage.getItem("session_id");
      const storedToken = localStorage.getItem("auth_token");

      console.log(
        "useCart: Loading from storage - cartId:",
        storedCartId,
        "sessionId:",
        storedSessionId
      );

      if (storedCartId) setCartIdState(storedCartId);
      if (storedSessionId) setSessionIdState(storedSessionId);
      if (storedToken) setTokenState(storedToken);
    };

    // Load initial values
    loadFromStorage();

    // Listen for storage changes (from other components or tabs)
    const handleStorageChange = (e: StorageEvent) => {
      console.log("useCart: Storage change detected:", e.key, e.newValue);
      if (
        e.key === "session_id" ||
        e.key === "auth_token" ||
        e.key === "cart_id"
      ) {
        loadFromStorage();
      }
    }; // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = () => {
      console.log(
        "useCart: Custom storage change detected, reloading from storage"
      );
      loadFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageChange", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "localStorageChange",
        handleCustomStorageChange
      );
    };
  }, []);
  const setCartId = (id: string) => {
    localStorage.setItem("cart_id", id);
    setCartIdState(id);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("localStorageChange"));
  };
  const setSessionId = (id: string) => {
    console.log("useCart: Setting session ID to:", id);
    localStorage.setItem("session_id", id);
    setSessionIdState(id);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("localStorageChange"));
    console.log("useCart: Session ID state updated and event dispatched");
  };

  const setToken = (newToken: string) => {
    console.log("useCart: Setting token to:", newToken);
    localStorage.setItem("auth_token", newToken);
    setTokenState(newToken);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("localStorageChange"));
    console.log("useCart: Token state updated and event dispatched");
  };
  const resetSession = () => {
    console.log("🔐 useCart: Resetting session data (preserving cart ID)");
    console.log(
      "🔐 useCart: Current localStorage before reset - session_id:",
      localStorage.getItem("session_id"),
      "auth_token:",
      localStorage.getItem("auth_token")
    );

    // Clear session-related localStorage items only (keep cart_id)
    localStorage.removeItem("session_id");
    localStorage.removeItem("auth_token");

    // Clear session-related state only (keep cartId)
    setSessionIdState(null);
    setTokenState(null);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("localStorageChange"));
    console.log("🔐 useCart: Session reset complete, cart ID preserved");
    console.log(
      "🔐 useCart: localStorage after reset - session_id:",
      localStorage.getItem("session_id"),
      "auth_token:",
      localStorage.getItem("auth_token")
    );
  };

  return {
    cartId,
    setCartId,
    sessionId,
    setSessionId,
    token,
    setToken,
    resetSession,
  };
};
