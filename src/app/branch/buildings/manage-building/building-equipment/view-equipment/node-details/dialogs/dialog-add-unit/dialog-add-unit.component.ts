import {ConsumptionCostNodeInfo} from './../../../../shared/models/node.model';
import {kWhTimeOfUseName, TimeOfUse} from './../../../../../../../../shared/models/time-of-use.model';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {
  SearchFilterUnits,
  SearchFilterUnitsModel
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import * as buildingCommonState from '@app/branch/buildings/manage-building/shared/store/state/common-data.state';
import {Observable, Subject} from 'rxjs';
import {
  RegisterViewModel,
  SupplyType,
  SupplyTypeDropdownItems,
  UnitOfMeasurement,
  UnitOfMeasurementType
} from '@models';
import * as nodeActions
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/actions/node.actions';
import * as fromNode from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers';
import {switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'dialog-add-unit',
  templateUrl: './dialog-add-unit.component.html',
  styleUrls: ['./dialog-add-unit.component.less']
})
export class DialogAddUnitComponent implements OnInit, OnDestroy {
  @Input() model: SearchFilterUnitsModel[];
  unitsFilter: Array<{ id: string; name: string }> = [];
  supplyToFilter: Array<{ id: string; name: string }> = [];
  filterData: SearchFilterUnits = new SearchFilterUnits();
  public isAllSelected = false;
  supplyTypeDropdownItems = SupplyTypeDropdownItems;
  public registers$: Observable<RegisterViewModel[]>;
  supplyType = SupplyType;
  unitsOfMeasurement: UnitOfMeasurement[];
  unitFilter$: Observable<SearchFilterUnits>;
  @Output() emitUnit: EventEmitter<string> = new EventEmitter<string>();
  units: string[];
  timeOfUseDropdownItems = Object.keys(TimeOfUse).filter(item => !isNaN(Number(item))).map(item => ({
    id: Number(item),
    name: kWhTimeOfUseName[item]
  }));
  selectedUnitOfMeasurement: number;
  public unitOfMeasurementType = UnitOfMeasurementType;
  public selectedData: ConsumptionCostNodeInfo[] = [];
  public isFilterChanged: boolean = false;
  private readonly DEFAULT_VALUE: string = '-1';
  selectedUnitId = this.DEFAULT_VALUE;
  timeOfUseFilter = this.DEFAULT_VALUE;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public ngbModal: NgbActiveModal,
    private store$: Store<buildingCommonState.State>
  ) {
  }

  ngOnInit(): void {
    // Get Filter Popup
    this.store$.pipe(select(fromNode.getUnitFilter)).pipe(switchMap(filter => {
      this.filterData = filter;
      this.filterData.supplyToIdFilter = !filter.supplyToIdFilter ? this.DEFAULT_VALUE : filter.supplyToIdFilter;
      this.units = [...filter.unitAll];
      this.selectedUnitOfMeasurement = this.filterData.unitOfMeasurementFilter;

      return this.store$.pipe(select(fromNode.getUnitModal));
    }), takeUntil(this.destroy$)).subscribe(units => {
      // GET Popup model
      this.model = units;

      this.getFilterData();
      this.updateSelectedRegisters();
      this.updateIsAllSelected();
    });
  }

  search(searchTerm: string) {
    this.filterData.searchKey = searchTerm;
    this.onChangeFilterData();
  }

  onSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    this.model = this.model.map(m => ({
      ...m,
      nodesInfo: m.nodesInfo.map(node => ({
        ...node,
        registers: node.registers.map(r => ({...r, isSelected: this.isAllSelected}))
      }))
    }));

    this.storeSelectedData();
  }

  onAdd() {
    if (this.model?.length) {
      const selectedModel = [];

      for (let a = 0; a < this.model.length; a++) {
        selectedModel.push({
          ...this.model[a],
          nodesInfo: this.model[a].nodesInfo.map(item => ({
            ...item,
            registers: item.registers?.filter(r => r.isSelected) || []
          }))
        });
      }

      this.store$.dispatch(new nodeActions.AddRegistersToUnits(selectedModel));
    }

    this.ngbModal.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onChangeFilterData() {
    if (!this.isFilterChanged) {
      this.storeSelectedData();
    }

    this.isFilterChanged = true;

    this.store$.dispatch(new nodeActions.ToggleUnitPopup({
      filterData: {
        unitIds: this.selectedUnitId === this.DEFAULT_VALUE ? this.units : [this.selectedUnitId],
        unitAll: this.units,
        searchKey: this.filterData.searchKey,
        unitOfMeasurementFilter: this.selectedUnitOfMeasurement,
        supplyTypeFilter: this.filterData.supplyTypeFilter,
        supplyToIdFilter: this.filterData.supplyToIdFilter === this.DEFAULT_VALUE ? null : this.filterData.supplyToIdFilter,
        nodeTypeFilter: this.filterData.nodeTypeFilter,
        timeOfUseFilter: this.filterData.timeOfUseFilter,
        selectedData: this.selectedData
      }
    }));
  }

  onSelectedDataChanged(): void {
    this.storeSelectedData();
  }

  updateSelectedRegisters() {
    for (const unit of this.model) {
      for (const nodeInfo of unit.nodesInfo) {
        for (const register of nodeInfo.registers) {
          if (this.filterData.selectedData.find(item =>
            item.unitId === unit.unitId &&
            item.id === nodeInfo.id &&
            item.registerId === register.id)) {
            register.isSelected = true;
          } else {
            register.isSelected = false;
          }
        }
      }
    }
  }

  updateIsAllSelected() {
    const allRegisters = this.model.flatMap(unit => unit.nodesInfo.flatMap(node => node.registers));

    this.isAllSelected = allRegisters.length === allRegisters.filter(item => item.isSelected).length;
  }

  storeSelectedData() {
    if (this.isFilterChanged) {
      const currentSelectedData = this.getSelectionData(true);
      const currentSelectionData = this.getSelectionData(false).concat(currentSelectedData);
      const filteredSelectedData = this.selectedData.filter(item => !currentSelectionData.some(i => this.areCostNodesInfoEqual(i, item)));

      this.selectedData = filteredSelectedData.concat(currentSelectedData);
    } else {
      this.selectedData = this.getSelectionData(true);
    }

    this.updateIsAllSelected();
  }

  areCostNodesInfoEqual(item: ConsumptionCostNodeInfo, item2: ConsumptionCostNodeInfo): boolean {
    return item.id === item2.id && item.registerId === item2.registerId && item.unitId === item2.unitId;
  }

  getSelectionData(isSelected: boolean): ConsumptionCostNodeInfo[] {
    return this.model.flatMap(unit => unit.nodesInfo.reduce((accumulator, node) => {
        accumulator.push(...node.registers.filter(register => !!register.isSelected === isSelected).map(register => ({
          id: node.id,
          unitId: unit.unitId,
          registerId: register.id,
        })));

        return accumulator;
      }, [])
    );
  }

  private getFilterData() {
    this.unitsFilter = this.model.reduce((modelPrev, model) => {
      modelPrev.push({id: model.unitId, name: model.unitName});
      model.nodesInfo.forEach(node => {
        const supplyTo = node.supplyToInfo;

        if (supplyTo && !this.supplyToFilter.some((s) => s.name === supplyTo.name)) {
          this.supplyToFilter.push({
            id: supplyTo.id,
            name: supplyTo.name
          });
        }
      });

      return modelPrev;
    }, []);
  }
}
