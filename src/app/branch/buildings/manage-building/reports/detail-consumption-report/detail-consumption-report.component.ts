import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { sortRule } from '@app/shared/helper';
import { SupplyType } from '@app/shared/models';
import { Subscription } from 'rxjs';
import { TenantCostReportFilterViewModel } from '../../shared/models/consumption-report.model';
import { TenantDetailConsumptionReportModel } from '../../shared/models/detail-consumption-report.model';
import { BuildingPeriodsService } from '../../shared/services/building-periods.service';
import { ConsumptionReportService } from '../services/consumption-report.service';

@Component({
  selector: 'detail-consumption-report',
  templateUrl: './detail-consumption-report.component.html',
  styleUrls: ['./detail-consumption-report.component.less']
})
export class DetailConsumptionReportComponent implements OnInit {
  buildingId: string;
  selectedPeriod: any;
  periods: any[];
  rows: any[] = [];
  supplyTypeNames = {
    [SupplyType.Electricity]: 'electricity',
    [SupplyType.Water]: 'water',
    [SupplyType.Gas]: 'gas',
    [SupplyType.Sewerage]: 'sewerage',
    [SupplyType.AdHoc]: 'ad-hoc',
  };

  private tenantListSub: Subscription;
  private tenantDetailSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private bldPeriodsService: BuildingPeriodsService,
    private reportService: ConsumptionReportService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.pathFromRoot[4].params.subscribe(params => {
      this.buildingId = params['id'];
      this.loadBuildingPeriods();
    });
  }

  loadBuildingPeriods() {
    this.bldPeriodsService.getAllShort(this.buildingId).subscribe(r => {
      this.periods = r.sort((a, b) => sortRule(new Date(b.endDate), new Date(a.endDate)));
      if (this.periods.length) {
        this.selectedPeriod = this.periods[0];
        this.loadTenantsList();
      }
    });
  }

  loadTenantsList() {
    const filter = new TenantCostReportFilterViewModel();
    this.tenantListSub = this.reportService.getTenantsList(this.buildingId, this.selectedPeriod.id, filter).subscribe(r => {
      console.log('tenants', r.tenants);
      this.aggregateDetailReport(r.tenants);
    });
  }

  aggregateDetailReport(tenants) {
    this.rows = tenants.map((tenant) => {
      let item = new TenantDetailConsumptionReportModel();
      item.tenantName = tenant.tenantName;
      item.shopName = '';
      item.id = tenant.tenantId;
      item.isFirst = true;
      item.costs = tenant.totals;
      return item;
    })
    console.log('rows', this.rows);
  }

  onExpandToggleTenant({id, depth}) {
    console.log('id', id);
    const index = this.rows.findIndex(x => x.id === id);
    const tenant = this.rows[index];
    if(tenant.isExpanded) {
      tenant.childs = [];
      tenant.isExpanded = false;
    } else {
      if(depth == 0) {
        const filter = new TenantCostReportFilterViewModel();
        this.tenantDetailSub = this.reportService.getTenantCostDetails(this.buildingId, this.selectedPeriod.id, id, filter).subscribe(tenantDetail => {
          this.aggregateTenantDetails(tenantDetail[0], index);

          tenant.isExpanded = true;
        });
      } 
      
    }
  }

  aggregateTenantDetails(detail, index) {
    console.log('detail', detail)
    /* const childs = [];
    let item = new TenantDetailConsumptionReportModel();
    item.tenantName = '';
    item.shopName = detail.shopOwnCosts.shopName;
    item.costs = [{
      totalExel: detail.shopOwnCosts.total,
      vat: detail.shopOwnCosts.totalIncVat - detail.shopOwnCosts.total,
      totalIncl: detail.shopOwnCosts.totalIncVat
    }]
    item.details = detail.shopOwnCosts.nodeTariffSections;
    childs.push(item);
    detail.commonAreaCosts.map(commonAreaItem => {
      let item = new TenantDetailConsumptionReportModel();
      item.tenantName = '';
      item.shopName = commonAreaItem.commonAreaName;
      item.details = commonAreaItem.nodeTariffSections;
      item.costs = [{
        totalExel: commonAreaItem.total,
        vat: commonAreaItem.totalIncVat - commonAreaItem.total,
        totalIncl: commonAreaItem.totalIncVat
      }]
      childs.push(item);
    }) */

    const childs = [];
    let item = new TenantDetailConsumptionReportModel();
    item.tenantName = '';
    item.shopName = detail.shopOwnCosts.shopName;
    item.details = detail;
    item.costs =   detail.totals.map(item => {
      return {
        totalExel: item.total,
        vat: item.totalIncVat - item.total,
        totalIncl: item.totalIncVat,
        supplyType: item.supplyType
      }
    });
    childs.push(item);
    this.rows[index]['childs'] = childs;
    console.log('rows', this.rows);
  }
  ngOnDestroy() {
    this.tenantListSub && this.tenantListSub.unsubscribe();
  }

  onPeriodChanged(period) {
    console.log(period);
  }
  
}
