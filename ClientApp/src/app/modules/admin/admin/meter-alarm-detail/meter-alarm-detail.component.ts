import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IWaterProfileResponse } from '@core/models';
import { AmrDataService } from '@shared/services';
import { catchError, map, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-meter-alarm-detail',
  templateUrl: './meter-alarm-detail.component.html',
  styleUrls: ['./meter-alarm-detail.component.scss']
})
export class MeterAlarmDetailComponent implements OnInit {

  profileForm: FormGroup;
  waterDataSource: IWaterProfileResponse;
  chartSubTitleWater: string = '';
  chartTitleWater = `Water Profile for Meter:`;
  selectedAlarmType: string;

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
    private _amrDataService: AmrDataService
  ) { }

  ngOnInit(): void {
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
      this.profileForm.get('sdT').setValue(new Date(sdpDate.setHours(0, 30, 0)));
      this.profileForm.get('edp').setValue(new Date(sdpDate.setDate(sdp.getDate() + 7)));
      this.profileForm.get('edT').setValue(new Date(sdpDate.setHours(0, 0, 0)));
    })
  }

  onShowMeterGraph() {
    if(this.profileForm.valid) {
      let formData = this.profileForm.value;
      var sDate = new Date(formData['sdp'].getFullYear(), formData['sdp'].getMonth(), formData['sdp'].getDate(), formData['sdT'].getHours(), formData['sdT'].getMinutes());
      var eDate = new Date(formData['edp'].getFullYear(), formData['edp'].getMonth(), formData['edp'].getDate(), formData['edT'].getHours(), formData['edT'].getMinutes());
      let data = {MeterId: formData['MeterId'], StartDate: sDate, EndDate: eDate, nightFlowStart: formData['NightFlowStart'], NightFlowEnd: formData['NightFlowEnd']};
      this._amrDataService.getMeterProfileForGraph(formData['MeterId'], sDate, eDate, formData['NightFlowStart'], formData['NightFlowEnd']).subscribe(res => {
        console.log("qwqwqw", res);
        this.setDataSource(res);
      })
    }
  }

  setDataSource(ds: IWaterProfileResponse): void {
    var pipe = new DatePipe('en_ZA');
    if (ds) {
      ds.Detail.forEach((det) => { det.ReadingDateString = pipe.transform(det.ReadingDate, "yyyy-MM-dd HH:mm") });
      this.waterDataSource = ds;
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
    this.selectedAlarmType = type;
  }
}
