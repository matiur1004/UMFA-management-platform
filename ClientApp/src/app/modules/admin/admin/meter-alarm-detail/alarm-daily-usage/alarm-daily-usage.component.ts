import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDateString } from '@core/utils/umfa.help';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';

@Component({
  selector: 'app-alarm-daily-usage',
  templateUrl: './alarm-daily-usage.component.html',
  styleUrls: ['./alarm-daily-usage.component.scss']
})
export class AlarmDailyUsageComponent implements OnInit {
  
  @Output() onChangeGraph: EventEmitter<any> = new EventEmitter<any>();
  
  analyzeForm: FormGroup;
  configInfo: any;
  analyzeInfo: any;

  constructor(
    private _alarmConfigService: AlarmConfigurationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log('daily average');
    this.onAlarmConfigDailyUsage();
    this.analyzeForm = this._formBuilder.group({
      Threshold: ['', [Validators.required]]
    });
  }

  onAlarmConfigDailyUsage() {
    if(this._alarmConfigService.profileInfo) {

      this._alarmConfigService.profileInfo = {...this._alarmConfigService.profileInfo};
      let data = {  
        ProfileStartDTM: formatDateString(this._alarmConfigService.profileInfo.StartDate), 
        ProfileEndDTM: formatDateString(this._alarmConfigService.profileInfo.EndDate), 
        MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo
      };
      this._alarmConfigService.getAlarmConfigDailyUsage(data).subscribe(res => {
        if(res && res['MeterSummary']) this.configInfo = res['MeterSummary'];
        if(res && res['MeterData']) this.onChangeGraph.emit(res['MeterData']);
      });
    } else {
      this._alarmConfigService.showAlert('You should set profile option first!');
    }
  }

  onAlarmAnalyzeDailyUsage() {
    if(this.analyzeForm.valid) {
      if(this._alarmConfigService.profileInfo) {
        let data = {  
          ...this.analyzeForm.value,
          ProfileStartDTM: formatDateString(this._alarmConfigService.profileInfo.StartDate), 
          ProfileEndDTM: formatDateString(this._alarmConfigService.profileInfo.EndDate),
          MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo,
        };
        this._alarmConfigService.getAlarmAnalyzeDailyUsage(data).subscribe(res => {
          if(res && res['Alarms']) this.analyzeInfo = res['Alarms'];
          if(res && res['MeterData']) this.onChangeGraph.emit(res['MeterData']);
        });
      } else {
        this._alarmConfigService.showAlert('You should set profile option first!');
      }
    }
  }
}
