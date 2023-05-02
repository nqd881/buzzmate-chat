import { QueryRepositories } from "@application/query-repo/constant";
import { IPhotoQueryRepo } from "@application/query-repo/photo-query-repo.interface";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindPhotosQuery } from "./find-photos.query";

@QueryHandler(FindPhotosQuery)
export class FindPhotosService implements IQueryHandler {
  constructor(
    @Inject(QueryRepositories.Photo) private photoQueryRepo: IPhotoQueryRepo
  ) {}

  async execute(query: FindPhotosQuery) {
    const { byIds } = query;

    return this.photoQueryRepo.queryPhotos({
      byIds,
    });
  }
}
