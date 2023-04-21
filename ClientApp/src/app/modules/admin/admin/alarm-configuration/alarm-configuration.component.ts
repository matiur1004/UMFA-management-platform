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
  
  metersWithAlarms: any[] = [];
  searchForm: UntypedFormGroup;
  partners: IUmfaPartner[] = [];
  allBuildings: IUmfaBuilding[] = [];
  buildings: IUmfaBuilding[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _meterService: MeterService, 
    private _formBuilder: FormBuilder, 
    private _buildingService: BuildingService,
    private _alarmConfigurationService: AlarmConfigurationService
  ) { }

  ngOnInit(): void {
    this.searchForm = this._formBuilder.group({
      partnerId: [],
      buildingId: []
    });
    this._meterService.metersWithAlarms$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.metersWithAlarms = data.map(item => {
          item = {...item, alarmConfig: {'Night Flow': item['Night Flow'], 'Burst Pipe': item['Burst Pipe'], 'Leak': item['Leak'], 'Daily Usage': item['Daily Usage'], 'Peak': item['Peak'], 'Average': item['Average']}};
          return item;
        });
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
      this._meterService.getAMRMetersWithAlarms(this._alarmConfigurationService.selectedBuilding).subscribe();
    }
    //
      
  }

  onPartnerChanged(event) {
    this.buildings = this.allBuildings.filter(obj => obj.PartnerId == event.Id);
  }

  onBuildingChanged(event) {
    this._meterService.getAMRMetersWithAlarms(event.BuildingId).subscribe();
  }

  onSelectRow(e) {
    this._meterService.onSelectMeterAlarm(e.data);
  }

  customSearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Name.toLowerCase().indexOf(term) > -1;
  }

  alarmConfigTemplate() {

  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
