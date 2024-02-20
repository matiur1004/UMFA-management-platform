import {Pipe, PipeTransform} from '@angular/core';
import {SupplyTypeText} from '@models';

@Pipe({
  name: 'supplyTypeLetter'
})
export class SupplyTypeLetterPipe implements PipeTransform {

  transform(value: number, longName = false): any {
    return SupplyTypeText[value] ? SupplyTypeText[value].slice(0, 1) : '';
  }

}
