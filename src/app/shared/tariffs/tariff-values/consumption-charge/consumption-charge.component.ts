import {Component, Input, OnInit} from '@angular/core';
import {
  TariffCategoryViewModel,
  TariffLineItemValueViewModel,
  TariffStepRangeModel,
  TimeOfUse,
  TimeOfUseName
} from '@models';

@Component({
  selector: 'consumption-charge',
  templateUrl: './consumption-charge.component.html',
  styleUrls: ['./consumption-charge.component.less']
})
export class ConsumptionChargeComponent implements OnInit {

  defaultCategoryName: string = '-----------------';

  @Input() categories: TariffCategoryViewModel[];
  @Input() values: TariffLineItemValueViewModel[];
  @Input() seasonIndex: number;
  @Input() timeOfUsesArr: TimeOfUse[];
  @Input() viewMode: string;
  @Input() ranges: TariffStepRangeModel[];

  touNameArray = TimeOfUseName;

  constructor() {
  }

  getCategoryName(id: string): string {
    const category = this.categories.find((c) => c.id === id);
    return category ? category.name : this.defaultCategoryName;
  }

  ngOnInit() {
  }
}
