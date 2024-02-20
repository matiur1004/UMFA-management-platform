import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'httpProtocol'
})
export class HttpProtocolPipe implements PipeTransform {

  transform(value: string, prot: string = 'https://'): string {
    return (/^https?:\/\//.test(value) ? value : prot + value);
  }

}
