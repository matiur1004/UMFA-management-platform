import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {chargingTypeText, TariffLineItemChargingType} from '@models';

@Component({
  selector: 'add-line-item',
  templateUrl: './add-line-item.component.html',
  styleUrls: ['./add-line-item.component.less']
})
export class AddLineItemComponent {

  form: FormGroup;
  @Input() chargingTypes: TariffLineItemChargingType[];
  @Input() closeOnSave = true;
  @Output() save = new EventEmitter();

  chargingTypeText = chargingTypeText;

  constructor(public activeModal: NgbActiveModal,
              private formBuilder: FormBuilder) {
    this.reset();
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
      if (this.closeOnSave) {
        this.activeModal.close(this.form.value);
      }
    } else {
      this.form.markAsTouched();
    }

  }

  reset() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      chargingType: [-1, Validators.min(0)]
    });
  }


  dismiss() {
    this.activeModal.dismiss();
  }

  onChargingTypeChanged(event) {
    this.form.controls.chargingType.setValue(event);
  }

}
