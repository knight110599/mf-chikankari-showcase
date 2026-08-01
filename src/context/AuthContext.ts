import { createContext } from "react";

import type {
  AuthUser,
  LoginCredentials,
  SignupCredentials,
} from "../types/auth";

export interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (
    credentials: LoginCredentials,
  ) => Promise<void>;
  signup: (
    credentials: SignupCredentials,
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );