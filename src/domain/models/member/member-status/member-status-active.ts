import { MemberStatus } from "../member-status";

export interface MemberStatusActiveProps {}

export class MemberStatusActive extends MemberStatus<MemberStatusActiveProps> {
  constructor(props: MemberStatusActiveProps) {
    super(props);
  }

  protected validate() {}
}
