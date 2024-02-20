import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'unitTypeLabel'
})
export class UnitTypeLabelPipe implements PipeTransform {
  private unitTypes = ['Shop', 'Common Area'];

  transform(value: number): any {
    return this.unitTypes[value];
  }

}
