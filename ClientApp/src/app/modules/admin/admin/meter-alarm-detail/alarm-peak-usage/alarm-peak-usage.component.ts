import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDateString, formatTimeString } from '@core/utils/umfa.help';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-alarm-peak-usage',
  templateUrl: './alarm-peak-usage.component.html',
  styleUrls: ['./alarm-peak-usage.component.scss']
})
export class AlarmPeakUsageComponent implements OnInit {

  @Output() onChangeGraph: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  analyzeForm: FormGroup;
  configInfo: any[] = [];
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
      PeakStartTime: [],
      PeakEndTime: [],
      NoOfPeaks: [5]
    })

    this.analyzeForm = this._formBuilder.group({
      Duration: ['', [Validators.required]],
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
            PeakStartTime:  startDate,
            PeakEndTime: endDate
          });

          this.analyzeForm.patchValue({
            Duration: this.alarmMeterDetail['Duration'],
            Threshold: this.alarmMeterDetail['Threshold'],
          });

          this.active = this.alarmMeterDetail['Active'];
        }
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
        MeterSerialNo: this._alarmConfigService.profileInfo.MeterSerialNo,
        NoOfPeaks: formData['NoOfPeaks']
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

  onSave() {
    let configData = this.form.value;
    let nStartTime = {hours: configData['PeakStartTime'].getHours(), minutes: configData['PeakStartTime'].getMinutes()};
    let nEndTime = {hours: configData['PeakEndTime'].getHours(), minutes: configData['PeakEndTime'].getMinutes()};

    let data = {
      ...this.analyzeForm.value,
      AMRMeterAlarmId: this.alarmMeterDetail ? this.alarmMeterDetail.AMRMeterAlarmId : 0,
      StartTime: formatTimeString(nStartTime),
      EndTime: formatTimeString(nEndTime),
      Active: this.active
    };
    this.save.emit(data);
  }

  onRemove() {
    this.delete.emit(true);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
