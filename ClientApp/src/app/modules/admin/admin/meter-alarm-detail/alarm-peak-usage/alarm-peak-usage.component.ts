import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDateString, formatTimeString } from '@core/utils/umfa.help';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';

@Component({
  selector: 'app-alarm-peak-usage',
  templateUrl: './alarm-peak-usage.component.html',
  styleUrls: ['./alarm-peak-usage.component.scss']
})
export class AlarmPeakUsageComponent implements OnInit {

  @Output() onChangeGraph: EventEmitter<any> = new EventEmitter<any>();
  
  form: FormGroup;
  analyzeForm: FormGroup;
  configInfo: any[] = [];
  analyzeInfo: any;
  
  constructor(
    private _alarmConfigService: AlarmConfigurationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // form 
    this.form = this._formBuilder.group({
      PeakStartTime: [],
      PeakEndTime: [],
      NoOfPeaks: [5]
    })

    this.analyzeForm = this._formBuilder.group({
      Duration: ['', [Validators.required]],
      Threshold: ['', [Validators.required]]
    });
  }

  onAlarmConfigPeakUsage() {
    let formData = this.form.value;
    if(this._alarmConfigService.profileInfo) {
      let nStartTime = {hours: formData['PeakStartTime'].getHours(), minutes: formData['PeakStartTime'].getMinutes()};
      let nEndTime = {hours: formData['PeakEndTime'].getHours(), minutes: formData['PeakEndTime'].getMinutes()};

      let data = {  
        ProfileStartDTM: formatDateString(this._alarmConfigService.profileInfo.StartDate), 
        ProfileEndDTM: formatDateString(this._alarmConfigService.profileInfo.EndDate), 
        PeakStartTime: formatTimeString(nStartTime), 
        PeakEndTime: formatTimeString(nEndTime),
        MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo
      };
      this._alarmConfigService.getAlarmConfigPeakUsage(data).subscribe(res => {
        if(res && res['MeterPeaks']) this.configInfo = res['MeterPeaks'];
        if(res && res['MeterData']) this.onChangeGraph.emit(res['MeterData']);
        
      });
    } else {
      this._alarmConfigService.showAlert('You should set profile option first!');
    }
  }
  
  getAlarmAnalyzePeakUsage() {
    if(this.analyzeForm.valid) {
      if(this._alarmConfigService.profileInfo) {
        let configData = this.form.value;
        let nStartTime = {hours: configData['PeakStartTime'].getHours(), minutes: configData['PeakStartTime'].getMinutes()};
        let nEndTime = {hours: configData['PeakEndTime'].getHours(), minutes: configData['PeakEndTime'].getMinutes()};

        let data = {  
          ...this.analyzeForm.value,
          ProfileStartDTM: formatDateString(this._alarmConfigService.profileInfo.StartDate), 
          ProfileEndDTM: formatDateString(this._alarmConfigService.profileInfo.EndDate), 
          PeakStartTime: formatTimeString(nStartTime), 
          PeakEndTime: formatTimeString(nEndTime),
          MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo,
        };
        this._alarmConfigService.getAlarmAnalyzePeakUsage(data).subscribe(res => {
          if(res && res['Alarms']) this.analyzeInfo = res['Alarms'];
          if(res && res['MeterData']) this.onChangeGraph.emit(res['MeterData']);
        });
      } else {
        this._alarmConfigService.showAlert('You should set profile option first!');
      }
    }
  }
}
