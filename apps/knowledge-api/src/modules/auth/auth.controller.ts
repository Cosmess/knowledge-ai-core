import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthUser, LoginRequestDto, LoginResponse } from "@knowledge-ai/shared-types";
import { AuthService } from "./auth.service.js";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({ description: "Issue an access token." })
  login(@Body() request: LoginRequestDto): LoginResponse {
    return this.auth.login(request);
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Get current authenticated user." })
  me(@Headers("authorization") authorization?: string): AuthUser {
    return this.auth.verifyBearer(authorization);
  }
}
