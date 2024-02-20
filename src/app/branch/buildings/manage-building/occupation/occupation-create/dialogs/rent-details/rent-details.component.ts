import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbActiveModal, NgbDateParserFormatter, NgbDateStruct, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';

import {ShopStatus, ShopViewModel} from '@models';
import {NgbDateFRParserFormatter} from 'app/shared/helper/ngb-date-fr-parser-formatter';
import {TenantService} from '@services';
import {TenantViewModel} from 'app/shared/models/tenant.model';

import * as fromOccupation from '../../../shared/store/reducers';
import * as fromOccupationAction from '../../../shared/store/actions/occupation.actions';
import {sortRule} from '@shared-helpers';
import {convertNgbDateToDate} from './../../../../../../../shared/helper/date-extension';

import * as selectors from '../../../../shared/store/selectors/common-data.selectors';

@Component({
  selector: 'rent-details',
  templateUrl: './rent-details.component.html',
  styleUrls: ['./rent-details.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class RentDetailsComponent implements OnInit {
  private static readonly TENANT_NAME_ERROR = 'Select tenant name';
  @Input() allShops: ShopViewModel[];
  @Input() model: ShopViewModel;
  @Input() tenants: TenantViewModel[];
  @Input() buildingId: string;

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  selectedDate: NgbDateStruct;

  form: FormGroup;
  status: ShopStatus = ShopStatus.Occupied;
  searchTerm: string;

  shopStatus = ShopStatus;
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private tenantService: TenantService,
    private store: Store<fromOccupation.State>) {
  }

  ngOnInit() {
    this.store.pipe(select(selectors.getActiveBuildingPeriod)).subscribe(buildingPeriod => {
      const parsedDate = new Date(buildingPeriod.startDate);

      this.selectedDate = {year: parsedDate.getFullYear(), month: parsedDate.getMonth() + 1, day: parsedDate.getDate()};
    })

    const now = new Date();
    this.sortTenantByShops();
    this.createForm();
  }

  sortTenantByShops() {
    const tenants = this.tenants.map(t => {
      const tenant = new TenantViewModel();
      tenant.id = t.id;
      tenant.name = t.name;
      tenant.shops = this.allShops.filter(shop => shop.tenant && shop.tenant.id == t.id).map(shop => shop.name);

      return tenant;
    });

    const tenantsWithoutShop = tenants.filter(t => t.shops.length === 0)
      .sort((a, b) => sortRule(a.name.toLowerCase(), b.name.toLowerCase()));

    const tenantsWithShop = tenants.filter(t => t.shops.length > 0)
      .sort((a, b) => sortRule(a.name.toLowerCase(), b.name.toLowerCase()));

    this.tenants = [...tenantsWithoutShop, ...tenantsWithShop];
  }

  createForm() {
    this.form = this.fb.group({
      currentTenant: this.fb.group({
        id: [this.model.tenant ? this.model.tenant.id : null],
        name: [this.model.tenant ? this.model.tenant.name : null]
      }),
      newTenant: this.fb.group({
        id: [null],
        name: [null]
      }),
      currentTenantEndDate: [this.selectedDate]
    });
  }

  save() {
    const value = this.form.value;
    const date = convertNgbDateToDate(value.currentTenantEndDate);

    let newTentantId = null;
    let comment = '';

    if (this.status !== ShopStatus.Vacant && !value.newTenant.id) {
      this.errorMessage = RentDetailsComponent.TENANT_NAME_ERROR;
      return;
    }

    if (this.status !== ShopStatus.Vacant && value.newTenant && value.newTenant.id) {
      newTentantId = value.newTenant.id;
      comment = value.newTenant.name + ' assigned to ' + this.model.name;
    } else {
      comment = this.model.name + ' become vacant';
    }

    const result = {
      newTenantId: newTentantId,
      shopId: this.model.id,
      comment: comment,
      startDate: date
    };

    this.activeModal.close(result);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  onSetVacant(formGroup) {
    formGroup.controls['id'].setValue(null);
    formGroup.controls['name'].setValue(null);
  }

  tenantChanged(formGroup, tenant: TenantViewModel) {
    formGroup.controls['id'].setValue(tenant.id);
    formGroup.controls['name'].setValue(tenant.name);
  }

  onVacantChange(event) {
    this.errorMessage = '';
    if (event.srcElement.checked) {
      this.status = ShopStatus.Vacant;
      this.onSetVacant(this.form.controls.newTenant as FormGroup);
    } else {
      this.status = ShopStatus.Occupied;
    }
  }

  search = (text$: Observable<string>) => {

    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => {
        this.searchTerm = term;

        if (term === '') {
          return this.tenants;
        }

        return this.tenants.filter((v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10);
      }));
  };

  inputFormatter(tenant: TenantViewModel) {
    return tenant.name;
  }

  resultFormatter(tenant: TenantViewModel) {

    let result = tenant.name;
    if (tenant.shops.length) {
      result = result + ' - ' + tenant.shops.length + ' shop(s)';
    }

    return tenant;
  }

  onTenantSelected(tenant) {
    this.errorMessage = '';

    const formGroup = this.form.controls.newTenant as FormGroup;
    formGroup.controls['id'].setValue(tenant.id);
    formGroup.controls['name'].setValue(tenant.name);
    this.searchTerm = tenant.name;
  }

  addTenant() {
    if (this.status === ShopStatus.Vacant) {
      return;
    }

    if (!this.searchTerm || !this.searchTerm.length) {
      this.errorMessage = RentDetailsComponent.TENANT_NAME_ERROR;
      return;
    }

    const tenant = new TenantViewModel();
    tenant.name = this.searchTerm;
    this.store.dispatch(new fromOccupationAction.AddTenant(tenant));
    this.errorMessage = '';
    this.sortTenantByShops();
    this.onTenantSelected(tenant);
  }

  onChangeTenantName(tenantName: string) {
    this.errorMessage = tenantName.length ? '' : RentDetailsComponent.TENANT_NAME_ERROR;
  }
}
