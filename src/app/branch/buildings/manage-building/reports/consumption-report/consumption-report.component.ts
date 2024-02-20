import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ConsumptionReportService} from '../services/consumption-report.service';
import {BuildingPeriodsService} from '../../shared/services/building-periods.service';

import {
  SupplyTypeUnitTypeCostViewModel,
  TenantCostReportFilterViewModel,
  TenantCostsReportOptionsViewModel,
  TenantCostsReportViewModel
} from 'app/branch/buildings/manage-building/shared/models/consumption-report.model';
import {SupplyType} from '@models';
import {sortRule} from '@shared-helpers';
import {Observable, of, Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfimationPopupActions, ConfirmationPopupMessage} from '@app/shared/models/confirmation-popup-message.model';
import {PopupConfirmReportComponent} from '@app/popups/popup.confirm-report/popup.confirm-report.component';
import {switchMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {ConfirmationReport, TenantCostCalculationMode} from '@app/shared/models/confirmation-report.model';
import * as commonDataAction from '../../shared/store/actions/common-data.action';
import * as nodeApplyNewTariffVersionsAction
  from '../../building-equipment/shared/store/actions/node-apply-new-tariff-versions.action';
import * as fromEquipment from '../../building-equipment/shared/store/reducers/equipment-tree.reducer';
import {Store} from "@ngrx/store";
import {CalculationCostResult} from "../shared/cost-calculation-result.enum";
import {NodeTariffsPopupMode} from "../../shared/enums/node-tariffs-popup.enum";
import {NodeTariffVersionsProcessingScope} from "../../shared/enums/node-tariff-versions-processing-scope.enum";
import { NodeTariffsAppliedPopup } from "../../shared/components/node-tariffs-applied-popup/node-tariffs-applied-popup.component";
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'consumption-report',
  templateUrl: './consumption-report.component.html',
  styleUrls: ['./consumption-report.component.less']
})
export class ConsumptionReportComponent implements OnInit, OnDestroy {
  buildingId: string;
  selectedPeriod: any;
  periods: any[];
  filterOptions: TenantCostsReportOptionsViewModel = new TenantCostsReportOptionsViewModel();
  report: TenantCostsReportViewModel = new TenantCostsReportViewModel();
  //costTotals: SupplyTypeUnitTypeCostViewModel;
  costTotals: any;

  selectedTenantIds: any[] = [];
  selectedTariffId: string;
  selectedTariffText = 'All tariffs';

  supplyType = SupplyType;
  supplyTypesList: any[] = [
    { supplyType: SupplyType.Electricity, checked: false },
    { supplyType: SupplyType.Water, checked: false },
    { supplyType: SupplyType.Sewerage, checked: false },
    { supplyType: SupplyType.Gas, checked: false },
    { supplyType: SupplyType.AdHoc, checked: false }
  ];
  showFilter: boolean;
  private filterSub: Subscription;
  private reportSub: Subscription;
  private costSub: Subscription;

  constructor(
    private bldPeriodsService: BuildingPeriodsService,
    private reportService: ConsumptionReportService,
    private ngbModal: NgbModal,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromEquipment.State>,
  ) {
  }

