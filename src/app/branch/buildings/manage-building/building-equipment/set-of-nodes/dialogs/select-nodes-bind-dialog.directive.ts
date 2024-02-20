import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {forkJoin} from 'rxjs';

import {DialogSelectNodesComponent} from './dialog-select-nodes/dialog-select-nodes.component';
import {NodeDetailViewModel} from '../../shared/models';
import {NodeService} from '../../shared/node.service';
import {MeterService} from '../../shared/meter.service';
import {EquipmentService} from '@services';
import {
  CommonAreaViewModel,
  EquipmentAttributeViewModel,
  ShopViewModel,
  SupplyToViewModel,
  TariffViewModel
} from '@models';

@Directive({
  selector: '[select-nodes-bind-dialog]'
})
export class SelectNodesBindDialogDirective {
  @Output() onConfirmerAction: EventEmitter<NodeDetailViewModel[]> = new EventEmitter<NodeDetailViewModel[]>();

  @Input('select-nodes-bind-dialog') excludeNodes: string[];
  @Input() supplyType: number;
  @Input() buildingId: string;
  @Input() versionId: string;

  constructor(
    private modalService: NgbModal,
    private nodeService: NodeService,
    private meterService: MeterService,
    private equipmentService: EquipmentService
  ) {
  }

  @HostListener('click', ['$event']) onClick() {
    forkJoin(
      this.nodeService.getAllBulkNodesByBuilding(this.buildingId, this.versionId, this.supplyType),
      this.meterService.getShops(this.buildingId, this.versionId),
      this.nodeService.getTariffsForBuilding(this.buildingId, this.supplyType, this.versionId),
      this.equipmentService.getAllEquipmentAttributes(''),
      this.meterService.getSupplies(this.buildingId, this.supplyType),
      this.meterService.getCommonAreas(this.buildingId, this.versionId)
    ).subscribe(res => {
      const nodes = this.getActulatNodes(res[0], this.excludeNodes);
      const shops = this.getActualShops(nodes, res[1]);
      const tariffs = this.getActualTariffs(nodes, res[2]);
      const suppliers = this.getSuppliersList(res[4]);
      const areas = res[5];
      this.openDialog(nodes, shops, tariffs, res[3], suppliers, areas);
    });
  }

  getActulatNodes(nodes: NodeDetailViewModel[], excludeNodeIds: string[]) {
    return nodes.filter(node => excludeNodeIds.indexOf(node.id) === -1);
  }

  getActualShops(nodes: NodeDetailViewModel[], shops: ShopViewModel[]) {
    let listOfShopIds = [];
    nodes.forEach(node => {
      if (node.shopIds.length) {
        listOfShopIds = listOfShopIds.concat(node.shopIds);
      }
    });
    const listOfShops = shops.filter(shop => listOfShopIds.indexOf(shop.id) !== -1);
    return listOfShops;
  }

  getActualTariffs(nodes: NodeDetailViewModel[], tariffs: any[]): TariffViewModel[] {
    let listOfTariffIds = [];
    nodes.forEach(node => {
      if (node.tariffs.length) {
        listOfTariffIds = listOfTariffIds.concat(node.tariffs.map(el => el.id));
      }
    });
    const listOfTariffs = tariffs.filter(tariff => listOfTariffIds.indexOf(tariff.id) !== -1);
    return listOfTariffs;
  }

  getSuppliersList(suppliers) {
    return suppliers.map((supplier) => {
      return {
        id: supplier.id,
        name: supplier.name,
        locationTypes: supplier.supplyTypes.reduce((locationTypes, supplyType) => {
          locationTypes.push(...supplyType.supplyToLocations);
          return locationTypes;
        }, [])
      }
    });
  }

  openDialog(nodes, shops, tariffs, attributes: EquipmentAttributeViewModel[], supplies: SupplyToViewModel[], areas: CommonAreaViewModel[]) {
    const options: any = {
      backdrop: 'static',
      windowClass: 'select-nodes-modal',
      size: 'xxl'
    }
    const modalRef = this.modalService.open(DialogSelectNodesComponent, options);
    modalRef.componentInstance.data = {
      buildingId: this.buildingId,
      versionId: this.versionId,
      supplyType: this.supplyType,
      nodes: nodes,
      shops: shops,
      areas: areas,
      tariffs: tariffs,
      attributes: attributes,
      supplies: supplies
    };
    modalRef.result.then((res: NodeDetailViewModel[]) => {
      this.onConfirmerAction.emit(res);
    }, () => {
    });
  }
}
