import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RegisterViewModel} from './../../../../../../../shared/models/register.model';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';

import * as fromNodeState from '../../../shared/store/reducers';
import * as nodeActions from '../../../shared/store/actions/node.actions';
import * as fromStore from '../../../../shared/store/selectors/common-data.selectors';
import {State as CommonDataState} from '../../../../shared/store/state/common-data.state';
import {
  AllocatedUnitViewModel,
  CostAllocationNodeModel,
  NodeDetailViewModel,
  NodeUnitsFiltersList,
  SearchFilterUnits
} from '../../../shared/models';
import {ShopViewModel, SplitType, SplitTypeList, UnitOfMeasurement, UnitOfMeasurementType} from '@models';
import {ConfirmDialogComponent} from "@app/popups/confirm-dialog/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'costs-allocations',
  templateUrl: './costs-allocation.component.html',
  styleUrls: ['./costs-allocation.component.less']
})
export class CostsAllocationComponent implements OnInit, OnDestroy {
  public node: NodeDetailViewModel;
  public SplitType = SplitType;
  public registers$;
  public registers: RegisterViewModel[] = [];
  public splitTypeList = SplitTypeList;
  public nodeUnitsFiltersList = NodeUnitsFiltersList;
  public selectedUnitFilterText = 0;
  public isSelectedAllUnits = false;
  public query = '';
  public sortProperty = 'name';
  public sortIndex = 1;
  public selectedRegister: UnitOfMeasurementType | number;
  public checkedAllPartly = false;
  isExpanded: boolean;
  hasAllocatedRegister: boolean;
  public unitOfMeasurements$: Observable<UnitOfMeasurement[]>;
  public unitOfMeasurements: UnitOfMeasurement[];
  public allowedUnitsOfMeasurementForConsumptionSplitType: UnitOfMeasurementType[] = [
    UnitOfMeasurementType.kWh,
    UnitOfMeasurementType.kVA,
    UnitOfMeasurementType.kVArh,
    UnitOfMeasurementType.CubicMeter,
    UnitOfMeasurementType.kL
  ];
  @Input() buildingPeriodIsFinalized: boolean;
  
  private subscription$: Subscription;
  private registersSubscription: Subscription;
  private unitOfMeasurementsSubscription: Subscription;

  constructor(
    private store: Store<fromNodeState.State>,
    private commonStore: Store<CommonDataState>,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new nodeActions.GetAllUnits());
    this.registersSubscription = this.commonStore.pipe(select(fromStore.getRegisters)).subscribe(registers => {
      this.registers = registers || [];
    });

