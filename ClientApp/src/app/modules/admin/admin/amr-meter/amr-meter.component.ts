import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllowedPageSizes } from 'app/core/helpers';
import { IAmrMeter, IopUser } from 'app/core/models';
import { MeterService, UserService } from 'app/shared/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-amr-meter',
  templateUrl: './amr-meter.component.html',
  styleUrls: ['./amr-meter.component.scss']
})
export class AmrMeterComponent implements OnInit {

  user: IopUser;
  meters$: Observable<IAmrMeter[]>;
  applyFilterTypes: any;
    currentFilter: any;
  readonly allowedPageSizes = AllowedPageSizes;

  constructor(
    private meterService: MeterService, 
    private userService: UserService,
    public _router: Router) {
      this.onEdit = this.onEdit.bind(this);
      this.applyFilterTypes = [{
          key: 'auto',
          name: 'Immediately',
      }, {
          key: 'onClick',
          name: 'On Button Click',
      }];
      this.currentFilter = this.applyFilterTypes[0].key;
    }

  ngOnInit(): void {
    this.user = this.userService.userValue;
    this.meters$ =  this.meterService.getMetersForUser(this.user.Id);
  }

  onEdit(e) {
    e.event.preventDefault();
    this._router.navigate([`/admin/amrMeter/edit/${this.user.Id}/${e.row.data.Id}`]);
  }
}
