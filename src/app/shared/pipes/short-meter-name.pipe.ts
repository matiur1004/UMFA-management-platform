import {Pipe, PipeTransform} from '@angular/core';
import {SupplyTypeText} from '@models';

@Pipe({
  name: 'shortMeterName'
})
export class ShortMeterNamePipe implements PipeTransform {

  transform(meterSerialNumber: string, supplyType: any): any {
    let res = '';
    if (meterSerialNumber) {
      res = meterSerialNumber.slice(-4);
    } else {
      res = 'N/A';
    }
    if (supplyType || supplyType === 0) {
      res += '-' + (SupplyTypeText[supplyType] ? SupplyTypeText[supplyType].slice(0, 1) : '');
    } else {
      res += '-_';
    }
    return res;
  }

}
