// export interface AuthUser {
//   id: number;
//   name: string;
//   email: string;
// }

// export interface AuthResponse {
//   accessToken: string;
//   user: AuthUser;
// }

// export interface LoginPayload {
//   email: string;
//   password: string;
// }

// export interface RegisterPayload {
//   name: string;
//   email: string;
//   password: string;
// }
export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}