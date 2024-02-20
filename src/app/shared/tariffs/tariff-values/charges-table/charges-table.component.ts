import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {numberMask} from '@shared-helpers';
import {
  InfinityRange,
  TariffCategoryViewModel,
  TariffLineItemValueHistoryViewModel,
  TariffStepRangeModel,
  TimeOfUse
} from '@models';

@Component({
  selector: 'charges-table',
  templateUrl: './charges-table.component.html',
  styleUrls: ['./charges-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChargesTableComponent implements OnInit {

  defaultCategoryName: string = '--------------';
  activeHistories: any;
  numberMask = numberMask({decimalLimit: 5});

  @Input() subtitle: string;
  @Input() categories: TariffCategoryViewModel[];
  @Input() values: any;
  @Input() seasonIndex: number;
  @Input() timeOfUse: TimeOfUse;
  @Input() viewMode: string;
  @Input() ranges: TariffStepRangeModel[];

  @Output() valueChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  isShow(c, seasonIndex: number, tou: TimeOfUse) {
    switch (this.viewMode) {
      case 'season':
        return c.value.seasonType === seasonIndex;

      case 'season-time':
        return c.value.seasonType === seasonIndex && c.value.timeOfUse === tou;

      case 'simple-time':
        return c.value.timeOfUse === tou;

      default:
        return true;
    }
  }

  setActiveHistory(histories: TariffLineItemValueHistoryViewModel[], previousValue: number): void {
    this.activeHistories = {
      histories,
      previousValue
    };
  }

  getRangeData(rangeId: string, ranges: TariffStepRangeModel[]): string {
    const valueRange = ranges.find(r => r.id === rangeId);

    return this.getRangeText(valueRange);
  }

  getRangeText(range: TariffStepRangeModel): string {
    const from = range.from === InfinityRange.MIN ? '-\u221E' : range.from;
    const to = range.to === InfinityRange.MAX ? '+\u221E' : range.to;

    return `${from}...${to}`;
  }

  getCategoryName(id: string): string {
    const category = this.categories.find((c) => c.id === id);
    return category ? category.name : this.defaultCategoryName;
  }

  getHistoryItem(history: TariffLineItemValueHistoryViewModel, previousValue: number = 0): string {
    return `${this.getIncrease(history.value, previousValue)} (+ R ${this.getIncreaseR(history.value, previousValue)}) - ${history.value}`;
  }

  getIncreaseR(value: number, previousValue: number = 0): string {
    const increase = value - previousValue;
    return increase > 0 ? `+${increase.toFixed(1)}` : increase.toFixed(1);
  }

  getIncrease(value: number, previousValue: number = 0): string {
    if (!previousValue) return '-';
    const increase = (value - previousValue) / previousValue * 100;
    return increase > 0 ? `+${increase.toFixed(1)}` : increase.toFixed(1);
  }

  trackByFn(index, item) {
    return (item && item.id) ? item.id : index;
  }

  ngOnInit() {
  }
}
