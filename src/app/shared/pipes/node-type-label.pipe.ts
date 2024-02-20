import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'nodeTypeLabel'
})
export class NodeTypeLabelPipe implements PipeTransform {
  private nodeTypes = ['Single meter node', 'Multi meter node'];
  private nodeTypesShort = ['Single', 'Multi'];

  transform(value: number, mode = 'long'): any {
    if (mode === 'short') {
      return this.nodeTypesShort[value] ? this.nodeTypesShort[value] : '';
    } else {
      return this.nodeTypes[value] ? this.nodeTypes[value] : '';
    }
  }

}
