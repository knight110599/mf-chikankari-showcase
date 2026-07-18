import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthUser,
  LoginCredentials,
  SignupCredentials,
} from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AUTH_STORAGE_KEY = "mf-chikankari-auth-user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

function isValidAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Partial<AuthUser>;

  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    user.role === "customer"
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem(AUTH_STORAGE_KEY) ??
        sessionStorage.getItem(AUTH_STORAGE_KEY);

      if (!storedUser) {
        return;
      }

      const parsedUser: unknown = JSON.parse(storedUser);

      if (!isValidAuthUser(parsedUser)) {
        clearStoredAuth();
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to restore authentication session:", error);
      clearStoredAuth();
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const email = credentials.email.trim().toLowerCase();

      if (!email || !credentials.password) {
        throw new Error("Email and password are required.");
      }

      const authenticatedUser: AuthUser = {
        id: crypto.randomUUID(),
        name: "MF Customer",
        email,
        role: "customer",
      };

      clearStoredAuth();
      setUser(authenticatedUser);

      const storage = credentials.rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(authenticatedUser),
      );
    },
    [],
  );

  const signup = useCallback(
    async (credentials: SignupCredentials): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 900));

      const fullName =
        `${credentials.firstName.trim()} ${credentials.lastName.trim()}`.trim();

      const newUser: AuthUser = {
        id: crypto.randomUUID(),
        name: fullName,
        email: credentials.email.trim().toLowerCase(),
        role: "customer",
      };

      clearStoredAuth();
      setUser(newUser);

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(newUser),
      );
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    clearStoredAuth();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      login,
      signup,
      logout,
    }),
    [user, isInitializing, login, signup, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}