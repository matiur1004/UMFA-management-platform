import {Injectable} from '@angular/core';
import {Action, Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {Router} from '@angular/router';

import * as fromPackages from '../reducers';
import * as fromPackageForm from '../reducers/package-form.store';
import {FormValue} from '../reducers/package-form.store';
import * as packagesAction from '../actions/packages.actions';
import * as packageFormAction from '../actions/package-form.actions';

import {PackageServiceService} from '../../package-service.service';
import {ResetAction, SetValueAction} from 'ngrx-forms';
import {PackagesEx} from '../packages-ex';
import {RecommendedPriceViewModel, RecommendPriceItemViewModel, SupplierPriceViewModel} from '@models';

@Injectable()
export class PackagesEffects {

  // Get packages
  getPackageRequest = createEffect(() => this.actions$.pipe(
    ofType(packagesAction.GET_PACKAGES_REQUEST, packagesAction.UPDATE_PACKAGES_ORDER, packagesAction.UPDATE_PACKAGES_PAGE),
    withLatestFrom(this.store$.select(fromPackages.getPackagesState), (action: any, state) => {
      return {
        payload: action.payload,
        state: state
      };
    }),
    switchMap((action: any) => {
      const state = action.state;

      return this.packagesService.get(state.packagesOrder).pipe(
        map(r => new packagesAction.GetPackagesRequestComplete(r)),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  // Start create package
  createPackage: Observable<any> = createEffect(() => this.actions$.pipe(
    ofType(packageFormAction.CREATE_PACKAGE),
    switchMap(() => {

      return this.packagesService.getDefault().pipe(
        map((r: any) => {
          r.adHocSupplierPrice.recomPrice = 100;
          r.electricitySupplierPrice.recomPrice = 100;
          r.gasSupplierPrice.recomPrice = 100;
          r.sewerageSupplierPrice.recomPrice = 100;
          r.waterSupplierPrice.recomPrice = 100;

          return new SetValueAction(fromPackageForm.FORM_ID, r);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    }),
    switchMap((action: any) => {

      if (action.type !== 'DUMMY') {
        return [
          action,
          new packageFormAction.GetPackageRequestComplete(action.value.services),
          new packageFormAction.RequestCalCulationPrice()
        ];
      }

      return [action];
    })
  ));
  // Start edit package
  editPackage: Observable<any> = createEffect(() => this.actions$.pipe(
    ofType(packageFormAction.EDIT_PACKAGE),
    withLatestFrom(this.store$.select(fromPackages.getPackages), (action: any, _) => {
      return {
        packageId: action.payload,
      };
    }),
    switchMap((action) => {

      return this.packagesService.getPackage(action.packageId).pipe(
        map((r: any) => {
          r.adHocSupplierPrice.recomPrice = 100;
          r.electricitySupplierPrice.recomPrice = 100;
          r.gasSupplierPrice.recomPrice = 100;
          r.sewerageSupplierPrice.recomPrice = 100;
          r.waterSupplierPrice.recomPrice = 100;

          return new SetValueAction(fromPackageForm.FORM_ID, r);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    }),
    switchMap((action: any) => {
      if (action.type !== 'DUMMY') {
        return [new packageFormAction.GetPackageRequestComplete(action.value.services), action];
      }

      return [action];
    })
  ));
  // Create/Update package
  savePackage = createEffect(() => this.actions$.pipe(
    ofType(packageFormAction.SEND_PACKAGE_REQUEST),
    withLatestFrom(this.store$.select(fromPackages.getFormState), (_, state) => {
      return {
        state: state
      };
    }),
    switchMap((action) => {
      if (!action.state.formState.isValid) {
        return of({type: 'DUMMY'});
      }

      const model: any = action.state.formState.value;
      model.services = action.state.services;

      if (!isNaN(model.adHocSupplierPrice.recomPrice) && model.adHocSupplierPrice.recomPrice != 0) {
        model.adHocSupplierPrice = this.MarkAllChanged(model.adHocSupplierPrice, true);
      }
      if (!isNaN(model.electricitySupplierPrice.recomPrice) && model.adHocSupplierPrice.recomPrice != 0, true) {
        model.electricitySupplierPrice = this.MarkAllChanged(model.electricitySupplierPrice, true);
      }
      if (!isNaN(model.waterSupplierPrice.recomPrice) && model.adHocSupplierPrice.recomPrice != 0) {
        model.waterSupplierPrice = this.MarkAllChanged(model.waterSupplierPrice, true);
      }
      if (!isNaN(model.gasSupplierPrice.recomPrice) && model.adHocSupplierPrice.recomPrice != 0) {
        model.gasSupplierPrice = this.MarkAllChanged(model.gasSupplierPrice, true);
      }
      if (!isNaN(model.sewerageSupplierPrice.recomPrice) && model.adHocSupplierPrice.recomPrice != 0) {
        model.sewerageSupplierPrice = this.MarkAllChanged(model.sewerageSupplierPrice, true);
      }

      if (action.state.isNew) {
        return this.packagesService.create(model).pipe(
          map(r => {
            this.router.navigate(['/admin', 'services', 'packages']);
            return new packageFormAction.SendPackageRequestComplete();
          }),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      } else {
        return this.packagesService.updatePackage(model, model.id).pipe(
          map(r => {
            this.router.navigate(['/admin', 'services', 'packages']);
            return new packageFormAction.SendPackageRequestComplete();
          }),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }
    })
  ));

  changeServiceStatus = createEffect(() => this.actions$.pipe(
    ofType(packagesAction.UPDATE_PACKAGE_STATUS_REQUEST),
    withLatestFrom(this.store$.select(fromPackages.getPackagesState), (action: any, state) => {
      return {
        payload: action.payload,
        packages: state.packages
      };
    }),
    switchMap((params: any) => {

      const {payload, packages} = params;
      return this.packagesService.updatePackageStatus(payload.packageId, {
        newValue: payload.value
      }).pipe(
        map(() => {
          return new packagesAction.UpdatePackageStatusRequestComplete(payload);
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  resetForm: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(packageFormAction.SEND_PACKAGE_REQUEST_COMPLETE),
    switchMap(() => [
      new SetValueAction(fromPackageForm.FORM_ID, fromPackageForm.INIT_DEFAULT_STATE),
      new ResetAction(fromPackageForm.FORM_ID)
    ])
  ));
  setPricesPackage: Observable<any> = createEffect(() => this.actions$.pipe(
    ofType(packageFormAction.APPLY_RECOM_PRICE),
    withLatestFrom(this.store$.select(fromPackages.getFormState), (action: any, state) => {
      return {
        state: state,
        payload: action.payload
      };
    }),
    switchMap((action) => {
      const {state} = action;
      const {payload} = action;

      const form: FormValue = JSON.parse(JSON.stringify(state.formState.value));

      let supplierKey = 'adHocSupplierPrice';
      let recommendedKey = 'adHoc';

      switch (payload) {
        case 0:
          supplierKey = 'electricitySupplierPrice';
          recommendedKey = 'electricity';
          break;

        case 1:
          supplierKey = 'waterSupplierPrice';
          recommendedKey = 'water';
          break;

        case 2:
          supplierKey = 'sewerageSupplierPrice';
          recommendedKey = 'sewerage';
          break;

        case 3:
          supplierKey = 'gasSupplierPrice';
          recommendedKey = 'gas';
          break;

        default:
          break;
      }

      const recommendedPrices: RecommendedPriceViewModel = PackagesEx.getRecommendSum(state.services, state.formState.value);

      form[supplierKey].recomPrice = 0;
      form[supplierKey] = this.MarkAllChanged(form[supplierKey], false);
      form[supplierKey] = this.updateSupplierPriceIfNotChanged(form[supplierKey], recommendedPrices[recommendedKey]);

      return [new ResetAction(fromPackageForm.FORM_ID), new SetValueAction(fromPackageForm.FORM_ID, form)];
    })
  ));

  deletePackage: Observable<any> = createEffect(() => this.actions$.pipe(
    ofType(packagesAction.DELETE_PACKAGE_REQUEST),
    withLatestFrom(this.store$.select(fromPackages.getPackages), (action: any, _) => {
      return {
        packageId: action.payload
      };
    }),
    mergeMap((action: any) => {

      return this.packagesService.deletePackage(action.packageId).pipe(
        map(r => {
          return new packagesAction.DeletePackageRequestComplete(action.packageId);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Rise the calculation of the header for package detail
  calculationActualPriceOfHeader = createEffect(() => this.actions$.pipe(
    ofType(packageFormAction.REQUEST_CALCULATION_ACTUAL_PRICE),
    debounceTime(300),
    withLatestFrom(this.store$.select(fromPackages.getFormState), (_, state) => {
      return state;
    }),
    switchMap((state: fromPackageForm.State) => {

      const {formState, services} = state;

      const recommendedPrices: RecommendedPriceViewModel = PackagesEx.getRecommendSum(services, formState.value);

      const value: FormValue = Object.assign({}, formState.value);

      if (value.adHocSupplierPrice.recomPrice == 0) {
        value.adHocSupplierPrice = this.updateSupplierPriceIfNotChanged(value.adHocSupplierPrice, recommendedPrices.adHoc);
      }
      if (value.electricitySupplierPrice.recomPrice == 0) {
        value.electricitySupplierPrice = this.updateSupplierPriceIfNotChanged(value.electricitySupplierPrice, recommendedPrices.electricity);
      }
      if (value.waterSupplierPrice.recomPrice == 0) {
        value.waterSupplierPrice = this.updateSupplierPriceIfNotChanged(value.waterSupplierPrice, recommendedPrices.water);
      }
      if (value.gasSupplierPrice.recomPrice == 0) {
        value.gasSupplierPrice = this.updateSupplierPriceIfNotChanged(value.gasSupplierPrice, recommendedPrices.gas);
      }
      if (value.sewerageSupplierPrice.recomPrice == 0) {
        value.sewerageSupplierPrice = this.updateSupplierPriceIfNotChanged(value.sewerageSupplierPrice, recommendedPrices.sewerage);
      }

      return [new SetValueAction(formState.id, value), new packageFormAction.UpdateRecommendedPrices(recommendedPrices)];
    })
  ));

  constructor(
    private router: Router,
    private actions$: Actions,
    private store$: Store<fromPackages.State>,
    private packagesService: PackageServiceService
  ) {
  }

  updateSupplierPriceIfNotChanged(currentSupplier: SupplierPriceViewModel, newValues: RecommendPriceItemViewModel): SupplierPriceViewModel {
    const result = Object.assign({}, currentSupplier);
    result.fixedPrice = currentSupplier.fixedPriceChanged ? currentSupplier.fixedPrice : newValues.fixedPrice;
    result.perTenant = currentSupplier.perTenantChanged ? currentSupplier.perTenant : newValues.perTenant;
    result.perShop = currentSupplier.perShopChanged ? currentSupplier.perShop : newValues.perShop;
    result.perMeter = currentSupplier.perMeterChanged ? currentSupplier.perMeter : newValues.perMeter;
    result.perSquareMeter = currentSupplier.perSquareMeterChanged ? currentSupplier.perSquareMeter : newValues.perSquareMeter;
    result.perBuilding = currentSupplier.perBuildingChanged ? currentSupplier.perBuilding : newValues.perBuilding;
    result.perCouncilAccount = currentSupplier.perCouncilAccountChanged ? currentSupplier.perCouncilAccount : newValues.perCouncilAccount;
    result.perHour = currentSupplier.perHourChanged ? currentSupplier.perHour : newValues.perHour;

    result.meterTypes = result.meterTypes.map(mt => {
      const result = {...mt};

      if (newValues.meterTypes.hasOwnProperty(mt.id) && !result.meterChanged) {
        result.value = newValues.meterTypes[mt.id];
      }

      return result;
    });

    return result;
  }

  MarkAllChanged(currentSupplier: SupplierPriceViewModel, value: boolean) {
    const result = Object.assign({}, currentSupplier, {
      fixedPriceChanged: value,
      perTenantChanged: value,
      perShopChanged: value,
      perMeterChanged: value,
      perSquareMeterChanged: value,
      perBuildingChanged: value,
      perCouncilAccountChanged: value,
      perHourChanged: value
    });

    result.meterTypes = result.meterTypes.map(mt => Object.assign({}, mt, {meterChanged: value}));

    return result;

  }
}
