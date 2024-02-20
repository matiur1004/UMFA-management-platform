import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import {IWizardComponent} from 'app/shared/wizard/IWizardComponent';
import {SplitShopComponent} from '../../dialogs/split-shop/split-shop.component';
import {ShopStatus, ShopViewModel, TenantViewModel} from '@models';
import {ShopHelper} from '../../../shared/helpers/shop.helper';
import {floorValidator} from 'app/shared/validators/floor.validator';
import {NotificationService} from 'app/shared/services/notification.service';
import {UploadDataModalComponent} from '../../dialogs/upload-data-modal/upload-data-modal.component';

@Component({
  selector: 'manage-shops-det',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-shops-det.component.html',
  styleUrls: ['./manage-shops-det.component.less']
})
export class ManageShopsDetComponent implements OnChanges, OnInit, IWizardComponent {

  @Input() buildingId: string;
  @Input() shops: ShopViewModel[];
  @Input() tenants: TenantViewModel[];
  @Input() shopCount: number;
  @Input() orderIndex: number;

  @Output() addShop = new EventEmitter<any>();
  @Output() deleteShop = new EventEmitter();
  @Output() updateShop = new EventEmitter();
  @Output() next = new EventEmitter<number>();
  @Output() previous = new EventEmitter<number>();

  @Output() setVacantStatusForShops = new EventEmitter();
  @Output() setSpareStatusForShops = new EventEmitter();
  @Output() setUnspareStatusForShops = new EventEmitter();
  @Output() mergeShops = new EventEmitter();
  @Output() splitShop = new EventEmitter();
  @Output() updateShopStatusFilter = new EventEmitter<number>();
  @Output() save = new EventEmitter();
  @Output() updateShopSearchTerm = new EventEmitter();
  @Output() updateShopOrderIndex = new EventEmitter<number>();

  form: FormGroup;
  isFormInitialized = false;
  shopStatus = ShopStatus;

  checkedAll = false;
  checkedAllPartly = false;
  showActionMenu = false;

