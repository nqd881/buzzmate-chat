import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Repositories} from "@application/di-tokens/repositories";
import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {FileMapper} from "./file.mapper";
import {FileRepository} from "./file.repository";
import {DbFile, DbFileSchema} from "./file.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: DbFile.name, schema: DbFileSchema}]),
  ],
  providers: [
    {provide: Repositories.File, useClass: FileRepository},
    {provide: DomainPersistenceMappers.File, useClass: FileMapper},
  ],
  exports: [Repositories.File],
})
export class FileRepoModule {}
