import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

const DB_NAME = "test";

@Injectable()
export class MongoUtils {
  constructor(@InjectConnection() private conn: Connection) {}

  getCollection(name: string) {
    return this.conn.getClient().db(DB_NAME).collection(name);
  }
}
