import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';

import {
  BrandViewModel,
  EquipmentGroupViewModel,
  EquipmentTemplateListItemViewModel,
  FieldType,
  SupplyType
} from '@models';
import {
  AssignFilter,
  BuildingEquipTemplateFilterDetailViewModel,
  OrderEquipmentTemplate
} from '../../shared/models/equipment.model';

import * as fromEquipmentTemplate from '../../shared/store/reducers';
import * as equipmentTemplateAction from '../../shared/store/actions/building-equip-template.action';
import * as commonStore from '../../../shared/store/selectors/common-data.selectors';

@Component({
  selector: 'equipment-template-list',
  templateUrl: './equipment-template-list.component.html',
  styleUrls: ['./equipment-template-list.component.less']
})
export class EquipmentTemplateListComponent implements OnInit {

  equipmentTemplateList$: Observable<EquipmentTemplateListItemViewModel[]>;
  page$: Observable<number>;
  unitsPerPage$: Observable<number | null>;
  filterDetail$: Observable<BuildingEquipTemplateFilterDetailViewModel>;
  allEquipmentTemplateModels$: Observable<string[]>;
  totalCount$: Observable<number>;

  selectedUnitsPerPageText$: Observable<string>;
  selectedAssignFilterText$: Observable<string>;
  assignedEquipmentTemplatesCount$: Observable<number>;

  selectedBrandText$: Observable<string>;
  selectedEquipmentGroupText$: Observable<string>;
  selectedModelText$: Observable<string>;

  showFilter: boolean = false;

  orderIndex: number = 1;
  unitsPerPageList = [30, 50, 100];

  supplyType = SupplyType;
  orderType = OrderEquipmentTemplate;
  fieldType = FieldType;
  buildingPeriodIsFinalized: boolean;

  constructor(private store: Store<fromEquipmentTemplate.State>) {
    this.store.dispatch(new equipmentTemplateAction.ResetForm());

    this.equipmentTemplateList$ = this.store.select(fromEquipmentTemplate.getEquipmentTemplates);
    this.totalCount$ = this.store.select(fromEquipmentTemplate.getTotal);
    this.page$ = this.store.select(fromEquipmentTemplate.getEquipmentTemplatePage);
    this.unitsPerPage$ = this.store.select(fromEquipmentTemplate.getEquipmentTemplateUnitsPerPage);
    this.selectedUnitsPerPageText$ = this.store.select(fromEquipmentTemplate.getEquipmentTemplateUnitsPerPage).pipe(map(s => s != null ? s.toString() : 'ALL'));
    this.assignedEquipmentTemplatesCount$ = this.store.select(fromEquipmentTemplate.getAssignedEquipmentTemplatesCount);
    this.selectedAssignFilterText$ = this.store.select(fromEquipmentTemplate.getAssignFilter).pipe(map(s => {
      switch (s) {
        case AssignFilter.OnlyAddedEquipment:
          return 'Only added equipment';

        case AssignFilter.NotAddedEquipment:
          return 'Not added equipment';

        default:
          return 'All equipment';
      }
    }));
    this.selectedBrandText$ = this.store.select(fromEquipmentTemplate.getFilterDetail).pipe(map(f => {
      return f.checkedBrand != null ? f.checkedBrand.name : '';
    }));
    this.selectedEquipmentGroupText$ = this.store.select(fromEquipmentTemplate.getFilterDetail).pipe(map(f => {
      return f.checkedEquipmentGroup != null ? f.checkedEquipmentGroup.name : '';
    }));
    this.selectedModelText$ = this.store.select(fromEquipmentTemplate.getFilterDetail).pipe(map(f => {
      return f.checkedModel != null ? f.checkedModel : "";
    }));
    this.filterDetail$ = this.store.select(fromEquipmentTemplate.getFilterDetail);
    this.allEquipmentTemplateModels$ = this.store.select(fromEquipmentTemplate.getAllEquipmentTemplateModels);
  }

  ngOnInit() {
    this.store.dispatch(new equipmentTemplateAction.InitFilterData());
    this.store.pipe(select(commonStore.getIsFinalized))
      .subscribe(res => {this.buildingPeriodIsFinalized = res});
  }

  search(term: string): void {
    this.store.dispatch(new equipmentTemplateAction.UpdateSearchKey(term));
  }

  onShowFilter() {
    this.showFilter = !this.showFilter;
  }

  onUnitsPerPageChanged(val: number) {
    this.store.dispatch(new equipmentTemplateAction.UpdateUnitsPerPage(val));
  }

  changeOrderIndex(idx) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1)))
      this.orderIndex *= -1;
    else
      this.orderIndex = idx;

    this.store.dispatch(new equipmentTemplateAction.UpdateOrder(this.orderIndex));
  }

  onAddRemoveEquipmentTemplate(equipmentTemplateId: string, flag: boolean) {
    if(this.buildingPeriodIsFinalized) return false;
    if (flag) {
      this.store.dispatch(new equipmentTemplateAction.RemoveEquipmentTemplate(equipmentTemplateId));
    } else {
      this.store.dispatch(new equipmentTemplateAction.AddEquipmentTemplate(equipmentTemplateId));
    }
  }

  onPageChange(page: number) {
    this.store.dispatch(new equipmentTemplateAction.UpdatePage(page));
  }

  onShowEquipmentChanged(value: number) {
    this.store.dispatch(new equipmentTemplateAction.UpdateIsAssignedFilter(value));
  }

  onSupplyTypeChanged(isChecked: boolean, idx: number) {
    this.store.dispatch(new equipmentTemplateAction.UpdateSupplyType({isChecked: isChecked, idx: idx}));
  }

  onAllSupplyTypesChanged() {
    this.store.dispatch(new equipmentTemplateAction.UpdateAllSupplyTypes());
  }

  onEquipmentGroupChanged(equipmentGroup: EquipmentGroupViewModel) {
    this.store.dispatch(new equipmentTemplateAction.UpdateEquipmentGroup(equipmentGroup));
  }

  onBrandChanged(brand: BrandViewModel) {
    this.store.dispatch(new equipmentTemplateAction.UpdateBrand(brand));
  }

  onModelChanged(model: string) {
    this.store.dispatch(new equipmentTemplateAction.UpdateModel(model));
  }

  onAttributeChanged(attr) {
    this.store.dispatch(new equipmentTemplateAction.UpdateAttribute(attr));
  }

  onIsOldModelChanged() {
    this.store.dispatch(new equipmentTemplateAction.UpdateIsOldModel());
  }

  onApply() {
    this.store.dispatch(new equipmentTemplateAction.RequestEquipmentTemplateList());
  }

  onResetFilter() {
    this.store.dispatch(new equipmentTemplateAction.ResetFilter());
  }

}
