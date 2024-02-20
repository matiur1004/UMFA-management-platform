import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {StringExtension} from '../../../../shared/helper/string-extension';

import {Store} from '@ngrx/store';
import * as packageFormAction from '../shared/store/actions/package-form.actions';
import * as fromPackages from '../shared/store/reducers';
import {FormGroupState, MarkAsSubmittedAction, SetValueAction} from 'ngrx-forms';
import {InitState} from '../shared/store/reducers/package-form.store';
import {ServiceCategoryType, ServiceStatusFilter} from '@models';

@Component({
  selector: 'package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.less']
})
export class PackageDetailComponent implements OnInit, OnDestroy {

  formState$: Observable<FormGroupState<any>>;
  routeEvents$: Subscription;

  recommendSum$: Observable<any>;

  servicesWithFilter$: Observable<any>;
  showPrice$: Observable<any>;
  serviceCountTitle$: Observable<string>;
  serviceCategoryFilterTitle$: Observable<string>;
  serviceFilterTitle$: Observable<string>;
  displayOptions$: Observable<any>;


  isNew: boolean = false;

  actualPrice: string = 'R 4 305';
  changedPrice: string = 'R 4 305';
  nullPrice: string = 'R 00.00';
  percentPrice: string = '+10%';
  tabId: any = 'tab-0';

  constructor(router: Router, route: ActivatedRoute, private store: Store<fromPackages.State>) {
    this.formState$ = store.select(fromPackages.getForm);
    this.servicesWithFilter$ = store.select(fromPackages.getServicesWithFilter);
    this.showPrice$ = store.select(fromPackages.getShowPrice);
    this.serviceCountTitle$ = store.select(fromPackages.getServiceCount);
    this.displayOptions$ = store.select(fromPackages.getDisplayOptions);

    this.recommendSum$ = store.select(fromPackages.getRecommendSum);

    this.serviceFilterTitle$ = store.select(fromPackages.getServiceFilter).pipe(map((idx) => {

      switch (idx) {
        case ServiceStatusFilter.ActiveServices:
          return 'Active services';

        case ServiceStatusFilter.InactiveServices:
          return 'Inactive services';

        default:
          return 'All services';
      }

    }));


    this.serviceCategoryFilterTitle$ = store.select(fromPackages.getServiceCategoryFilter).pipe(map((idx) => {

      switch (idx) {
        case ServiceCategoryType.FullMetering:
          return 'Full metering';

        case ServiceCategoryType.PartialMetering:
          return 'Partial metering';

        case ServiceCategoryType.PrepaidMetering:
          return 'Pre-paid metering';

        case ServiceCategoryType.SingleTenant:
          return 'Single tenant';

        default:
          return 'All categories';
      }

    }));


    this.routeEvents$ = router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => {
        return route.snapshot.params;
      })).subscribe(params => {
      let packageId = params['packageId'];

      if (StringExtension.isGuid(packageId)) {
        // Edit the package
        this.store.dispatch(new packageFormAction.EditPackage(packageId));
      } else {
        // Create a package
        this.store.dispatch(new packageFormAction.CreatePackage());
        this.isNew = true;
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.routeEvents$.unsubscribe();
  }

  onChangeColor($event) {
    this.store.dispatch(new SetValueAction('packageForm.color', $event));
  }

  onShowPrices($event) {
    this.store.dispatch(new packageFormAction.ToggleDisplayPrice());
  }

  onToggleServiceExpand($event) {
    this.store.dispatch(new packageFormAction.ToggleServiceExpand($event));
  }

  onSave() {
    this.formState$.subscribe(response => {
      var itemdf = 1;
    });

    this.store.dispatch(new MarkAsSubmittedAction(InitState.id));
    this.store.dispatch(new packageFormAction.SendPackageRequest());
  }

  onChangeServiceStatus($event) {
    this.store.dispatch(new packageFormAction.UpdateServiceStatus($event));
    this.onRecalc();
  }

  onUpdateCategoryFilter($event) {
    this.store.dispatch(new packageFormAction.UpdateServiceCategoryFilter($event));
  }

  onUpdateServiceFilter($event) {
    this.store.dispatch(new packageFormAction.UpdateServiceFilter($event));
  }

  onServiceValueChanged(event) {
    this.store.dispatch(new packageFormAction.UpdateServiceValue(event));
    this.onRecalc();
  }

  onApplyRecomPrice(supplyType) {
    this.store.dispatch(new packageFormAction.ApplyRecomPrice(supplyType));
  }

  onMeterValueChanged(event) {
    this.store.dispatch(new packageFormAction.UpdateServiceMeterValue(event));
    this.onRecalc();
  }

  onChargingMethodChanged(event) {
    this.store.dispatch(new packageFormAction.UpdateServiceChargingMethod(event));
    this.onRecalc();
  }

  onChargingTypeChanged($event) {
    this.store.dispatch(new packageFormAction.UpdateChargingType($event));
    this.onRecalc();
  }

  onRecalc() {
    this.store.dispatch(new packageFormAction.RequestCalCulationPrice());
  }
}
