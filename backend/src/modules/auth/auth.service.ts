import { AuthRepository } from "./auth.repository.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import type { IAuthRepository } from "./auth.repository.interface.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";
import { ApiError } from "../../utils/apiError.js";
import type { RegisterDTO, LoginDTO } from "./auth.validation.js";

export class AuthService {
  constructor(private repository: IAuthRepository) {}

  async getUserById(id: number) {
    return this.repository.findById(id);
  }

  generateAccessToken(id: number) {
    return generateAccessToken(id);
  }

  generateRefreshToken(id: number) {
    return generateRefreshToken(id);
  }

  async register(data: RegisterDTO) {
    const email = data.email.toLowerCase();
    const exists = await this.repository.findByEmail(email);

    if (exists) {
      throw new ApiError(409, "Email already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await this.repository.create(data.name, email, passwordHash);

    return {
      accessToken: generateAccessToken(user.id),

      refreshToken: generateRefreshToken(user.id),

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(data: LoginDTO) {
    const user = await this.repository.findByEmail(data.email.toLowerCase());

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const valid = await comparePassword(data.password, user.passwordHash);

    if (!valid) {
      throw new ApiError(401, "Invalid credentials");
    }

    return {
      accessToken: generateAccessToken(user.id),

      refreshToken: generateRefreshToken(user.id),

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
