import { MaybePromise } from "@libs/utilities/types";
import { DocumentQueryModel } from "./query-model";

export type QueryChatDocumentsOptions = {
  chatId: string;
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export interface IDocumentQueryRepo {
  queryChatDocuments(
    options?: QueryChatDocumentsOptions
  ): MaybePromise<DocumentQueryModel[]>;
}
