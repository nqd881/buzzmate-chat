import { MemberStatus } from "../member-status";

export interface MemberStatusBannedProps {
  bannedDate: Date;
  reason: string;
}

export class MemberStatusBanned extends MemberStatus<MemberStatusBannedProps> {
  constructor(props: MemberStatusBannedProps) {
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
