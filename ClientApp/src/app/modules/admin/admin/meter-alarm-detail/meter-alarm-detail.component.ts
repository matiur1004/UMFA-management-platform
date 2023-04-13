import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IWaterProfileResponse } from '@core/models';
import { AmrDataService } from '@shared/services';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';
import { catchError, map, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-meter-alarm-detail',
  templateUrl: './meter-alarm-detail.component.html',
  styleUrls: ['./meter-alarm-detail.component.scss']
})
export class MeterAlarmDetailComponent implements OnInit {

  @Input() meter: any;

  profileForm: FormGroup;
  profileDataSource: IWaterProfileResponse;
  chartSubTitleWater: string = '';
  chartTitleWater = `Water Profile for Meter:`;
  selectedAlarmType: string;
  applyNightFlow: boolean = false;

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
          } else
            this.setDataSource(prof);
        } else this.setDataSource(prof);
      })
    );

  constructor(
    private _formBuilder: FormBuilder,
    private _amrDataService: AmrDataService,
    private _alarmConfigService: AlarmConfigurationService
  ) { }

  ngOnInit(): void {
    this.meter = {
      "AMRMEterId": 114,
      "MeterNo": "220041204(W)",
      "Make": "Elster",
      "Model": "A1400",
      "ScadaMeterNo": "81501574",
      "Night Flow": 0,
      "Burst Pipe": 0,
      "Leak": 0,
      "Daily Usage": 0,
      "Peak": 0,
      "Average": 0
    }
    //114
    this.profileForm = this._formBuilder.group({
      MeterId: [70, [Validators.required]],
      sdp: [null, [Validators.required]],
      sdT: [null, [Validators.required]],
      edp: [null, [Validators.required]],
      edT: [null, [Validators.required]],
      // StartDate: ['', [Validators.required]],
      // EndDate: ['', [Validators.required]],
      NightFlowStart: [{hours: 22, minutes: 0}],
      NightFlowEnd: [{ hours: 6, minutes: 0}]
    });

    this.profileForm.get('sdp').valueChanges.subscribe(sdp => {
      let sdpDate = new Date(sdp);
      this.profileForm.get('sdT').setValue(new Date(sdpDate.setHours(0, 0, 0)));
      this.profileForm.get('edp').setValue(new Date(sdpDate.setDate(sdp.getDate() + 7)));
      this.profileForm.get('edT').setValue(new Date(sdpDate.setHours(0, 0, 0)));
    })

    this.profileForm.valueChanges.subscribe(formData => {
      
      if(formData && formData['sdp'] && formData['edp'] && formData['sdT'] && formData['edT']) {
        var sDate = new Date(formData['sdp'].getFullYear(), formData['sdp'].getMonth(), formData['sdp'].getDate(), formData['sdT'].getHours(), formData['sdT'].getMinutes());
        var eDate = new Date(formData['edp'].getFullYear(), formData['edp'].getMonth(), formData['edp'].getDate(), formData['edT'].getHours(), formData['edT'].getMinutes());

        this._alarmConfigService.profileInfo = {StartDate: sDate, EndDate: eDate, NightFlowStart: formData['NightFlowStart'], NightFlowEnd: formData['NightFlowEnd'], MeterSerialNo: '13138213'};
      }
    })
  }

  onShowMeterGraph() {
    if(this.profileForm.valid) {
      let formData = this.profileForm.value;
      let data = {...this._alarmConfigService.profileInfo, MeterId: formData['MeterId'], nightFlowStart: formData['NightFlowStart'], NightFlowEnd: formData['NightFlowEnd']};
      this._amrDataService.getMeterProfileForGraph(formData['MeterId'], data['StartDate'], data['EndDate'], formData['NightFlowStart'], formData['NightFlowEnd'], this.applyNightFlow).subscribe(res => {
        this.setDataSource(res);
        this.applyNightFlow = true;
      })
    }
  }

  setDataSource(ds: IWaterProfileResponse): void {
    var pipe = new DatePipe('en_ZA');
    if (ds) {
      ds.Detail.forEach((det) => { det.ReadingDateString = pipe.transform(det.ReadingDate, "yyyy-MM-dd HH:mm") });
      this.profileDataSource = ds;
      if (ds) {
        var flowDate = pipe.transform(ds.Header.MaxFlowDate, "HH:mm on dd MMM yyyy");
        this.chartTitleWater = `Water Profile for Meter: ${ds.Header.Description} (${ds.Header.MeterNo})`;
        this.chartSubTitleWater = `Usages for period: ${ds.Header.PeriodUsage.toFixed(2)}kL, Maximun flow: ${ds.Header.MaxFlow.toFixed(2)}kL at ${flowDate}`;
      } else {
        this.chartTitleWater = 'Water Profile';
        this.chartSubTitleWater = '';
      }
    }
  }
  
  onApply() {
    
  }

  customizePoint = (arg: any) => {
    return { color: arg.data.Color }
  };

  customizeTooltip(arg: any) {
    var ret = { text: `Selected Value<br>${arg.valueText}` };
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

  onChangeGraph(data) {
    var pipe = new DatePipe('en_ZA');
    data.forEach((det) => { det.ReadingDateString = pipe.transform(det.ReadingDate, "yyyy-MM-dd HH:mm") });
    this.profileDataSource.Detail = data;
  }
}
