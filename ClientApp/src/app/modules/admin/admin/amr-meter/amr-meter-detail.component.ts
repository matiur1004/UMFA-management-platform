import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAmrMeter } from 'app/core/models';
import { MeterService } from 'app/shared/services/meter.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './amr-meter-detail.component.html',
  styleUrls: ['./amr-meter-detail.component.scss']
})
export class AMRMeterDetailComponent implements OnInit {

  meter: IAmrMeter;
  meter$: Observable<IAmrMeter>;
  errMessage: string;

  constructor(private route: ActivatedRoute, private meterService: MeterService) { }

  ngOnInit(): void {
    const meterId = +this.route.snapshot.paramMap.get('id');
    this.meter$ = this.meterService.getMeter(meterId);
  }

}
