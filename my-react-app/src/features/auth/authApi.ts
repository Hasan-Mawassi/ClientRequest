export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  user: AuthUser;
}

const authUrl = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3001/api/auth"
).replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${authUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return undefined as T;

  const payload = (await response.json().catch(() => null)) as {
    message?: string;
    error?:
      | string
      | {
          fieldErrors?: Record<string, string[]>;
          formErrors?: string[];
        }
      | null;
  } | null;

  if (!response.ok) {
    const details =
      payload?.error && typeof payload.error === "object"
        ? [
            ...(payload.error.formErrors ?? []),
            ...Object.entries(payload.error.fieldErrors ?? {}).flatMap(
              ([field, issues]) => issues.map((issue) => `${field}: ${issue}`),
            ),
          ]
        : [];
    const message = payload?.message ?? "The request could not be completed.";
    throw new Error(
      details.length ? `${message}: ${details.join("; ")}` : message,
    );
  }

  return payload as T;
}

export function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request("/register", { method: "POST", body: JSON.stringify(input) });
}

export function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request("/login", { method: "POST", body: JSON.stringify(input) });
}

export function getCurrentUser(): Promise<AuthResponse> {
  return request("/me");
}

export function refreshSession(): Promise<AuthResponse> {
  return request("/refresh", { method: "POST" });
}

export function logout(): Promise<void> {
  return request("/logout", { method: "POST" });
}
