import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {forkJoin} from 'rxjs';
import {
  BrandViewModel,
  EquipmentAttributeViewModel,
  EquipmentGroupViewModel,
  EquipmentTemplateAttributeViewModel,
  EquipmentTemplateRegisterViewModel,
  EquipmentTemplateViewModel,
  FieldType,
  RegisterViewModel,
  SupplyType,
  ObisCodeViewModel
} from '@models';
import {EquipmentService} from '@services';
import {moveItemInArray, ratioMask, ratioPlaceholderMask, ratioRegex} from '@shared-helpers';
import {Store} from "@ngrx/store";
import * as fromEquipment from "@app/branch/buildings/manage-building/building-equipment/shared/store/reducers";
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrls: ['./create-equipment.component.less']
})
export class CreateEquipmentComponent implements OnInit {

  public model: EquipmentTemplateViewModel = new EquipmentTemplateViewModel();
  public equipmentId: string = null;
  public isNew: boolean;
  public form: FormGroup;
  public selectedEquipmentGroupText = 'Select equipment group';
  public selectedBrandText = 'Select brand';
  public defaultImage = 'assets/images/upload-file/upload-img-preview.svg';
  public isSubmitted = false;
  ratioMask = ratioMask;
  ratioPlaceholderMask = ratioPlaceholderMask;
  public supplyType = SupplyType;
  public supplyTypesList = [SupplyType.Electricity, SupplyType.Water, SupplyType.Gas, SupplyType.Sewerage, SupplyType.AdHoc];

  allEquipmentGroups: EquipmentGroupViewModel[] = new Array<EquipmentGroupViewModel>();
  allBrands: BrandViewModel[] = new Array<BrandViewModel>();
  allAttribs: EquipmentAttributeViewModel[] = new Array<EquipmentAttributeViewModel>();
  allRegisters: RegisterViewModel[] = new Array<RegisterViewModel>();
  fieldTypes = FieldType;
  settingsInAttribute = {} as any;
  selectedComboOptions = {} as any;

  equipmentGroupsBySupplyType: EquipmentGroupViewModel[] = new Array<EquipmentGroupViewModel>();
  brandsByEquipmentGroup: BrandViewModel[] = new Array<BrandViewModel>();

  equipmentRegisters: EquipmentTemplateRegisterViewModel[] = new Array<EquipmentTemplateRegisterViewModel>();
  excludedEquipmentRegisters: RegisterViewModel[] = new Array<RegisterViewModel>();

  selectedIcon0: string = "../../../../../../assets/images/icons/equipment/registerTypes/cumulative.svg";
  selectedIconAlt0: string = "Cumulative";
  selectedIcon1: string = "../../../../../../assets/images/icons/equipment/registerTypes/resetted-max.svg";
  selectedIconAlt1: string = "Resetted-Max";
  selectedIcon2: string = "../../../../../../assets/images/icons/equipment/registerTypes/resetted.svg";
  selectedIconAlt2: string = "Resetted";

  equipmentAttribs: EquipmentTemplateAttributeViewModel[] = new Array<EquipmentTemplateAttributeViewModel>();
  excludedEquipmentAttribs: EquipmentAttributeViewModel[] = new Array<EquipmentAttributeViewModel>();
  logoUrl: string = null;
  public formErrors = {'model': ''}
  private typeComboOptions = {
    wholeCurrentMeter: 'Whole current Meter',
    ctMeter: 'CT Meter',
    highVoltageMeter: 'High Voltage Meter'
  };
  private attribNames = {
    type: 'Type',
    ctRatio: 'CT Ratio',
    ptRatio: 'PT Ratio'
  };
  private validationMessages = {
    'model': {
      'required': 'Model is required'
    }
  };

  private electricityMeterAttributes = ['voltage', 'phase', 'cb size'];

  constructor(private formBuilder: FormBuilder,
              private equipmentService: EquipmentService,
              private activeModal: NgbActiveModal,
              private store: Store<fromEquipment.State>,
              private fb: FormBuilder) {
  }

