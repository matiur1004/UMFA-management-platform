import {TariffViewModel} from './../../../../../shared/models/tariff.model';
import {BuildingPeriodViewModel} from './../../shared/models/building-period.model';
import {BuildingPeriodsService} from './../../shared/services/building-periods.service';
import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NodeDetailViewModel} from '../../building-equipment/shared/models';
import {NodeService} from '../../building-equipment/shared/node.service';
import {DialogSelectTariffsComponent} from './dialog-select-tariffs/dialog-select-tariffs.component';
import {forkJoin} from 'rxjs';
import {VersionViewModel} from '@app/shared/models';

@Directive({
  selector: '[select-tariffs-bind-dialog]'
})
export class SelectTariffsBindDialogDirective {
  @Output() onConfirmerAction: EventEmitter<NodeDetailViewModel[]> = new EventEmitter<NodeDetailViewModel[]>();
  @Input() nodeIds: string[] = [];
  @Input() supplyType: number;
  @Input() buildingId: string;
  @Input() versionId: string;
  @Input() excludeTariffs: any[] = [];
  @Input() hideCostReceiver = false;

  constructor(
    private modalService: NgbModal,
    private nodeService: NodeService,
    private buildingPeriodService: BuildingPeriodsService
  ) {
  }

  @HostListener('click', ['$event']) onClick() {
    forkJoin([
      this.nodeService.getTariffsForBuilding(this.buildingId, this.supplyType, this.versionId),
      this.nodeService.getRecomendedCategoriesForTariffsByNode(this.buildingId, this.versionId, this.nodeIds),
      this.buildingPeriodService.getActiveBuildingPeriod(this.buildingId)
    ]).subscribe(res => {
      const activeBuildingPeriod = res[2];
      let tariffs = this.filterExcludesTariffs(res[0]);
      tariffs = this.filterDisabledTariffs(tariffs, activeBuildingPeriod);
      tariffs = this.markRecommendedTariffs(tariffs, res[1]);
      tariffs = this.markCostReceiverTariffs(tariffs);
      tariffs = this.groupTariffsByName(tariffs);
      this.openDialog(tariffs);
    });
  }

  filterExcludesTariffs(tariffs: any[]) {
    const excludeTariffsIds = this.excludeTariffs.map(el => el.id);
    return tariffs.filter(el => excludeTariffsIds.indexOf(el.id) === -1 && el.isActual);
  }

  filterDisabledTariffs(
    tariffs: VersionViewModel<TariffViewModel>[],
    buildingPeriod: BuildingPeriodViewModel): VersionViewModel<TariffViewModel>[] {
    let result = tariffs || [];

    if (tariffs?.length && buildingPeriod) {
      result =
        tariffs.filter(item =>
          !item.entity.disableAfter ||
          new Date(item.entity.disableAfter).valueOf() > new Date(buildingPeriod.startDate).valueOf());
    }

    return result;
  }

  markRecommendedTariffs(tariffs: any[], recomendedCategories: any[]) {
    const nodeId = this.nodeIds[0];
    const rcList = recomendedCategories[nodeId];
    const res = tariffs.map(tariff => {

      const recomendedItem = (rcList || []).find(el => el.tariffVerionId === tariff.id);
      return {
        ...tariff,
        isRecommended: (recomendedItem) ? recomendedItem.isApplicable : false
      };
    });
    return res;
  }

  markCostReceiverTariffs(tariffs: any[]) {
    let res = tariffs.map(tariff => {
      const isCostReceiver = (tariff.entity.lineItems || []).some(el => el.isCostReceiver);
      return {
        ...tariff,
        isCostReceiver: isCostReceiver
      }
    });
    if (this.hideCostReceiver === true) {
      res = res.filter(el => !el.isCostReceiver);
    }
    return res;
  }

  groupTariffsByName(tariffs: any[]) {
    return tariffs;
  }

  openDialog(tariffs) {
    const options: any = {
      backdrop: 'static',
      windowClass: 'select-tariffs-modal',
      size: 'sm'
    }
    const modalRef = this.modalService.open(DialogSelectTariffsComponent, options);
    modalRef.componentInstance.data = {
      tariffs: tariffs,
    };
    modalRef.result.then((res: NodeDetailViewModel[]) => {
      this.onConfirmerAction.emit(res);
    }, () => {
    });
  }
}
