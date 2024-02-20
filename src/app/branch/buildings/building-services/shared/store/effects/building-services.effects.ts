import {Injectable} from '@angular/core';
import {Action, Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import * as fromBuildingServices from '../reducers';
import * as buildingServicesAction from '../actions/building-services.actions';
import * as packageCustomizationAction from '../actions/package-customization.actions';

import {BuildingServicesService} from 'app/branch/buildings/building-services/shared/building-services.service';
import {BuildingServicesCalc} from 'app/branch/buildings/building-services/shared/store/building-services-calc';
import {InputEx} from '@shared-helpers';
import {ChargingMethod} from '@models';
import {Router} from '@angular/router';
import {BuildingPackageDetailViewModel, PackageChargingMethod} from '../../models';

@Injectable()
export class BuildingServicesEffects {

  getBuildingSerivcesStatus: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(buildingServicesAction.GET_BUILDING_SERVICES_STATUS),
    withLatestFrom(this.store$.select(fromBuildingServices.getServicesState), (_, state) => {
      return state;
    }),
    switchMap((action: any) => {

      return this.buildingServicesManager.getStatus(action.buildingId).pipe(
        map(r => new buildingServicesAction.UpdateIsCompleted(r)),
        catchError(() => of({type: 'DUMMY'}))
      );
    }),
    switchMap((action: any) => {
      if (action.type == 'DUMMY') {
        return [action];
      }

      if (action.payload) {
        return [action, new buildingServicesAction.GetBuildingSerivcesApplied()];
      } else {
        return [action, new buildingServicesAction.GetPackagesRequest()];
      }
    })
  ));

  getBuildingSerivcesApplied: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(buildingServicesAction.GET_BUILDING_SERVICES_APPLIED),
    withLatestFrom(this.store$.select(fromBuildingServices.getServicesState), (_, state) => {
      return state;
    }),
    switchMap((action) => {

      return this.buildingServicesManager.getApplied(action.buildingId).pipe(
        map(r => new buildingServicesAction.UpdateSelectedPackageComplete(r)),
        catchError(() => of({type: 'DUMMY'}))
      );

    })
  ));

  getPackages = createEffect(() => this.actions$.pipe(
    ofType(
      buildingServicesAction.GET_PACKAGES_REQUEST,
      buildingServicesAction.UPDATE_PACKAGES_PAGE,
      buildingServicesAction.UPDATE_PACKAGES_SEARCH_TERM,
      buildingServicesAction.UPDATE_PACKAGE_CATEGORY_FILTER
    ),
    withLatestFrom(this.store$.select(fromBuildingServices.getServicesState), (action: any, state) => {
      return {
        payload: action.payload,
        state: state
      };
    }),
    switchMap(action => {
      const {state} = action;

      const start = (state.page - 1) * state.pageSize;
      const end = start + state.pageSize;
      const category = state.packageCategoryFilter;

      return this.buildingServicesManager.get(action.state.searchTerm, start, end, category).pipe(
        map(response => {
          return new buildingServicesAction.GetPackagesRequestComplete(response);
        }),

        catchError(() =>
          of([{type: 'DUMMY'}])
        )
      );
    }),
    switchMap((action: any) => {
      const {payload} = action;

      if (action.type != 'DUMMY' && payload.items.length) {
        return [action, new buildingServicesAction.GetPackageDetailsRequest(payload.items[0].id)];
      }

      return [action];
    }),
  ));

  getPackageDetails: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(buildingServicesAction.GET_PACKAGE_DETAILS_REQUEST),
    withLatestFrom(this.store$.select(fromBuildingServices.getServicesState), (action: any, state) => {
      return {
        state: state,
        payload: action.payload
      };
    }),
    switchMap(action => {

      return this.buildingServicesManager.getDetails(action.state.buildingId, action.payload).pipe(
        map(packageDetails =>
          new buildingServicesAction.GetPackageDetailsRequestComplete(packageDetails)
        ),
        catchError(() =>
          of({type: 'DUMMY'})
        )
      );
    })
  ));
  // Start select package
  selectPackage: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(buildingServicesAction.UPDATE_SELECTED_PACKAGE),
    withLatestFrom(this.store$.select(fromBuildingServices.getServicesState), (action: any, state) => {
      return {
        state: state,
        payload: action.payload
      };
    }),
    switchMap((action) => {

      return this.buildingServicesManager.getDetails(action.state.buildingId, action.payload).pipe(
        map(r => new buildingServicesAction.UpdateSelectedPackageComplete(r)),
        catchError(() => of({type: 'DUMMY'}))
      );

    })
  ));
  // Save services
  saveServices = createEffect(() => this.actions$.pipe(
    ofType(buildingServicesAction.SAVE_SERVICES),
    withLatestFrom(this.store$.select(fromBuildingServices.getState), (action: any, state) => {
      return {
        payload: action.payload,
        state: state
      };
    }),
    switchMap((action) => {
      const {payload, state} = action;
      const {BuildingServices} = state;

      const packageDetails = {...BuildingServices.packageDetails};

      const model: BuildingPackageDetailViewModel = BuildingServicesCalc.calculatePrices(packageDetails);

      if (payload) {
        model.chargingMethod = PackageChargingMethod.Custom;
      }

      return this.buildingServicesManager.save(BuildingServices.buildingId, model).pipe(
        map(r => new buildingServicesAction.GetBuildingSerivcesApplied()),
        catchError(() => of({type: 'DUMMY'}))
      );
    })
  ));
  // set services for Package Customize
  updateCustomizationServices = createEffect(() => this.actions$.pipe(
    ofType(
      buildingServicesAction.UPDATE_SELECTED_PACKAGE_COMPLETE,
      buildingServicesAction.GET_PACKAGE_DETAILS_REQUEST_COMPLETE,
      buildingServicesAction.UPDATE_SELECTED_PACKAGE_COMPLETE
    ),
    withLatestFrom(this.store$.select(fromBuildingServices.getServices), (_, services) => {
      return services;
    }),
    switchMap((action) => {
      return of(new packageCustomizationAction.UpdateServicesComplete(action));
    })
  ));

  updateCustomizationItemsCount = createEffect(() => this.actions$.pipe(
    ofType(packageCustomizationAction.UPDATE_SERVICES_COMPLETE),
    withLatestFrom(this.store$.select(fromBuildingServices.getPackageDetails), (_, packageDetails) => {
      return packageDetails;
    }),
    switchMap((action) => {
      const model = {
        numberOfTenants: action.numberOfTenants,
        numberOfShops: action.numberOfShops,
        // numberOfMeters: action.numberOfMeters,
        numberOfSqMetres: action.numberOfSqMetres,
        numberOfCouncilAcc: action.numberOfCouncilAcc,
        numberOfHours: action.numberOfHours
      };
      return [new packageCustomizationAction.UpdateItemsCount(model), new packageCustomizationAction.CalculatePrices()];
    })
  ));

  calc = createEffect(() => this.actions$.pipe(
    ofType(packageCustomizationAction.UPDATE_ITEMS_COUNT),
    switchMap(() => {
      return of(new packageCustomizationAction.CalculatePrices());
    })
  ));

  calcCustomizationPrices = createEffect(() => this.actions$.pipe(
    ofType(
      packageCustomizationAction.CALCULATE_PRICES,
      packageCustomizationAction.UPDATE_CHARGING_METHOD,
      packageCustomizationAction.UPDATE_SERVICE_STATUS
    ),
    withLatestFrom(this.store$.select(fromBuildingServices.getPackageCustomizationState), (_, customizationState) => {
      return customizationState;
    }),
    switchMap((action) => {
      const services = JSON.parse(JSON.stringify(action.services));
      let totalPrice = 0;

      InputEx.getServiceEnumerator<any>(services, (service) => {
        if (!service.isActive) {
          return;
        }

        service.unitPrice = 0;

        switch (service.chargingMethod) {
          case ChargingMethod.PerTenant: {
            service.unitPrice += service.electricity ? service.electricity.perTenant : 0;
            service.unitPrice += service.water ? service.water.perTenant : 0;
            service.unitPrice += service.sewerage ? service.sewerage.perTenant : 0;
            service.unitPrice += service.gas ? service.gas.perTenant : 0;
            service.unitPrice += service.adHoc ? service.adHoc.perTenant : 0;

            service.servicePrice = service.unitPrice * action.numberOfTenants;
            break;
          }

          case ChargingMethod.PerShop: {
            service.unitPrice += service.electricity ? service.electricity.perShop : 0;
            service.unitPrice += service.water ? service.water.perShop : 0;
            service.unitPrice += service.sewerage ? service.sewerage.perShop : 0;
            service.unitPrice += service.gas ? service.gas.perShop : 0;
            service.unitPrice += service.adHoc ? service.adHoc.perShop : 0;

            service.servicePrice = service.unitPrice * action.numberOfShops;
            break;
          }

          case ChargingMethod.PerMeter: {
            service.unitPrice += service.electricity ? service.electricity.perMeter : 0;
            service.unitPrice += service.water ? service.water.perMeter : 0;
            service.unitPrice += service.sewerage ? service.sewerage.perMeter : 0;
            service.unitPrice += service.gas ? service.gas.perMeter : 0;
            service.unitPrice += service.adHoc ? service.adHoc.perMeter : 0;

            service.servicePrice = service.unitPrice * action.numberOfMeters;
            break;
          }

          case ChargingMethod.PerSquareMeter: {
            service.unitPrice += service.electricity ? service.electricity.perSquareMeter : 0;
            service.unitPrice += service.water ? service.water.perSquareMeter : 0;
            service.unitPrice += service.sewerage ? service.sewerage.perSquareMeter : 0;
            service.unitPrice += service.gas ? service.gas.perSquareMeter : 0;
            service.unitPrice += service.adHoc ? service.adHoc.perSquareMeter : 0;

            service.servicePrice = service.unitPrice * action.numberOfSqMetres;
            break;
          }

          case ChargingMethod.PerCouncilAccount: {
            service.unitPrice += service.electricity ? service.electricity.perCouncilAccount : 0;
            service.unitPrice += service.water ? service.water.perCouncilAccount : 0;
            service.unitPrice += service.sewerage ? service.sewerage.perCouncilAccount : 0;
            service.unitPrice += service.gas ? service.gas.perCouncilAccount : 0;
            service.unitPrice += service.adHoc ? service.adHoc.perCouncilAccount : 0;

            service.servicePrice = service.unitPrice * action.numberOfCouncilAcc;
            break;
          }

          case ChargingMethod.PerHour: {
            service.unitPrice += service.electricity ? service.electricity.perHour : 0;
            service.unitPrice += service.water ? service.water.perHour : 0;
            service.unitPrice += service.sewerage ? service.sewerage.perHour : 0;
            service.unitPrice += service.gas ? service.gas.perHour : 0;
            service.unitPrice += service.adHoc ? service.adHoc.perHour : 0;

            service.servicePrice = service.unitPrice * action.numberOfHours;
            break;
          }

          default:
            break;
        }

        totalPrice += service.servicePrice;
      });

      return [
        new packageCustomizationAction.UpdateServices(services),
        new packageCustomizationAction.UpdateTotalPrice(totalPrice)
      ];

    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromBuildingServices.State>,
    private buildingServicesManager: BuildingServicesService,
    private router: Router
  ) {
  }

}
