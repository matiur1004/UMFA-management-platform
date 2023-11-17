import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { AllowedPageSizes } from '@core/helpers';
import { IUmfaBuilding, IUmfaPartner } from '@core/models';
import { BuildingService, DXReportService, MeterService } from '@shared/services';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-alarm-configuration',
  templateUrl: './alarm-configuration.component.html',
  styleUrls: ['./alarm-configuration.component.scss']
})
export class AlarmConfigurationComponent implements OnInit {
  
  readonly allowedPageSizes = AllowedPageSizes;
  
  totalMetersWithAlarms: any[] = [];
  metersWithAlarms: any[] = [];
  searchForm: UntypedFormGroup;
  partners: IUmfaPartner[] = [];
  allBuildings: IUmfaBuilding[] = [];
  buildings: IUmfaBuilding[] = [];
  isSelectedAlarm: boolean = false;
  applyFilterTypes: any;
  currentFilter: any;
  supplyTypeItems: any[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _meterService: MeterService, 
    private _formBuilder: FormBuilder, 
    private _buildingService: BuildingService,
    private _alarmConfigurationService: AlarmConfigurationService
  ) {
    this.applyFilterTypes = [{
        key: 'auto',
        name: 'Immediately',
    }, {
        key: 'onClick',
        name: 'On Button Click',
    }];
    this.currentFilter = this.applyFilterTypes[0].key;
   }

  ngOnInit(): void {
    this.searchForm = this._formBuilder.group({
      partnerId: [],
      buildingId: [],
      supplyType: [null]
    });
    this._alarmConfigurationService.metersWithAlarms$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.supplyTypeItems = [{value: null, label: 'All'}];
        this.totalMetersWithAlarms = data.map(item => {
          if(!this.supplyTypeItems.find(obj => obj['value'] == item['SupplyType'])) this.supplyTypeItems.push({value: item['SupplyType'], label: item['SupplyType']});
          let configured = item['Configured'];
          let triggered = item['Triggered'];
          if(configured) {
            configured = configured.split(', ').map(num => Number(num));
            let configured_val = {};
            if(configured.indexOf(1) > -1) configured_val = {...configured_val, 'Night Flow': 1} ;
            if(configured.indexOf(2) > -1) configured_val = {...configured_val, 'Burst Pipe': 1} ;
            if(configured.indexOf(3) > -1) configured_val = {...configured_val, 'Leak': 1} ;
            if(configured.indexOf(4) > -1) configured_val = {...configured_val, 'Daily Usage': 1} ;
            if(configured.indexOf(5) > -1) configured_val = {...configured_val, 'Peak': 1} ;
            if(configured.indexOf(6) > -1) configured_val = {...configured_val, 'Average': 1} ;
            item = {...item, alarmConfig: configured_val};
          }
          if(triggered) {
            triggered = triggered.split(', ').map(num => Number(num));
            let triggered_val = {};
            if(triggered.indexOf(1) > -1) triggered_val = {...triggered_val, 'Night Flow': 1} ;
            if(triggered.indexOf(2) > -1) triggered_val = {...triggered_val, 'Burst Pipe': 1} ;
            if(triggered.indexOf(3) > -1) triggered_val = {...triggered_val, 'Leak': 1} ;
            if(triggered.indexOf(4) > -1) triggered_val = {...triggered_val, 'Daily Usage': 1} ;
            if(triggered.indexOf(5) > -1) triggered_val = {...triggered_val, 'Peak': 1} ;
            if(triggered.indexOf(6) > -1) triggered_val = {...triggered_val, 'Average': 1} ;
            item = {...item, alarmTriggered: triggered_val};
          }
          return item;
        });
        this.searchForm.get('supplyType').setValue(this._alarmConfigurationService.selectedSupplyType);
        if(!this._alarmConfigurationService.selectedSupplyType) this.metersWithAlarms = this.totalMetersWithAlarms;
        else this.metersWithAlarms = this.totalMetersWithAlarms.filter(obj => obj['SupplyType'] == this._alarmConfigurationService.selectedSupplyType);
      })
      
    this._buildingService.buildings$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IUmfaBuilding[]) => {
        this.allBuildings = data;
        this.buildings = data;
        this.searchForm.get('buildingId').setValue(this._alarmConfigurationService.selectedBuilding);
      })

    this._buildingService.partners$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IUmfaPartner[]) => {
        this.partners = data;
        this.searchForm.get('partnerId').setValue(this._alarmConfigurationService.selectedPartner);
      })
    
    this.searchForm.valueChanges.subscribe(formValue => {
      this._alarmConfigurationService.selectedBuilding = formValue['buildingId'];
      this._alarmConfigurationService.selectedPartner = formValue['partnerId'];
    })
    if(this._alarmConfigurationService.selectedBuilding) {
      this._alarmConfigurationService.getAlarmsByBuilding(this._alarmConfigurationService.selectedBuilding).subscribe();
    }
    //
      
  }

  onPartnerChanged(event) {
    this.buildings = this.allBuildings.filter(obj => obj.PartnerId == event.Id);
  }

  onBuildingChanged(event) {
    this._alarmConfigurationService.getAlarmsByBuilding(event.BuildingId).subscribe();
  }

  onSelectRow(e) {
    this.isSelectedAlarm = true;
    this._meterService.onSelectMeterAlarm(e.data);
  }

  customSearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Name.toLowerCase().indexOf(term) > -1;
  }

  alarmConfigTemplate() {

  }

  onSupplyTypeChange(event) {
    if(event.value) {
      this.metersWithAlarms = this.totalMetersWithAlarms.filter(obj => obj['SupplyType'] == event.value);
    } else {
      this.metersWithAlarms = this.totalMetersWithAlarms;
    }
    
  }

  ngOnDestroy() {
    if(!this.isSelectedAlarm) {
      this._alarmConfigurationService.selectedBuilding = null;
      this._alarmConfigurationService.selectedPartner = null;
      this._alarmConfigurationService.destroy();
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
