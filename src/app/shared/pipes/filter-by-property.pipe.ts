import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterByProperty'
})
export class FilterByPropertyPipe implements PipeTransform {

  transform(data: any[], properties: string | string[], filter: string): any {
    let res = [];
    if (!properties || !filter) {
      res = data;
    } else {
      if (!Array.isArray(properties)) {
        properties = [properties];
      }
      filter = filter.toLocaleLowerCase();
      res = data.filter(el => {
        const values = (properties as string[]).map(property => el[property] ? el[property].toLocaleLowerCase() : el[property])
        if (values.some(value => value && value.indexOf(filter) !== -1)) {
          return true;
        }
        return false;
      });
    }
    return res;
  }

}