  get formAttributes(): FormArray {
    return this.form.controls['equipmentAttributes'] as FormArray;
  }

  get formRegisters(): FormArray {
    return this.form.controls['equipmentRegisters'] as FormArray;
  }

  get formEquipmentGroupId(): FormControl {
    return this.form.controls['equipmentGroupId'] as FormControl;
  }

  obisCodes: ObisCodeViewModel[]= new Array<ObisCodeViewModel>();

  ngOnInit(): void {
    const equipmentGroups = this.equipmentService.getAllEquipmentGroups('');
    const brands = this.equipmentService.getAllBrands('');
    const attribs = this.equipmentService.getAllEquipmentAttributes('');
    const registers = this.equipmentService.getAllRegisters('');
    this.equipmentService.getAllObisCodes('').subscribe((response) => {
      this.obisCodes = response;
    });
    const join = forkJoin(equipmentGroups, brands, attribs, registers);
    join.subscribe(result => {
      this.allEquipmentGroups = result[0] as EquipmentGroupViewModel[];
      this.allBrands = result[1] as BrandViewModel[];
      this.allAttribs = result[2] as EquipmentAttributeViewModel[];
      this.allRegisters = result[3] as RegisterViewModel[];

      if (!this.isNew) {
        this.equipmentService.getEquipmentTemplate(this.equipmentId).subscribe(response => {
          this.model = response;
          this.logoUrl = response.logoUrl;

          this.createForm(this.model);
          this.onSupplyTypeChange(this.model.supplyType);

          this.onEquipmentGroupChange(this.model.equipmentGroup);
          this.onBrandChange(this.model.brand);

          this.equipmentAttribs = this.model.attributes;
          this.createFormControlsForAttribs();
          this.updateExcludedAttribs();

          this.equipmentRegisters = this.model.registers
            .sort((a, b) => a.sequenceNumber < b.sequenceNumber ? -1 : (a.sequenceNumber > b.sequenceNumber ? 1 : 0))
            .map(x => {
              return {
                register: x,
                sequenceNumber: x.sequenceNumber,
                isBilling: x.isBilling,
                dialCount: x.dialCount,
                registerType: x.registerType,
                obisCode: x.obisCode
              }
            });

          this.createFormControlsForRegisters();
          this.updateExcludedRegisters();
        });

      } else {
        this.createForm(new EquipmentTemplateViewModel());
        this.onSupplyTypeChange(this.model.supplyType);
      }
    });

  }

  markRequiredAttributes(attributes: EquipmentTemplateAttributeViewModel[]): void {
    attributes.filter(a => this.electricityMeterAttributes.includes(a.attribute.name.toLowerCase()))
      .forEach(a => {
        a.attribute.isRequired = true;
      });
  }

  updateExcludedAttribs(): void {
    let attribsBySupplyType = this.allAttribs.slice();
    const equipmentGroupId = this.formEquipmentGroupId.value;

    if (equipmentGroupId) {
      attribsBySupplyType = attribsBySupplyType.filter(a => a.equipmentGroups.find(d => d.id === equipmentGroupId) != null);
    }

    const selectedAttribsIds = this.formAttributes.value.map(f => f.id);
    this.excludedEquipmentAttribs = attribsBySupplyType.filter(a => selectedAttribsIds.indexOf(a.id) === -1);
  }

  updateExcludedRegisters(): void {

    const registersBySupplyType = this.allRegisters.slice();
    const selectedRegistersIds = this.formRegisters.value.map(f => f.id);
    this.excludedEquipmentRegisters = registersBySupplyType
      .filter(r => r.supplyTypes
          .find(s => this.equipmentGroupsBySupplyType.length ? s === this.equipmentGroupsBySupplyType[0].supplyType : false) != null &&
        this.equipmentRegisters.find(x => x.register.id === r.id) == null)
      .filter(a => selectedRegistersIds.indexOf(a.id) === -1);
  }

