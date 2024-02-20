import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {EquipmentService} from '@services';
import {EquipmentGroupViewModel, SupplyTypeDropdownItems} from '@models';

@Component({
  selector: 'app-edit-groups',
  templateUrl: './edit-groups.component.html',
  styleUrls: ['./edit-groups.component.less']
})
export class EditGroupsComponent implements OnInit {

  @Input() model: EquipmentGroupViewModel;

  form: FormGroup;

  public supplyTypesList = SupplyTypeDropdownItems;

  formErrors = {'name': ''};

  private validationMessages = {
    'name': {
      'required': 'Equipment group name is required'
    }
  };

  constructor(private formBuilder: FormBuilder, private equipmentService: EquipmentService, private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      supplyType: [this.supplyTypesList[0]]
    });

    if (this.model != null) {
      this.form.setValue({
        id: this.model.id,
        name: this.model.name,
        supplyType: this.model.supplyType
      });
      if (this.model.isSystem) {
        this.form.disable();
      }
    }

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  onValueFormChange(data?: any) {
    if (!this.form) {
      return;
    }
    let form = this.form;

    for (let field in this.formErrors) {
      this.formErrors[field] = '';
      let control = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && !control.valid)) {
        let message = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }

  insertAccount() {
    if (this.form.valid && !this.model) {
      this.equipmentService.createEquipmentGroup(this.form.value).subscribe(() => {
        this.activeModal.close();
      });
    } else if (this.form.valid) {
      this.equipmentService.updateEquipmentGroup(this.model.id, this.form.value).subscribe(() => {
        this.activeModal.close();
      });
    } else {
      this.onValueFormChange();
    }
  }

  save(event) {
    this.insertAccount();
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
