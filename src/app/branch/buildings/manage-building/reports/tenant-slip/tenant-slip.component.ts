import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '@app/branch/clients/shared/client.service';
import { sortRule } from '@app/shared/helper';
import { SupplyType } from '@app/shared/models';
import { BranchSettingsService, BuildingService, TenantService } from '@app/shared/services';
import { Store } from '@ngrx/store';
import { forkJoin, Subscription } from 'rxjs';
import { TenantCostReportFilterViewModel, TenantCostsReportOptionsViewModel } from '../../shared/models/consumption-report.model';
import { BuildingPeriodsService } from '../../shared/services/building-periods.service';
import { ConsumptionReportService } from '../services/consumption-report.service';
import * as fromMeterReadings from '../../meter-readings/billing-readings/shared/store/reducers';
import * as billingReadingsAction from '../../meter-readings/billing-readings/shared/store/actions/billing-readings.actions';
import { BuildingBillingReadingsService } from '../../meter-readings/billing-readings/shared/services/billing-readings.service';
@Component({
  selector: 'tenant-slip',
  templateUrl: './tenant-slip.component.html',
  styleUrls: ['./tenant-slip.component.less']
})
export class TenantSlipComponent implements OnInit {

  branchId: string;
  buildingId: string;
  periods: any[];
  selectedPeriod: any;
  selectedTenantId: any;

  filterOptions: TenantCostsReportOptionsViewModel = new TenantCostsReportOptionsViewModel();
  tenantTableItems: any[] = [];
  costTotal: any;

  supplyType = SupplyType;

  branchDetail: any;
  buildingDetail: any;
  clientDetail: any;
  contactInformations: any;
  tenant: any;
  meterReadingList: any[] = [];
  chartData: any[] = [];

  private filterSub: Subscription;
  private costSub: Subscription;
  private tenantSub: Subscription;
  private branchSub: Subscription;
  private buildingSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private bldPeriodsService: BuildingPeriodsService,
    private reportService: ConsumptionReportService,
    private buildingService: BuildingService,
    private clientService: ClientService,
    private tenantService: TenantService,
    private branchService: BranchSettingsService,
    private _buildingBillingReadingService: BuildingBillingReadingsService,
    private store: Store<fromMeterReadings.State>,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.pathFromRoot[2].params.subscribe(params => {
      this.branchId = params['branchid'];
      this.loadBranchDetail();
    });
    this.activatedRoute.pathFromRoot[4].params.subscribe(params => {
      this.buildingId = params['id'];
      this.loadBuildingDetail();
      this.loadBuildingPeriods();
    });
  }

  loadBranchDetail() {
    this.branchSub = this.branchService.get(this.branchId).subscribe(branchDetail => {
      this.branchDetail = branchDetail;
    })
  }
  loadBuildingDetail() {
    this.buildingSub = this.buildingService.get(this.buildingId).subscribe(buildingDetail => {
      this.buildingDetail = buildingDetail;
      let clientId = buildingDetail['clientId'];
      this.clientService.getById(clientId).subscribe(clientDetail => {
        this.clientDetail = clientDetail;
        this.contactInformations = clientDetail['contactInformations'];
      });
    })
  }

  loadBuildingPeriods() {
    this.bldPeriodsService.getAllShort(this.buildingId).subscribe(r => {
      this.periods = r.sort((a, b) => sortRule(new Date(b.endDate), new Date(a.endDate)));
      if (this.periods.length) {
        this.selectedPeriod = this.periods[0];
        this.store.dispatch(new billingReadingsAction.UpdateBuildingPeriod(this.selectedPeriod.id));
        this.loadFilterOptions();
      }
    });
  }

  loadFilterOptions() {
    this.filterSub = this.reportService.getFilterOptions(this.buildingId, this.selectedPeriod.id).subscribe(r => {
      this.filterOptions = r;
      this.selectedTenantId = r.tenants[0].id;
      this.onChangeTenant(this.selectedTenantId);
    });
  }
  
  loadTenantInfo() {
    this.tenantSub = this.tenantService.getById(this.buildingId, this.selectedTenantId).subscribe(tenant => {
      this.tenant = tenant;
    })
  }
  loadTenantCostDetail(): void {
    const filter = new TenantCostReportFilterViewModel();
    this.costSub = this.reportService.getTenantCostDetails(this.buildingId, this.selectedPeriod.id, this.selectedTenantId, filter).subscribe(r => {
      if(!r.length) return;
      this.tenantTableItems = [];
      r.forEach((detail) => {
        this.buildingDetail.shopName = detail['shopOwnCosts']['shopName'];
        this.buildingDetail.shopArea = detail['shopOwnCosts']['shopArea']
        let tarrifLists = detail['shopOwnCosts']['nodeTariffSections'];
        tarrifLists.forEach(tarrif => {
          let lineItems = tarrif['lineItems'];
          lineItems.forEach(item => {
            let priceDetail = item['priceDetails'][0];
            let calculation = priceDetail['calculations'][0];
            if(calculation && item.total) {
              this.tenantTableItems.push({
                date: this.selectedPeriod.endDate,
                description: `${this.supplyType[tarrif.supplyType]} ${item.lineItemName}  -  ${calculation['formula']}`,
                total: item.total,
                totalIncVat: item.totalIncVat
              })
            }
          })
        })
      })
      
      this.costTotal = {
        total: this.tenantTableItems.reduce((prev, cur) => prev + cur.total, 0),
        totalIncVat: this.tenantTableItems.reduce((prev, cur) => prev + cur.totalIncVat, 0)
      };
    });
  }

  onChangeTenant(tenantId: string) {
    this.selectedTenantId = tenantId;
    this.loadMeterList();
    this.loadTenantInfo();
    this.loadTenantCostDetail();
    this.loadWholeCostDetail();
  }
  
  onPeriodChanged(period: any) {
    this.selectedPeriod = period;
    this.loadTenantInfo();
    this.loadTenantCostDetail();
  }

  loadMeterList(): void {
    const filterModel = {
      buildingId: this.buildingId,
      buildingPeriodId: this.selectedPeriod.id,
      tenantId: this.selectedTenantId
    }
    this._buildingBillingReadingService.getMeterReadings(this.buildingId, this.selectedPeriod.id, filterModel)
      .subscribe(res => {
        this.meterReadingList = [];
        res.items.forEach((item => {
          item.registerReadings.forEach(reading=>{
            this.meterReadingList.push({
              node: item.meterDetails.nodes[0],
              supply: this.supplyType[item.meterDetails.supplyType],
              previousReading: reading.previousReadingValue,
              currentReading: reading.currentReadingValue
            })
          })
        }))
      })
  }

  loadWholeCostDetail() {
    const filter = new TenantCostReportFilterViewModel();
    const subList = this.periods.map(period => {
      return this.reportService.getTenantCostDetails(this.buildingId, period.id, this.selectedTenantId, filter)
    })
    forkJoin(subList).subscribe((res) => {
      this.chartData = res.map((detail, index) => {
        const dataList = [];
        detail.forEach((item => {
          item.totals.forEach((total) => {
            dataList.push({
              totalIncVat: total.totalIncVat
            })
          })
        }))
        return {
          name: this.periods[index].name,
          value: dataList.reduce((prev, cur) => prev + cur.totalIncVat, 0)
        }
      })
    })
  }

  ngOnDestroy() {
    this.filterSub && this.filterSub.unsubscribe();
    this.costSub && this.costSub.unsubscribe();
    this.tenantSub && this.tenantSub.unsubscribe();
    this.branchSub && this.branchSub.unsubscribe();
    this.buildingSub && this.buildingSub.unsubscribe();
  }
}
