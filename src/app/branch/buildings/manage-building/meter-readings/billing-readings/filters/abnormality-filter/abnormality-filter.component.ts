import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Options} from '@angular-slider/ngx-slider';
import {AbnormalityFilterData} from './../../shared/models/billing-reading-filter.model';

@Component({
  selector: 'abnormality-filter',
  templateUrl: './abnormality-filter.component.html',
  styleUrls: ['./abnormality-filter.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbnormalityFilterComponent {

  public sliderOptions: Options = {
    floor: -100,
    ceil: 100,
    step: 1,
    hidePointerLabels: true,
    hideLimitLabels: true
  };
  @Output()
  public filterChanged: EventEmitter<AbnormalityFilterData> = new EventEmitter<AbnormalityFilterData>();

  private _filterData: AbnormalityFilterData = new AbnormalityFilterData();

  public get filterData(): AbnormalityFilterData {
    return this._filterData;
  }

  @Input()
  public set filterData(value: AbnormalityFilterData) {
    this._filterData = value || new AbnormalityFilterData();
  }

  public onFilterDataChanged(): void {
    this.filterChanged.emit(this.filterData);
  }
}
