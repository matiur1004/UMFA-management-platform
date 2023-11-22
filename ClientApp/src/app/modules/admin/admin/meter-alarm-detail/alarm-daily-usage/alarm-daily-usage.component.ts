import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDateString } from '@core/utils/umfa.help';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-alarm-daily-usage',
  templateUrl: './alarm-daily-usage.component.html',
  styleUrls: ['./alarm-daily-usage.component.scss']
})
export class AlarmDailyUsageComponent implements OnInit {
  @Input() meter;
  @Output() onChangeGraph: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

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
    this.onAlarmConfigDailyUsage();
    this.analyzeForm = this._formBuilder.group({
      Threshold: ['', [Validators.required]]
    });

    this._alarmConfigService.alarmMeterDetail$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.alarmMeterDetail = data.find(obj => obj.AlarmTypeId == 4);
        if(this.alarmMeterDetail) {

          this.analyzeForm.patchValue({
            Threshold: this.alarmMeterDetail['Threshold'],
          });

          this.active = this.alarmMeterDetail['Active'];
        }
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

  onSave() {
    let data = {
      ...this.analyzeForm.value,
      AMRMeterAlarmId: this.alarmMeterDetail ? this.alarmMeterDetail.AMRMeterAlarmId : 0,
      Duration: 0,
      StartTime: '22:00',
      EndTime: '05:00',
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
