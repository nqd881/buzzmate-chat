import { autoDeclare } from "@infrastructure/types/declare";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { SocketAdapter } from "./socket-adapter";

autoDeclare();

async function bootstrap() {
  console.log("Chat Server");

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useWebSocketAdapter(
    new SocketAdapter(app, process.env.SERVER_SOCKET_PORT)
  );

  await app.listen(process.env.SERVER_HTTP_PORT);
}

bootstrap();
