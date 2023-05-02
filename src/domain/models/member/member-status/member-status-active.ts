import { MemberStatus, MemberStatusProps } from "../member-status";

export interface MemberStatusActiveProps {}

export class MemberStatusActive extends MemberStatus<MemberStatusActiveProps> {
  constructor(props: MemberStatusProps<MemberStatusActiveProps>) {
    super(props);
  }

  protected validate() {}
}
