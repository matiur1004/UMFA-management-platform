import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as nodeFormActions from '../../../../shared/store/actions/node-form.actions';
import * as fromNodeState from '../../../../shared/store/reducers';
import {Store} from '@ngrx/store';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

const notZeroValidator = (c) => c.value == 0 ? {notZero: true} : null;

@Component({
  selector: 'calc-factor',
  templateUrl: './calc-factor.component.html',
  styleUrls: ['./calc-factor.component.less']
})
export class CalcFactorComponent {

  selectedItems: string[];
  form: FormGroup;

  constructor(public activeModal: NgbActiveModal, private store: Store<fromNodeState.State>, fb: FormBuilder) {
    this.form = fb.group({
      calculationFactor: [1, [notZeroValidator, Validators.min(-1000), Validators.max(1000)]]
    });
  }

  close() {
    if (this.form.valid) {
      this.store.dispatch(new nodeFormActions.SetCalculationFactor({
        calculationFactor: this.form.value.calculationFactor,
        nodes: this.selectedItems
      }));
      this.activeModal.close();
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
