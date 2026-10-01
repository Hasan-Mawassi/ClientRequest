// import { request } from "./request";

// import type {
//   AuthResponse,
//   LoginPayload,
//   RegisterPayload,
// } from "../types/auth";

// export const loginApi = (payload: LoginPayload) => {
//   return request<AuthResponse>({
//     method: "POST",
//     route: "/auth/login",
//     body: payload,
//     withCredentials: true,
//   });
// };

// export const registerApi = (payload: RegisterPayload) => {
//   return request<AuthResponse>({
//     method: "POST",
//     route: "/auth/register",
//     body: payload,
//     withCredentials: true,
//   });
// };

// export const refreshApi = () => {
//   return request<AuthResponse>({
//     method: "POST",
//     route: "/auth/refresh",
//     withCredentials: true,
//   });
// };

// export const logoutApi = () => {
//   return request({
//     method: "POST",
//     route: "/auth/logout",
//     withCredentials: true,
//   });
// };

// export const checkAuthApi = () => {
//   return request({
//     method: "GET",
//     route: "/auth/check",
//     auth: true,
//     withCredentials: true,
//   });
// };

import { request } from "./request";

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../types/auth";

export const loginApi = (payload: LoginPayload) =>
  request<AuthResponse>({
    method: "POST",
    route: "/auth/login",
    body: payload,
    withCredentials: true,
  });

export const registerApi = (payload: RegisterPayload) =>
  request<AuthResponse>({
    method: "POST",
    route: "/auth/register",
    body: payload,
    withCredentials: true,
  });

export const refreshApi = () =>
  request<AuthResponse>({
    method: "POST",
    route: "/auth/refresh",
    withCredentials: true,
  });

export const logoutApi = () =>
  request({
    method: "POST",
    route: "/auth/logout",
    withCredentials: true,
  });

export const checkAuthApi = () =>
  request<AuthResponse>({
    method: "GET",
    route: "/auth/check",
    auth: true,
    withCredentials: true,
  });