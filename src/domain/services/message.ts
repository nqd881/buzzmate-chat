import {ChatMember} from "@domain/models/chat-member/chat-member";
import {Message} from "@domain/models/message/message";

export class MessageDomainService {
  // static pinMessage(chatMember: ChatMember, message: Message<any>) {
  //   if (
  //     chatMember.isMember() ||
  //     (chatMember.isMemberRestricted() &&
  //       chatMember.reachedTimeShouldRemoveRestrictions())
  //   ) {
  //     message.pin();
  //   }
  // }
  // static unpinMessage(chatMember: ChatMember, message: Message<any>) {
  //   if (
  //     chatMember.isMember() ||
  //     (chatMember.isMemberRestricted() &&
  //       chatMember.reachedTimeShouldRemoveRestrictions())
  //   ) {
  //     message.unpin();
  //   }
  // }
}
