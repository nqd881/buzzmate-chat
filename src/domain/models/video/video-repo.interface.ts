import {Video} from "@domain/models/video/video";
import {IRepositoryBase} from "@libs/ddd";

export interface IVideoRepo extends IRepositoryBase<Video> {}
