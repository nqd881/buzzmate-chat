import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";

export class SocketAdapter extends IoAdapter {
  constructor(app: INestApplicationContext, private port: number | string) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    port = Number(this.port);

    return super.createIOServer(port, options);
  }
}
