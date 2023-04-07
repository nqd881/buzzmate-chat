import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Repositories} from "@application/di-tokens/repositories";
import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {DocumentMapper} from "./document.mapper";
import {DocumentRepository} from "./document.repository";
import {DbDocument, DbDocumentSchema} from "./document.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: DbDocument.name, schema: DbDocumentSchema},
    ]),
  ],
  providers: [
    {provide: Repositories.Document, useClass: DocumentRepository},
    {provide: DomainPersistenceMappers.Document, useClass: DocumentMapper},
  ],
  exports: [Repositories.Document],
})
export class DocumentRepoModule {}
