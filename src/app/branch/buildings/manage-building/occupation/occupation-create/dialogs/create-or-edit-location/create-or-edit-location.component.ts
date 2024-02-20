import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from 'app/shared/helper/ngb-date-fr-parser-formatter';
import {LocationViewModel} from '@models';


@Component({
  selector: 'create-or-edit-location',
  templateUrl: './create-or-edit-location.component.html',
  styleUrls: ['./create-or-edit-location.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class CreateOrEditLocationComponent implements OnInit {
  model: LocationViewModel;
  form: FormGroup;
  title: string;
  isSubmitted: boolean = false;
  isNewLocation: boolean = false;

  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.isNewLocation = this.model == null;
    this.title = this.isNewLocation ? 'Create new location' : 'Edit location';
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [this.isNewLocation ? null : this.model.id],
      name: [this.isNewLocation ? '' : this.model.name, Validators.required],
      description: [this.isNewLocation ? '' : this.model.description],
      sequenceNumber: [this.isNewLocation ? '' : this.model.sequenceNumber]
    });
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  submit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.activeModal.close(this.form.value);
    }
  }
}