  shopsInfoText = '';
  filterByIdx = 0;
  filterByLbl = 'All shops';
  filterByItems = [
    {label: 'All shops', value: 0},
    {label: 'Active shops', value: 1},
    {label: 'Inactive shops', value: 2}];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.createForm(this.shops);
    this.updateActionPanel();
  }

  onFilterBy(event: { label: string, value: number }) {
    this.filterByIdx = event.value;
    this.filterByLbl = event.label;
    this.updateShopStatusFilter.emit(event.value);
  }

  onChanges(): void {
    (<FormArray>this.form.controls['shops']).controls.forEach(form => {
      form.valueChanges.subscribe(shop => this.onShopValueChanged(shop));
    });
  }

  ngOnChanges() {
    this.createForm(this.shops);
    this.updateActionPanel();
  }

  canNavigate(): boolean {
    return this.form.valid;
  }

  createForm(model: ShopViewModel[]) {
    this.form = this.fb.group({
      shops: this.fb.array([], Validators.required)
    });

    const control = this.form.controls['shops'] as FormArray;
    model.forEach(element => {
      control.push(
        this.fb.group({
          id: [element.id],
          name: [element.name, Validators.required],
          area: [element.area, [Validators.required, Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
          tenant: this.fb.group({
            id: [element.tenant ? element.tenant.id : null],
            name: [{value: element.tenant ? element.tenant.name : null, disabled: element.isSpare}],
          }),
          floor: [element.floor, floorValidator()],
          isSpare: [element.isSpare],
          status: [ShopHelper.getStatus(element)],
          isSelected: [false]
        })
      );
    });

    this.onChanges();
  }

  onUploadData() {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      windowClass: 'upload-data-modal'
    };
    const modalRef = this.modalService.open(UploadDataModalComponent, modalOptions);
    modalRef.componentInstance.buildingId = this.buildingId;
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

    const modalRef = this.modalService.open(SplitShopComponent, {
      backdrop: 'static',
      windowClass: 'splt-modal'
    });
    modalRef.componentInstance.model = shop;
    modalRef.componentInstance.tenants = this.tenants;
    modalRef.result.then((response) => {
      this.splitShop.emit({previousShop: shop, shops: response});
    }, () => {
    });
    this.checkedAll = false;
    this.checkedAllPartly = false;
  }

  onCreate() {
    this.addShop.emit();
    this.checkedAll = false;
    this.checkedAllPartly = false;
  }

  onDelete(shopId: string, index: number) {
    const control = this.form.controls['shops'] as FormArray;

    control.removeAt(index);
    this.deleteShop.emit(shopId);
    this.checkedAll = false;
    this.checkedAllPartly = false;
  }

  onToggleSpare(shopId: string, index: number) {
    const formGroup = this.getFormShop(shopId);
    const isSpare = formGroup.controls['isSpare'].value;

    formGroup.controls['isSpare'].setValue(!isSpare);
    this.updateShop.emit({id: shopId, path: 'isSpare', value: !isSpare});

    if (!isSpare) {
      const tenantControl = <FormGroup>formGroup.controls['tenant'];
      tenantControl.controls['name'].setValue(null);
      tenantControl.controls['name'].disable();
      this.updateShop.emit({id: shopId, path: 'tenant', value: null});
    } else {
      const tenantControl = <FormGroup>formGroup.controls['tenant'];
      tenantControl.controls['name'].enable();
    }
    this.checkedAll = false;
    this.checkedAllPartly = false;
  }

  onSetVacantMultiple() {
    const shops = this.getSelectedShops();

    shops.forEach(s => {
      s.controls['isSpare'].setValue(false);
      const tenantControl = <FormGroup>s.controls['tenant'];
      tenantControl.controls['name'].setValue(null);
      tenantControl.controls['name'].enable();
      tenantControl.controls['id'].setValue(null);
    });

    this.setVacantStatusForShops.emit(this.getShopsIds(shops));
  }

  onSetSpareMultiple() {
    const shops = this.getSelectedShops();

    shops.forEach(s => {
      s.controls['isSpare'].setValue(true);
      const tenantControl = <FormGroup>s.controls['tenant'];
      tenantControl.controls['name'].setValue('');
      tenantControl.controls['name'].disable();
    });

    this.setSpareStatusForShops.emit(this.getShopsIds(shops));
  }

  onSetUnspareMultiple() {
    const shops = this.getSelectedShops();

    shops.forEach(s => {
      s.controls['isSpare'].setValue(false);
      const tenantControl = <FormGroup>s.controls['tenant'];
      tenantControl.controls['name'].enable();
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
  }

  isMergeValid(shops: ShopViewModel[]): boolean {
    let isValid = !shops.filter(s => s.isSpare).length;
    let firstTenantName = '';

    if (isValid) {
      shops.forEach(s => {
        if (s.tenant) {
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
    const totalCount = this.getFormShops().length;
    const checkedCount = this.getSelectedShops().length;

    if (checkedCount === 0 || checkedCount === totalCount) {
      this.checkedAllPartly = false;
    }

    if (checkedCount > 0 && checkedCount < totalCount) {
      this.checkedAllPartly = true;
    }

    if (checkedCount === totalCount) {
      this.checkedAll = true;
    }
  }

  updateActionPanel() {
    const selectedCount = this.getSelectedShops().length;
    this.showActionMenu = selectedCount > 0;

    this.shopsInfoText = this.showActionMenu
      ? selectedCount + ' shops selected'
      : this.shops.length + ' shops';
  }

  onNext() {
    this.save.emit();
    this.next.emit();
  }

  changeOrderIndex(idx) {
    if (this.orderIndex === idx || (this.orderIndex === (idx * -1))) {
      this.orderIndex *= -1;
      this.updateShopOrderIndex.emit(this.orderIndex);
    } else {
      this.updateShopOrderIndex.emit(idx);
    }
  }

  private getFormShops(): FormGroup[] {
    return (this.form.controls['shops'] as FormArray).controls as FormGroup[];
  }

  private getSelectedShops(): FormGroup[] {

    const controls = (this.form.controls['shops'] as FormArray).controls as FormGroup[];
    return controls.filter(c => c.controls['isSelected'].value);
  }

  private getShopsIds(controls: FormGroup[]): string[] {
    return controls.map((s) => s.controls['id'].value);
  }

  private getFormShop(shopId: string): FormGroup {
    const controls = (<FormArray>this.form.controls['shops']).controls;

    return <FormGroup>controls.find(s => s.value.id === shopId);
  }
}