  ngOnInit() {
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
        this.loadFilterOptions();
      }
    });
  }

  onPeriodChanged(period: any) {
    this.selectedPeriod = period;
    this.loadFilterOptions();
  }

  loadFilterOptions() {
    this.filterSub = this.reportService.getFilterOptions(this.buildingId, this.selectedPeriod.id).subscribe(r => {
      this.filterOptions = r;
      this.loadTenantsList();
      this.loadCostTotals();
    });
  }

  loadTenantsList() {
    const filter = this.consumptionReportFilter();
    this.costSub = this.reportService.getTenantsList(this.buildingId, this.selectedPeriod.id, filter).subscribe(r => {
      this.aggregateTenantsList(r);
      this.aggregateTenantsTotal(r);
      this.report = r;
    });
  }

  loadCostTotals() {
    const filter = this.consumptionReportFilter();
    this.reportSub = this.reportService.getCostTotals(this.buildingId, this.selectedPeriod.id, filter).subscribe(r => {
      this.costTotals = r;
    });
  }

  consumptionReportFilter() {
    const filter = new TenantCostReportFilterViewModel();
    filter.supplyTypes = this.supplyTypesList.filter(x => x.checked).map(x => x.supplyType);
    filter.tenantIds = this.selectedTenantIds;
    filter.tariffId = this.selectedTariffId;

    return filter;
  }

  onExpandToggleTenant(tenantId: string) {
    const index = this.report.tenants.findIndex(x => x.tenantId === tenantId);
    const tenant = this.report.tenants[index];

    if (tenant.isExpanded) {
      tenant.isExpanded = false;

    } else {
      const filter = new TenantCostReportFilterViewModel();
      this.costSub = this.reportService.getTenantCostDetails(this.buildingId, this.selectedPeriod.id, tenantId, filter).subscribe(r => {
        this.aggregateTenantDetails(r);

        tenant.details = r;
        tenant.isExpanded = true;
      });
    }
  }

  onExpandToggleNonRecoverableTenant(event) {
    const {tenantId, category} = event;
    let index;
    let tenant;
    if(category == 'tenantsNotLiable') {
      index = this.report.tenantsNotLiableTenants.findIndex(x => x.tenantId === tenantId);
      tenant = this.report.tenantsNotLiableTenants[index];
    }
    if(category == 'ownerLiability') {
      index = this.report.ownerTenants.findIndex(x => x.tenantId === tenantId);
      tenant = this.report.ownerTenants[index];
    }
    if(category == 'vacantShops') {
      index = this.report.vacantTenants.findIndex(x => x.shopId === tenantId);
      tenant = this.report.vacantTenants[index];
    }
    if (tenant.isExpanded) {
      tenant.isExpanded = false;
    } else {
      const filter = new TenantCostReportFilterViewModel();
      if(category == 'ownerLiability') {
        this.costSub = this.reportService.getTenantOwnerCostDetails(this.buildingId, this.selectedPeriod.id, tenantId, filter).subscribe(r => {
          this.aggregateTenantDetails(r);
  
          tenant.details = r;
          tenant.isExpanded = true;
        });
      } else if (category == 'tenantsNotLiable'){
        this.costSub = this.reportService.getTenantNotLiableCostDetails(this.buildingId, this.selectedPeriod.id, tenantId, filter).subscribe(r => {
          this.aggregateTenantDetails(r);
          tenant.details = r;
          tenant.isExpanded = true;
        });
      } else {
        this.costSub = this.reportService.getTenantVacantCostDetails(this.buildingId, this.selectedPeriod.id, tenantId, filter).subscribe(r => {
          this.aggregateTenantDetails(r);
  
          tenant.details = r;
          tenant.isExpanded = true;
        });
        
      }
      
    }
  }
  onSupplyTypeChecked(supplyType: SupplyType) {
    const index = this.supplyTypesList.findIndex(x => x.supplyType === supplyType);
    this.supplyTypesList[index].checked = !this.supplyTypesList[index].checked;
  }

  onApply() {
    this.loadTenantsList();
    this.loadCostTotals();
  }

  onTariffChanged(tariffVersionId: any) {
    this.selectedTariffId = tariffVersionId;

    if (!tariffVersionId) {
      this.selectedTariffText = 'All tariffs';
    } else {
      const tariff = this.filterOptions.tariffs.find(x => x.id === tariffVersionId);
      if (tariff) {
        this.selectedTariffText = tariff.entity.name;
      }
    }
  }

  onResetFilter() {
    this.supplyTypesList.forEach(s => {
      s.checked = false;
    });
    this.selectedTenantIds = [];
    this.onTariffChanged(null);
  }

  aggregateTenantsList(report: TenantCostsReportViewModel) {
    report.tenants.forEach(t => {
      t.isExpanded = false;
      t.sum = {
        total: t.totals.reduce((prev, cur) => prev + cur.total, 0),
        totalIncVat: t.totals.reduce((prev, cur) => prev + cur.totalIncVat, 0)
      };

      t.sum.vat = t.totals.totalIncVat - t.totals.total;
    });
  }

  aggregateTenantsTotal(report: TenantCostsReportViewModel) {
    let reportTotals = 0; let reportNonRecoverableTotals = 0;
    let reportVatTotals = 0; let reportNonRecoverableVatTotals = 0;
    let reportIncVatTotals = 0; let reportNonRecoverableIncVatTotals = 0;
    report.tenants.forEach(t => {
      t.sum = {
        total: t.totals.reduce((prev, cur) => prev + cur.total, 0),
        totalIncVat: t.totals.reduce((prev, cur) => prev + cur.totalIncVat, 0)
      };

      t.sum.vat = t.sum.totalIncVat - t.sum.total;
      reportTotals += t.sum.total;
      reportVatTotals += t.sum.vat;
      reportIncVatTotals += t.sum.totalIncVat;

      
    });
    // non-recoverable total
    report.vacantTenants.forEach(t => {
      t.sum = {
        total: t.totals.reduce((prev, cur) => prev + cur.total, 0),
        totalIncVat: t.totals.reduce((prev, cur) => prev + cur.totalIncVat, 0)
      };
      t.sum.vat = t.sum.totalIncVat - t.sum.total;
    });

    let vacantsSum = {
      total: report.vacantTenants.reduce((prev, cur) => prev + cur.sum.total, 0),
      totalIncVat: report.vacantTenants.reduce((prev, cur) => prev + cur.sum.totalIncVat, 0)
    }
    
    report.tenantsNotLiableTenants.forEach(t => {
      t.sum = {
        total: t.totals.reduce((prev, cur) => prev + cur.total, 0),
        totalIncVat: t.totals.reduce((prev, cur) => prev + cur.totalIncVat, 0)
      };
      t.sum.vat = t.sum.totalIncVat - t.sum.total;
    });
    let tenantsNotLiableSum = {
      total: report.tenantsNotLiableTenants.reduce((prev, cur) => prev + cur.sum.total, 0),
      totalIncVat: report.tenantsNotLiableTenants.reduce((prev, cur) => prev + cur.sum.totalIncVat, 0)
    };

    report.ownerTenants.forEach(t => {
      t.sum = {
        total: t.totals.reduce((prev, cur) => prev + cur.total, 0),
        totalIncVat: t.totals.reduce((prev, cur) => prev + cur.totalIncVat, 0)
      };
      t.sum.vat = t.sum.totalIncVat - t.sum.total;
    });
    let ownerLiabilitySum = {
      total: report.ownerTenants.reduce((prev, cur) => prev + cur.sum.total, 0),
      totalIncVat: report.ownerTenants.reduce((prev, cur) => prev + cur.sum.totalIncVat, 0)
    };

    reportNonRecoverableTotals = vacantsSum.total + ownerLiabilitySum.total + tenantsNotLiableSum.total;
    reportNonRecoverableVatTotals = (vacantsSum.totalIncVat - vacantsSum.total) + (ownerLiabilitySum.totalIncVat - ownerLiabilitySum.total) + (tenantsNotLiableSum.totalIncVat - tenantsNotLiableSum.total);
    reportNonRecoverableIncVatTotals = vacantsSum.totalIncVat + ownerLiabilitySum.totalIncVat + tenantsNotLiableSum.totalIncVat;
    this.costTotals = [
      { fieldName: 'Report Totals', recoverable: reportTotals, nonRecoverable: reportNonRecoverableTotals, total: reportTotals + reportNonRecoverableTotals },
      { fieldName: 'VAT', recoverable: reportVatTotals, nonRecoverable: reportNonRecoverableVatTotals, total: reportVatTotals + reportNonRecoverableVatTotals },
      { fieldName: 'Total including VAT',   recoverable: reportIncVatTotals, nonRecoverable: reportNonRecoverableIncVatTotals, total: reportIncVatTotals + reportNonRecoverableVatTotals },
    ]
  }
  aggregateTenantDetails(details: any) {
    details.forEach(d => {
      d.totalIncVat = d.totals.reduce((prev, cur) => prev + cur.totalIncVat, 0);
    });
  }

  recalculate() {
    this.reportSub = this.reportService.validateConsumptionReport(this.buildingId, this.selectedPeriod.id).pipe(
      switchMap((response) => {
        if (response.hasError) {
          return this.loadConfirmationPopup(response).pipe(
            switchMap((popupData) => {
              if (popupData) {
                return this.recalculateCosts(TenantCostCalculationMode.withEmpty);
              }
              return of(null);
            })
          );
        }

        return this.recalculateCosts(TenantCostCalculationMode.default);
      })
    ).subscribe(() => {
    }, e => console.error(e));
  }

  recalculateCosts(calculationMode: TenantCostCalculationMode) {
    return this.reportService.recalculateCosts(this.buildingId, this.selectedPeriod.id,
      <ConfirmationReport>{ calculationMode: calculationMode }).pipe(
        switchMap(versionResult => {

          const calculationResult = versionResult.entity.calculationResult;
          const nodeSetsWithConflicts = versionResult.entity.nodeSetsWithConflicts;

          this.updateVersionData(versionResult.current.id, versionResult.current.versionDate);
          switch (calculationResult) {
            case CalculationCostResult.Conflicts:
              this.store.dispatch(new nodeApplyNewTariffVersionsAction.ShowNodeTariffConflictsPopup(
                {
                  versionDate: versionResult.current.versionDate,
                  nodeSets: nodeSetsWithConflicts
                }));

              break;

            case CalculationCostResult.NewTariffVersionsAreAppliedWithConflicts:
              const modalRef = this.ngbModal.open(NodeTariffsAppliedPopup, { backdrop: 'static' });
              modalRef.result.finally(() => {
                this.store.dispatch(new nodeApplyNewTariffVersionsAction.ShowNodeTariffConflictsPopup(
                  {
                    nodeSets: nodeSetsWithConflicts,
                    versionDate: versionResult.current.versionDate
                  }));
              });

              break;

            case CalculationCostResult.NewTariffVersionsAreAppliedWithoutConflicts:
              this.store.dispatch(new nodeApplyNewTariffVersionsAction.ShowNodeTariffsAppliedPopup());

              this.onApply();

              break;

            case CalculationCostResult.NewTariffVersionsShouldBeApplied:
              this.store.dispatch(new nodeApplyNewTariffVersionsAction.ShowNewNodeTariffVersionsPopup(
                {
                  mode: NodeTariffsPopupMode.NewTariffVersionsWithChoice,
                  scope: NodeTariffVersionsProcessingScope.Report
                }
              ));

              break;

            default:
              this.onApply();

              break;
          }

          return of(null);
        })
      );
  }

  updateVersionData(versionId: string, versionDate: Date,): void {
    this.store.dispatch(new commonDataAction.UpdateUrlVersionAction(versionDate));
    this.store.dispatch(new commonDataAction.GetHistoryWithVersionId(versionId));
  }

  ngOnDestroy() {
    this.filterSub && this.filterSub.unsubscribe();
    this.reportSub && this.reportSub.unsubscribe();
    this.costSub && this.costSub.unsubscribe();
  }

  private loadConfirmationPopup(response: ConfirmationPopupMessage): Observable<any> {
    response.actions = [ConfimationPopupActions.confirm, ConfimationPopupActions.cancel];
    const modalRef = this.ngbModal.open(PopupConfirmReportComponent, {
      backdrop: 'static',
      size: 'sm'
    });
    modalRef.componentInstance.popupDialog = response;

    return fromPromise(modalRef.result);
  }

  convetToPDF() {
    let data = document.getElementById('ExportReportToPdf');

    html2canvas(data).then((canvas) => {
      var imgData = canvas.toDataURL('image/png');

      /*
      Here are the numbers (paper width and height) that I found to work. 
      It still creates a little overlap part between the pages, but good enough for me.
      if you can find an official number from jsPDF, use them.
      */
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      var doc = new jspdf('p', 'mm');
      var position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save('ConsumptionReport.pdf');
    });
  }
}
