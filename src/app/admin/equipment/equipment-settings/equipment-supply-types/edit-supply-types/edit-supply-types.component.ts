import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BuildingService, EquipmentService} from '@services';
import {CategoryViewModel, SupplyToViewModel, SupplyType} from '@models';

@Component({
  selector: 'app-edit-supply-types',
  templateUrl: './edit-supply-types.component.html',
  styleUrls: ['./edit-supply-types.component.less']
})
export class EditSupplyTypesComponent implements OnInit {

  @Input() model: SupplyToViewModel = new SupplyToViewModel();

  public isNew: boolean;
  form: FormGroup;
  isSubmitted = false;
  supplyTypeEnum = SupplyType;
  supplyTypesList = [SupplyType.Electricity, SupplyType.Water, SupplyType.Gas, SupplyType.Sewerage, SupplyType.AdHoc];
  selectedCategoryIds: string[] = new Array<string>();
  categories: CategoryViewModel[] = new Array<CategoryViewModel>();
  formErrors = {
    'name': '',
    'locations': ''
  };
  private selectedSupplyTypeText: string = SupplyType[SupplyType.Electricity];
  private validationMessages = {
    'name': {
      'required': 'Supply To name is required'
    },
    'locations': {
      'required': 'Location type is required'
    }
  };

  constructor(private fb: FormBuilder, private equipmentService: EquipmentService, private activeModal: NgbActiveModal,
              private buildingService: BuildingService) {
  }

  get supplyTypes(): FormArray {
    return this.form.controls.supplyTypes as FormArray;
  }

  ngOnInit() {
    this.createForm(this.model);

    this.buildingService.getAllCategories().subscribe((response: CategoryViewModel[]) => {
      this.categories = response;
    });
  }

  createForm(model: SupplyToViewModel) {
    this.form = this.fb.group({
      id: [model.id],
      name: [model.name, Validators.required],
      supplyTypes: this.fb.array(model.supplyTypes.map(s => this.fb.group({
        id: [s.id],
        supplyType: [s.supplyType],
        supplyToLocations: this.fb.array(s.supplyToLocations.map(l => this.fb.group({
          id: [l.id],
          name: [l.name],
          categoryIds: this.fb.array(l.categoryIds.map(c => this.fb.control(c)))
        })))
      })))
    });

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

      if (((control && control.dirty && !control.valid) || (control && !control.valid)) && this.isSubmitted) {
        const message = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }

  insertAccount() {
    if (this.form.valid && this.isNew) {
      this.equipmentService.createSupplyLocationType(this.form.value).subscribe(() => {
        this.activeModal.close();
      });
    } else if (this.form.valid) {
      this.equipmentService.updateSupplyLocationType(this.model.id, this.form.value).subscribe(() => {
        this.activeModal.close();
      });
    } else {
      this.onValueFormChange();
    }
  }

  onSupplyTypeChange(supplyToSupplyTypeControl: FormControl, type: SupplyType) {
    if (!type) {
      type = SupplyType.Electricity;
    }

    supplyToSupplyTypeControl.get('supplyType').setValue(type);
  }

  updateSupplyTypeText(type: SupplyType) {
    this.selectedSupplyTypeText = SupplyType[type];
  }

  addLocation(control) {
    control.push(this.fb.group({
      id: [''],
      name: ['', Validators.required],
      categoryIds: this.fb.array([], Validators.required)
    }));

    this.model = this.form.value;
  }

  deleteItemFromArray(control, index) {
    control.removeAt(index);
  }

  addSupplyType() {
    const control = <FormArray>this.form.get('supplyTypes');
    control.push(this.fb.group({
      id: [''],
      supplyType: [SupplyType.Electricity],
      supplyToLocations: this.fb.array([])
    }));
  }

  categoriesChanged(control, categories: CategoryViewModel[]) {
    const categoryIds = control as FormArray;

    while (categoryIds.length !== 0) {
      categoryIds.removeAt(0);
    }

    categories.forEach(c => {
      categoryIds.push(this.fb.control(c.id));
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
