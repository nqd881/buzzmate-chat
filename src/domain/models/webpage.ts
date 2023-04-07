import { ValueObject } from "@libs/ddd";

export interface IWebPageProps {
  url: string;
  title: string;
  description: string;
  siteName: string;
  image: string;
  type: string;
}

export class WebPage extends ValueObject<IWebPageProps> {
  constructor(props: IWebPageProps) {
    super(props);
  }

  protected validate() {}
}
