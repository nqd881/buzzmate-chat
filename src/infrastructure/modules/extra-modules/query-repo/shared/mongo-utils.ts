import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Injectable()
export class MongoUtils {
  constructor(@InjectConnection() private conn: Connection) {}

  client() {
    return this.conn.getClient();
  }

  getDb() {
    return this.client().db(this.conn.name);
  }

  getCollection(name: string) {
    return this.getDb().collection(name);
  }

  getCollections() {
    return this.getDb().collections();
  }

  async collectionIsExisting(collectionName: string) {
    const collections = await this.getCollections();

    const collectionNames = collections.map((col) => col.collectionName);

    return collectionNames.includes(collectionName);
  }
}
