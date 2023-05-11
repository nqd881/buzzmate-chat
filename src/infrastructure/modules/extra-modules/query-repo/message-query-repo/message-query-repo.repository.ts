import {
  IMessageQueryRepo,
  QueryMessagesOptions,
} from "@application/query-repo/message-query-repo.interface";
import { MessageQueryModel } from "@application/query-repo/query-model";
import { Injectable } from "@nestjs/common";
import { isNil } from "lodash";
import {
  AggOps,
  Expr,
  Facet,
  Limit,
  Lookup,
  Match,
  ReplaceRoot,
  Set,
  Sort,
  Unwind,
} from "../shared/common";
import { MongoUtils } from "../shared/mongo-utils";
import { MessageBasePipeline } from "./pipelines";

@Injectable()
export class MessageQueryRepo implements IMessageQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryMessages(userId: string, options?: QueryMessagesOptions) {
    const { chatId, byIds, byTimeEndpoint, byIdEndpoint, limit } =
      options || {};

    const shouldQueryByIds = byIds?.length > 0;
    const shouldQueryByTimeEndpoint = Object.entries(byTimeEndpoint || {}).some(
      ([key, value]) => !isNil(value)
    );
    const shouldQueryByIdEndpoint = Object.entries(byIdEndpoint || {}).some(
      ([key, value]) => !isNil(value)
    );

    const ByIds = () => [
      Match(byIds ? Expr(AggOps.In("$_id", byIds)) : {}),
      Sort({
        date: 1,
        _id: 1,
      }),
    ];

    const ByTimeEndpoint = () => {
      const { beforeTime, afterTime } = byTimeEndpoint;

      if (!beforeTime && !afterTime) return [];

      if (beforeTime && afterTime) {
        return [
          Match(
            Expr(
              AggOps.And([
                AggOps.Gt("$date", new Date(afterTime)),
                AggOps.Lt("$date", new Date(beforeTime)),
              ])
            )
          ),
          Sort({
            date: 1,
            _id: 1,
          }),
        ];
      }

      if (beforeTime) {
        return [
          Match(Expr(AggOps.Lt("$date", new Date(beforeTime)))),
          Sort({
            date: -1,
            _id: 1,
          }),
        ];
      }

      if (afterTime) {
        return [
          Match(Expr(AggOps.Gt("$date", new Date(afterTime)))),
          Sort({
            date: 1,
            _id: 1,
          }),
        ];
      }
    };

    const ByIdEndpoint = () => {
      const { beforeMessageId, afterMessageId } = byIdEndpoint;

      if (!beforeMessageId && !afterMessageId) return [];

      if (beforeMessageId && afterMessageId) {
        return [
          Facet({
            beforeMessage: [Match(Expr(AggOps.Eq("$_id", beforeMessageId)))],
            afterMessage: [Match(Expr(AggOps.Eq("$_id", afterMessageId)))],
          }),
          Lookup(
            "dbmessages",
            {
              beforeTime: { $first: "$beforeMessage.date" },
              afterTime: { $first: "$afterMessage.date" },
            },
            [
              Match(
                Expr(
                  AggOps.And([
                    AggOps.Gt("$date", "$$afterTime"),
                    AggOps.Lt("$date", "$$beforeTime"),
                  ])
                )
              ),
              Sort({
                date: 1,
                _id: 1,
              }),
            ],
            "__messages"
          ),
          Unwind("$__messages", true),
          Set({
            __messages: AggOps.IfNull("$__messages", {}),
          }),
          ReplaceRoot("$__messages"),
        ];
      }

      if (beforeMessageId) {
        return [
          Match(Expr(AggOps.Eq("$_id", beforeMessageId))),
          Lookup(
            "dbmessages",
            {
              beforeTime: "$date",
            },
            [
              Match(Expr(AggOps.Lt("$date", "$$beforeTime"))),
              Sort({
                date: -1,
                _id: 1,
              }),
            ],
            "__messages"
          ),
          Unwind("$__messages", true),
          Set({
            __messages: AggOps.IfNull("$__messages", {}),
          }),
          ReplaceRoot("$__messages"),
        ];
      }

      if (afterMessageId) {
        return [
          Match(Expr(AggOps.Eq("$_id", afterMessageId))),
          Lookup(
            "dbmessages",
            {
              afterTime: "$date",
            },
            [
              Match(Expr(AggOps.Gt("$date", "$$afterTime"))),
              Sort({
                date: 1,
                _id: 1,
              }),
            ],
            "__messages"
          ),
          Unwind("$__messages", true),
          Set({
            __messages: AggOps.IfNull("$__messages", {}),
          }),
          ReplaceRoot("$__messages"),
        ];
      }
    };

    const messages = await this.mongoUtils
      .getCollection("dbmembers")
      .aggregate(
        [
          Match(
            Expr(
              AggOps.And([
                AggOps.Eq("$userId", userId),
                AggOps.Eq("$chatId", chatId),
              ])
            )
          ),
          Lookup(
            "dbmessages",
            {
              chatId,
            },
            [
              Match(Expr(AggOps.Eq("$chatId", "$$chatId"))),
              ...(shouldQueryByIds
                ? ByIds()
                : shouldQueryByIdEndpoint
                ? ByIdEndpoint()
                : shouldQueryByTimeEndpoint
                ? ByTimeEndpoint()
                : []),
              ...MessageBasePipeline,
              limit ? Limit(limit) : null,
            ],
            "__messages"
          ),
          Unwind("$__messages"),
          ReplaceRoot("$__messages"),
          Sort({
            date: 1,
            id: 1,
          }),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return messages as MessageQueryModel[];
  }
}
