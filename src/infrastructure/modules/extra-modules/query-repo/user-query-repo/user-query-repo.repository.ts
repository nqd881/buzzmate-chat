import { Injectable } from "@nestjs/common";
import { MongoUtils } from "../shared/mongo-utils";
import {
  IUserQueryRepo,
  QueryUsersOptions,
} from "@application/query-repo/user-query-repo.interface";
import { IUserQueryModel } from "@application/query-repo/query-model";
import { isNil } from "lodash";
import { HOST } from "../shared/constants";
import { AggOps, Expr, Match, Project } from "../shared/common";

@Injectable()
export class UserQueryRepo implements IUserQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryUsers(options?: QueryUsersOptions) {
    const { limit, byIds, byEmails, byNames } = options || {};

    const users = await this.mongoUtils
      .getCollection("dbusers")
      .aggregate(
        [
          Match(
            Expr(
              AggOps.Or([
                ...(byEmails
                  ? byEmails.map((email) =>
                      AggOps.RegexMatch("$emailAddress", `(?i).*${email}.*`)
                    )
                  : []),
                ...(byNames
                  ? byNames.map((name) =>
                      AggOps.RegexMatch("$name", `(?i).*${name}.*`)
                    )
                  : []),
                ...(byIds
                  ? byIds.map((id) =>
                      AggOps.RegexMatch("$_id", `(?i).*${id}.*`)
                    )
                  : []),
              ])
            )
          ),
          Project({
            Id: false,
            Include: {
              identity: 1,
              name: 1,
              emailAddress: 1,
              type: 1,
            },
            Fields: {
              id: "$_id",
              url: {
                $concat: [
                  `http://${HOST}/api/chat-svc/chats/`,
                  "$chatId",
                  "/documents/",
                  "$_id",
                ],
              },
            },
          }),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return users as IUserQueryModel[];
  }
}
