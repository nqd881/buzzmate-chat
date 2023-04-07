declare module "express-serve-static-core" {
  interface Request {
    userId: string;
    accessTokenPayload: any;
  }
}

declare module "socket.io" {
  class Socket {
    userId: string;
  }
}

export function autoDeclare() {}
