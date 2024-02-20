import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'tariffApplyTypeLabel'
})
export class TariffApplyTypeLabelPipe implements PipeTransform {
  private tariffApplyTypes = {
    0: 'Per node',
    1: 'Per meter'
  };

  transform(value: number): string {
    return this.tariffApplyTypes[value];
  }

}
