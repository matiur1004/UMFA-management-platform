import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';

import {ShopStatus, ShopViewModel, TenantShopHistoryViewModel, TenantViewModel} from '@models';
import {ShopHelper} from '../../../shared/helpers/shop.helper';
import * as fromOccupation from '../../../shared/store/reducers';
import * as occupationAction from '../../../shared/store/actions/occupation.actions';
import {floorValidator} from 'app/shared/validators/floor.validator';
import {NotificationService} from 'app/shared/services/notification.service';
import {SplitShopComponent} from '../../../occupation-create/dialogs/split-shop/split-shop.component';
import {RentDetailsComponent} from '../../../occupation-create/dialogs/rent-details/rent-details.component';
import * as buildingCommonData from '../../../../shared/store/selectors/common-data.selectors';

@Component({
  selector: 'view-shops',
  templateUrl: './view-shops.component.html',
  styleUrls: ['./view-shops.component.less'],
})
export class ViewShopsComponent implements OnChanges, OnInit, OnDestroy {

  @Input() allShops: ShopViewModel[];
  @Input() shops: ShopViewModel[];
  @Input() tenantShopHistory: TenantShopHistoryViewModel[];
  @Input() canEdit: boolean;
  @Input() buildingId: string;
  @Input() orderIndex: number;

  @Output() addShop = new EventEmitter<any>();
  @Output() deleteShop = new EventEmitter();
  @Output() updateShop = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() save = new EventEmitter();

  @Output() setVacantStatusForShops = new EventEmitter();
  @Output() setSpareStatusForShops = new EventEmitter();
  @Output() setUnspareStatusForShops = new EventEmitter();
  @Output() mergeShops = new EventEmitter();
  @Output() splitShop = new EventEmitter();
  @Output() updateShopStatusFilter = new EventEmitter<number>();
  @Output() updateShopSearchTerm = new EventEmitter();
  @Output() updateShopRentDetails = new EventEmitter();

  @Output() openShopHistory = new EventEmitter();
  @Output() closeShopHistory = new EventEmitter();

  @Output() updateShopOrderIndex = new EventEmitter<number>();

  form: FormGroup;
  isFormInitialized = false;
  shopStatus = ShopStatus;
  isSort = false;

