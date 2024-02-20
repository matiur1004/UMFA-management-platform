import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'locationTypeLabel'
})
export class LocationTypeLabelPipe implements PipeTransform {
  private nodeTypes = ['Simple', 'Multy'];

  transform(value: number): any {
    return this.nodeTypes[value];
  }

}
