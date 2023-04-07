import {Photo} from "@domain/models/photo/photo";
import {IRepositoryBase} from "@libs/ddd";

export interface IPhotoRepo extends IRepositoryBase<Photo> {}
