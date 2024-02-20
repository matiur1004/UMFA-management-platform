import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromSupplier from '../shared/store/reducers';
import * as selectors from '../shared/store/selectors';
import {FormGroupState} from 'ngrx-forms';
import {CreateSupplierFormValue} from '../shared/store/reducers/create-supplier-form.store';
import {ApiSupplierCreate} from '../shared/store/actions/supplier-common.actions';
import {SupplyType} from '@models';

@Component({
  selector: 'create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.less']
})
export class CreateSupplierComponent implements OnInit {
  formState$: Observable<FormGroupState<CreateSupplierFormValue>>;
  SupplyType = SupplyType;
  showErrors = false;

  constructor(private activeModal: NgbActiveModal,
              private store: Store<fromSupplier.State>
  ) {
    this.formState$ = store.select(selectors.getCreateSupplierForm);
  }

  ngOnInit() {

  }

  save() {
    this.showErrors = true;
    this.store.dispatch(new ApiSupplierCreate());
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
