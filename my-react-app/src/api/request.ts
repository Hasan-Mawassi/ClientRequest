import axios, { type AxiosRequestConfig, type Method } from "axios";

import { tokenManager } from "../utils/tokenManager";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

interface RequestOptions<TBody = unknown> {
  method: Method;
  route: string;
  body?: TBody;
  auth?: boolean;
  withCredentials?: boolean;
}

export interface RequestSuccess<T> {
  error: false;
  data: T;
  message?: string;
}

export interface RequestFailure {
  error: true;
  message: string;
  fieldErrors?: Record<string, string[]>;
  status: number;
}

export type RequestResult<T> = RequestSuccess<T> | RequestFailure;

interface ApiErrorResponse {
  message?: string;
  fieldErrors?: Record<string, string[]>;
  details?: {
    fieldErrors?: Record<string, string[]>;
  };
}

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post("/auth/refresh", null, {
        withCredentials: true,
      })
      .then((response) => {
        const accessToken = response.data?.data?.accessToken;

        if (!accessToken) {
          throw new Error("Refresh response did not include an access token");
        }

        tokenManager.setToken(accessToken);

        return accessToken;
      })
      .catch((error) => {
        tokenManager.clearToken();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const request = async <T>({
  method,
  route,
  body,
  auth = false,
  withCredentials = false,
}: RequestOptions): Promise<RequestResult<T>> => {
  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = tokenManager.getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const requestConfig: AxiosRequestConfig = {
    method,
    url: route,
    data: body,
    headers,
    withCredentials,
  };

  try {
    let response;

    try {
      response = await axios.request(requestConfig);
    } catch (error: unknown) {
      const canRefresh =
        auth &&
        axios.isAxiosError(error) &&
        error.response?.status === 401 &&
        route !== "/auth/login" &&
        route !== "/auth/register" &&
        route !== "/auth/refresh";

      if (!canRefresh) {
        throw error;
      }

      const accessToken = await refreshAccessToken();

      response = await axios.request({
        ...requestConfig,
        headers: {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return {
      error: false,
      data: response.data?.data as T,
      message: response.data?.message,
    };
  } catch (error: unknown) {
    const apiError = axios.isAxiosError<ApiErrorResponse>(error)
      ? error.response?.data
      : undefined;

    return {
      error: true,
      message: apiError?.message || "Something went wrong",
      fieldErrors:
        apiError?.details?.fieldErrors || apiError?.fieldErrors || {},
      status:
        (axios.isAxiosError(error) ? error.response?.status : undefined) || 500,
    };
  }
};
