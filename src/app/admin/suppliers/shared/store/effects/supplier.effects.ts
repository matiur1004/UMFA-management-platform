import {Injectable} from '@angular/core';
import * as supplierState from '../reducers';
import * as selectors from '../selectors';
import * as supplierInfoFormState from '../reducers/supplier-info-form.store';
import * as supplierCommonActions from '../actions/supplier-common.actions';
import * as supplierFormActions from '../actions/supplier-info-form.actions';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {SupplierService} from '../../services/supplier.service';
import {Observable, of} from 'rxjs';
import {SetValueAction, unbox} from 'ngrx-forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {SupplierViewModel, SupplyType} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateSupplierComponent} from 'app/admin/suppliers/create-supplier/create-supplier.component';
import {Router} from '@angular/router';


@Injectable()
export class SupplierEffects {

  loadSupplier: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(supplierCommonActions.API_SUPPLIER_LOAD),
      switchMap((a: supplierCommonActions.ApiSupplierLoad) => {
        const {supplierId} = a.payload;
        return this.supplierService.getSupplier(supplierId).pipe(
          map((r: SupplierViewModel) => new supplierCommonActions.ApiSupplierLoaded(r)),
          catchError(r => {
            return of(new supplierCommonActions.ApiSupplierLoadFailed(r));
          }));
      })
    )
  );

  deleteSupplier: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(supplierCommonActions.API_SUPPLIER_DELETE),
      switchMap((action: any) => {
        return this.supplierService.deleteSupplier(action.payload).pipe(
          map(() => new supplierCommonActions.ApiSuppliersListRequest()),
          catchError(r => {
            return of({type: 'DUMMY'});
          }));
      })
    )
  );

  initSupplierInfoForm: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(supplierCommonActions.API_SUPPLIER_LOADED, supplierFormActions.RESET_SUPPLIER_DETAIL, supplierFormActions.SET_SHOW_SUPPLIER_INFO_FORM),
      withLatestFrom(this.store$.select(selectors.getCurrentSupplier),
        this.store$.select(selectors.getShowSupplierInfoForm),
        (a, supplier, showSupplierInfoForm) => {
          return {
            supplier: supplier,
            showSupplierInfoForm: showSupplierInfoForm
          };
        }),
      filter((action) => action.showSupplierInfoForm && !!action.supplier),
      switchMap(({supplier}) => {
        let formValue = {
          name: supplier.name,
          description: supplier.description,
          email: supplier.email,
          phone: supplier.phone,
          registrationNumber: supplier.registrationNumber,
          vatNumber: supplier.vatNumber,
          webAddress: supplier.webAddress,
          physicalAddress: supplier.physicalAddress || {},
          postalAddress: supplier.postalAddress || {},
          supplyTypes: Object.keys(SupplyType).reduce((acc, s) => {
            const st = SupplyType[s];
            acc[st] = supplier.supplyTypes.indexOf(st) >= 0;
            return acc;
          }, {})
        };

        return [
          new SetValueAction(supplierInfoFormState.SupplierFormId, formValue),
          new supplierFormActions.SetSupplierLogoUrl(supplier.logoUrl)
        ];
      }))
  );

  apiLoadSuppliersList: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(supplierCommonActions.API_SUPPLIERS_LIST_REQUEST),
      withLatestFrom(
        this.store$.select(selectors.getSuppliersFilterText),
        this.store$.select(selectors.getSuppliersFilterSupplyType),
        (action, searchText, supplyType) => {
          return {searchText, supplyType};
        }),
      switchMap(({searchText, supplyType}) => {
        return this.supplierService.getAll(searchText, supplyType).pipe(
          map((data: SupplierViewModel[]) => {
            let suppliersVm = data.map(s => {
              return {
                ...s,
                enabledSupplyTypes: s.supplyTypes.reduce((acc, t) => {
                    acc[t] = true;
                    return acc;
                  },
                  {})
              };
            });
            return new supplierCommonActions.ApiSuppliersListLoaded(suppliersVm);
          }),
          catchError(r => {
            return of({type: 'DUMMY'});
          }));
      })
    )
  );

  saveSupplier: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(supplierFormActions.API_SAVE_SUPPLIER),
      withLatestFrom(
        this.store$.select(selectors.getSupplierId),
        this.store$.select(selectors.getSupplierForm),
        this.store$.select(selectors.getCurrentSupplier),
        (action, supplierId, form, currentSuplier) => {
          return {supplierId, form, currentSuplier};
        }
      ),
      filter(({form}) => form.isValid),
      switchMap(({supplierId, form, currentSuplier}) => {
        const value = form.value;
        const supplier = <SupplierViewModel>{
          id: supplierId,
          name: value.name,
          logo: value.logo,
          logoUrl: currentSuplier.logoUrl,
          description: value.description,
          email: value.email,
          registrationNumber: value.registrationNumber,
          phone: value.phone,
          webAddress: value.webAddress,
          vatNumber: value.vatNumber,
          supplyTypes: Object.keys(value.supplyTypes).filter(t => value.supplyTypes[t]).map(key => Number(key)),
          physicalAddress: unbox(value.physicalAddress),
          postalAddress: unbox(value.postalAddress)
        };

        return this.supplierService.updateSupplier(supplier).pipe(
          map(() => {
            return {status: true, supplier};
          }),
          catchError(r => {
            return of({status: false, supplier: null});
          }));
      }),
      switchMap(({status, supplier}) => {
        if (!status) {
          return [{type: 'DUMMY'}];
        }
        return [
          new supplierCommonActions.ApiSuppliersListRequest(),
          new supplierCommonActions.ApiSupplierLoad({supplierId: supplier.id})
        ];
      })
    )
  );

  createSupplier = createEffect(() =>
    this.actions$.pipe(
      ofType(supplierCommonActions.API_SUPPLIER_CREATE),
      withLatestFrom(
        this.store$.select(selectors.getCreateSupplierForm),
        this.store$.select(selectors.getAddNewModal),
        (action, form, modal) => {
          return {form, modal};
        }
      ),
      filter(({form}) => form.isValid),
      switchMap(({form, modal}) => {
        const value = form.value;
        const supplier = {
          name: value.name,
          supplyTypes: Object.keys(value.supplyTypes).filter(t => value.supplyTypes[t]).map(key => Number(key))
        };

        return this.supplierService.createSupplier(supplier).pipe(
          map((r) => {
            return {status: true, payload: r, modal};
          }),
          catchError(r => {
            return of({status: false, payload: null, modal: null});
          }));
      }),
      switchMap(({status, modal, payload}) => {
        if (!status) {
          return [{type: 'DUMMY'}];
        }
        if (modal) {
          modal.close();
        }
        this.navigatetoSupplierDetails(payload);
        return [new supplierCommonActions.ApiSuppliersListRequest(), new supplierCommonActions.SupplierAddNewModalChanged(null)];
      })
    )
  );

  openAddNewSupplier = createEffect(() =>
    this.actions$.pipe(
      ofType(supplierCommonActions.SUPPLIER_ADD_NEW),
      tap(() => {
        this.modalService.open(CreateSupplierComponent, {backdrop: 'static'});
      })
    ), {dispatch: false}
  );

  updateSearchKey: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(supplierCommonActions.SUPPLIER_FILTER_TEXT_CHANGED),
      debounceTime(300),
      distinctUntilChanged(),
      map(() => new supplierCommonActions.ApiSuppliersListRequest())
    )
  );

  updateSupplyType: Observable<Action> = createEffect(() => 
    this.actions$.pipe(
      ofType(supplierCommonActions.SUPPLIER_FILTER_SUPPLY_TYPE_CHANGED),
      distinctUntilChanged(),
      map(() => new supplierCommonActions.ApiSuppliersListRequest())
    )
  );

  constructor(private actions$: Actions,
              private router: Router,
              private store$: Store<supplierState.State>,
              private modalService: NgbModal,
              private supplierService: SupplierService) {
  }

  private navigatetoSupplierDetails(supplierId) {
    this.router.navigate(['admin', 'suppliers', supplierId]);
  }

}
