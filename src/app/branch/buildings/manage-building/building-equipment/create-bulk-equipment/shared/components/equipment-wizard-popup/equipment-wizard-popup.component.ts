import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {
  equipmentBulkStepActionText,
  EquipmentBulkStepActionType,
  registersAndReadingsStepActionText,
  RegistersAndReadingsStepActionType,
  shopBulkStepActionText,
  ShopsStepActionType,
  ShopStepDescriptionFieldType,
  Step
} from '@app/branch/buildings/manage-building/building-equipment/shared/models/bulk-action.model';
import {Observable, Subscription} from 'rxjs';
import {Dictionary, EquipmentGroupViewModel, FieldType, LocationViewModel, TemplateListItemViewModel} from '@models';
import {
  NgbDateFRParserFormatter,
  NgbDateFullParserFormatter,
  ngbDateNgrxValueConverter,
  ratioMask
} from '@shared-helpers';
import {MeterViewModel} from '@app/branch/buildings/manage-building/building-equipment/shared/models';

@Component({
  selector: 'add-new-meter',
  templateUrl: './equipment-wizard-popup.component.html',
  styleUrls: ['./equipment-wizard-popup.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFullParserFormatter}, {
    provide: NgbDateParserFormatter,
    useClass: NgbDateFRParserFormatter
  }]
})

export class EquipmentWizardPopupComponent implements OnInit, OnDestroy {
  bulkAction: any;
  public bulkValue: any;
  public descriptionValue: string;
  public step: Step;
  public equipmentGroup: any;
  public equipmentGroupAttributes: { [id: string]: any; } = {};
  ratioMask = ratioMask;
  public fieldTypes = FieldType;
  public stepAction = Step;
  public locationTypes: Dictionary<Array<any>> = {};
  public locationType: Dictionary<string> = {};
  public unitOptions$: Observable<any[]>;
  locations$: Observable<LocationViewModel[]>;
  selectedGroupsParents$: Observable<Dictionary<{ groupName: string; parentMeters: MeterViewModel[] }>>;
  selectedLocationAndSupplies$: Observable<Dictionary<{ groupName: string, supplyTypes: Array<any> }>>;
  selectedGroups$: Observable<Dictionary<{ group: EquipmentGroupViewModel, devices: TemplateListItemViewModel[] }>>;
  dropdownData$: Observable<any>;
  equipmentStepActionType = EquipmentBulkStepActionType;
  registersReadingsType = RegistersAndReadingsStepActionType;
  shopStepActionType = ShopsStepActionType;
  bulkStepActionText = equipmentBulkStepActionText;
  bulkShopActionText = shopBulkStepActionText;
  bulkRegistersActionText = registersAndReadingsStepActionText;
  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;
  selectedDevices: Dictionary<{ group: EquipmentGroupViewModel; devices: TemplateListItemViewModel[] }>;
  selectedParents: Dictionary<{ groupName: string; parentMeters: MeterViewModel[] }>;
  selectedLocationsAndSupplies: Dictionary<{ supplyTypes: Array<any>; }>;
  descriptionFieldtype = ShopStepDescriptionFieldType;
  setDescriptionItems: any = [
    {name: 'Serial Number', id: ShopStepDescriptionFieldType.SerialNumber},
    {name: 'Equipment Group', id: ShopStepDescriptionFieldType.EquipmentGroup},
    {name: 'Device Type', id: ShopStepDescriptionFieldType.DeviceType},
    {name: 'Parent', id: ShopStepDescriptionFieldType.Parent}, 
    {name: 'Supply To', id: ShopStepDescriptionFieldType.SupplyTo},
    {name: 'Location Type', id: ShopStepDescriptionFieldType.LocationType}, 
    {name: 'Units', id: ShopStepDescriptionFieldType.Units}, 
    {name: 'Free Text', id: ShopStepDescriptionFieldType.FreeText}];
  private selectedSub: Subscription;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.selectedSub = this.selectedLocationAndSupplies$.subscribe(data => {
      this.selectedLocationsAndSupplies = data;
      Object.keys(data).forEach(group => {
        this.locationTypes[group] = [];
        this.locationType[group] = null;
      });
    });

    // Observable for parentMeters Second Wizard step
    this.selectedSub = this.selectedGroupsParents$.subscribe(d => this.selectedParents = d);

    // Observable for set Device First Wizard step
    this.selectedSub = this.selectedGroups$.subscribe(s => this.selectedDevices = s);

    this.equipmentGroup?.meters.forEach(meter => {
      this.equipmentGroup.headerAttributes.forEach(attribute => {
        if (!this.equipmentGroupAttributes[attribute.id]) {
          this.equipmentGroupAttributes[attribute.id] = meter.attributes[attribute.id];
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.selectedSub && this.selectedSub.unsubscribe();
  }

  trackById(index) {
    return index;
  }


  onCancel() {
    this.activeModal.close();
  }

  objectDevices() {
    return Object.keys(this.selectedDevices);
  }

  objectLocationsSupplies() {
    return Object.keys(this.selectedLocationsAndSupplies);
  }

  objectParents() {
    return Object.keys(this.selectedParents);
  }

  onSet() {
    if (this.bulkAction !== this.equipmentStepActionType.SetDevice
      && this.bulkAction !== this.shopStepActionType.SetParentMeter) {
      this.bulkValue = this.bulkValue && this.bulkValue.id
        ? this.bulkValue.id
        : this.bulkValue;
    }
    this.activeModal.close({bulkAction: this.bulkAction, bulkValue: this.bulkValue, description: this.descriptionValue});
  }

  onSetDevice(groupId: string, id: string) {
    if (!this.bulkValue) {
      this.bulkValue = {};
    }
    this.bulkValue[groupId] = {device: id};
  }

  onSetParentMeters(groupId: string, parentMeters: Array<string>) {
    this.bulkValue = {};
    this.bulkValue[groupId] = {parentMeters};
  }

  onChangeSupplyType(groupId: string, supplyTo) {
    if (!this.bulkValue) {
      this.bulkValue = {};
    }

    this.locationType[groupId] = null;

    this.bulkValue[groupId] = {
      ...this.bulkValue[groupId],
      supplyToId: supplyTo.id,
    };

    const suppliesTo = this.selectedLocationsAndSupplies[groupId].supplyTypes;
    const supplyTypes = suppliesTo.find(s => s.id === supplyTo.id).supplyTypes;
    this.locationTypes[groupId] = supplyTypes.length ? supplyTypes[0].supplyToLocations : [];
  }

  onChangeLocation(groupId: string, location) {
    if (!this.bulkValue) {
      this.bulkValue = {};
    }
    this.bulkValue[groupId] = {
      ...this.bulkValue[groupId],
      locationName: location.name
    };
  }

  onBulkValueChanged(equipmentGroupId: any, item: any) {
    if (!this.bulkValue) {
      this.bulkValue = {};
    }
    this.bulkValue[equipmentGroupId] = item;
  }
}
