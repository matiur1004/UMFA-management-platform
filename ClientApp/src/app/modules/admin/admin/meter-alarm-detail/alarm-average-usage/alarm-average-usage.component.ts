import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDateString, formatTimeString } from '@core/utils/umfa.help';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';

@Component({
  selector: 'app-alarm-average-usage',
  templateUrl: './alarm-average-usage.component.html',
  styleUrls: ['./alarm-average-usage.component.scss']
})
export class AlarmAverageUsageComponent implements OnInit {

  @Output() onChangeGraph: EventEmitter<any> = new EventEmitter<any>();
  
  minutues = [];
  form: FormGroup;
  analyzeForm: FormGroup;
  configInfo: any;
  analyzeInfo: any;
  
  constructor(
    private _alarmConfigService: AlarmConfigurationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    for(let i = 1; i <= 60; i++) {
      this.minutues.push({Value: i});
    }

    // form 
    this.form = this._formBuilder.group({
      AveStartTime: [],
      AveEndTime: []
    })

    this.analyzeForm = this._formBuilder.group({
      Threshold: ['', [Validators.required]]
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
}
