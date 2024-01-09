import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../dasboard.service';
import { NotificationService } from '@shared/services';
import { AllowedPageSizes } from 'app/core/helpers';
import themes from 'devextreme/ui/themes';
import { of, from, Observable, takeUntil, Subject } from 'rxjs' 
import { DxDataGridComponent } from 'devextreme-angular';
@Component({
  selector: 'app-client-feedback-reports',
  templateUrl: './client-feedback-reports.component.html',
  styleUrls: ['./client-feedback-reports.component.scss']
})
export class ClientFeedbackReportsComponent implements OnInit {

  @ViewChild('grid') dataGrid: DxDataGridComponent;
  clientBuildings: any
  clients: any;

  clientBuildings$ = of([
    { ClientId: "68", ClientName: "Moolean Group of Componies", PartnerName:"UMFA-JWE", BuildingId:"1639", BuildingName:"DYKOR/GEAR", BuildingActive:"0" },
    { ClientId: "68", ClientName: "Moolean Group of Componies", PartnerName:"UMFA-JWE", BuildingId:"1639", BuildingName:"DYKOR/GEAR", BuildingActive:"0" },
    { ClientId: "68", ClientName: "Moolean Group of Componies", PartnerName:"UMFA-JWE", BuildingId:"1639", BuildingName:"DYKOR/GEAR", BuildingActive:"0" },
    { ClientId: "68", ClientName: "Moolean Group of Componies", PartnerName:"UMFA-JWE", BuildingId:"1639", BuildingName:"DYKOR/GEAR", BuildingActive:"0" },
    { ClientId: "68", ClientName: "Moolean Group of Componies", PartnerName:"UMFA-JWE", BuildingId:"1639", BuildingName:"DYKOR/GEAR", BuildingActive:"0" },
    { ClientId: "68", ClientName: "Moolean Group of Componies", PartnerName:"UMFA-JWE", BuildingId:"1639", BuildingName:"DYKOR/GEAR", BuildingActive:"0" }  
  ])
  form: FormGroup;
  startDate: any;
  endDate: any
  currentFilter: any;
  applyFilterTypes: any;
  selectedRows: any;
  checkBoxesMode: string
  isSelected: boolean = false;
  calendarOption: any= {
    maxZoomLevel: 'year', 
    minZoomLevel: 'century', 
  }
  public readonly allowedPageSizes= AllowedPageSizes

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _formBuilder: FormBuilder,
    private _dbService: DashboardService,
    private _notificationService: NotificationService
  ) { 
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately',
  }, {
      key: 'onClick',
      name: 'On Button Click',
  }];
  this.currentFilter = this.applyFilterTypes[0].key;
  }

  get isArchiveEnabled() {
    if(!this.isSelected) return false;
    return true;
  }

  ngOnInit(): void {
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
    this.form = this._formBuilder.group({
      Client: ['', [Validators.required]],
      StartDate: [],
      EndDate: [],
    });

    this._dbService.clientBuildings$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.clients = [];
          this.clientBuildings = res;
          this.clientBuildings.forEach(item => {
            if(!this.clients.find(obj => obj['ClientId'] == item['ClientId'])) this.clients.push({ClientId: item['ClientId'], ClientName: item['ClientName']});
          })
        }
      });
  }

  valueChanged($event, value) {

  }

  dateValueChanged($event,type) {
    if(type === 'START') {
      if(this.endDate && this.startDate?.getTime() > this.endDate.getTime()) {
        this._notificationService.error('Start date must be prior to end date', 'Date Error');
        this.startDate = null;
      }
    } else {
      if(this.startDate && this.endDate?.getTime() < this.startDate.getTime()) {
        this._notificationService.error('End date must be after the start date', 'Date Error');
        this.endDate = null;
      }
    }
  }

  selectionChangedHandler() {
    this.isSelected = this.dataGrid.instance.getSelectedRowsData().length > 0;
  }

  report() {

  }

  ngOnDestroy(): void
  {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
