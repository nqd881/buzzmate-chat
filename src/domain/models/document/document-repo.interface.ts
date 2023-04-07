import {Document} from "@domain/models/document/document";
import {IRepositoryBase} from "@libs/ddd";

export interface IDocumentRepo extends IRepositoryBase<Document> {}
