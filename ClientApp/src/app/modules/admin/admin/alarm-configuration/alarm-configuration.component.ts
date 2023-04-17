import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { AllowedPageSizes } from '@core/helpers';
import { IUmfaBuilding, IUmfaPartner } from '@core/models';
import { BuildingService, DXReportService, MeterService } from '@shared/services';
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
    private reportService: DXReportService,
    private _buildingService: BuildingService
  ) { }

  ngOnInit(): void {
    this.searchForm = this._formBuilder.group({
      partnerId: [],
      buildingId: []
    });
    this._meterService.metersWithAlarms$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.metersWithAlarms = data;
      })

    this._buildingService.buildings$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IUmfaBuilding[]) => {
        this.allBuildings = data;
        this.buildings = data;
      })

    this._buildingService.partners$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IUmfaPartner[]) => {
        this.partners = data;
      })

    this._meterService.getAMRMetersWithAlarms(3015).subscribe();
      
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

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
