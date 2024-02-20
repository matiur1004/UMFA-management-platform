import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'meterTypeLabel'
})
export class MeterTypeLabelPipe implements PipeTransform {
  private meterTypes = ['Breaker', 'Whole Current Meter', 'CT Meter', 'High Voltage Meter'];

  transform(value: number): any {
    return this.meterTypes[value];
  }

}
