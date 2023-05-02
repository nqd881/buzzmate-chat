import { MemberStatus, MemberStatusProps } from "../member-status";

export interface MemberStatusLeftProps {
  leaveDate: Date;
}

export class MemberStatusLeft extends MemberStatus<MemberStatusLeftProps> {
  constructor(props: MemberStatusProps<MemberStatusLeftProps>) {
    super(props);
  }

  protected validate() {}

  get leaveDate() {
    return this.props.leaveDate;
  }
}
