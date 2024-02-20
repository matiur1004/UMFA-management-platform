import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArrayState, FormGroupState} from 'ngrx-forms';
import {MeterPhotoType, MeterRegisterViewModel} from '../../shared/models';
import {FieldType, SupplyType, ObisCodeViewModel} from '@models';
import { formatBuildingDate, formatNgbDatePickerDate, NgbDateFRParserFormatter, ngbDateNgrxValueConverter, ratioMask, ratioPlaceholderMask} from '@shared-helpers';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import { EquipmentService } from '@services';
import { RegisterType } from '@models';
import { BuildingPeriodViewModel } from '../../../shared/models/building-period.model';

@Component({
  selector: 'equipment-attributes',
  templateUrl: './equipment-attributes.component.html',
  styleUrls: ['./equipment-attributes.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquipmentAttributesComponent implements OnInit {

  @Input() equipmentTemplates: any[];
  @Input() meters: any[];
  @Input() equipmentTemplateForm: FormGroupState<any>;
  @Input() notIncludedRegisters: any[];
  @Input() isFixedRegister: boolean;

  @Input() actualPhotoUrl: string;
  @Input() registerFiles: any;
  @Input() equipmentRegistersDict: any;
  @Input() buildingPeriod: BuildingPeriodViewModel;

  @Output() deviceChanges = new EventEmitter();
  @Output() comboSettingsChange = new EventEmitter();

  @Output() removeRegister = new EventEmitter();
  @Output() addRegister = new EventEmitter();
  @Output() registerScaleChange = new EventEmitter();
  @Output() registerSequenceChange = new EventEmitter<CdkDragDrop<MeterRegisterViewModel[]>>();

  @Output() close = new EventEmitter();
  @Output() nextStep = new EventEmitter();
  @Output() openImage = new EventEmitter();
  @Output() registerFileChange = new EventEmitter();

  @Output() parentMeterChanges = new EventEmitter();

  meterPhotoType = MeterPhotoType;
  supplyType = SupplyType;
  fieldTypes = FieldType;
  obisCodes: ObisCodeViewModel[]= new Array<ObisCodeViewModel>();
  dateNgrxValueConverter = ngbDateNgrxValueConverter;
  ratioMask = ratioMask;
  ratioPlaceholderMask = ratioPlaceholderMask

  selectedIcon0: string = "../../../../../../assets/images/icons/equipment/registerTypes/cumulative.svg";
  selectedIconAlt0: string = "Cumulative";
  selectedIcon1: string = "../../../../../../assets/images/icons/equipment/registerTypes/resetted-max.svg";
  selectedIconAlt1: string = "Resetted-Max";
  selectedIcon2: string = "../../../../../../assets/images/icons/equipment/registerTypes/resetted.svg";
  selectedIconAlt2: string = "Resetted";

  photo: string;
  logo = null;

  defaultImageUrl: string = null;

  ngbMinDateStr: object;
  ngbMaxDateStr: object;

  constructor(private equipmentService: EquipmentService) {
  }

  get registers() {
    var regs = this.equipmentTemplateForm.controls.registers as FormArrayState<any>;
    this.updateRegisters(regs)
    return regs;
  }

  get attributes() {
    return this.equipmentTemplateForm.controls.attributes as FormArrayState<any>;
  }

  isAttrPhotoAdded(control) {
    return !!(control.value.newPhotoUrl || control.value.photoUrl);
  }

  ngOnInit(): void {
    this.defaultImageUrl = this.actualPhotoUrl || this.equipmentTemplateForm.controls.equipmentPhotoUrl.value;
    this.equipmentService.getAllObisCodes('').subscribe((response) => {
      this.obisCodes = response;
    });

    this.updateRegisters(this.equipmentTemplateForm.controls.registers)
    this.ngbMinDateStr = formatNgbDatePickerDate(formatBuildingDate(this.buildingPeriod.startDate.split("T")[0]));
    this.ngbMaxDateStr = formatNgbDatePickerDate(formatBuildingDate(this.buildingPeriod.endDate.split("T")[0]));
  }

  trackById(index, item) {
    return index;
  }

  onClickEquipmentTemplatePhoto() {
    let photoUrl = null;
    let meterType = null;

    if (this.actualPhotoUrl) {
      photoUrl = this.actualPhotoUrl;
      meterType = this.meterPhotoType.ActualPhoto;
    } else {
      photoUrl = this.equipmentTemplateForm.controls.equipmentPhotoUrl.value;
      meterType = this.meterPhotoType.MainPhoto;
    }

    this.openImage.emit({url: photoUrl, meterPhotoType: meterType});
  }

  updateRegisters(regs) {
    regs.value.forEach(reg => {
      if (reg != null) {
        switch (reg.name) {
          case "kVA": {
            reg.registerType = RegisterType.ResetMax;
            break;
          }
          case "kWh": {
            reg.registerType = RegisterType.Reset;
            break;
          }
          case "kWh-O": {
            reg.registerType = RegisterType.ResetMax;
            break;
          }
          case "kWh-P": {
            reg.registerType = RegisterType.ResetMax;
            break;
          }
          case "kWh-S": {
            reg.registerType = RegisterType.ResetMax;
            break;
          }
          case "kVArh": {
            reg.registerType = RegisterType.Consumption;
            break;
          }
          default: {
            break;
          }
        }
      }
    });
  }

  logoChanged(result) {
    this.openImage.emit({url: this.actualPhotoUrl, meterPhotoType: this.meterPhotoType.ActualPhoto, result: result})
  }

  onClickNext() {
    this.nextStep.emit(1);
  }

  onParentsListChanged(event) {
    this.parentMeterChanges.emit(event);
  }

  onDropRegisters(event: CdkDragDrop<MeterRegisterViewModel[]>) {
    this.registerSequenceChange.emit(event);
  }
}
