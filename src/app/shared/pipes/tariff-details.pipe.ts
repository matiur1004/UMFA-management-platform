import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

import {TariffViewModel, VersionViewModel} from '@models';

@Pipe({
  name: 'tariffDetails'
})
export class TariffDetailsPipe implements PipeTransform {
  constructor(public datePipe: DatePipe) {
  }

  transform(tariffId: string, tariffs: VersionViewModel<TariffViewModel>[]): any {
    let res = '';
    if (tariffId && Array.isArray(tariffs)) {
      const tariff = tariffs.find(tariff => tariff.id === tariffId);
      if (tariff) {
        const versionName = this.datePipe.transform(tariff.versionDate, 'dd/MM/yyyy');
        const tariffName = tariff.entity.name + ' ' + tariff.majorVersion + '-' + versionName;
        res = `<span class="tariff-name" title="${tariffName}">${tariffName}</span>`;
      }
    }
    return res;
  }

}
