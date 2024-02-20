import {Component, Input, OnInit} from '@angular/core';
import {EstimatedReadingReasonViewModel} from '@app/shared/models/estimated-reading-reason';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'reason-settings',
  templateUrl: './reason-settings.component.html',
  styleUrls: ['./reason-settings.component.less']
})
export class ReasonSettingsComponent implements OnInit {
  @Input() model: EstimatedReadingReasonViewModel = {} as EstimatedReadingReasonViewModel;
  isNew: boolean;
  form: FormGroup;

  constructor(public activeModal: NgbActiveModal) {
    this.form = new FormGroup({
      reason: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
    if (!this.isNew) {
      this.form.controls.reason.setValue(this.model.reason);
    }

    if (this.model.isSystem) {
      this.form.disable();
    }
  }

  dismiss() {
    this.activeModal.close();
  }

  save() {
    this.activeModal.close(this.form.controls.reason.value);
  }
}