  createForm(model: EquipmentTemplateViewModel): void {
    this.formGroupsBuilder(model);
    this.createFormControlsForAttribs();
    this.createFormControlsForRegisters();
    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  formGroupsBuilder(model: EquipmentTemplateViewModel): void {
    this.form = this.formBuilder.group({
      id: [model.id],
      model: [model.equipmentModel, Validators.required],
      supplyType: [model.supplyType, Validators.required],
      equipmentGroupId: [model.equipmentGroup.id, Validators.required],
      brandId: [model.brand.id, Validators.required],
      isOldModel: [model.isOldModel],
      isDisplayOBISCode: [model.isDisplayOBISCode],
      isFixedRegister: [model.isFixedRegister],
      equipmentAttributes: this.fb.array([]),
      equipmentRegisters: this.fb.array([]),
      logo: [null]
    });
  }

  logoChanged(file): void {
    this.form.controls['logo'].setValue(file);
  }

  setNumber(index: number): void {
    const numberValue = this.form.get('equipmentAttributes.' + index + '.numberValue').value;
    this.form.get('equipmentAttributes.' + index + '.numberValue').setValue(numberValue.replace(/[^0-9,.]/g, '').replace('.', ','));
  }

  createFormControlsForAttribs(): void {
    const control = this.formAttributes;

    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.markRequiredAttributes(this.equipmentAttribs);

    this.equipmentAttribs.forEach((element, i) => {
      control.push(
        this.getAttributeControl(element.attribute, element.value, element.numberValue ? +element.numberValue : 0)
      );
    });

    this.updateRatioAttributes();
  }

  createFormControlsForRegisters(): void {
    const control = this.formRegisters;

    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.equipmentRegisters.forEach((element, i) => {
      control.push(
        this.getRegisterControl(element.register, element.isBilling, element.dialCount, element.register.registerType, element.obisCode)
      );
    });

  }

  onValueFormChange(data?: any): void {
    if (!this.form) return;
    const form = this.form;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (this.isSubmitted && ((control && control.dirty && !control.valid) || (control && !control.valid))) {
        const message = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }

  getModel(): EquipmentTemplateViewModel {
    const data = this.form.value;
    const model = new EquipmentTemplateViewModel();
    model.id = data.id;
    model.equipmentModel = data.model;
    model.supplyType = data.supplyType;
    model.isOldModel = data.isOldModel;
    model.isDisplayOBISCode = data.isDisplayOBISCode;
    model.isFixedRegister = data.isFixedRegister;
    model.equipmentGroup = this.allEquipmentGroups.find(g => g.id === data.equipmentGroupId);
    model.brand = this.allBrands.find(b => b.id === data.brandId);
    model.logo = data.logo;
    model.logoUrl = this.logoUrl;

    data.equipmentAttributes.forEach((e) => {
      model.attributes.push({
        attribute: this.allAttribs.find(a => a.id === e.id),
        value: e.value,
        numberValue: e.numberValue
      });
    });

    data.equipmentRegisters.forEach((e) => {
      model.registers.push({
        ...this.allRegisters.find(r => r.id === e.id),
        sequenceNumber: e.sequenceNumber,
        isBilling: e.isBilling,
        dialCount: e.dialCount,
        obisCode: e.obisCode
      });
    });

    return model;
  }

  insertAccount(): void {
    if (this.form.valid && this.isNew) {
      this.equipmentService.createEquipmentTemplate(this.getModel()).subscribe(() => {
        this.activeModal.close();
      });
    } else if (this.form.valid) {
      this.equipmentService.updateEquipmentTemplate(this.model.id, this.getModel()).subscribe(() => {
        this.activeModal.close();
      });
    } else {
      this.onValueFormChange();
    }
  }

  onSupplyTypeChange(type: SupplyType): void {
    this.equipmentGroupsBySupplyType = this.allEquipmentGroups.filter(e => e.supplyType === type);

    if (this.formRegisters.value.length) {
      this.deleteRegister(this.formRegisters.value.map(f => f.id));
    }

    this.onEquipmentGroupChange(
      this.equipmentGroupsBySupplyType.length ? this.equipmentGroupsBySupplyType[0] : null
    );
  }

  onEquipmentGroupChange(equipmentGroup: EquipmentGroupViewModel): void {
    if (equipmentGroup == null) {
      this.selectedEquipmentGroupText = 'Select equipment group';
      this.form.controls['equipmentGroupId'].setValue(null);
      this.brandsByEquipmentGroup = [];
      this.equipmentAttribs = [];
      this.equipmentRegisters = [];

    } else {
      this.selectedEquipmentGroupText = equipmentGroup.name;
      this.form.controls['equipmentGroupId'].setValue(equipmentGroup.id);
      this.equipmentAttribs = this.getSystemAttribs(equipmentGroup.id);
      this.equipmentRegisters = [];
      this.selectedComboOptions = {} as any;

      this.brandsByEquipmentGroup = this.allBrands.filter(e => e.equipmentGroups.find(d => d.id === equipmentGroup.id) != null);
    }

    this.createFormControlsForAttribs();
    this.updateExcludedAttribs();
    this.updateExcludedRegisters();
    this.onBrandChange(this.brandsByEquipmentGroup.length ? this.brandsByEquipmentGroup[0] : null);
  }

  onBrandChange(brand: BrandViewModel): void {
    if (brand == null) {
      this.selectedBrandText = 'Select brand';
      this.form.controls['brandId'].setValue(null);

    } else {
      this.selectedBrandText = brand.name;
      this.form.controls['brandId'].setValue(brand.id);
    }
  }

  onComboSettingsChange(option: string, id: string): void {
    if (option) {
      this.selectedComboOptions[id] = option;
      const comboAttributeId = this.formAttributes.value.findIndex(attr => attr.id === id);
      this.form.get('equipmentAttributes.' + comboAttributeId + '.value').setValue(option);
      this.model = this.getModel();
    }

    const typeAttribIndex = this.formAttributes.value.find(x => x.name === this.attribNames.type);

    if (typeAttribIndex)
      this.updateRatioAttributes();
  }

  updateComboSettings(attributes: EquipmentTemplateAttributeViewModel[]): void {
    this.selectedComboOptions = {};
    attributes.forEach((item, i, attributes) => {
      if (attributes[i].value != '')
        this.selectedComboOptions[i] = attributes[i].value;
    });
  }

  updateRatioAttributes(): void {
    if (!this.isNew) return;
    const formAttribs = this.formAttributes.value;
    const typeAttrib = formAttribs.find(x => x.name === this.attribNames.type);

    if (typeAttrib == null || !typeAttrib.value) {
      return;
    }

    const ctRatioAttr = formAttribs.find(x => x.name === this.attribNames.ctRatio);
    const ptRatioAttr = formAttribs.find(x => x.name === this.attribNames.ptRatio);

    const ctRatioId = ctRatioAttr ? ctRatioAttr.id : '';
    const ptRatioId = ptRatioAttr ? ptRatioAttr.id : '';

    if (typeAttrib.value === this.typeComboOptions.wholeCurrentMeter) {

      const ratioAttributes = [ctRatioId, ptRatioId].filter(item => item !== '');

      if (ratioAttributes.length) {
        this.deleteAttribute(ratioAttributes);
      }

    } else if (typeAttrib.value === this.typeComboOptions.ctMeter) {

      if (!ctRatioId) {
        const ctRatioAttribute = this.allAttribs.find(x => x.name === this.attribNames.ctRatio && x.isSystem);
        this.addAttribute(ctRatioAttribute);
      }
      if (ptRatioId) {
        this.deleteAttribute([ptRatioId]);
      }

    } else if (typeAttrib.value === this.typeComboOptions.highVoltageMeter) {

      if (!ctRatioId) {
        const ctRatioAttribute = this.allAttribs.find(x => x.name === this.attribNames.ctRatio && x.isSystem);
        this.addAttribute(ctRatioAttribute);
      }

      if (!ptRatioId) {
        const ptRatioAttribute = this.allAttribs.find(x => x.name === this.attribNames.ptRatio && x.isSystem);
        this.addAttribute(ptRatioAttribute);
      }
    }

    this.updateExcludedAttribs();
  }

  getSystemAttribs(equipmentGroupId: string) {
    const systemAttribs = this.allAttribs.filter(a => a.equipmentGroups.find(d => d.id === equipmentGroupId) != null && a.isSystem);

    return systemAttribs.map(s => {
      return {
        attribute: s,
        value: '',
        numberValue: ''
      };
    });
  }

  getAttributeControl(attrib, value = '', numberValue = 0): FormGroup {
    return this.fb.group({
      id: [attrib.id],
      name: [attrib.name],
      fieldType: [attrib.fieldType],
      value: this.fb.control(value, attrib.fieldType === FieldType.Ratio ? Validators.pattern(ratioRegex) : null),
      numberValue: [numberValue]
    });
  }

  addAttribute(attrib): void {
    this.formAttributes.push(this.getAttributeControl(attrib));

    this.equipmentAttribs.push({
      attribute: attrib,
      value: '',
      numberValue: ''
    });

    if (attrib.name === this.attribNames.type) {
      this.updateRatioAttributes();
    }

    this.updateExcludedAttribs();
    this.form.updateValueAndValidity();
  }

  deleteAttribute(attributes: string[]): void {
    attributes.forEach(attribute => {
      const attributeIndex = this.formAttributes.value.findIndex(attr => attr.id === attribute);
      this.formAttributes.removeAt(attributeIndex);
    });
    this.updateForm();
    this.updateExcludedAttribs();
  }

  getRegisterControl(register: RegisterViewModel, isBilling = true, dialCount = 5, registerType = 0, obisCode = ''): FormGroup {
    return this.fb.group({
      id: register.id,
      name: register.name,
      isBilling: isBilling,
      dialCount: dialCount,
      registerType: registerType,
      obisCode: obisCode
    });
  }

  addRegister(register): void {
    register.sequenceNumber = this.formRegisters.length;
    this.formRegisters.push(this.getRegisterControl(register, true, 5, register.registerType, register.obisCode));

    this.equipmentRegisters.push({
      register: register,
      sequenceNumber: register.sequenceNumber,
      dialCount: register.dialCount,
      isBilling: register.isBilling,
      registerType: register.registerType,
      obisCode: register.obisCode
    });

    this.updateExcludedRegisters();
    this.form.updateValueAndValidity();
  }

  deleteRegister(registers: string[]): void {
    registers.forEach(register => {
      const index = this.formRegisters.value.findIndex(r => r.id === register);
      this.formRegisters.removeAt(index);
    });
    this.updateForm();
    this.updateExcludedRegisters();
  }

  updateForm(): void {
    this.model = this.getModel();
    this.equipmentAttribs = this.model.attributes;
    this.equipmentRegisters = this.model.registers.map(x => {
      return {
        register: x,
        sequenceNumber: x.sequenceNumber,
        isBilling: x.isBilling,
        dialCount: x.dialCount,
        registerType: x.registerType,
        obisCode: x.obisCode
      }
    });
    this.updateComboSettings(this.equipmentAttribs);
    this.form.reset();
    this.createForm(this.model);
  }

  save(): void {
    this.isSubmitted = true;
    this.insertAccount();
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  onDropRegisters(event: CdkDragDrop<EquipmentTemplateRegisterViewModel[]>): void {
    const formRegisters = this.form.controls.equipmentRegisters.value;
    moveItemInArray(formRegisters, event.previousIndex, event.currentIndex);
    this.form.controls.equipmentRegisters.patchValue(formRegisters);
  }

}
