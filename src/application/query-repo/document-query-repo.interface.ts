import { MaybePromise } from "@libs/utilities/types";
import { DocumentResponseDto } from "./response-dto";

export type QueryDocumentsOptions = {
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export interface IDocumentQueryRepo {
  queryDocuments(
    options?: QueryDocumentsOptions
  ): MaybePromise<DocumentResponseDto[]>;
}
