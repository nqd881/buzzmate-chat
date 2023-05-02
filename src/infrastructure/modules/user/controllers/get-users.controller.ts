import { FindUsersQuery } from "@application/queries/find-users/find-users.query";
import { AuthGuard } from "@infrastructure/guards/auth.guard";
import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { isString } from "lodash";
import { GetUsersQuery } from "./dto/get-users.query";

@Controller("users")
export class GetUsersController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(@Query() queries: GetUsersQuery) {
    const { limit, id, email, name } = queries;

    const query = new FindUsersQuery({
      limit,
      byIds: isString(id) ? [id] : id,
      byEmails: isString(email) ? [email] : email,
      byNames: isString(name) ? [name] : name,
    });

    try {
      const users = await this.queryBus.execute(query);

      return users;
    } catch (err) {
      console.log(err);
    }
  }
}
