import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {FormGroupControls, FormGroupState,} from 'ngrx-forms';

import * as fromTariffValuesForm from '../../store/reducers/tariff-values-form.store';

import {NgbDateFullParserFormatter, ngbDateNgrxValueConverter} from '@shared-helpers';
import {Season, TariffLineItemValuesViewModel, TariffLineItemValueViewModel, TimeOfUse} from '@models';

export const sortRule = (a, b) => (a > b) ? 1 : (a < b) ? -1 : 0;

@Component({
  selector: 'tariff-values-form',
  templateUrl: './tariff-values-form.component.html',
  styleUrls: ['./tariff-values-form.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFullParserFormatter}],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TariffValuesFormComponent {

  @Input() form: FormGroupState<fromTariffValuesForm.FormValue>;

  versionId: string;
  valueId: string;

  seasons = Season;
  seasonsArr: string[] = Object.keys(Season).filter(key => !isNaN(Number(Season[key]))).reverse();

  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;

  holidayArray = [
    {date: {day: 1, month: 1, year: 2018}, day: 'desc1r', actualDay: 'Friday'},
    {date: {day: 7, month: 1, year: 2018}, day: 'descr2', actualDay: 'Tuesday'},
    {date: {day: 14, month: 2, year: 2018}, day: 'descr5', actualDay: 'Wednesday'},
    {date: {day: 13, month: 5, year: 2018}, day: 'descr3', actualDay: 'Friday'}
  ];
  treatedDays = ['Sunday', 'Saturday'];
  tabId: string = "demand-charge-0"
  otherTabId: string = "tab-consumption-0"

  getTimeOfUsesArr(timeOfUses: number[]): number[] {
    return timeOfUses.filter(t => t !== TimeOfUse.None);
  }

  isSimpleCharge(charge: TariffLineItemValuesViewModel): boolean {
    return (!charge.timeOfUses || charge.timeOfUses.length === 0) && (!charge.seasons || charge.seasons.length === 0);
  }

  isSimpleTimeOfUseCharge(charge: TariffLineItemValuesViewModel): boolean {
    return (charge.timeOfUses && charge.timeOfUses.length > 0) && (!charge.seasons || charge.seasons.length === 0);
  }

  isSeasonCharge(charge: TariffLineItemValuesViewModel): boolean {
    return (!charge.timeOfUses || charge.timeOfUses.length === 0) && (charge.seasons && charge.seasons.length > 0);
  }

  isSeasonTimeOfUseCharge(charge: TariffLineItemValuesViewModel): boolean {
    return (charge.timeOfUses && charge.timeOfUses.length > 0) && (charge.seasons && charge.seasons.length > 0);
  }

  isTabInvalid(
    form: FormGroupState<fromTariffValuesForm.FormValue>,
    values: FormGroupControls<TariffLineItemValueViewModel>[],
    seasonIndex: number
  ): boolean {
    const isError = values.find((item: any) => (item.value.seasonType === seasonIndex && item.isInvalid));

    if (form.isSubmitted && isError) {
      return true;
    }
    return false;
  }

  trackByFn(index, item) {
    return (item && item.id) ? item.id : index;
  }
}
