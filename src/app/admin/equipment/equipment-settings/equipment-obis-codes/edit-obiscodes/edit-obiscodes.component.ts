import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EquipmentService} from '@services';
import {ObisCodeViewModel} from '@models';
import {EnergyTypeDropdownItems} from './../../../../../shared/models/obis-code-energytype.model';
import {PolarityTypeDropdownItems} from './../../../../../shared/models/obis-code-polaritytype.model';
import {ReadingTypeDropdownItems}from './../../../../../shared/models/obis-code-readingtype.model';
import {TariffTypeDropdownItems} from './../../../../../shared/models/obis-code-tarifftype.model';

@Component({
  selector: 'edit-obiscodes',
  templateUrl: './edit-obiscodes.component.html',
  styleUrls: ['./edit-obiscodes.component.less']
})
export class EditObiscodesComponent implements OnInit {
  @Input() model: ObisCodeViewModel;

  form: FormGroup;

  public energyTypesList = EnergyTypeDropdownItems;
  public energyTypeText = '';
  public polarityTypesList = PolarityTypeDropdownItems;
  public polarityTypeText = '';
  public readingTypesList = ReadingTypeDropdownItems;
  public readingTypeText = '';
  public tariffTypesList = TariffTypeDropdownItems;
  public tariffTypeText = '';
  public displayValueText = '';

  formErrors = {
    'obisCodeValue': '',
    'displayValue': ''
  };

 private validationMessages = {
    'obisCodeValue': {
      'required': 'Obis Code Value is required'
    },
    'displayValue': {
      'required': 'Display Value is required'
    }
  };

  constructor(private formBuilder: FormBuilder, private equipmentService: EquipmentService, private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      obisCodeValue: ['',Validators.required],
      energyType: [this.energyTypesList[0]],
      polarityType: [this.polarityTypesList[0]],
      readingType: [this.readingTypesList[0]],
      tariffType: [this.tariffTypesList[0]],
      displayValue: ['',Validators.required],
    });

    if (this.model != null) {
      this.form.setValue({
        id: this.model.id,
        energyType: this.model.energyType,
        polarityType: this.model.polarityType,
        readingType: this.model.readingType,
        tariffType: this.model.tariffType,
        obisCodeValue: this.model.obisCodeValue,
        displayValue: this.model.displayValue,
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
    const form = this.form;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && !control.valid)) {
        const message = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
//    this.energyTypeText = this.form.value.energyType.label.slice(0,1);
//    this.polarityTypeText = this.form.value.polarityType.label.slice(0,3);
//   this.readingTypeText = this.form.value.readingType.label;
//   this.tariffTypeText = this.form.value.tariffType.label.charAt(0) + this.form.value.tariffType.label.charAt(7);
//   this.displayValueText = this.form.value.obisCodeValue + ' ('+ this.energyTypeText + '-' + this.polarityTypeText +'-'+ this.readingTypeText +'-'+ this.tariffTypeText + ')';
//    const displayValueControl = document.getElementById("displayValue");
//    displayValueControl.value=this.displayValueText;
  }

  insertAccount() {
    if (this.form.valid && !this.model) {
      this.equipmentService.createObisCode(this.form.value).subscribe(() => {
        this.activeModal.close();
      });
    } else if (this.form.valid) {
      this.equipmentService.updateObisCode(this.model.id, this.form.value).subscribe(() => {
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
