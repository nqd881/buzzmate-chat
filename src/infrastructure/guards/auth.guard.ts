import { FindUserByIdentityCommand } from "@application/commands/user/find-user-by-identity/find-user-by-identity.command";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request, Response } from "express";
import fs from "fs";
import jwt, { JwtPayload } from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
  private PRIVATE_KEY: Buffer = null;

  constructor(private readonly commandBus: CommandBus) {
    this.PRIVATE_KEY = fs.readFileSync(
      "src/infrastructure/env/jwt-keys/public.key"
    );
  }

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();

      const cacheUserInfo = request.cookies?.["buzzmate-chat-user"];

      const authorizationHeader = request.header("Authorization");

      const accessToken = authorizationHeader.split(" ")[1];

      const payload = jwt.verify(accessToken, this.PRIVATE_KEY) as JwtPayload;

      const setUserChatIdCookie = () => {
        response.cookie("chat-user-id", cacheUserInfo.userId);
      };

      if (
        cacheUserInfo?.identity &&
        cacheUserInfo?.identity === payload?.rootUserId
      ) {
        request.userId = cacheUserInfo.userId;

        setUserChatIdCookie();

        return true;
      }

      const command = new FindUserByIdentityCommand({
        identity: payload?.rootUserId,
      });

      try {
        const user = await this.commandBus.execute(command);

        response.cookie(
          "buzzmate-chat-user",
          {
            identity: user.identity,
            userId: user.id.value,
          },
          {
            httpOnly: true,
          }
        );

        setUserChatIdCookie();

        request.userId = user.id.value;

        return true;
      } catch (err) {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}
