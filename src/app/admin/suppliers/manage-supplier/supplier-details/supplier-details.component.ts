import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {CustomNgbDateParserFormatter} from './custom-parser/date-custom-parser';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {FormGroupState} from 'ngrx-forms';
import {SupplierFormValue} from '../../shared/store/reducers/supplier-info-form.store';
import {Store} from '@ngrx/store';
import * as fromSupplier from '../../shared/store/reducers';
import * as selectors from '../../shared/store/selectors';
import {SupplyType} from '@models';
import * as supplierFormActions from '../../shared/store/actions/supplier-info-form.actions';

@Component({
  selector: 'supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NgbDateParserFormatter, useFactory: () => new CustomNgbDateParserFormatter('dd MMMM')}]
})
export class SupplierDetailsComponent implements OnInit, OnDestroy {

  formState$: Observable<FormGroupState<SupplierFormValue>>;
  isSubmitted = false;
  logoUrl$: Observable<string>;
  SupplyType = SupplyType;
  submitNotify = new Subject<any>();
  highSeasonOptions = ['June', 'July', 'August'];
  highSeasonSelectedOptions = ['June'];
  lowSeasonOptions = ['Januray', 'February', 'March', 'April', 'May', 'September', 'October', 'November', 'December'];
  lowSeasonSelectedOptions = [];
  hollidayArray = [{date: '01-01-01', descr: 'desc1r'}, {date: '07-07-07', descr: 'descr2'}, {
    date: '12-12-12',
    descr: 'descr3'
  }];
  model: NgbDateStruct;
  dateList: NgbDateStruct[] = [];
  hasSeasonalChanges: boolean = false;
  hasPublicHolidays: boolean = false;
  hasTou: boolean = false;

  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private store: Store<fromSupplier.State>,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.formState$ = this.store.select(selectors.getSupplierForm);
    this.logoUrl$ = this.store.select(selectors.getSupplierLogoUrl);

    for (let i in this.hollidayArray) {
      this.dateList.push({...this.setDefaultDate(this.hollidayArray[i].date, +i)});
    }

    this.store.dispatch(new supplierFormActions.SetShowSupplierInfoForm(true));
  }

  ngOnDestroy() {
    this.store.dispatch(new supplierFormActions.SetShowSupplierInfoForm(false));
  }

  highSeasonChangeOptions(event) {
  }

  lowSeasonChangeOptions(event) {
  }

  setDefaultDate(date: string, idx: number): NgbDateStruct {
    var startDate = new Date(date);
    let startYear = startDate.getFullYear().toString();
    let startMonth = startDate.getMonth() + 1;
    let startDay = startDate.getDate();

    return this.ngbDateParserFormatter.parse(startYear + '-' + startMonth.toString() + '-' + startDay);
  }

  onSelectDate(date: NgbDateStruct, idx: number) {
    if (date != null) {
      this.dateList[idx] = date;
    }
  }

  logoChanged(file) {
    this.store.dispatch(new supplierFormActions.SupplierLogoSelected(file));
  }

  save() {
    this.submitNotify.next();
    this.isSubmitted = true;
    this.store.dispatch(new supplierFormActions.ApiSaveSupplier());
  }

  cancel() {
    this.store.dispatch(new supplierFormActions.ResetSupplierDetail());
    this.router.navigate(['/admin/suppliers/']);
  }

}
