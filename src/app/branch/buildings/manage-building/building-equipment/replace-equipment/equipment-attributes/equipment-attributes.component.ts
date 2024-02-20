import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArrayState, FormGroupState} from 'ngrx-forms';
import {MeterPhotoType, MeterRegisterViewModel} from '../../shared/models';
import {EquipmentAttributeValueViewModel, FieldType, SupplyType} from '@models';
import {NgbDateFRParserFormatter, ngbDateNgrxValueConverter, ratioMask, ratioPlaceholderMask} from '@shared-helpers';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
  selector: 'replace-equipment-attributes',
  templateUrl: './equipment-attributes.component.html',
  styleUrls: ['./equipment-attributes.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ReplaceEquipAttributesComponent implements OnInit {

  @Input() equipmentTemplates: any[];
  @Input() meters: any[];
  @Input() parentMeter: any;
  @Input() equipmentTemplateForm: FormGroupState<any>;
  @Input() notIncludedRegisters: any[];

  @Input() actualPhotoUrl: string;
  @Input() registerFiles: any;
  @Input() equipmentRegistersDict: any;

  @Input() replacementDate: any;

  @Output() deviceChanges = new EventEmitter();
  @Output() comboSettingsChange = new EventEmitter();

  @Output() removeRegister = new EventEmitter();
  @Output() addRegister = new EventEmitter();
  @Output() registerScaleChange = new EventEmitter();
  @Output() registerSequenceChange = new EventEmitter<CdkDragDrop<MeterRegisterViewModel[]>>();

  @Output() close = new EventEmitter();
  @Output() nextStep = new EventEmitter();
  @Output() actualPhotoChange = new EventEmitter();
  @Output() attributePhotoChange = new EventEmitter();
  @Output() registerFileChange = new EventEmitter();

  @Output() parentMeterChanges = new EventEmitter();

  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;

  meterPhotoType = MeterPhotoType;
  supplyType = SupplyType;
  fieldTypes = FieldType;
  ratioMask = ratioMask;
  ratioPlaceholderMask = ratioPlaceholderMask;
  photo: string;

  constructor() {
  }

  get attributes() {
    return this.equipmentTemplateForm.controls.attributes as FormArrayState<EquipmentAttributeValueViewModel[]>;
  }

  get registers() {
    return this.equipmentTemplateForm.controls.registers as FormArrayState<any>;
  }

  ngOnInit() {
  }

  onChangeEquipmentModel(id: string) {
    this.deviceChanges.emit(id);
  }

  isAttrPhotoAdded(control) {
    return !!(control.value.newPhotoUrl || control.value.photoUrl);
  }

  trackById(index, item) {
    return index;
  }

  onDropRegisters(event: CdkDragDrop<MeterRegisterViewModel[]>) {
    this.registerSequenceChange.emit(event);
  }
}
