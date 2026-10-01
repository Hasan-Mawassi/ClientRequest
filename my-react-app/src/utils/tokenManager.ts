const TOKEN_KEY = "accessToken";

export const tokenManager = {
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  },
};
