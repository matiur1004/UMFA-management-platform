import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BrandViewModel, EquipmentGroupViewModel} from '@models';
import {EquipmentService} from '@services';

@Component({
  selector: 'app-edit-brands',
  templateUrl: './edit-brands.component.html',
  styleUrls: ['./edit-brands.component.less']
})
export class EditBrandsComponent implements OnInit {

  @Input() model: BrandViewModel = new BrandViewModel();

  public isNew: boolean;
  form: FormGroup;
  equipmentGroups: EquipmentGroupViewModel[] = new Array<EquipmentGroupViewModel>();
  selectedEquipmentGroupsIds: string[] = new Array<string>();
  formErrors = {
    'name': '',
    'equipmentGroups': ''
  };
  private isSubmitted = false;
  private validationMessages = {
    'name': {
      'required': 'Brand name is required'
    },
    'equipmentGroups': {
      'required': 'Equipment group is required'
    }
  };

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private equipmentService: EquipmentService) {
  }

  ngOnInit() {
    this.equipmentService.getAllEquipmentGroups('').subscribe((response: EquipmentGroupViewModel[]) => {
      this.equipmentGroups = response;

      if (this.model != null) {
        this.selectedEquipmentGroupsIds = this.getEquipmentGroupsIds();
      }
    });

    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [this.model.id],
      name: [this.model.name, Validators.required],
      equipmentGroups: this.formBuilder.array(this.getEquipmentGroups(), Validators.required)
    });

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

      if (this.isSubmitted && ((control && control.dirty && !control.valid) || (control && !control.valid))) {
        let message = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }

  insertAccount() {
    if (this.form.valid && this.isNew) {
      this.equipmentService.createBrand(this.form.value).subscribe(() => {
        this.activeModal.close();
      });
    } else if (this.form.valid) {
      this.equipmentService.updateBrand(this.model.id, this.form.value).subscribe(() => {
        this.activeModal.close();
      });
    } else {
      this.onValueFormChange();
    }
  }

  getEquipmentGroupsIds() {
    return this.model.equipmentGroups.map(g => g.id);
  }

  getEquipmentGroups() {
    return this.model.equipmentGroups.map(d => this.formBuilder.group({id: [d.id], name: [d.name]}));
  }

  onEquipmentGroupChange(equipmentGroups: EquipmentGroupViewModel[]) {
    let equipmentGroupsControls = <FormArray>this.form.controls['equipmentGroups'];

    while (equipmentGroupsControls.length !== 0) {
      equipmentGroupsControls.removeAt(0);
    }

    equipmentGroups.forEach(equipmentGroup => {
      var formGrp = this.formBuilder.group({id: [equipmentGroup.id], name: [equipmentGroup.name]});
      equipmentGroupsControls.push(formGrp);
    });
  }

  save() {
    this.isSubmitted = true;
    this.insertAccount();
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