    this.subscription$ = this.store.pipe(select(fromNodeState.getCostAllocationUnits)).subscribe(res => {

      if (res.splitType === SplitType.Consumption) {
        this.setRegistersCountForAllocatedUnits(res);
      }

      this.node = res;
      this.isSelectedAllUnits = false;

      this.unitOfMeasurementsSubscription = this.commonStore.pipe(select(fromStore.getUnitsOfMeasurement)).subscribe(unitOfMeasurements => {
        this.unitOfMeasurements =
          unitOfMeasurements.filter(item => this.allowedUnitsOfMeasurementForConsumptionSplitType.includes(item.unitType));

        if (this.node && this.node.splitType === SplitType.Consumption) {
          this.selectedRegister = this.node.consumptionSplitTypeUnitOfMeasurement || UnitOfMeasurementType.kWh;
          this.hasAllocatedRegister = this.node.allocatedUnits.some(val => val.registersCount != 0);
        }
      });
    });

  }

  ngOnDestroy() {
    this.unitOfMeasurementsSubscription && this.unitOfMeasurementsSubscription.unsubscribe();
    this.subscription$ && this.subscription$.unsubscribe();
  }

  search(ev) {
    this.query = ev;
  }

  onSelectedAll() {
    this.checkedAllPartly = false;
    this.node.allocatedUnits.forEach(el => el.isSelected = this.isSelectedAllUnits);
  }

  onSelectedItem() {
    this.isSelectedAllUnits = !this.node.allocatedUnits.some(el => !el.isSelected);
  }

  onSort(fieldName) {
    if (this.sortProperty === fieldName) {
      this.sortIndex *= -1;
    } else {
      this.sortProperty = fieldName;
      this.sortIndex = 1;
    }
  }

  onAddUnits(units: ShopViewModel[]) {
    const allocatedUnits = [];
    units.forEach(el => {
      const allocatedUnit = {
        id: el.id,
        name: el.name,
        floor: el.floor,
        tenantName: el.tenant ? el.tenant.name : '',
        unitType: el['unitType'],
        allocationShare: null,
        area: el.area,
        isLiable: true,
        meterIds: [],
        usage: 0,
        registersCount: 0,
        isNew: true
      };
      allocatedUnits.push(allocatedUnit);
    });
    this.node.allocatedUnits = this.node.allocatedUnits.concat(allocatedUnits);
  }

  onAddMeters(meters: any[]) {
    const metersIds = meters.map(el => el.id);
    this.node.allocatedUnits.forEach(unit => {
      if (unit.isSelected) {
        unit.meterIds = [...new Set(unit.meterIds.concat(metersIds))];
      }
    });
  }

  onLiableChanged(aUnit, status) {
    aUnit.isLiable = status;
  }

  onDeleteUnit(aUnit) {
    this.node.allocatedUnits = this.node.allocatedUnits.filter(el => el !== aUnit);
  }

  onSave(event) {
    const data: CostAllocationNodeModel = {
      nodeId: this.node.id,
      splitType: this.node.splitType,
      ownersLiability: this.node.ownersLiability,
      includeVacant: this.node.includeVacant,
      includeNotLiable: this.node.includeNotLiable,
      consumptionSplitTypeUnitOfMeasurement:
        this.node.splitType === SplitType.Consumption ? this.selectedRegister : null,
      allocatedUnits: []
    };

    data.allocatedUnits = this.node.allocatedUnits.map(el => ({
      allocationShare: el.allocationShare,
      id: el.id,
      isLiable: el.isLiable,
      unitType: el.unitType,
      meterIds: el.meterIds,
      consumptionCostNodeInfo: el.consumptionCostNodeInfo
    }));

    this.store.dispatch(new nodeActions.SaveNodeCostAllocation({
      comment: event.comment, versionDate: event.date, action: event.actionType, entity: data
    }));
  }

  onAddRegister(isSelected: boolean, aUnit?: AllocatedUnitViewModel[]) {
    if (this.node.allocatedUnits.some(item => item.isNew)) {
      const modalRef = this.modalService.open(ConfirmDialogComponent, {backdrop: 'static'});
      modalRef.componentInstance.popupText = 'There are unsaved allocated units and these units will be deleted if you proceed!';
      modalRef.result.then(() => {
        this.openAddUnitRegistersPopup(isSelected, aUnit);
      }, () => {
      });
    } else {
      this.openAddUnitRegistersPopup(isSelected, aUnit);
    }
  }

  openAddUnitRegistersPopup(isSelected: boolean, aUnit?: AllocatedUnitViewModel[]) {
    let unitArr = [];

    if (isSelected) {
      const units = this.node.allocatedUnits.filter(u => u.isSelected);
      unitArr = units && units.length ? units.map(u => u.id) : [];
    } else {
      unitArr = aUnit.map(u => u.id);
    }
    const filterData = new SearchFilterUnits();
    const unitOfMeasurementFilter = this.selectedRegister || -1;
    filterData.unitIds = unitArr;
    filterData.unitAll = unitArr;
    filterData.unitOfMeasurementFilter = unitOfMeasurementFilter;
    filterData.selectedData =
      this.node.allocatedUnits.flatMap(item => item.consumptionCostNodeInfo.map(n => ({...n, unitId: item.id}))) || [];

    this.store.dispatch(new nodeActions.ToggleUnitPopup({filterData}));
    this.store.dispatch(new nodeActions.ModalPopup());
  }

  onDeleteUnits() {
    this.node.allocatedUnits = this.node.allocatedUnits.filter(el => !el.isSelected);
  }

  onToggleShowNode(id: string) {
    this.store.dispatch(new nodeActions.ToggleNodeInfo(id));
  }

  onChangeHowToSplit() {
    this.store.dispatch(new nodeActions.ChangeNodeSplitType({
      splitType: this.node.splitType,
      allocatedUnits: this.node.allocatedUnits
    }));
    this.selectedRegister = this.node.splitType === SplitType.Consumption
      ? this.selectedRegister
      : -1;
  }

  setRegistersCountForAllocatedUnits(node: NodeDetailViewModel): void {
    for (const allocatedUnit of node.allocatedUnits) {
      allocatedUnit.registersCount = allocatedUnit.consumptionCostNodeInfo?.flatMap(item => item.registerId)?.length || 0;
    }
  }

  splitByConsumptionRegisterChange(unitOfMeasurement: UnitOfMeasurement): void {
    const registersMap = this.registers.reduce((object, item) => {
        object[item.id] = item;

        return object;
      },
      {});

    for (const allocatedUnit of this.node.allocatedUnits) {
      allocatedUnit.consumptionCostNodeInfo =
        (allocatedUnit.consumptionCostNodeInfo || []).filter(item =>
          registersMap[item.registerId].unitOfMeasurement === unitOfMeasurement.unitType);
    }

    this.setRegistersCountForAllocatedUnits(this.node);
  }

  getTotalAllocationShare() {
    let total = 0;
    this.node.allocatedUnits.forEach(unit => {
      total = total + (unit.allocationShare ?? 0);
    })
    return total;
  }
}
