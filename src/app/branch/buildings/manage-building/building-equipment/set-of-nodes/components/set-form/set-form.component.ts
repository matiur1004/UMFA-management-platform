import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NodeSetsViewModel} from '../../../shared/models';
import {SupplyTypeDropdownItems} from '@models';

@Component({
  selector: 'set-form',
  templateUrl: './set-form.component.html',
  styleUrls: ['./set-form.component.less']
})
export class SetFormComponent implements OnChanges {
  @Input() action = 'Create';
  @Input() model: NodeSetsViewModel = {
    name: '',
    supplyType: '',
    description: '',
    nodeIds: []
  };
  @Input() buildingId: string;
  @Output() formSubmit: EventEmitter<NodeSetsViewModel> = new EventEmitter<NodeSetsViewModel>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  formSet: FormGroup;
  submitted = false;

  public supplyTypesList = SupplyTypeDropdownItems;

  constructor(private fb: FormBuilder) {
  }

  get isNameInvalid() {
    return !this.formSet.controls['name'].valid && this.formSet.touched;
  }

  get isSupplyTypeInvalid() {
    return !this.formSet.controls['supplyType'].valid && this.formSet.touched;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] || !this.formSet) {
      this.initForm();
    }
  }

  public initForm() {
    this.formSet = this.fb.group({
      name: [this.model.name || '', Validators.required],
      supplyType: [this.model.supplyType, Validators.required],
      description: [this.model.description || '']
    });
  }

  onFormSubmit() {
    this.submitted = true;
    this.formSet.controls['name'].markAsTouched();
    this.formSet.controls['supplyType'].markAsTouched();
    if (this.formSet.valid) {
      this.model.name = this.formSet.controls['name'].value;
      this.model.supplyType = this.formSet.controls['supplyType'].value;
      this.model.description = this.formSet.controls['description'].value;
      this.formSubmit.emit(this.model);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
