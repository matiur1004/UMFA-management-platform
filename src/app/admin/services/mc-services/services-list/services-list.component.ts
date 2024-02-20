import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';

import {ServiceCategoryType, ServiceStatusFilter, ServiceViewModel} from '@models';

import * as fromServices from '../shared/store/reducers';
import * as servicesAction from '../shared/store/actions/services.actions';
import * as serviceFormAction from '../shared/store/actions/service-form.actions';

import {DeleteServiceComponent} from '../delete-service/delete-service.component';
import {CreateServiceComponent} from '../create-service/create-service.component';


@Component({
  selector: 'services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.less']
})
export class ServicesListComponent implements OnInit {

  servicesList$: Observable<ServiceViewModel[]>;
  showPrice$: Observable<boolean>;
  serviceFilterText$: Observable<string>;
  serviceCategoryFilterText$: Observable<string>;
  getServiceCount$: Observable<string>;

  serviceStatusFilter = ServiceStatusFilter;
  serviceCategoryFilter = ServiceCategoryType;


  constructor(private modalService: NgbModal, private store: Store<fromServices.State>) {
    this.servicesList$ = store.select(fromServices.getServicesWithFilter);
    this.showPrice$ = store.select(fromServices.getShowPrice);
    this.getServiceCount$ = store.select(fromServices.getServiceCount);

    this.serviceFilterText$ = store.select(fromServices.getServiceFilter).pipe(map(value => {
      let result = 'All services';
      switch (value) {
        case ServiceStatusFilter.ActiveServices:
          result = 'Active services'
          break;

        case ServiceStatusFilter.InactiveServices:
          result = 'Inactive services'
          break;

        default:
          result = 'All services'
          break;
      }

      return result;
    }));

    this.serviceCategoryFilterText$ = store.select(fromServices.getServiceCategoryFilter).pipe(map((idx) => {

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
  }

  ngOnInit() {
    this.store.dispatch(new servicesAction.GetServicesRequest());
  }

  onShowPrices() {
    this.store.dispatch(new servicesAction.ToggleDisplayPrice());
  }

  onEdit(event) {
    this.store.dispatch(new serviceFormAction.EditService(event));
    this.openDetail();
  }

  onDelete(event) {
    const modalRef = this.modalService.open(DeleteServiceComponent, {
      backdrop: 'static',
      windowClass: 'del-service-modal'
    });
    modalRef.componentInstance.status = event.value;
    modalRef.componentInstance.serviceId = event.serviceId;
    modalRef.componentInstance.objectCount = event.objectCount;
    modalRef.result.then((result) => {
      this.store.dispatch(new servicesAction.DeleteService(event.serviceId));
    }, (reason) => {
    });
  }

  onCreate(event) {
    this.store.dispatch(new serviceFormAction.UpdateParentId(event));
    this.store.dispatch(new serviceFormAction.CreateService());
    this.openDetail();
  }

  onChangeServiceStatus(event) {
    this.store.dispatch(new servicesAction.UpdateServiceStatusRequest(event));
  }

  openDetail() {
    const modalRef = this.modalService.open(CreateServiceComponent, {backdrop: 'static'});
  }

  onToggleService(event) {
    this.store.dispatch(new servicesAction.ToggleServiceExpand(event));
  }

  onChangeFilter(event) {
    this.store.dispatch(new servicesAction.UpdateServiceFilter(event));
  }

  onChangeCategoryFilter(event) {
    this.store.dispatch(new servicesAction.UpdateServiceCategoryFilter(event));
  }
}
