// import { createContext } from "react";

// import type { AuthUser } from "../types/auth";

// export interface AuthContextValue {
//   user: AuthUser | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (
//     email: string,
//     password: string,
//   ) => Promise<{
//     success: boolean;
//     message?: string;
//   }>;
//   register: (
//     name: string,
//     email: string,
//     password: string,
//   ) => Promise<{
//     success: boolean;
//     message?: string;
//   }>;
//   logout: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextValue | undefined>(
//   undefined,
// );
import { createContext } from "react";

import type { AuthUser } from "../types/auth";

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;

  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;

  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);