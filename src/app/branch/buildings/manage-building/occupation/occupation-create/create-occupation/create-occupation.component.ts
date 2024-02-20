import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Router} from '@angular/router';

import {NgbNavChangeEvent, NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {IWizardComponent} from 'app/shared/wizard/IWizardComponent';
import {OccupationWizardTabType} from '../../shared/models/occupation-wizard-tab-type.model';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import * as fromOccupation from '../../shared/store/reducers';
import * as occupationAction from '../../shared/store/actions/occupation.actions';
import * as buildingStepWizardAction from '../../shared/store/actions/building-step-wizard.actions';
import * as fromSelectors from '../../shared/store/selectors';
import * as equipmentTemplateAction
  from '../../../building-equipment/shared/store/actions/building-equip-template.action';
import * as commonData from '../../../shared/store/selectors/common-data.selectors';
import {
  CommonAreaLiabilityViewModel,
  CommonAreaViewModel,
  EquipmentTemplateListItemViewModel,
  LiabilityViewModel,
  LocationViewModel,
  OccupationViewModel,
  ShopViewModel,
  VersionActionType
} from '@models';
import {BuildingPeriodViewModel} from '../../../shared/models/building-period.model';
import {BranchManagerService} from '@services';

@Component({
  selector: 'create-occupation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-occupation.component.html',
  styleUrls: ['./create-occupation.component.less']
})
export class CreateOccupationComponent implements OnInit, AfterViewInit {

  buildingPeriod$: Observable<BuildingPeriodViewModel>;
  shops$: Observable<ShopViewModel[]>;
  shopsWithFilteringAndSerchByNameAndTenant$: Observable<ShopViewModel[]>;
  shopWithFilteringAndSearching$: Observable<ShopViewModel[]>;
  locations$: Observable<LocationViewModel[]>;
  equipmentTemplates$: Observable<EquipmentTemplateListItemViewModel[]>;
  equipmentTemplatesSearchKey$: Observable<string>;
  tariffs$: Observable<any[]>;

  commonAreas$: Observable<CommonAreaViewModel[]>;
  commonAreasDefault: CommonAreaViewModel[];
  commonAreaWithSearching$: Observable<CommonAreaViewModel[]>;
  commonAreasShopsData$: Observable<any>;

  commonAreaLiablities$: Observable<CommonAreaLiabilityViewModel[]>;
  selectedCommonAreaLiablity$: Observable<CommonAreaLiabilityViewModel>;
  selectedCommonAreaLiablityServiceType$: Observable<string>;
  selectedCommonAreaLiablityService$: Observable<LiabilityViewModel>;

  liabilityShopFilterBy$: Observable<number>;
  liabilityShopSearchTerm$: Observable<string>;
  isComplete$: Observable<boolean>;

  shopCount$: Observable<number>;
  shopOrderIndex$: Observable<number>;

  commonAreaCount$: Observable<number>;
  commonAreaOrderIndex$: Observable<number>;

  locationOrderIndex$: Observable<number>;
  assignedEquipmentTemplatesCount$: Observable<number>;
  buildingId$: Observable<string>;
  branchId: string;

  @ViewChild('nav', {static: true}) tabs: NgbNav;
  @ViewChildren('wizardComponent') components: QueryList<IWizardComponent>;
  steps: IWizardComponent[];

  model: OccupationViewModel;

  TabType = OccupationWizardTabType;
  tabId = OccupationWizardTabType.BuildingPeriod;
  private navigateFromButton = false;

  constructor(
    private store: Store<fromOccupation.State>,
    private router: Router,
    private branchManager: BranchManagerService
  ) {
    this.store.dispatch(new equipmentTemplateAction.ResetForm());
    this.store.dispatch(new equipmentTemplateAction.UpdateUnitsPerPage(null));

    this.buildingPeriod$ = store.select(fromOccupation.getBuildingPeriod);
    this.shops$ = store.select(fromOccupation.getShopsWithFilteringByStatus);
    this.shopsWithFilteringAndSerchByNameAndTenant$ = store.select(fromOccupation.shopsWithFilteringAndSerchByNameAndTenant);
    this.shopWithFilteringAndSearching$ = store.select(fromOccupation.getShopWithFilteringAndSearching);
    this.commonAreas$ = store.select(fromOccupation.getCommonAreas);
    this.selectedCommonAreaLiablity$ = store.select(fromOccupation.getSelectedCommonAreaLiability);
    this.commonAreaLiablities$ = store.select(fromOccupation.getCommonAreaLiabilities);
    this.selectedCommonAreaLiablityService$ = store.select(fromOccupation.getSelectedCommonAreaLiabilityService);
    this.selectedCommonAreaLiablityServiceType$ = store.select(fromOccupation.getSelectedCommonAreaLiabilityServiceType)
      .pipe(map(serviceType => serviceType.toString()));

    this.commonAreaWithSearching$ = store.select(fromOccupation.getCommonAreaWithSearchingAndFilteringShops);
    this.commonAreasShopsData$ = store.select(fromOccupation.getCommonAreaShopRelations);
    this.liabilityShopFilterBy$ = store.select(fromOccupation.getLiabilityShopFilter);
    this.liabilityShopSearchTerm$ = store.select(fromOccupation.getLiabilityShopSearchTerm);
    this.isComplete$ = store.select(fromOccupation.getCompleteStatus);
    this.shopCount$ = store.select(fromOccupation.getShopCount);
    this.commonAreaCount$ = store.select(fromOccupation.getCommonAreaCount);
    this.shopOrderIndex$ = store.select(fromOccupation.getShopOrderIndex);
    this.commonAreaOrderIndex$ = store.select(fromOccupation.getCommonAreaOrderIndex);
    this.locations$ = store.select(fromSelectors.getSortedLocations);
    this.locationOrderIndex$ = store.select(fromSelectors.getLocationOrderIndex);

    this.equipmentTemplates$ = store.select(fromOccupation.getEquipmentTemplates);
    this.equipmentTemplatesSearchKey$ = store.select(fromOccupation.getEquipmentTemplateSearchKey);
    this.assignedEquipmentTemplatesCount$ = store.select(fromOccupation.getAssignedEquipmentTemplatesCount);

    this.tariffs$ = store.select(fromOccupation.getEquipmentTemplates);
    this.buildingId$ = store.select(commonData.getBuildingId);
    this.branchId = this.branchManager.getBranchId();
  }

  ngOnInit() {
    this.store.dispatch(new equipmentTemplateAction.RequestEquipmentTemplateList());
  }

  ngAfterViewInit() {
    this.steps = this.components.toArray();
  }

  getCurrentIdx(): number {
    return parseInt(this.tabs.activeId) | 0;
  }

  public beforeChange(event: NgbNavChangeEvent) {

    const currentStep: number = +event.activeId;
    const nextStep: number = +event.nextId;

    if (nextStep > currentStep && !this.navigateFromButton) {
      event.preventDefault();
    } else {
      this.store.dispatch(new occupationAction.ResetFilters());
    }

    if (nextStep < currentStep && currentStep === 2) {
      this.onSetDefaultCommonArea();
    }

    this.navigateFromButton = false;
  }

  onNext(data: any) {
    this.navigateFromButton = true;

    const nextId = this.getCurrentIdx() + 1;
    this.tabs.select(nextId.toString());
  }

  onPrevious(data: any) {
    const branchId = this.branchManager.getBranchId();
    this.router.navigate(['/branch', branchId, 'buildings']);
  }

  onDeleteShop(event) {
    this.store.dispatch(new occupationAction.DeleteShop(event));
  }

  onAddCommonAreaShop(event) {
    this.store.dispatch(new occupationAction.AddCommonAreaShop(event));
  }

  onDeleteCommonAreaShop(event) {
    this.store.dispatch(new occupationAction.DeleteCommonAreaShop(event));
  }

  onUpdateShopSearchTerm(event) {
    this.store.dispatch(new occupationAction.UpdateShopSearchTerm(event));
  }

  onUpdateCommonAreaSearchTerm(event) {
    this.store.dispatch(new occupationAction.UpdateCommonAreaSearchTerm(event));
  }

  onUpdateShopConnectFilter(event) {
    this.store.dispatch(new occupationAction.UpdateShopConnectFilter(event));
  }

  onCheckAllCommonAreaShops(event) {
    this.store.dispatch(new occupationAction.CheckAllCommonAreaShops(event));
  }

  onUncheckAllCommonAreaShops(event) {
    this.store.dispatch(new occupationAction.UncheckAllCommonAreaShops(event));
  }

  onCheckAllShopCommonAreas(event) {
    this.store.dispatch(new occupationAction.CheckAllShopCommonAreas(event));
  }

  onAddShop() {
    this.store.dispatch(new occupationAction.AddShop());
  }

  onUpdateShop($event) {
    this.store.dispatch(new occupationAction.UpdateShop($event));
  }

  onUncheckAllShopCommonAreas(event) {
    this.store.dispatch(new occupationAction.UncheckAllShopCommonAreas(event));
  }

  onAddCommonAreas($event) {
    this.store.dispatch(new occupationAction.AddCommonAreas($event));
  }

  onUpdateCommonArea($event) {
    this.store.dispatch(new occupationAction.UpdateCommonArea($event));
  }

  onGetDefaultCommonAreas(defaultCommonAreas: CommonAreaViewModel[]) {
    this.commonAreasDefault = defaultCommonAreas;
  }

  onSetDefaultCommonArea() {
    const areaIds = this.commonAreasDefault.map(el => el.id);
    this.store.dispatch(new occupationAction.ReturnDefaultFormAreaValue({
      areaIds: areaIds,
      defaultAreas: this.commonAreasDefault
    }));
  }

  onDeleteCommonArea($event) {
    this.store.dispatch(new occupationAction.DeleteCommonArea($event));
  }

  onSetVacantStatusForShops($event) {
    this.store.dispatch(new occupationAction.SetVacantStatusForShops($event));
  }

  onSetSpareStatusForShops($event) {
    this.store.dispatch(new occupationAction.SetSpareStatusForShops($event));
  }

  onSetUnspareStatusForShops($event) {
    this.store.dispatch(new occupationAction.SetUnspareStatusForShops($event));
  }

  onMergeShops($event) {
    this.store.dispatch(new occupationAction.MergeShops($event));
  }

  onSplitShop($event) {
    this.store.dispatch(new occupationAction.SplitShop($event));
  }

  onUpdateShopStatusFilter(event) {
    this.store.dispatch(new occupationAction.UpdateShopStatusFilter(event));
  }

  onCommonAreaLiabilityChange($event) {
    this.store.dispatch(new occupationAction.CommonAreaLiabilitySelected($event));
  }

  onCommonAreaLiabilityServiceTypeChange($event) {
    this.store.dispatch(new occupationAction.CommonAreaLiabilityServiceSelected($event));
  }

  onOwnerLiabilityChanged($event) {
    this.store.dispatch(new occupationAction.UpdateOwnerLiabilityForService($event));
  }

  onIncludeNotLiableShopsChanged($event) {
    this.store.dispatch(new occupationAction.UpdateIncludeNotLiableShopsChangedForService($event));
  }

  onIncludeVacantShopSqMChanged($event) {
    this.store.dispatch(new occupationAction.UpdateIncludeVacantShopSqMChangedForService($event));
  }

  onDefaultSettingsChanged($event) {
    this.store.dispatch(new occupationAction.UpdateLiabilityDefaultSetting($event));
  }

  onUpdateShopAllocation($event) {
    this.store.dispatch(new occupationAction.UpdateShopAllocation($event));
  }

  onUpdateShopTermSearch($event) {
    this.store.dispatch(new occupationAction.UpdateLiabilityShopSearchTerm($event));
  }

  onUpdateShopFilter($event) {
    this.store.dispatch(new occupationAction.UpdateLiabilityShopFilter($event));
  }

  onUpdateSplit($event) {
    this.store.dispatch(new occupationAction.UpdateLiabilitySplit($event));
  }

  onUpdateShopLiability($event) {
    this.store.dispatch(new occupationAction.UpdateShopLiable($event));
  }

  onSaveDraft() {
    this.store.dispatch(new occupationAction.SaveOccupation({
      action: VersionActionType.Init,
      comment: null,
      startDate: null
    }));
  }

  onFinalSave() {
    this.store.dispatch(new occupationAction.SaveOccupation({
      action: VersionActionType.Insert,
      comment: null,
      startDate: null
    }));
  }

  onUpdateCommonAreaServices($event) {
    this.store.dispatch(new occupationAction.UpdateCommonAreaServices($event));
  }

  onUpdateShopOrderIndex($event) {
    this.store.dispatch(new occupationAction.UpdateShopOrder($event));
  }

  onUpdateCommonAreaOrderIndex($event) {
    this.store.dispatch(new occupationAction.UpdateCommonAreaOrder($event));
  }

  onCreateLocation($event) {
    this.store.dispatch(new buildingStepWizardAction.AddLocation($event));
  }

  onUpdateLocation($event) {
    this.store.dispatch(new buildingStepWizardAction.UpdateLocation($event));
  }

  onDeleteLocation($event) {
    this.store.dispatch(new buildingStepWizardAction.DeleteLocation($event));
  }

  onUpdateLocationOrderIndex($event) {
    this.store.dispatch(new buildingStepWizardAction.UpdateLocationOrder($event));
  }

  onUpdateLocationSequenceNumber($event) {
    this.store.dispatch(new buildingStepWizardAction.UpdateLocationSequenceNumber($event));
  }

  onEquipmentTemplatesSearch(term: string): void {
    this.store.dispatch(new equipmentTemplateAction.UpdateSearchKey(term));
  }

  onChangeEquipmentTemplatesOrderIndex(orderIndex) {
    this.store.dispatch(new equipmentTemplateAction.UpdateOrder(orderIndex));
  }

  onAddEquipmentTemplate(equipmentTemplateId) {
    this.store.dispatch(new equipmentTemplateAction.AddEquipmentTemplate(equipmentTemplateId));
  }

  onRemoveEquipmentTemplate(equipmentTemplateId) {
    this.store.dispatch(new equipmentTemplateAction.RemoveEquipmentTemplate(equipmentTemplateId));
  }

  onUpdateBuildingPeriod(model: BuildingPeriodViewModel) {
    this.store.dispatch(new occupationAction.UpdateBuildingPeriod(model));
  }
}
