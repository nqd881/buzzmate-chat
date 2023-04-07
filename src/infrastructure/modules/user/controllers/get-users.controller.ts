import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetUsersQuery } from "./dto/get-users.query";
import { FindUsersQuery } from "@application/queries/find-users/find-users.query";

@Controller("users")
export class GetUsersController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(@Req() req: Request, @Query() queries: GetUsersQuery) {
    const { limit, id, email, name } = queries;

    const query = new FindUsersQuery({
      limit,
      byIds: id,
      byEmails: email,
      byNames: name,
    });

    try {
      const users = await this.queryBus.execute(query);

      return users;
    } catch (err) {
      console.log(err);
    }
  }
}
