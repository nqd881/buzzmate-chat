import {
  IMemberQueryRepo,
  QueryMembersOptions,
} from "@application/query-repo/member-query.repo.interface";
import { MemberQueryModel } from "@application/query-repo/query-model";
import { Injectable } from "@nestjs/common";
import { isNil } from "lodash";
import { AggOps, Expr, Match } from "../shared/common";
import { MongoUtils } from "../shared/mongo-utils";
import { MemberBasePipeline } from "./pipelines";

@Injectable()
export class MemberQueryRepo implements IMemberQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryMembers(options?: QueryMembersOptions) {
    const { chatId, byIds } = options;

    const members = await this.mongoUtils
      .getCollection("dbmembers")
      .aggregate(
        [
          Match(Expr(AggOps.Eq("$chatId", chatId))),
          byIds ? Match(Expr(AggOps.In("$_id", byIds))) : null,
          ...MemberBasePipeline,
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return members as MemberQueryModel[];
  }
}
