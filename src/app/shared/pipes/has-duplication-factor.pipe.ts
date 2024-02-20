import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'hasDuplicationFactor'
})
export class HasDuplicationFactorPipe implements PipeTransform {

  transform(value: any[]): any {
    return value.some(el => el.hasDuplicationFactor);
  }

}
