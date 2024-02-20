import {Pipe, PipeTransform} from '@angular/core';
import {TariffViewModel, VersionViewModel} from '@models';

@Pipe({
  name: 'tariffSelectorList'
})
export class TariffSelectorListPipe implements PipeTransform {

  transform(tariffs: VersionViewModel<TariffViewModel>[]): any {
    let res = [];
    if (tariffs && Array.isArray(tariffs)) {
      res = tariffs.map(el => {
        return {id: el.id}
      });
    }
    return res;
  }

}
