import {Pipe, PipeTransform} from '@angular/core';
import {resolveNestedProperties} from '../helper/property-path-resolver';

@Pipe({
  name: 'sortByPropery'
})
export class SortByProperyPipe implements PipeTransform {

  transform(value: any[], propery: string, sortIndex = 1): any {
    let res = value ? [].concat(value) : [];
    return res.sort((a: any, b: any) => {
      let a_value = resolveNestedProperties(propery, a);
      let b_value = resolveNestedProperties(propery, b);
      if (a_value > b_value)
        return 1 * sortIndex;
      else if (a_value < b_value)
        return -1 * sortIndex;

      return 0;
    });
  }

}
