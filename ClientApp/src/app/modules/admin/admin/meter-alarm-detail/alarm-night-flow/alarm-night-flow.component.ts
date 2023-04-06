import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDateString, formatTimeString } from '@core/utils/umfa.help';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';

@Component({
  selector: 'app-alarm-night-flow',
  templateUrl: './alarm-night-flow.component.html',
  styleUrls: ['./alarm-night-flow.component.scss']
})
export class AlarmNightFlowComponent implements OnInit {

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
      NightStartTime: [],
      NightEndTime: []
    })

    this.analyzeForm = this._formBuilder.group({
      Duration: ['', [Validators.required]],
      Threshold: ['', [Validators.required]]
    });
  }

  onAlarmConfigNightFlow() {
    let formData = this.form.value;
    if(this._alarmConfigService.profileInfo) {
      let nStartTime = {hours: formData['NightStartTime'].getHours(), minutes: formData['NightStartTime'].getMinutes()};
      let nEndTime = {hours: formData['NightEndTime'].getHours(), minutes: formData['NightEndTime'].getMinutes()};

      let data = {  
        ProfileStartDTM: formatDateString(this._alarmConfigService.profileInfo.StartDate), 
        ProfileEndDTM: formatDateString(this._alarmConfigService.profileInfo.EndDate), 
        NFStartTime: formatTimeString(nStartTime), 
        NFEndTime: formatTimeString(nEndTime),
        MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo
      };
      this._alarmConfigService.getAlarmConfigNightFlow(data).subscribe(res => {
        if(res && res.length > 0) this.configInfo = res[0];
      });
    }    
  }

  getAlarmAnalyzeNightFlow() {
      if(this.analyzeForm.valid) {
        if(this._alarmConfigService.profileInfo) {
          let configData = this.form.value;
          let nStartTime = {hours: configData['NightStartTime'].getHours(), minutes: configData['NightStartTime'].getMinutes()};
          let nEndTime = {hours: configData['NightEndTime'].getHours(), minutes: configData['NightEndTime'].getMinutes()};

          let data = {  
            ...this.analyzeForm.value,
            ProfileStartDTM: formatDateString(this._alarmConfigService.profileInfo.StartDate), 
            ProfileEndDTM: formatDateString(this._alarmConfigService.profileInfo.EndDate), 
            NFStartTime: formatTimeString(nStartTime), 
            NFEndTime: formatTimeString(nEndTime),
            MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo,
          };
          this._alarmConfigService.getAlarmAnalyzeNightFlow(data).subscribe(res => {
            if(res && res.length > 0) {
              this.analyzeInfo = res[0];
            }
          });
        }
      }
  }
}
