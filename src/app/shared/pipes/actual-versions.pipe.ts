import {Pipe, PipeTransform} from '@angular/core';
import {IVersionModel} from "../models";

@Pipe({
  name: 'actualVersions'
})
export class ActualVersionsPipe implements PipeTransform {
  transform(items: IVersionModel[], isActual = true): any[] {
    return items.filter(item => item.isActual === isActual);
  }
}
