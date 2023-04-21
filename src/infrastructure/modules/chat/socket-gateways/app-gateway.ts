import { FindChatsQuery } from "@application/queries/find-chats/find-chats.query";
import { ChatResponseDto } from "@application/query-repo/response-dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { OnGatewayConnection, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";

import { FindUserByIdentityCommand } from "@application/commands/user/find-user-by-identity/find-user-by-identity.command";
import fs from "fs";
import jwt, { JwtPayload } from "jsonwebtoken";

@WebSocketGateway(4001, { cors: true })
export class AppGateway implements OnGatewayConnection {
  private PRIVATE_KEY: Buffer = null;

  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
    this.PRIVATE_KEY = fs.readFileSync(
      "src/infrastructure/env/jwt-keys/public.key"
    );
  }

  private async findChatsOfUser(userId: string) {
    const query = new FindChatsQuery({
      metadata: {
        userId,
      },
    });

    return this.queryBus.execute<FindChatsQuery, ChatResponseDto[]>(query);
  }

  private async checkUser(socket: Socket) {
    const accessToken = socket.handshake.auth?.accessToken;

    try {
      const payload = jwt.verify(accessToken, this.PRIVATE_KEY) as JwtPayload;

      const { rootUserId } = payload;

      if (rootUserId) {
        const command = new FindUserByIdentityCommand({
          identity: rootUserId,
        });

        const user = await this.commandBus.execute(command);

        if (user) {
          socket.userId = user.id.value;
        }
      }
    } catch (err) {}
  }

  private async joinChats(socket: Socket) {
    if (!socket?.userId) return;

    const chats = await this.findChatsOfUser(socket.userId);

    const chatIds = chats.map((chat) => chat.id);

    socket.join(chatIds);
  }

  private joinMe(socket: Socket) {
    if (!socket?.userId) return;

    socket.join(socket.userId);
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    await this.checkUser(socket);

    this.joinMe(socket);

    await this.joinChats(socket);
  }
}
