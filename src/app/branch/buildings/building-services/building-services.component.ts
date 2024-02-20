import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChargingMethod, PackageServiceViewModel, ServiceCategoryType, ServiceViewModel, SupplyType} from "@models";
import {BuildingPackageDetailViewModel, BuildingPackageViewModel} from './shared/models';
import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromBuildingServices from './shared/store/reducers';
import * as buildingServicesAction from './shared/store/actions/building-services.actions';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {StringExtension} from 'app/shared/helper/string-extension';

@Component({
  selector: 'building-services',
  templateUrl: './building-services.component.html',
  styleUrls: ['./building-services.component.less']
})
export class BuildingServicesComponent implements OnInit, OnDestroy {

  chargingMethod = ChargingMethod;
  serviceType = SupplyType;

  packages$: Observable<BuildingPackageViewModel[]>;
  packageDetails$: Observable<BuildingPackageDetailViewModel>;
  showPrice$: Observable<boolean>;
  serviceFilterText$: Observable<string>;
  serviceCount$: Observable<string>;
  packagesCount$: Observable<string>;
  page$: Observable<number>;
  pacakgesTotal$: Observable<number>;
  pageSize$: Observable<number>;
  services$: Observable<ServiceViewModel[]>;
  packagesCategoryText$: Observable<string>;

  tenantPriceHeader$: Observable<any>;
  shopPriceHeader$: Observable<any>;
  meterPriceHeader$: Observable<any>;
  sqMeterPriceHeader$: Observable<any>;
  councilAccPriceHeader$: Observable<any>;
  hourPriceHeader$: Observable<any>;
  buildingPrice$: Observable<any>;
  fixedPrice$: Observable<any>;
  meterTypesDetail$: Observable<any>;

  isComplete$: Observable<boolean>;

  flatCustomizationServices$: Observable<PackageServiceViewModel[]>;
  customizationDetail$: Observable<any>;
  customizationTotalPrice$: Observable<number>;
  isComplete: boolean = false;
  branchId: string;
  id: string;
  packageDetails: any;
  private pathFromRoot$: Subscription;

  constructor(private store: Store<fromBuildingServices.State>, private activatedRoute: ActivatedRoute, private router: Router) {

    this.store.dispatch(new buildingServicesAction.ResetBuildingServices());

    this.packages$ = store.select(fromBuildingServices.getPackages);
    this.packageDetails$ = store.select(fromBuildingServices.getPackageDetails);
    this.services$ = store.select(fromBuildingServices.getServicesWithFilter);
    this.showPrice$ = store.select(fromBuildingServices.getShowPrice);
    this.serviceCount$ = store.select(fromBuildingServices.getServiceCount);
    this.packagesCount$ = store.select(fromBuildingServices.getPackagesCount);
    this.page$ = store.select(fromBuildingServices.getPage);
    this.pacakgesTotal$ = store.select(fromBuildingServices.getPackagesTolal);
    this.pageSize$ = store.select(fromBuildingServices.getPageSize);

    this.tenantPriceHeader$ = store.select(fromBuildingServices.getTenantPriceHeader);
    this.shopPriceHeader$ = store.select(fromBuildingServices.getShopPriceHeader);
    this.meterPriceHeader$ = store.select(fromBuildingServices.getMeterPriceHeader);
    this.sqMeterPriceHeader$ = store.select(fromBuildingServices.getSqMeterPriceHeader);
    this.councilAccPriceHeader$ = store.select(fromBuildingServices.getCouncilAccPriceHeader);
    this.hourPriceHeader$ = store.select(fromBuildingServices.getHourPriceHeader);
    this.buildingPrice$ = store.select(fromBuildingServices.getBuildingPrice);
    this.fixedPrice$ = store.select(fromBuildingServices.getFixedPrice);
    this.meterTypesDetail$ = store.select(fromBuildingServices.getMeterTypesDetail);

    this.isComplete$ = store.select(fromBuildingServices.getIsCompleted);

    this.flatCustomizationServices$ = store.select(fromBuildingServices.getFlatCustomizationServices);
    this.customizationDetail$ = store.select(fromBuildingServices.getCustomizationDetail);
    this.customizationTotalPrice$ = store.select(fromBuildingServices.getCustomizationTotal);

    this.packageDetails$.subscribe(packageDetails => {
      this.packageDetails = packageDetails;
    });

    this.serviceFilterText$ = store.select(fromBuildingServices.getServiceFilter).pipe(map((idx) => {

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

    this.packagesCategoryText$ = store.select(fromBuildingServices.getPackageCategoryFilter).pipe(map(value => {
      switch (value) {
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
  }

  ngOnInit() {
    this.pathFromRoot$ = this.activatedRoute.pathFromRoot[2].params.subscribe(params => {
      this.branchId = params['branchid'];
    });
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

      if (StringExtension.isGuid(this.id)) {
        this.store.dispatch(new buildingServicesAction.UpdateBuildingId(this.id));
        this.store.dispatch(new buildingServicesAction.GetBuildingSerivcesStatus());
      }
    });

    this.isComplete$.subscribe(isComplete => {
      this.isComplete = isComplete;
    });
  }

  ngOnDestroy() {
    this.pathFromRoot$.unsubscribe();
    this.store.dispatch(new buildingServicesAction.UpdatePackagesSearchTerm(''));
  }

  setPage(event) {
    this.store.dispatch(new buildingServicesAction.UpdatePackagesPage(event));
  }

  search(event) {
    this.store.dispatch(new buildingServicesAction.UpdatePackagesSearchTerm(event));
  }

  supplyTypeChange(type) {
    this.store.dispatch(new buildingServicesAction.UpdatePackageSupplyTypes(type));
  }

  changePackage(packageId) {
    this.store.dispatch(new buildingServicesAction.UpdateSelectedPackage(packageId));
  }

  onShowPrices() {
    this.store.dispatch(new buildingServicesAction.ToggleDisplayPrice());
  }

  onToggleService(serviceId) {
    this.store.dispatch(new buildingServicesAction.ToggleServiceExpand(serviceId));
  }

  updatePackageChargingMethod(value) {
    this.store.dispatch(new buildingServicesAction.UpdatePackageChargingMethod(value));
  }

  onSave() {
    this.store.dispatch(new buildingServicesAction.SaveServices(false));
    this.onNavigate(this.router.url);
  }

  onCancel() {
    this.onNavigate(this.router.url);
  }

  onCustomize() {
    if (this.router.url.includes('buildings'))
      this.router.navigate([`/branch/${this.branchId}/buildings/${this.id}/package-customization/${this.packageDetails.id}`]);
    else
      this.router.navigate([`/branch/${this.branchId}/marketing/${this.id}/package-customization/${this.packageDetails.id}`]);
  }

  onChange() {
    this.store.dispatch(new buildingServicesAction.GetPackagesRequest());
    this.store.dispatch(new buildingServicesAction.UpdateIsCompleted(false));
    this.router.navigate([`/branch/${this.branchId}/buildings`]);
  }

  onUpdateCategoryFilter(event) {
    this.store.dispatch(new buildingServicesAction.UpdateServiceFilter(event));
  }

  onChangePackageCategory(event) {
    this.store.dispatch(new buildingServicesAction.UpdatePackageCategoryFilter(event));
  }

  onNavigate(url: string) {
    if (url.includes('buildings')) {
      this.router.navigate([`/branch/${this.branchId}/buildings`]);
    } else {
      this.router.navigate([`/branch/${this.branchId}/marketing`]);
    }
  }

}
