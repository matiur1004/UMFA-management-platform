import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngrx/store';

import * as fromServices from '../shared/store/reducers';
import * as servicesAction from '../shared/store/actions/services.actions';

@Component({
  selector: 'delete-service',
  templateUrl: './delete-service.component.html',
  styleUrls: ['./delete-service.component.less']
})
export class DeleteServiceComponent implements OnInit {

  public status: boolean = false;
  public serviceId: string;
  public objectCount: number;

  constructor(public activeModal: NgbActiveModal, private store: Store<fromServices.State>) {

  }

  ngOnInit() {

  }

  dismiss() {
    this.activeModal.dismiss();
  }

  close() {
    this.activeModal.close();
  }

  onChangeServiceStatus(event) {
    this.store.dispatch(new servicesAction.UpdateServiceStatusRequest(event));
  }

}
