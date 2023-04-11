import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';

@Component({
  selector: 'app-alarm-daily-usage',
  templateUrl: './alarm-daily-usage.component.html',
  styleUrls: ['./alarm-daily-usage.component.scss']
})
export class AlarmDailyUsageComponent implements OnInit {
  
  analyzeForm: FormGroup;
  configInfo: any;
  analyzeInfo: any;

  constructor(
    private _alarmConfigService: AlarmConfigurationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.analyzeForm = this._formBuilder.group({
      Duration: ['', [Validators.required]],
      Threshold: ['', [Validators.required]]
    });
  }

  onAlarmAnalyzeDailyUsage() {
    if(this.analyzeForm.valid) {
      if(this._alarmConfigService.profileInfo) {
        // let configData = this.form.value;
        // let nStartTime = {hours: configData['NightStartTime'].getHours(), minutes: configData['NightStartTime'].getMinutes()};
        // let nEndTime = {hours: configData['NightEndTime'].getHours(), minutes: configData['NightEndTime'].getMinutes()};

        // let data = {  
        //   ...this.analyzeForm.value,
        //   ProfileStartDTM: formatDateString(this._alarmConfigService.profileInfo.StartDate), 
        //   ProfileEndDTM: formatDateString(this._alarmConfigService.profileInfo.EndDate), 
        //   NFStartTime: formatTimeString(nStartTime), 
        //   NFEndTime: formatTimeString(nEndTime),
        //   MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo,
        // };
        // this._alarmConfigService.getAlarmAnalyzeNightFlow(data).subscribe(res => {
        //   if(res && res.length > 0) {
        //     this.analyzeInfo = res[0];
        //   }
        // });
      } else {
        this._alarmConfigService.showAlert('You should set profile option first!');
      }
    }
  }
}
