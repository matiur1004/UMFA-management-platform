import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDateString, formatTimeString } from '@core/utils/umfa.help';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-alarm-average-usage',
  templateUrl: './alarm-average-usage.component.html',
  styleUrls: ['./alarm-average-usage.component.scss']
})
export class AlarmAverageUsageComponent implements OnInit {

  @Output() onChangeGraph: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  analyzeForm: FormGroup;
  configInfo: any;
  analyzeInfo: any;
  alarmMeterDetail: any;
  active: boolean = true;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _alarmConfigService: AlarmConfigurationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // form 
    this.form = this._formBuilder.group({
      AveStartTime: [],
      AveEndTime: []
    })

    this.analyzeForm = this._formBuilder.group({
      Threshold: ['', [Validators.required]]
    });

    this._alarmConfigService.alarmMeterDetail$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.alarmMeterDetail = data;
        if(this.alarmMeterDetail) {
          let startDate = new Date();
          let endDate = new Date();
          startDate.setHours(Number(this.alarmMeterDetail['StartTime'].split(':')[0]))
          startDate.setMinutes(Number(this.alarmMeterDetail['StartTime'].split(':')[1]));

          endDate.setHours(Number(this.alarmMeterDetail['EndTime'].split(':')[0]))
          endDate.setMinutes(Number(this.alarmMeterDetail['EndTime'].split(':')[1]));

          this.form.patchValue({
            AveStartTime:  startDate,
            AveEndTime: endDate
          });

          this.analyzeForm.patchValue({
            Threshold: this.alarmMeterDetail['Threshold'],
          });

          this.active = this.alarmMeterDetail['Active'];
        }
      });

  }

  onAlarmConfigAverageUsage() {
    let formData = this.form.value;
    if(this._alarmConfigService.profileInfo) {
      let nStartTime = {hours: formData['AveStartTime'].getHours(), minutes: formData['AveStartTime'].getMinutes()};
      let nEndTime = {hours: formData['AveEndTime'].getHours(), minutes: formData['AveEndTime'].getMinutes()};

      let data = {  
        ProfileStartDTM: formatDateString(this._alarmConfigService.profileInfo.StartDate), 
        ProfileEndDTM: formatDateString(this._alarmConfigService.profileInfo.EndDate), 
        AveStartTime: formatTimeString(nStartTime), 
        AveEndTime: formatTimeString(nEndTime),
        MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo
      };
      this._alarmConfigService.getAlarmConfigAvgUsage(data).subscribe(res => {
        if(res && res['MeterInfo']) this.configInfo = res['MeterInfo'];
        if(res && res['MeterData']) this.onChangeGraph.emit(res['MeterData']);
      });
    } else {
      this._alarmConfigService.showAlert('You should set profile option first!');
    }
  }

  getAlarmAnalyzeAverageUsage() {
    if(this.analyzeForm.valid) {
      if(this._alarmConfigService.profileInfo) {
        let configData = this.form.value;
        let nStartTime = {hours: configData['AveStartTime'].getHours(), minutes: configData['AveStartTime'].getMinutes()};
        let nEndTime = {hours: configData['AveEndTime'].getHours(), minutes: configData['AveEndTime'].getMinutes()};

        let data = {  
          ...this.analyzeForm.value,
          ProfileStartDTM: formatDateString(this._alarmConfigService.profileInfo.StartDate), 
          ProfileEndDTM: formatDateString(this._alarmConfigService.profileInfo.EndDate), 
          AvgStartTime: formatTimeString(nStartTime), 
          AvgEndTime: formatTimeString(nEndTime),
          MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo,
          UseInterval: true
        };
        this._alarmConfigService.getAlarmAnalyzeAvgUsage(data).subscribe(res => {
          if(res && res['Alarms']) this.analyzeInfo = res['Alarms'];
          if(res && res['MeterData']) this.onChangeGraph.emit(res['MeterData']);
        });
      } else {
        this._alarmConfigService.showAlert('You should set profile option first!');
      }
    }
  }

  onSave() {
    let configData = this.form.value;
    let nStartTime = {hours: configData['AveStartTime'].getHours(), minutes: configData['AveStartTime'].getMinutes()};
    let nEndTime = {hours: configData['AveEndTime'].getHours(), minutes: configData['AveEndTime'].getMinutes()};

    let data = {
      ...this.analyzeForm.value,
      AMRMeterAlarmId: this.alarmMeterDetail ? this.alarmMeterDetail.AMRMeterAlarmId : 0,
      StartTime: formatTimeString(nStartTime),
      EndTime: formatTimeString(nEndTime),
      Duration: 0,
      Active: this.active
    };
    this.save.emit(data);
  }

  onRemove() {
    this.delete.emit(true);
  }

  ngOnDestroy(): void {
    this._alarmConfigService.destroy();
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
