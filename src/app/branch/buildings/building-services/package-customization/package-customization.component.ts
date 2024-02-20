import {Component, OnInit} from '@angular/core';

import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromBuildingServices from '../shared/store/reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {StringExtension} from 'app/shared/helper/string-extension';
import {PackageServiceViewModel, SupplyType} from '@models';

import * as buildingServicesAction from '../shared/store/actions/building-services.actions';

@Component({
  selector: 'app-package-customization',
  templateUrl: './package-customization.component.html',
  styleUrls: ['./package-customization.component.less']
})
export class PackageCustomizationComponent implements OnInit {

  serviceType = SupplyType;

  packageDetail$: Observable<any>;
  services$: Observable<PackageServiceViewModel[]>;
  totalPrice$: Observable<number>;
  serviceCount$: Observable<string>;
  id: string;
  packageId: string;
  branchId: string;
  private pathFromRoot$: Subscription;

  constructor(private store: Store<fromBuildingServices.State>, private activatedRoute: ActivatedRoute, private router: Router) {
    this.services$ = store.select(fromBuildingServices.getServices);
    this.totalPrice$ = store.select(fromBuildingServices.getCustomizationTotal);
    this.serviceCount$ = store.select(fromBuildingServices.getServiceCount);
    this.packageDetail$ = store.select(fromBuildingServices.getPackageDetails);

  }

  ngOnInit() {

    this.pathFromRoot$ = this.activatedRoute.pathFromRoot[2].params.subscribe(params => {
      this.branchId = params['branchid'];
    });

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.packageId = params['packageId'];

      if (StringExtension.isGuid(this.id) && StringExtension.isGuid(this.packageId)) {
        this.store.dispatch(new buildingServicesAction.UpdateBuildingId(this.id));
        this.store.dispatch(new buildingServicesAction.UpdateSelectedPackage(this.packageId));
      }
    });
  }

  onToggleServiceExpand(event) {
    this.store.dispatch(new buildingServicesAction.ToggleServiceExpand(event));
  }

  onChangeServiceStatus(event) {
    this.store.dispatch(new buildingServicesAction.UpdateServiceStatus(event));
  }

  onChargingMethodChanged(event) {
    this.store.dispatch(new buildingServicesAction.UpdateServiceChargingMethod(event));
  }

  onServiceValueChanged(event) {
    this.store.dispatch(new buildingServicesAction.UpdateServiceValue(event));
  }

  onMeterValueChanged(event) {
    this.store.dispatch(new buildingServicesAction.UpdateServiceMeterValue(event));
  }

  supplyTypeChange(event) {
    this.store.dispatch(new buildingServicesAction.UpdatePackageSupplyTypes(event));
  }

  onChargingTypeChanged(event) {
    this.store.dispatch(new buildingServicesAction.UpdateChargingType(event));
  }

  onSave() {
    this.store.dispatch(new buildingServicesAction.SaveServices(true));
    this.onNavigate(this.router.url);
  }

  onCancel() {
    this.onNavigate(this.router.url);
  }

  onNavigate(url: string) {
    if (url.includes('buildings'))
      this.router.navigate([`/branch/${this.branchId}/buildings`]);
    else
      this.router.navigate([`/branch/${this.branchId}/marketing`]);
  }

}
