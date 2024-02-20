import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArrayState, FormGroupState} from 'ngrx-forms';
import {
  registerAndReadingsStepActionTypes,
  RegistersAndReadingsStepActionType,
  Step
} from '../../shared/models/bulk-action.model';
import {formatBuildingDate, formatNgbDatePickerDate, NgbDateFRParserFormatter, ngbDateNgrxValueConverter} from '@shared-helpers';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MeterRegisterViewModel} from '../../shared/models';
import {MeterRegistersFormValue} from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers/bulk-equipment-wizard-reducers/registers-and-readings-step.store';
import {SupplyType, ObisCodeViewModel, BuildingFilter, BuildingFilterTypeDropdownItems, SupplyTypeDropdownItems, LocationViewModel, EquipmentTemplateListItemViewModel} from '@models';
import {EquipmentService} from '@services';
import { RegisterType } from '@models'
import { FilterAttribute } from '../../shared/models/search-filter.model';
import { BuildingPeriodViewModel } from '../../../shared/models/building-period.model';

@Component({
  selector: 'registers-and-readings',
  templateUrl: './registers-and-readings.component.html',
  styleUrls: ['./registers-and-readings.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class RegistersAndReadingsComponent implements OnInit {

  @Input() form: FormGroupState<any>;
  @Input() total: number;
  @Input() notIncludedRegisters: any;
  @Input() registerFiles: any;
  @Input() equipmentRegistersDictionary: any;
  @Input() isSelectedAllMeters: boolean;
  @Input() isSelectedOneOrMoreMeters: boolean;
  @Input() locationList: LocationViewModel[];
  @Input() equipmentGroups: any[];
  @Input() deviceTypes: EquipmentTemplateListItemViewModel[];
  @Input() buildingPeriod: BuildingPeriodViewModel;
  
  @Output() selectAllMeters = new EventEmitter();
  @Output() removeRegister = new EventEmitter();
  @Output() addRegister = new EventEmitter();
  @Output() registerFileChange = new EventEmitter();
  @Output() registerScaleChange = new EventEmitter();
  @Output() applyBulkValue = new EventEmitter();
  @Output() sequenceRegis = new EventEmitter();
  @Output() registerSequenceChange = new EventEmitter<{ dropEvent: CdkDragDrop<MeterRegisterViewModel[]>, serialNumber: string }>();
  @Output() close = new EventEmitter();
  @Output() nextStep = new EventEmitter();
  @Output() filter: EventEmitter<FilterAttribute> = new EventEmitter<FilterAttribute>();
  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;
  actionType = RegistersAndReadingsStepActionType;
  actionTypes = registerAndReadingsStepActionTypes;
  filteredBulkActions: any[];
  bulkAction: RegistersAndReadingsStepActionType = RegistersAndReadingsStepActionType.SetRegisterNote;
  bulkValue: any;
  step = Step.RegistersAndReadings;
  checkedAllPartly: boolean;
  supplyType = SupplyType;
  private _selectedRegisters: number;
  obisCodes: ObisCodeViewModel[] = new Array<ObisCodeViewModel>();

  selectedIcon0: string = "../../../../../../assets/images/icons/equipment/registerTypes/cumulative.svg";
  selectedIconAlt0: string = "Cumulative";
  selectedIcon1: string = "../../../../../../assets/images/icons/equipment/registerTypes/resetted-max.svg";
  selectedIconAlt1: string = "Resetted-Max";
  selectedIcon2: string = "../../../../../../assets/images/icons/equipment/registerTypes/resetted.svg";
  selectedIconAlt2: string = "Resetted";

  supplyTypeModel: SupplyType = -1;
  locationModel = -1;
  equipmentGroupModel = -1;
  deviceTypeModel = -1;

  filterTypeModel: BuildingFilter = -1;
  filterTypes = BuildingFilter;

  searchTerm = '';
  public filterTypesList = BuildingFilterTypeDropdownItems;
  public supplyTypesList = SupplyTypeDropdownItems;
  
  ngbMinDateStr: object;
  ngbMaxDateStr: object;
  
  get selectedRegisters() {
    return this._selectedRegisters;
  }

  @Input() set selectedRegisters(registers: number) {
    this._selectedRegisters = registers;
    this.checkedAllPartly = this.selectedRegisters > 0 && this.meters.value.length !== this.selectedRegisters;
  }

  get meters() {
    var selectedMeters = this.form.controls.meters as FormArrayState<MeterRegistersFormValue[]>;
    this.updateRegisters(selectedMeters);
    return selectedMeters;
  }

  constructor(private equipmentService: EquipmentService) {
  }

  ngOnInit() {
    this.getFilteredBulkActions();
    this.equipmentService.getAllObisCodes('').subscribe((response) => {
    this.obisCodes = response;
    });
    this.updateRegisters(this.form.controls.meters);
    this.deviceTypes = this.deviceTypes.filter((item) => item.isAssigned == true);
    this.locationList = this.locationList.sort((a, b) => a.name > b.name ? 1 : -1);
    this.deviceTypes = this.deviceTypes.sort((a, b) => a.model > b.model ? 1 : -1);
    this.equipmentGroups = this.equipmentGroups.sort((a, b) => a.name > b.name ? 1 : -1);

    this.ngbMinDateStr = formatNgbDatePickerDate(formatBuildingDate(this.buildingPeriod.startDate.split("T")[0]));
    this.ngbMaxDateStr = formatNgbDatePickerDate(formatBuildingDate(this.buildingPeriod.endDate.split("T")[0]));
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

  trackById(index) {
    return index;
  }

  getFilteredBulkActions() {
    this.filteredBulkActions = this.actionTypes.filter(item => item !== this.bulkAction);
  }

  onDropRegisters(event: CdkDragDrop<MeterRegisterViewModel[]>, serialNumber: string) {
    this.registerSequenceChange.emit({dropEvent: event, serialNumber});
  }

  onChangeFilterType(type) {
    this.filterTypeModel = type;
    this.filter.emit({category: this.filterTypeModel, supplyType: this.supplyTypeModel, location: this.locationModel, equipmentGroup: this.equipmentGroupModel, device: this.deviceTypeModel, searchTerm: this.searchTerm});
  }

  onSearchBySupplyType(supplyType: SupplyType) {
    this.supplyTypeModel = supplyType;
    this.filter.emit({category: this.filterTypeModel, supplyType: this.supplyTypeModel});
  }

  onSearchByLocation(location: any) {
    this.locationModel = location;
    this.filter.emit({category: this.filterTypeModel, location: this.locationModel});
  }

  onSearchByEquipmentModel(equipmentGroup){
    this.equipmentGroupModel = equipmentGroup;
    this.filter.emit({category: this.filterTypeModel, equipmentGroup: this.equipmentGroupModel});
  }

  onSearchByDeviceType(deviceType) {
    this.deviceTypeModel = deviceType;
    this.filter.emit({category: this.filterTypeModel, device: this.deviceTypeModel});
  }
  
  search(searchTerm: string) {
    this.searchTerm = searchTerm.trim().toLowerCase();
    this.filter.emit({category: this.filterTypeModel, searchTerm});
  }
}
