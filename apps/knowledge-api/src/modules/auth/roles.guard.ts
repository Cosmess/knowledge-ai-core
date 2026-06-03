import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthUser } from "@knowledge-ai/shared-types";
import { AuthService } from "./auth.service.js";

export const ROLES_METADATA_KEY = "roles";

export const Roles = (...roles: string[]): MethodDecorator & ClassDecorator => SetMetadata(ROLES_METADATA_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly auth: AuthService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<string[]>(ROLES_METADATA_KEY, context.getHandler()) ??
      this.reflector.get<string[]>(ROLES_METADATA_KEY, context.getClass()) ??
      [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; user?: AuthUser }>();
    const user = this.auth.verifyBearer(request.headers.authorization);
    request.user = user;

    if (requiredRoles.some((role) => user.roles.includes(role))) {
      return true;
    }

    throw new UnauthorizedException("Insufficient role.");
  }
}