  checkedAll = false;
  checkedAllPartly = false;
  currentTenants: TenantViewModel[] = new Array<TenantViewModel>();
  tenants: TenantViewModel[];
  filterBy = 'All shops';
  tenantsSubj: Subscription;
  historySubj: Subscription;
  showActionMenu = false;
  shopsInfoText = '';
  shopsFromModel: ShopViewModel[];
  buildingPeriodIsFinalized$: Observable<any>;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private store: Store<fromOccupation.State>,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute) {
    this.tenantsSubj = store.select(fromOccupation.getTenants).subscribe((tenants) => {
      this.tenants = tenants;
    });
  }

  ngOnInit() {
    this.historySubj = this.store.select(fromOccupation.getCurrentHistory).subscribe((_) => {
      this.createForm(this.shops);
      this.shopsFromModel = this.shops;
      this.isFormInitialized = true;
      this.setCheckedAllByDefault();
    });

    this.updateActionPanel();
    this.store.dispatch(new occupationAction.SetTenants());
    this.buildingPeriodIsFinalized$ = this.store.pipe(select(buildingCommonData.getIsFinalized));
  }

  ngOnDestroy(): void {
    this.tenantsSubj.unsubscribe();
    this.historySubj.unsubscribe();
  }

  onFilterBy(filterLbl: string, filterIdx: number) {
    this.filterBy = filterLbl;
    this.updateShopStatusFilter.emit(filterIdx);
  }

  onChanges(): void {
    (<FormArray>this.form.controls['shops']).controls.forEach(form => {
      form.valueChanges.subscribe(shop => this.onShopValueChanged(shop));
    });
  }

  onGetShopHistory(shopId: string, shop: ShopViewModel) {
    this.store.dispatch(new occupationAction.RequestGetShopHistory(shopId));
  }

  tenantChanged(tenant, shopId, idx, shopControl) {
    shopControl.controls['tenant'].controls['name'].setValue(tenant.name);
    shopControl.controls['tenant'].controls['id'].setValue(tenant.id);

    this.currentTenants[idx] = tenant;
    this.updateShop.emit({id: shopId, path: 'tenant.id', value: tenant.id});
  }

  ngOnChanges() {
    if ((this.shops.length !== 0 && !this.isFormInitialized ||
      this.form && this.form.controls && this.shops.length !== (this.form.controls['shops'] as FormArray).length) || this.isSort) {
      this.createForm(this.shops);
      this.isFormInitialized = true;
      this.isSort = false;
    }
    this.updateActionPanel();
  }

  createForm(model: ShopViewModel[]) {
    this.form = this.fb.group({
      shops: this.fb.array([], Validators.required)
    });
    this.currentTenants = [];

    const control = this.form.controls['shops'] as FormArray;
    model.forEach(element => {
      this.currentTenants.push(element.tenant);
      control.push(
        this.fb.group({
          id: [element.id],
          name: [element.name, Validators.required],
          area: [element.area, [Validators.required, Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
          tenant: this.fb.group({
            id: [element.tenant ? element.tenant.id : null],
            name: [element.tenant ? element.tenant.name : null]
          }),
          floor: [element.floor, floorValidator()],
          isSpare: [element.isSpare],
          status: [ShopHelper.getStatus(element)],
          isSelected: [false],
          isExpanded: [false]
        })
      );
    });

    this.onChanges();
  }

  onShopValueChanged(shop) {
    const status = ShopHelper.getStatus(shop);

    if (shop.status !== status) {
      const formGroup = this.getFormShop(shop.id);
      formGroup.controls['status'].setValue(status);
    }

    this.updateCheckAllPartlyState();
    this.updateActionPanel();
  }

  onSplitShop(shopId: string) {
    if (!this.form.valid) {
      this.notificationService.error('There is invalid data.');
      return;
    }

    const shop = this.shops.find(s => s.id === shopId);

    if (shop.shopNodes && shop.shopNodes.length) {
      this.notificationService.error('You can\'t split shop with assigned node. Please select other options.');
      return;
    }

    const modalRef = this.modalService.open(SplitShopComponent, {
      backdrop: 'static',
      windowClass: 'splt-modal'
    });
    modalRef.componentInstance.model = shop;
    modalRef.result.then((response) => {
      this.splitShop.emit({previousShop: shop, shops: response});
    }, () => {
    });
  }

  onCreate() {
    this.addShop.emit();
  }

  onToggleSpare(shopId: string, index: number) {
    const formGroup = this.getFormShop(shopId);
    const isSpare = formGroup.controls['isSpare'].value;

    formGroup.controls['isSpare'].setValue(!isSpare);
    this.updateShop.emit({id: shopId, path: 'isSpare', value: !isSpare});

    if (!isSpare) {
      const tenantControl = <FormGroup>formGroup.controls['tenant'];
      tenantControl.controls['name'].setValue(null);
      tenantControl.controls['id'].setValue(null);
      this.currentTenants[index] = null;

      this.updateShop.emit({id: shopId, path: 'tenant', value: null});
    }
  }

  onSetVacantMultiple() {
    const shops = this.getSelectedShops();

    shops.forEach(s => {
      s.controls['isSpare'].setValue(false);
      const tenantControl = <FormGroup>s.controls['tenant'];
      tenantControl.controls['name'].setValue(null);
      tenantControl.controls['id'].setValue(null);
    });

    this.setVacantStatusForShops.emit(this.getShopsIds(shops));
  }

  onSetSpareMultiple() {
    const shops = this.getSelectedShops();

    shops.forEach(s => {
      s.controls['isSpare'].setValue(true);
      const tenantControl = <FormGroup>s.controls['tenant'];
      tenantControl.controls['id'].setValue(null);
      tenantControl.controls['name'].setValue(null);
      const id = s.controls['id'].value;
      const idx = this.shops.findIndex(shop => shop.id == id);

      if (idx != -1) {
        this.currentTenants[idx] = null;
      }
    });

    this.setSpareStatusForShops.emit(this.getShopsIds(shops));
  }

  onSetUnspareMultiple() {
    const shops = this.getSelectedShops();

    shops.forEach(s => {
      s.controls['isSpare'].setValue(false);
    });

    this.setUnspareStatusForShops.emit(this.getShopsIds(shops));
  }

  onMerge() {
    if (!this.form.valid) {
      this.notificationService.error('There is invalid data.');
      return;
    }

    const formShops = this.getSelectedShops();
    if (!formShops.length) {
      return;
    }

    const shopsIds = this.getShopsIds(formShops);
    const shops = this.shops.filter(s => shopsIds.includes(s.id));

    if (this.isMergeValid(shops)) {
      this.mergeShops.emit(shopsIds);
    } else {
      this.notificationService.error('You can\'t merge selected shops. Please select other options.');
    }

    this.setCheckedAllByDefault();
  }

  isMergeValid(shops: ShopViewModel[]): boolean {
    let isValid = !shops.filter(s => s.isSpare).length;
    let firstTenantName = '';

    if (isValid) {
      shops.forEach(s => {
        if (s.shopNodes && s.shopNodes.length) {
          isValid = false;
          return;
        }

        if (s.tenant && s.tenant.name) {
          if (!firstTenantName) {
            firstTenantName = s.tenant.name;
          }

          if (firstTenantName && firstTenantName !== s.tenant.name) {
            isValid = false;
          }
        }
      });
    }

    return isValid;
  }

  onSelectAll() {
    this.checkedAll = !this.checkedAll;
    this.checkedAllPartly = false;

    const controls = (<FormArray>this.form.controls['shops']).controls;

    controls.forEach(group => {
      (<FormGroup>group).controls['isSelected'].setValue(this.checkedAll);
    });
  }

  onSelect() {
    this.updateCheckAllState();
  }

  updateCheckAllState() {
    const controls = this.getFormShops();
    const checkedCount = this.getSelectedShops().length;

    this.checkedAll = controls.length === checkedCount;
    this.checkedAllPartly = !this.checkedAll;
  }

  updateCheckAllPartlyState() {
    if (this.getSelectedShops().length === 0) {
      this.checkedAllPartly = false;
    }
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit();
    }

    this.setCheckedAllByDefault();
  }

  trackShopBy(index: number) {
    return index;
  }

  onSetVacant(shopControl) {
    const shops = [shopControl];

    shops.forEach(s => {
      const teantnControl = <FormGroup>s.controls['tenant'];
      teantnControl.controls['name'].setValue(null);
      teantnControl.controls['id'].setValue(null);
    });

    this.setVacantStatusForShops.emit(this.getShopsIds(shops));
  }

  onChangeRentDetails(shop: ShopViewModel) {
    const modalRef = this.modalService.open(RentDetailsComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = shop;
    modalRef.componentInstance.tenants = this.tenants;
    modalRef.componentInstance.buildingId = this.buildingId;
    modalRef.componentInstance.allShops = this.allShops;

    modalRef.result.then((result) => {
      this.updateShopRentDetails.emit(result);
    }, (reason) => {
    });
  }

  updateActionPanel() {
    const selectedCount = this.getSelectedShops().length;
    this.showActionMenu = selectedCount > 0;

    this.shopsInfoText = this.showActionMenu
      ? selectedCount + ' shops selected'
      : this.shops.length + ' shops';
  }

  onToggleHistory(shop) {
    if (shop.controls.isExpanded.value) {
      this.closeShopHistory.emit(shop.controls.id.value);
    } else {
      this.openShopHistory.emit(shop.controls.id.value);
    }
    shop.controls.isExpanded.value = !shop.controls.isExpanded.value;
  }

  changeOrderIndex(idx) {
    this.isSort = true;
    if (this.orderIndex === idx || (this.orderIndex === (idx * -1))) {
      this.orderIndex *= -1;
      this.updateShopOrderIndex.emit(this.orderIndex);
    } else {
      this.updateShopOrderIndex.emit(idx);
    }
  }

  onCancel() {
    this.setCheckedAllByDefault();
    const shopIds = this.shopsFromModel.map(el => el.id);
    this.store.dispatch(new occupationAction.ReturnDefaultFormShopValue({
      shopIds: shopIds,
      defaultShops: this.shopsFromModel
    }));
    this.createForm(this.shopsFromModel);
  }

  setCheckedAllByDefault() {
    this.checkedAll = false;
    this.checkedAllPartly = false;
  }

  isSpareAvailable() {
    return !this.getSelectedShops().some(shop => shop.controls['status'].value === ShopStatus.Occupied);
  }

  private getFormShops(): FormGroup[] {
    return (this.form.controls['shops'] as FormArray).controls as FormGroup[];
  }

  private getSelectedShops(): FormGroup[] {
    let selectedShops = [];
    if (this.form) {
      const controls = (this.form.controls['shops'] as FormArray).controls as FormGroup[];
      selectedShops = controls.filter(c => c.controls['isSelected'].value);
    }
    return selectedShops;
  }

  private getShopsIds(controls: FormGroup[]): string[] {
    return controls.map((s) => s.controls['id'].value);
  }

  private getFormShop(shopId: string): FormGroup {
    const controls = (<FormArray>this.form.controls['shops']).controls;

    return <FormGroup>controls.find(s => s.value.id === shopId);
  }
}
