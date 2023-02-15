import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, observable, Subscription } from 'rxjs';
import { Time } from "@angular/common";
import { DxSelectBoxComponent } from 'devextreme-angular/ui/select-box';
import { IAmrChart, IAmrMeter, ITouHeader } from 'app/core/models';
import { AmrDataService } from 'app/shared/services/amr.data.service';
import { MeterService } from 'app/shared/services/meter.service';
import { UserService } from 'app/shared/services/user.service';


@Component({
  selector: 'amr-graphcriteria',
  templateUrl: './amr-graph-criteria.component.html',
  styleUrls: ['./amr-graph-criteria.component.scss']
})
export class AmrGraphCriteriaComponent implements OnInit, OnDestroy {

  get amrChart(): IAmrChart { return this.amrService.SelectedChart; }

  subSelectedChart: Subscription;

  sdtModel: Date;// = new Date('2022-06-06 00:30');
  sTime: Date;// = new Date('2022-06-06 00:30');

  edtModel: Date;// = new Date('2022-06-13 00:00');
  eTime: Date;// = new Date('2022-06-13 00:00');

  meterId: number = null;
  touHeaderId?: number = null;

  custMtrTemplate = (arg: any) => {
    var ret = "<div class='custom-item' title='" + arg.Description + "'>" + arg.MeterNo + "</div>";
    return ret;
  }

  custTOUTemplate = (arg: any) => {
    var ret = "<div class='custom-item' title='" + arg.Name + "'>" + arg.Name + "</div>";
    return ret;
  }

  meters$: Observable<IAmrMeter[]>; //this.meterService.getMetersForUserChart(this.userService.userValue.Id, this.amrChart.Id);

  touHeaders$: Observable<ITouHeader[]>; //this.amrService.getTouHeaders();

  constructor(private amrService: AmrDataService,
    private userService: UserService,
    private meterService: MeterService) { }

  ngOnInit(): void {
    this.subSelectedChart = this.amrService.obsSelectedChart.subscribe({
      next: c => {
        if (c == null) {
          this.sdtModel = null;
          this.sTime = null;
          this.edtModel = null;
          this.eTime = null;
          this.meterId = null;
          this.touHeaderId = null;
          this.amrService.DemChartParams = null;
          this.amrService.setFrmValid(2, false);
        } else {
          if (c.Id == 1) {
            this.meters$ = this.meterService.getMetersForUserChart(this.userService.userValue.Id, c.Id);
            this.touHeaders$ = this.amrService.getTouHeaders();
          }
          else if (c.Id == 2) {
            this.meters$ = this.meterService.getMetersForUserChart(this.userService.userValue.Id, c.Id);
            this.touHeaders$ = null;
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.amrService.setFrmValid(2, false);
    this.amrService.DemChartParams = null;
    this.subSelectedChart.unsubscribe();
  }

  valueChangedDemand(e: any, frm: NgForm) {
    if (e.value) {
      if (e.previousValue && e.value != e.previousValue) this.amrService.displayChart(false);
      if (e.element.id == 'sDateId' && !e.previousValue) {
        let dt: Date = new Date(e.value);
        dt.setHours(0, 30, 0);
        this.sTime = new Date(dt);
        dt.setDate(dt.getDate() + 7);
        dt.setHours(0, 0, 0);
        this.edtModel = dt;
        if (!this.meterId || !this.touHeaderId)
          this.eTime = dt;
      }
      this.setCriteriaDemand(frm);
    }
  }

  setCriteriaDemand(frm: NgForm) {
        if (frm.valid && this.sdtModel && this.sTime && this.edtModel && this.eTime && this.meterId && this.touHeaderId) {
          var sDate = new Date(this.sdtModel.getFullYear(), this.sdtModel.getMonth(), this.sdtModel.getDate(), this.sTime.getHours(), this.sTime.getMinutes());
          var eDate = new Date(this.edtModel.getFullYear(), this.edtModel.getMonth(), this.edtModel.getDate(), this.eTime.getHours(), this.eTime.getMinutes());
          this.amrService.DemChartParams = { MeterId: this.meterId, StartDate: sDate, EndDate: eDate, TOUId: this.touHeaderId };
          this.amrService.setFrmValid(2, true);
        }
      }
  
  valueChangedWater(e: any, frm: NgForm) {
    if (e.value) {
      if (e.previousValue && e.value != e.previousValue) this.amrService.displayChart(false);
      if (e.element.id == 'sDateId' && !e.previousValue) {
        let dt: Date = new Date(e.value);
        dt.setHours(0, 30, 0);
        this.sTime = new Date(dt);
        dt.setDate(dt.getDate() + 7);
        dt.setHours(0, 0, 0);
        this.edtModel = dt;
        this.eTime = dt;
      }
      this.setCriteriaWater(frm);
    }
  }

  setCriteriaWater(frm: NgForm) {
    if (this.sdtModel && this.sTime && this.edtModel && this.eTime && this.meterId) {
      var sDate = new Date(this.sdtModel.getFullYear(), this.sdtModel.getMonth(), this.sdtModel.getDate(), this.sTime.getHours(), this.sTime.getMinutes());
      var eDate = new Date(this.edtModel.getFullYear(), this.edtModel.getMonth(), this.edtModel.getDate(), this.eTime.getHours(), this.eTime.getMinutes());
      this.amrService.WaterChartParams = { MeterId: this.meterId, StartDate: sDate, EndDate: eDate
        , nightFlowStart: {hours: 22, minutes: 0}, nightFlowEnd: { hours: 6, minutes: 0}  };
      this.amrService.setFrmValid(2, true);
    }
  }

}
