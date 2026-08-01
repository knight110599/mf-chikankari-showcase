import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AuthContext,
  type AuthContextValue,
} from "./AuthContext";

import type {
  AuthUser,
  LoginCredentials,
  SignupCredentials,
} from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

interface BackendUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "CUSTOMER" | "WHOLESALE" | "ADMIN";
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: BackendUser;
    accessToken?: string;
  };
}

interface RefreshResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken?: string;
  };
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export const AUTH_USER_STORAGE_KEY =
  "mf-chikankari-auth-user";

export const AUTH_TOKEN_STORAGE_KEY =
  "mf-chikankari-access-token";

function clearStoredAuth() {
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

  sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

function getStoredAuth() {
  const localUser = localStorage.getItem(
    AUTH_USER_STORAGE_KEY,
  );

  if (localUser) {
    return {
      serializedUser: localUser,
      storage: localStorage,
    };
  }

  const sessionUser = sessionStorage.getItem(
    AUTH_USER_STORAGE_KEY,
  );

  if (sessionUser) {
    return {
      serializedUser: sessionUser,
      storage: sessionStorage,
    };
  }

  return null;
}

function isValidAuthUser(
  value: unknown,
): value is AuthUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.role === "string"
  );
}

function normalizeUser(
  backendUser: BackendUser,
): AuthUser {
  const name =
    `${backendUser.firstName} ${backendUser.lastName}`.trim();

  return {
    id: backendUser.id,
    name: name || backendUser.email,
    email: backendUser.email,
    role:
      backendUser.role === "WHOLESALE"
        ? ("wholesale" as AuthUser["role"])
        : ("customer" as AuthUser["role"]),
  };
}

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  return (await response.json()) as T;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [accessToken, setAccessToken] =
    useState<string | null>(null);

  const [isInitializing, setIsInitializing] =
    useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const restoreSession = async () => {
        const storedAuth = getStoredAuth();

        if (!storedAuth) {
          setIsInitializing(false);
          return;
        }

        try {
          const parsedUser: unknown = JSON.parse(
            storedAuth.serializedUser,
          );

          if (!isValidAuthUser(parsedUser)) {
            clearStoredAuth();
            setUser(null);
            setAccessToken(null);
            return;
          }

          const response = await fetch(
            `${API_URL}/auth/refresh`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const result =
            await parseResponse<RefreshResponse>(
              response,
            );

          const refreshedToken =
            result.data?.accessToken;

          if (
            !response.ok ||
            !result.success ||
            !refreshedToken
          ) {
            throw new Error(
              result.message ||
                "Unable to restore session.",
            );
          }

          storedAuth.storage.setItem(
            AUTH_TOKEN_STORAGE_KEY,
            refreshedToken,
          );

          setUser(parsedUser);
          setAccessToken(refreshedToken);
        } catch (error) {
          console.error(
            "Failed to restore authentication session:",
            error,
          );

          clearStoredAuth();
          setUser(null);
          setAccessToken(null);
        } finally {
          setIsInitializing(false);
        }
      };

      void restoreSession();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const login = useCallback(
    async (
      credentials: LoginCredentials,
    ): Promise<void> => {
      const email =
        credentials.email.trim().toLowerCase();

      if (!email || !credentials.password) {
        throw new Error(
          "Email and password are required.",
        );
      }

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password: credentials.password,
          }),
        },
      );

      const result =
        await parseResponse<AuthResponse>(response);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to sign in.",
        );
      }

      const backendUser = result.data?.user;
      const token = result.data?.accessToken;

      if (!backendUser) {
        throw new Error(
          "User information was not returned by the server.",
        );
      }

      if (!token) {
        throw new Error(
          "Access token was not returned by the server.",
        );
      }

      if (backendUser.role === "ADMIN") {
        throw new Error(
          "Please use the admin login page for this account.",
        );
      }

      const authenticatedUser =
        normalizeUser(backendUser);

      clearStoredAuth();

      const storage = credentials.rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem(
        AUTH_USER_STORAGE_KEY,
        JSON.stringify(authenticatedUser),
      );

      storage.setItem(
        AUTH_TOKEN_STORAGE_KEY,
        token,
      );

      setUser(authenticatedUser);
      setAccessToken(token);
    },
    [],
  );

  const signup = useCallback(
    async (
      credentials: SignupCredentials,
    ): Promise<void> => {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName:
              credentials.firstName.trim(),
            lastName:
              credentials.lastName.trim(),
            email: credentials.email
              .trim()
              .toLowerCase(),
            password: credentials.password,
          }),
        },
      );

      const result =
        await parseResponse<AuthResponse>(response);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to create your account.",
        );
      }

      const backendUser = result.data?.user;
      const token = result.data?.accessToken;

      if (backendUser && token) {
        const authenticatedUser =
          normalizeUser(backendUser);

        clearStoredAuth();

        localStorage.setItem(
          AUTH_USER_STORAGE_KEY,
          JSON.stringify(authenticatedUser),
        );

        localStorage.setItem(
          AUTH_TOKEN_STORAGE_KEY,
          token,
        );

        setUser(authenticatedUser);
        setAccessToken(token);
        return;
      }

      await login({
        email: credentials.email,
        password: credentials.password,
        rememberMe: true,
      });
    },
    [login],
  );

  const logout = useCallback(() => {
    void fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.error(
        "Logout request failed:",
        error,
      );
    });

    clearStoredAuth();
    setUser(null);
    setAccessToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(
        user && accessToken,
      ),
      isInitializing,
      login,
      signup,
      logout,
    }),
    [
      user,
      accessToken,
      isInitializing,
      login,
      signup,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}