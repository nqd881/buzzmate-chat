import {Injectable, PipeTransform} from "@nestjs/common";

@Injectable()
export class JsonTransformPipe implements PipeTransform {
  transform(value: string) {
    return JSON.parse(value);
  }
}
