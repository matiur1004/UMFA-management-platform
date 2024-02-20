import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {ShopStatus, ShopViewModel, TenantViewModel} from '@models';
import {ShopHelper} from '../../../shared/helpers/shop.helper';
import {floorValidator} from 'app/shared/validators/floor.validator';
import {StringExtension} from 'app/shared/helper/string-extension';
import {CreateTenantComponent} from '@app/branch/buildings/manage-building/occupation/occupation-create/dialogs/create-tenant/create-tenant.component';
import * as fromOccupationAction
  from '@app/branch/buildings/manage-building/occupation/shared/store/actions/occupation.actions';
import * as occupationAction
  from '@app/branch/buildings/manage-building/occupation/shared/store/actions/occupation.actions';
import * as fromOccupation from '@app/branch/buildings/manage-building/occupation/shared/store/reducers';
import {Store} from '@ngrx/store';
import {TenantService} from '@services';
import {Subscription} from 'rxjs';

@Component({
  selector: 'split-shop',
  templateUrl: './split-shop.component.html',
  styleUrls: ['./split-shop.component.less']
})
export class SplitShopComponent implements OnInit, OnDestroy {

  isSubmitted: boolean = false;
  tenants: TenantViewModel[];
  shopStatus = ShopStatus;
  form: FormGroup;
  shopsTotal: number = 2;
  splitItems = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  shops: ShopViewModel[];
  private tenantsSubj: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private tenantService: TenantService,
    private modalService: NgbModal,
    private store: Store<fromOccupation.State>,
    private fb: FormBuilder) {
    store.dispatch(new occupationAction.SetTenants());
  }

  private _model: ShopViewModel;

  public get model(): ShopViewModel {
    return this._model;
  }

  public set model(v: ShopViewModel) {
    this._model = v;
  }

  get shopsArr() {
    return this.form.controls.shops as FormArray;
  }

  ngOnInit() {
    this.tenantsSubj = this.store.select(fromOccupation.getTenants).subscribe((tenants) => {
      this.tenants = tenants;
    });
    this.generateShops();
    this.createForm(this.shops);
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
          area: [element.area, Validators.required],
          tenant: this.fb.group({
            id: [element.tenant.id],
            name: [element.tenant.name]
          }),
          floor: [element.floor, floorValidator()],
          status: [ShopHelper.getStatus(element)]
        })
      );
    });
  }

  generateShops() {
    this.shops = new Array<ShopViewModel>();

    for (let i = 0; i < this.shopsTotal; i++) {
      const shop = new ShopViewModel();
      shop.id = StringExtension.NewGuid();
      shop.area = 0;
      shop.floor = this._model.floor;

      this.shops.push(shop);
    }
  }

  onShopsTotalChange(total: number) {
    this.shopsTotal = total;

    this.generateShops();
    this.createForm(this.shops);
  }

  save() {
    this.isSubmitted = true;
    if (this.form.valid && !this.checkValidArea()) {
      const formShops = (this.form.controls['shops'] as FormArray).controls as FormGroup[];

      const shops = formShops.map(s => {
        const shop = new ShopViewModel();
        shop.id = s.controls['id'].value;
        shop.name = s.controls['name'].value;
        shop.area = s.controls['area'].value;
        shop.tenant = s.controls['tenant'].value;
        shop.floor = s.controls['floor'].value;
        shop.isSpare = false;

        return shop;
      });

      this.activeModal.close(shops);

    } else {
      this.validateAllFormFields(this.form);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);

      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});

      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);

      } else if (control instanceof FormArray) {
        control.controls.forEach(c => this.validateAllFormFields(c as FormGroup));
      }
    });
  }

  isFieldInvalid(field: FormControl) {
    return !field.valid && field.touched;
  }

  onDelete(index: number) {
    this.shopsTotal -= 1;
    const control = this.form.controls['shops'] as FormArray;
    control.removeAt(index);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  checkValidArea() {
    if (this.form && this.form.value && this.form.value.shops) {
      return this.model.area < (this.form.value.shops.reduce((value, current) => {
        return value + current.area;
      }, 0));
    } else {
      return false;
    }
  }

  onSetTenant(shopItem) {
    const tenantValue = shopItem.controls['tenant'].controls['name'].value;

    if (tenantValue.length) {
      shopItem.controls['status'].setValue(this.shopStatus.Occupied);
      return;
    }

    shopItem.controls['status'].setValue(this.shopStatus.Vacant);
    shopItem.controls['tenant'].controls['name'].setValue(null);
  }

  ngOnDestroy(): void {
    this.tenantsSubj && this.tenantsSubj.unsubscribe();
  }

  onCreateTenant() {
    const modalRef = this.modalService.open(CreateTenantComponent, {backdrop: 'static'});

    modalRef.result.then(
      (tenantName: string) => {
        if (tenantName) {
          const tenant = new TenantViewModel();
          tenant.name = tenantName;
          this.store.dispatch(new fromOccupationAction.AddTenant(tenant));
        }
      },
      (e) => {/* closed - do nothing */
      });
  }

  private getFormShop(shopId: string): FormGroup {
    const controls = (<FormArray>this.form.controls['shops']).controls;

    return <FormGroup>controls.find(s => s.value.id === shopId);
  }
}
