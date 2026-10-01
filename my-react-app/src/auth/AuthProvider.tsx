// import { useEffect, useState, type ReactNode } from "react";

// import {
//   checkAuthApi,
//   loginApi,
//   logoutApi,
//   registerApi,
// } from "../api/auth.api";

// import { tokenManager } from "../utils/tokenManager";

// import type { AuthUser } from "../types/auth";

// import { AuthContext } from "./AuthContext";

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [user, setUser] = useState<AuthUser | null>(null);

//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const token = tokenManager.getToken();

//       if (!token) {
//         setIsLoading(false);
//         return;
//       }

//       const result = await checkAuthApi();

//       if (result.error) {
//         tokenManager.clearToken();
//         setUser(null);
//         setIsLoading(false);
//         return;
//       }

//       setIsLoading(false);
//     };

//     initializeAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     const result = await loginApi({
//       email,
//       password,
//     });

//     if (result.error) {
//       return {
//         success: false,
//         message: result.message,
//       };
//     }
//     console.log("Access Token:", result);
//     tokenManager.setToken(result.data.accessToken);
//     console.log("tokenManager:", tokenManager);
//     setUser(result.data.user);

//     return {
//       success: true,
//     };
//   };

//   const register = async (name: string, email: string, password: string) => {
//     const result = await registerApi({
//       name,
//       email,
//       password,
//     });

//     if (result.error) {
//       return {
//         success: false,
//         message: result.message,
//       };
//     }

//     tokenManager.setToken(result.data.accessToken);

//     setUser(result.data.user);

//     return {
//       success: true,
//     };
//   };

//   const logout = async () => {
//     await logoutApi();

//     tokenManager.clearToken();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         isLoading,
//         login,
//         register,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }
import { useEffect, useState, type ReactNode } from "react";

import {
  checkAuthApi,
  loginApi,
  logoutApi,
  registerApi,
} from "../api/auth.api";

import { tokenManager } from "../utils/tokenManager";

import type { AuthUser } from "../types/auth";

import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenManager.getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      const result = await checkAuthApi();

      if (result.error) {
        tokenManager.clearToken();
        setUser(null);
      } else {
        setUser(result.data.user);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginApi({
      email,
      password,
    });

    if (result.error) {
      return {
        success: false,
        message: result.message,
      };
    }

    tokenManager.setToken(result.data.accessToken);

    setUser(result.data.user);

    return {
      success: true,
    };
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await registerApi({
      name,
      email,
      password,
    });

    if (result.error) {
      return {
        success: false,
        message: result.message,
      };
    }

    tokenManager.setToken(result.data.accessToken);

    setUser(result.data.user);

    return {
      success: true,
    };
  };

  const logout = async () => {
    await logoutApi();

    tokenManager.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}