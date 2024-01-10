import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../dasboard.service';
import { NotificationService } from '@shared/services';
import { AllowedPageSizes } from 'app/core/helpers';
import themes from 'devextreme/ui/themes';
import { of, from, Observable, takeUntil, Subject } from 'rxjs' 
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
@Component({
  selector: 'app-client-feedback-reports',
  templateUrl: './client-feedback-reports.component.html',
  styleUrls: ['./client-feedback-reports.component.scss']
})
export class ClientFeedbackReportsComponent implements OnInit {

  @ViewChild('clientBuildingGrid') clientBuildingGrid: DxDataGridComponent;
  @ViewChild('clientFeedbackGrid') clientFeedbackGrid: DxDataGridComponent;
  
  clientBuildings: any
  filteredClientBuildings: any
  clients: any;

  form: FormGroup;
  startDate: any;
  endDate: any
  currentFilter: any;
  applyFilterTypes: any;
  selectedRows: any;
  checkBoxesMode: string
  isSelected: boolean = false;
  clientFeedbackReports: any;
  selectedNumber: any;

  calendarOption: any= {
    maxZoomLevel: 'year', 
    minZoomLevel: 'century', 
  }

  clientId: number;

  public readonly allowedPageSizes= AllowedPageSizes

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _formBuilder: FormBuilder,
    private _dbService: DashboardService,
    private _notificationService: NotificationService,
    private _cdr: ChangeDetectorRef
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
    if(!this.clientId) return false;
    if(!this.startDate) return false;
    if(!this.endDate) return false;
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

    this._dbService.clientFeedbackReportsDetails$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.clientFeedbackReports = res;
        }        
      })
  }

  valueChanged(event) {
    if(this.clientId) 
      {
        this.filteredClientBuildings = this.clientBuildings.filter(building => building.ClientId === this.clientId);
        this._dbService.getClientFeedbackReports(this.clientId).subscribe();
      }
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
    this.isSelected = this.clientBuildingGrid.instance.getSelectedRowsData().length > 0;
    this.selectedNumber = this.clientBuildingGrid.instance.getSelectedRowsData().length;
  }

  report() {
    let buildingIds = this.clientBuildingGrid.instance.getSelectedRowsData().map(obj => obj['BuildingId']).join(', ');
    let formData = {
      BuildingIds: buildingIds,
      ClientId: this.clientId,
      SPeriod: moment(this.startDate).format('MMMM YYYY'),
      EPeriod: moment(this.endDate).format('MMMM YYYY')
    }
    this._dbService.createClientFeedbackReports(formData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.clientFeedbackReports.push(res);
        this.clientId = null;
        this.startDate = null;
        this.endDate = null;
        this._cdr.detectChanges();

        this.clientBuildingGrid.instance.deselectAll();
      })
    
  }

  onCustomizeDateTime(cellInfo) {
    if(!cellInfo.value) return 'N/A';
    return moment(new Date(cellInfo.value)).format('DD/MM/YYYY HH:mm:ss');
  }
  
  onDownload(e) {
    e.event.preventDefault();
    if(e.row.data.Url) window.open(e.row.data.Url, "_blank");
  }

  ngOnDestroy(): void
  {
    // Unsubscribe from all subscriptions
    this.clientBuildingGrid.instance.clearFilter();
    this.clientId = null;
    this.startDate = null;
    this.endDate = null;
    this.clientBuildings = [];
    this.clientFeedbackGrid.instance.refresh();
    this.clientFeedbackGrid.instance.pageIndex(0);
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
