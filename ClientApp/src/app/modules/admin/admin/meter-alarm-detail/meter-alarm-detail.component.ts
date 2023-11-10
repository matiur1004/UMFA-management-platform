import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IWaterProfileResponse } from '@core/models';
import { AmrDataService } from '@shared/services';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';
import { Subject, catchError, forkJoin, map, takeUntil, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-meter-alarm-detail',
  templateUrl: './meter-alarm-detail.component.html',
  styleUrls: ['./meter-alarm-detail.component.scss']
})
export class MeterAlarmDetailComponent implements OnInit {

  @Input() meter: any;

  profileForm: FormGroup;
  profileDataSource: any;
  chartSubTitleWater: string = '';
  chartTitleWater = `Water Profile for Meter:`;
  selectedAlarmType: any;
  applyNightFlow: boolean = false;
  todayDate = new Date();

  notAcknowledgedConfig: any;
  obsWaterProfile$ = this._amrDataService.obsWaterProfile$
    .pipe(
      tap(p => {
        //if (p) console.log(`Next value observed: ${(p.Detail.length)} long details`)
      }),
      catchError(err => {
        this._amrDataService.setError(`Error Observed: ${err}`);
        return throwError(err);
      }),
      map((prof: IWaterProfileResponse) => {
        if (prof) {
          if (prof.Status == 'Error') {
            this._amrDataService.setError(`Error getting data: ${prof.ErrorMessage}`);
          } else {
            console.log("rrrrrr", prof);
            if(this.meter['SupplyType'] == 'Electricity') {
              this.setDataSourceForElectricity(prof);
            } else {
              this.setDataSource(prof);
            }            
          }            
        }
      })
    );

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _formBuilder: FormBuilder,
    private _amrDataService: AmrDataService,
    private _alarmConfigService: AlarmConfigurationService
  ) { }

  ngOnInit(): void {
    this.profileForm = this._formBuilder.group({
      MeterId: [this.meter.AMRMeterId, [Validators.required]],
      sdp: [null, [Validators.required]],
      sdT: [null, [Validators.required]],
      edp: [null, [Validators.required]],
      edT: [null, [Validators.required]],
      NightFlowStart: [{hours: 22, minutes: 0}],
      NightFlowEnd: [{ hours: 6, minutes: 0}]
    });

    this.profileForm.get('sdp').valueChanges.subscribe(sdp => {
      let sdpDate = new Date(sdp);
      this.profileForm.get('sdT').setValue(new Date(sdpDate.setHours(0, 0, 0)));
      this.profileForm.get('edp').setValue(new Date(sdpDate.setDate(sdp.getDate() + 7)));
      this.profileForm.get('edT').setValue(new Date(sdpDate.setHours(23, 59, 0)));
    })

    this.profileForm.valueChanges.subscribe(formData => {
      if(formData && formData['sdp'] && formData['edp'] && formData['sdT'] && formData['edT']) {
        var sDate = new Date(formData['sdp'].getFullYear(), formData['sdp'].getMonth(), formData['sdp'].getDate(), formData['sdT'].getHours(), formData['sdT'].getMinutes());
        var eDate = new Date(formData['edp'].getFullYear(), formData['edp'].getMonth(), formData['edp'].getDate(), formData['edT'].getHours(), formData['edT'].getMinutes());

        this._alarmConfigService.profileInfo = {StartDate: sDate, EndDate: eDate, NightFlowStart: formData['NightFlowStart'], NightFlowEnd: formData['NightFlowEnd'], MeterSerialNo: this.meter.ScadaMeterNo};
      }
    })

    this.onShowConfigStatus();

    this.getAlarmMeterDetail(this.meter.AMRMeterId);
    
    this._alarmConfigService.alarmMeterDetail$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if(data && data.length > 0) {
          let alarmConfigs = [];
          data.forEach(alarmDetail => {
            if(alarmDetail.AlarmTypeId == 1) this.meter = {...this.meter, alarmConfig: {...this.meter['alarmConfig'], 'Night Flow Detail': alarmDetail}};
            if(alarmDetail.AlarmTypeId == 2) this.meter = {...this.meter, alarmConfig: {...this.meter['alarmConfig'], 'Burst Pipe Detail': alarmDetail}};
            if(alarmDetail.AlarmTypeId == 3) this.meter = {...this.meter, alarmConfig: {...this.meter['alarmConfig'], 'Leak Detail': alarmDetail}};
            if(alarmDetail.AlarmTypeId == 4) this.meter = {...this.meter, alarmConfig: {...this.meter['alarmConfig'], 'Daily Usage Detail': alarmDetail}};
            if(alarmDetail.AlarmTypeId == 5) this.meter = {...this.meter, alarmConfig: {...this.meter['alarmConfig'], 'Peak Detail': alarmDetail}};
            if(alarmDetail.AlarmTypeId == 6) this.meter = {...this.meter, alarmConfig: {...this.meter['alarmConfig'], 'Average Detail': alarmDetail}};
            alarmConfigs.push(alarmDetail);
          })
          this.getAlarmMeterNotAcknowledgedCount(alarmConfigs);
        }
      });
  }

  getAlarmMeterNotAcknowledgedCount(alarmConfigs: any[]) {
    let calls = alarmConfigs.map(config => {
      return this._alarmConfigService.getAlarmMeterNotAcknowledgedCount(config.AMRMeterAlarmId);  
    })
    this.notAcknowledgedConfig = {
      'Night Flow': 0,
      'Burst Pipe': 0,
      'Leak': 0,
      'Daily Usage': 0,
      'Peak': 0,
      'Average': 0
    };
    forkJoin(calls)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        data.forEach((val, index) => {
          if(alarmConfigs[index].AlarmTypeId == 1) this.notAcknowledgedConfig = {...this.notAcknowledgedConfig, 'Night Flow': val};
          if(alarmConfigs[index].AlarmTypeId == 2) this.notAcknowledgedConfig = {...this.notAcknowledgedConfig, 'Burst Pipe': val};
          if(alarmConfigs[index].AlarmTypeId == 3) this.notAcknowledgedConfig = {...this.notAcknowledgedConfig, 'Leak': val};
          if(alarmConfigs[index].AlarmTypeId == 4) this.notAcknowledgedConfig = {...this.notAcknowledgedConfig, 'Daily Usage': val};
          if(alarmConfigs[index].AlarmTypeId == 5) this.notAcknowledgedConfig = {...this.notAcknowledgedConfig, 'Peak': val};
          if(alarmConfigs[index].AlarmTypeId == 6) this.notAcknowledgedConfig = {...this.notAcknowledgedConfig, 'Average': val};
        })
      });
  }

  onShowConfigStatus() {
    let configured = this.meter['Configured'];
    this.meter = {...this.meter, alarmConfig: {
      'Night Flow': 0,
      'Burst Pipe': 0,
      'Leak': 0,
      'Daily Usage': 0,
      'Peak': 0,
      'Average': 0
    }};
    if(configured) {
      configured = configured.split(', ').map(num => Number(num));
      let configured_val = {};
      if(configured.indexOf(1) > -1) configured_val = {...configured_val, 'Night Flow': 1} ;
      if(configured.indexOf(2) > -1) configured_val = {...configured_val, 'Burst Pipe': 1} ;
      if(configured.indexOf(3) > -1) configured_val = {...configured_val, 'Leak': 1} ;
      if(configured.indexOf(4) > -1) configured_val = {...configured_val, 'Daily Usage': 1} ;
      if(configured.indexOf(5) > -1) configured_val = {...configured_val, 'Peak': 1} ;
      if(configured.indexOf(6) > -1) configured_val = {...configured_val, 'Average': 1} ;
      this.meter = {...this.meter, alarmConfig: configured_val};
    }
  }

  onShowMeterGraph(isProfile: boolean = false) {
    if(this.profileForm.valid) {
      if(isProfile) this.applyNightFlow = false;
      let formData = this.profileForm.value;
      let data = {...this._alarmConfigService.profileInfo, MeterId: formData['MeterId'], nightFlowStart: formData['NightFlowStart'], NightFlowEnd: formData['NightFlowEnd']};
      if(this.meter['SupplyType'] == 'Electricity') {
        this._amrDataService.getMeterProfileForGraphOfElectricity(this.meter.AMRMeterId, data['StartDate'], data['EndDate'], formData['NightFlowStart'], formData['NightFlowEnd'], this.applyNightFlow)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(res => {
            this.setDataSourceForElectricity(res);
          })
      } else {
        this._amrDataService.getMeterProfileForGraph(this.meter.AMRMeterId, data['StartDate'], data['EndDate'], formData['NightFlowStart'], formData['NightFlowEnd'], this.applyNightFlow)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(res => {
            this.setDataSource(res);
          })
      }
      
    }
  }

  setDataSource(ds: IWaterProfileResponse): void {
    var pipe = new DatePipe('en_ZA');
    if (ds) {
      ds.Detail.forEach((det) => { det.ReadingDateString = pipe.transform(det.ReadingDate, "yyyy-MM-dd HH:mm") });
      this.profileDataSource = ds;
      if (ds) {
        var flowDate = pipe.transform(ds.Header.MaxFlowDate, "HH:mm on dd MMM yyyy");
        this.chartTitleWater = `Alarm Configuration for Meter: ${this.meter.Description} (${this.meter.MeterNo})`;
        this.chartSubTitleWater = `Usages for period: ${ds.Header.PeriodUsage.toFixed(2)}kL, Maximun flow: ${ds.Header.MaxFlow.toFixed(2)}kL at ${flowDate}`;
      }
    }
  }
  
  setDataSourceForElectricity(ds: any): void {
    var pipe = new DatePipe('en_ZA');
    if (ds) {
      ds.Readings.forEach((det) => { det.ReadingDateString = pipe.transform(det.ReadingDate, "yyyy-MM-dd HH:mm") });
      this.profileDataSource = ds;
      if (ds) {
        this.chartTitleWater = `Alarm Configuration for Meter: ${this.meter.Description} (${this.meter.MeterNo})`;
        this.chartSubTitleWater = `Usages for period: ${ds.Header.PeriodUsage.toFixed(2)}kL, Maximun flow: ${ds.Header.MaxDemand.toFixed(2)}kL at ${pipe.transform(ds.Header.MaxDemandDate, "HH:mm on dd MMM yyyy")}`;
      }
    }
  }
  onApply() {
    
  }

  customizePoint = (arg: any) => {
    return { color: arg.data.Color }
  };

  customizeTooltip(arg: any) {
    var ret = { text: `<strong>Selected Value:</strong> ${arg.valueText} <br> <strong>Date and Time:</strong> ${arg.argument}` };
    return ret;
  }

  pointClick(e: any) {
    const point = e.target;
    point.showTooltip();
  }

  onSelectAlarmType(type) {
    if(this._alarmConfigService.profileInfo) {
      if(this.selectedAlarmType == type) return;
      this.applyNightFlow = false;
      this.onShowMeterGraph();
      this.selectedAlarmType = type;
    } else {
      this._alarmConfigService.showAlert('You should set profile option first!');
    }
  }

  getAlarmMeterDetail(id) {
    this._alarmConfigService.getAlarmMeterDetail(id).subscribe(res => {});
  }

  onChangeGraph(data) {
    var pipe = new DatePipe('en_ZA');
    data.forEach((det) => { det.ReadingDateString = pipe.transform(det.ReadingDate, "yyyy-MM-dd HH:mm") });
    this.profileDataSource.Detail = data;
  }

  onSave($event) {
    let alarmData = {
      ...$event,
      AlarmTypeName: this.getAlarmTypeName(this.selectedAlarmType),
      AMRMeterId: this.profileForm.get('MeterId').value,
      AlarmTriggerMethodId: 1
    };
    this._alarmConfigService.createOrUpdateAMRMeterAlarm(alarmData).subscribe((res) => {
      if(res['Value']['Active']) {
        this.meter['alarmConfig'][this.getAlarmTypeName(this.selectedAlarmType)] = 1;
        this.meter['alarmConfig'][`${this.getAlarmTypeName(this.selectedAlarmType)} Detail`] = res['Value'];
      }
    });
  }

  onDelete(event) {
    this._alarmConfigService.delete(1).subscribe();
  }

  getAlarmTypeName(type) {
    if(type == 'Leak Detection') return 'Leak';
    if(type == 'Peak Usage') return 'Peak';
    if(type == 'Average Usage') return 'Average';
    return type;
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this._alarmConfigService.destroyMeterAlarmDetail();
  }
}
