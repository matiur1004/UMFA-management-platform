import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDateString, formatTimeString } from '@core/utils/umfa.help';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';

@Component({
  selector: 'app-alarm-burst-pipe',
  templateUrl: './alarm-burst-pipe.component.html',
  styleUrls: ['./alarm-burst-pipe.component.scss']
})
export class AlarmBurstPipeComponent implements OnInit {

  @Output() onChangeGraph: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

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
      NoOfPeaks: []
    })

    this.analyzeForm = this._formBuilder.group({
      Duration: ['', [Validators.required]],
      Threshold: ['', [Validators.required]]
    });
  }

  onAlarmConfigBurstPipe() {
    let formData = this.form.value;
    if(this._alarmConfigService.profileInfo) {
      let data = {  
        ProfileStartDTM: formatDateString(this._alarmConfigService.profileInfo.StartDate), 
        ProfileEndDTM: formatDateString(this._alarmConfigService.profileInfo.EndDate),
        NoOfPeaks: formData['NoOfPeaks'],
        MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo
      };
      this._alarmConfigService.getAlarmConfigBurstPipe(data).subscribe(res => {
        if(res && res['PeaksData']) this.configInfo = res['PeaksData'];
        if(res && res['MeterData']) this.onChangeGraph.emit(res['MeterData']);
      });
    } else {
      this._alarmConfigService.showAlert('You should set profile option first!');
    }
  }

  getAlarmAnalyzeBurstPipe() {
    if(this.analyzeForm.valid) {
      if(this._alarmConfigService.profileInfo) {
        let data = {  
          ...this.analyzeForm.value,
          ProfileStartDTM: formatDateString(this._alarmConfigService.profileInfo.StartDate), 
          ProfileEndDTM: formatDateString(this._alarmConfigService.profileInfo.EndDate),
          MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo,
        };
        this._alarmConfigService.getAlarmAnalyzeBurstPipe(data).subscribe(res => {
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

    let data = {
      ...this.analyzeForm.value,
      NoOfPeaks: configData['NoOfPeaks'],
      StartTime: null,
      EndTime: null,
      Active: true
    };
    this.save.emit(data);
  }

  onRemove() {
    this.delete.emit(true);
  }
}
