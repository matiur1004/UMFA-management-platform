import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ReconCategoryText, SupplyTypeText, UnitType} from '@models';

@Component({
  selector: 'cost-totals',
  templateUrl: './cost-totals.component.html',
  styleUrls: ['./cost-totals.component.less']
})
export class CostTotalsComponent implements OnInit, OnChanges {

  @Input() costTotals: any;

  supplyTypeText = SupplyTypeText;
  reconCategoryText = ReconCategoryText;
  costTotalsData: any[] = [];
  costTotalsSum: any[] = [];

  constructor() {
  }

  ngOnInit() {
    if(this.costTotals) {
      //this.costTotalsSum = this.getCostTotalsSum(this.costTotals);  
      this.costTotalsSum = this.costTotals;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    //console.log('sdfsdfsdf', changes.costTotals);
    if (changes.costTotals && changes.costTotals.currentValue)
      this.costTotalsSum = this.costTotals;
      //this.aggregateCostTotals(this.costTotals);
  }

  onExpandItem(item) {
    item.isExpanded = !item.isExpanded;
  }

  private aggregateCostTotals(cost: any) {
    let groupedCostDictionary = this.getGroupedCostDictionary(cost);
    this.costTotalsData = this.getCostTotalsData(groupedCostDictionary);
    this.costTotalsSum = this.getCostTotalsSum(this.costTotals);
  }

  private getGroupedCostDictionary(costData: any) {
    let groupedCostDictionary = {};
    if (costData) {
      costData.forEach(c => {
        if (groupedCostDictionary[c.supplyType]) {
          if (groupedCostDictionary[c.supplyType][c.unitType]) {
            groupedCostDictionary[c.supplyType][c.unitType].push(c);
          } else {
            groupedCostDictionary[c.supplyType][c.unitType] = [c];
          }
        } else {
          groupedCostDictionary[c.supplyType] = {
            [c.unitType]: [c]
          }
        }
      });
    }
    return groupedCostDictionary;
  };

  private getCostTotalsData(costData: any) {
    let res = Object.keys(costData).map(i => {
      let item = costData[i];
      let supplyTotalItem = {};

      let shopItems = item[UnitType.Shop];
      let specialsItems = item[UnitType.CommonArea];
      let shopArea = shopItems && shopItems.length && {...aggregation(shopItems), items: shopItems, isExpanded: false};
      let specials = specialsItems && specialsItems.length && {
        ...aggregation(specialsItems),
        items: specialsItems,
        isExpanded: false
      };

      supplyTotalItem = {
        supplyType: parseInt(i),
        shopArea: shopArea,
        specials: specials,
        recoverable: (shopArea ? shopArea.recoverable : 0) + (specials ? specials.recoverable : 0),
        nonRecoverable: (shopArea ? shopArea.nonRecoverable : 0) + (specials ? specials.nonRecoverable : 0),
        total: (shopArea ? shopArea.total : 0) + (specials ? specials.total : 0),
        isExpanded: false
      };
      return supplyTotalItem;
    });
    return res;
  }

  private getCostTotalsSum(costData) {
    let totals = aggregation(costData || [])
    let totalsIncVat = totAggregationIncVat(costData || [])
    let res = [
      {
        fieldName: 'Report Totals',
        ...totals
      },
      {
        fieldName: 'VAT',
        recoverable: totalsIncVat.recoverable - totals.recoverable,
        nonRecoverable: totalsIncVat.nonRecoverable - totals.nonRecoverable,
        total: totalsIncVat.total - totals.total
      },
      {
        fieldName: 'Total including VAT',
        ...totalsIncVat
      }
    ];
    return res;
  }

}

const totAggregationIncVat = (cost) => cost.reduce((acc, curr) => ({
  recoverable: acc.recoverable + curr.recoverableIncVat,
  nonRecoverable: acc.nonRecoverable + curr.nonRecoverableIncVat,
  total: acc.total + curr.totalIncVat
}), {recoverable: 0, nonRecoverable: 0, total: 0});

const aggregation = (items) => items.reduce((acc, curr) => ({
  recoverable: acc.recoverable + curr.recoverable,
  nonRecoverable: acc.nonRecoverable + curr.nonRecoverable,
  total: acc.total + curr.total
}), {recoverable: 0, nonRecoverable: 0, total: 0});
