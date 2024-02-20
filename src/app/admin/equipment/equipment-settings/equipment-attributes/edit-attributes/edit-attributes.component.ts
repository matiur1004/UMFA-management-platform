import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormGroupState, MarkAsSubmittedAction} from 'ngrx-forms';
import {
  EquipmentAttributeViewModel,
  EquipmentComboSettingsViewModel,
  EquipmentGroupViewModel,
  EquipmentUnitViewModel,
  FieldType
} from '@models';
import {EquipmentService} from '@services';
import {InitState} from '../../../shared/store/reducers/edit-attributes.store';
import * as editAttributes from '../../../shared/store/reducers';
import * as editAttributesActions from '../../../shared/store/actions/edit-attributes.actions';

@Component({
  selector: 'edit-attributes',
  templateUrl: './edit-attributes.component.html',
  styleUrls: ['./edit-attributes.component.less']
})
export class EditAttributesComponent implements OnInit {

  @Input() model: EquipmentAttributeViewModel = new EquipmentAttributeViewModel();

  public isNew: boolean;
  equipmentGroups: EquipmentGroupViewModel[] = new Array<EquipmentGroupViewModel>();
  formState$: Observable<FormGroupState<any>>;
  destroyed = new Subject();
  fieldType: FieldType;
  FieldType = FieldType;
  unitList: EquipmentUnitViewModel[] = [];
  comboSettingList: EquipmentComboSettingsViewModel[] = [];
  equipmentGroupList: string[] = [];
  comboSettingsValueList: string[] = [];
  isEdit = false;
  formState: any;
  fieldTypes = [
    {
      name: 'Numeric input',
      id: FieldType.Number
    },
    {
      name: 'Predefined list',
      id: FieldType.Combo
    },
    {
      name: 'Ratio input',
      id: FieldType.Ratio
    }];
  private form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private equipmentService: EquipmentService,
              private activeModal: NgbActiveModal,
              private store: Store<editAttributes.State>) {
    this.formState$ = store.pipe(select(editAttributes.getAttributeForm));

  }

  ngOnInit() {
    if (this.model.id) {
      this.isEdit = true;
      if (!this.model.unit) {
        this.model.unit = {id: null, name: null};
      }
      this.store.dispatch(new editAttributesActions.AttributesInitForEdit({value: this.model}));
    } else {
      this.store.dispatch(new editAttributesActions.AttributesInit());
    }
    this.store.dispatch(new editAttributesActions.AttributesGetUnits());
    this.store.pipe(select(editAttributes.getAttributesFieldType), takeUntil(this.destroyed)).subscribe(fieldType => {
      this.fieldType = fieldType;
    });
    this.store.pipe(select(editAttributes.getComboOptions), takeUntil(this.destroyed)).subscribe(combo => {
      this.comboSettingsValueList = combo.map(c => c.value);
    });
    this.store.pipe(select(editAttributes.getUnitList), takeUntil(this.destroyed)).subscribe(options => {
      if (options) {
        this.unitList = options.units;
        this.comboSettingList = options.comboSettings;
        this.equipmentGroups = options.groups;
      }
    });
    this.store.pipe(select(editAttributes.getEquipmentGroup), takeUntil(this.destroyed)).subscribe(equipmentGroups => {
      this.equipmentGroupList = equipmentGroups.map(x => x.id);
    });
    this.store.pipe(select(editAttributes.getAttributeFormState), takeUntil(this.destroyed)).subscribe(value => {
      this.formState = value.formState;
    });
  }

  close() {
    this.activeModal.close();
  }

  insertAccount() {
    if (this.form.valid && this.isNew) {
      this.equipmentService.createEquipmentAttribute(this.form.value).subscribe(() => {
        this.activeModal.close();
      });
    } else if (this.form.valid) {
      this.equipmentService.updateEquipmentAttribute(this.model.id, this.form.value).subscribe(() => {
        this.activeModal.close();
      });
    } else {
      //this.onValueFormChange();
    }
  }

  getEquipmentGroupsIds() {
    return this.model.equipmentGroups.map(g => g.id);
  }

  getEquipmentGroups() {
    return this.model.equipmentGroups.map(d => this.formBuilder.group({id: [d.id], name: [d.name]}));
  }

  onEquipmentGroupChange(equipmentGroups: EquipmentGroupViewModel[]) {
    const equipmentGroupsControls = <FormArray>this.form.controls['equipmentGroups'];

    while (equipmentGroupsControls.length !== 0) {
      equipmentGroupsControls.removeAt(0);
    }

    equipmentGroups.forEach(equipmentGroup => {
      const formGrp = this.formBuilder.group({id: [equipmentGroup.id], name: [equipmentGroup.name]});
      equipmentGroupsControls.push(formGrp);
    });
  }

  changeUnit(e) {
    if (typeof e === 'string') {
      e = {name: e};
    }
    if (!e.id) {
      const index = this.unitList.findIndex(u => u.name === e.name);
      if (index < 0) {
        this.unitList.push({name: e.name, id: null});
      }
      this.store.dispatch(new editAttributesActions.AttributesSetUnits({
        value: {units: this.unitList, comboSettings: this.comboSettingList, groups: this.equipmentGroups}
      }));
      this.store.dispatch(new editAttributesActions.AttributesChangeUnit({value: {name: e.name, id: null}}));
    } else {
      this.store.dispatch(new editAttributesActions.AttributesChangeUnit({value: e}));
    }
  }

  save() {
    this.store.dispatch(new MarkAsSubmittedAction(InitState.id));
    if (Object.keys(this.formState.errors).length > 0) {
      return;
    }
    this.store.dispatch(new editAttributesActions.AttributesCreate({modal: this.activeModal}));
  }

  edit() {
    this.store.dispatch(new MarkAsSubmittedAction(InitState.id));
    if (Object.keys(this.formState.errors).length > 0) {
      return;
    }
    this.store.dispatch(new editAttributesActions.AttributesEdit({modal: this.activeModal}));
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  changeFieldType() {
    this.store.dispatch(new editAttributesActions.AttributesChangeFieldType({value: this.fieldType}));
  }

  selectGroup(event) {
    this.store.dispatch(new editAttributesActions.AttributesAddGroup({
      group: event
    }));
  }

  removeGroup(event) {
    this.store.dispatch(new editAttributesActions.AttributesRemoveGroup({
      group: event.value
    }));
  }

  addCombo(event) {
    let option = event;
    if (typeof option === 'string') {
      option = {value: option};
    }
    option['id'] = null;
    this.store.dispatch(new editAttributesActions.AttributesAddComboOptions({
      value: option
    }));
  }

  removeCombo(event) {
    this.store.dispatch(new editAttributesActions.AttributesRemoveComboOptions({value: event.value}));
  }
}
