import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterByLocation'
})
export class FilterByLocationPipe implements PipeTransform {

  transform(value: any[], location: string): any {
    let res = [];
    if (location) {
      value.forEach(el => {
        if (el.location.locationId === location) {
          res.push(el);
        }
      });
    } else {
      res = value;
    }
    return res;
  }

}
