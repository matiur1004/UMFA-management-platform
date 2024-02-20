import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'dialog-set-custom-attribute',
  templateUrl: './dialog-set-custom-attribute.component.html',
  styleUrls: ['./dialog-set-custom-attribute.component.less']
})
export class DialogSetCustomAttributeComponent implements OnInit {
  @Input() data: any;

  public phaseList = ['1 phase', '3 phases'];
  public voltageList = [];

  public fieldName = '';
  public selectedFile: File = null;

  public form: FormGroup;
  public submitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    if (this.data) {
      this.fieldName = this.data.attribute.name;
      const value = this.data.billingValue || this.data.recommendedValue;
      const comment = this.data.comment;
      this.selectedFile = null;

      this.form = this.fb.group({
        value: [value, Validators.required],
        comment: [comment, Validators.required],
        file: [null]
      });

      if (this.fieldName === 'Voltage') {
        this.voltageList = this.data.attribute.comboSettings.map(el => el.value);
      }
    }
  }

  onFileSelected(ev) {
    this.selectedFile = ev;
  }


  close() {
    this.submitted = true;
    if (this.form.valid) {
      this.activeModal.close({
        attributeName: this.fieldName.toLowerCase(),
        value: this.form.value.value,
        comment: this.form.value.comment,
        file: this.selectedFile
      });
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
