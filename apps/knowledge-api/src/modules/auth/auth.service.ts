import { Injectable, UnauthorizedException } from "@nestjs/common";
import jwt from "jsonwebtoken";
import { AuthUser, LoginRequestDto, LoginResponse } from "@knowledge-ai/shared-types";
import { getAppConfig } from "../../config/app-config.js";

interface UserRecord {
  email: string;
  password: string;
  roles: string[];
  spaces: string[];
}

@Injectable()
export class AuthService {
  private readonly config = getAppConfig();

  login(request: LoginRequestDto): LoginResponse {
    const user = this.findUser(request.email);

    if (!user || user.password !== request.password) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const payload: AuthUser = {
      sub: user.email,
      email: user.email,
      roles: user.roles,
      spaces: user.spaces
    };

    const accessToken = jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiresInSeconds
    });

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: this.config.jwtExpiresInSeconds
    };
  }

  verifyBearer(authorization?: string): AuthUser {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token.");
    }

    const token = authorization.slice("Bearer ".length);

    try {
      return jwt.verify(token, this.config.jwtSecret) as AuthUser;
    } catch {
      throw new UnauthorizedException("Invalid bearer token.");
    }
  }

  private findUser(email: string): UserRecord | undefined {
    const configuredUsers = process.env.API_AUTH_USERS;

    if (configuredUsers) {
      const users = JSON.parse(configuredUsers) as UserRecord[];
      return users.find((user) => user.email === email);
    }

    return [
      {
        email: "admin@example.com",
        password: "admin",
        roles: ["admin", "developer", "operations", "product", "support"],
        spaces: ["*"]
      }
    ].find((user) => user.email === email);
  }
}
