import {Chat} from "@domain/models/chat/chat";
import {IRepositoryBase} from "@libs/ddd";

export interface IChatRepo extends IRepositoryBase<Chat> {}
