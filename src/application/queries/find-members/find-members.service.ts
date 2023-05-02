import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindMembersQuery } from "./find-members.query";
import { Inject } from "@nestjs/common";
import { QueryRepositories } from "@application/query-repo/constant";
import { IMemberQueryRepo } from "@application/query-repo/member-query.repo.interface";

@QueryHandler(FindMembersQuery)
export class FindMembersService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Member) private memberQueryRepo: IMemberQueryRepo
  ) {}

  async execute(query: FindMembersQuery) {
    const { userId } = query.metadata;
    const { chatId, byIds, limit } = query;

    return this.memberQueryRepo.queryMembers({ chatId, byIds, limit });
  }
}
