import { MemberStatus, MemberStatusProps } from "../member-status";

export interface MemberStatusBannedProps {
  bannedDate: Date;
  reason: string;
}

export class MemberStatusBanned extends MemberStatus<MemberStatusBannedProps> {
  constructor(props: MemberStatusProps<MemberStatusBannedProps>) {
    super(props);
  }

  protected validate() {}

  get bannedDate() {
    return this.props.bannedDate;
  }

  get reason() {
    return this.props.reason;
  }
}
