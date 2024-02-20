import {TariffValueVersionInfoViewModel} from './../../../../../shared/models/tariff.model';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject} from 'rxjs';
import {FormGroupControls, FormGroupState, MarkAsSubmittedAction, SetValueAction,} from 'ngrx-forms';
import {NgbDateFRParserFormatter, sortRule} from '@shared-helpers';
import {select, Store} from '@ngrx/store';
import {map, takeUntil} from 'rxjs/operators';

import * as fromTariffValuesActions from '../../../shared/store/actions/tariff-values.actions';
import * as fromTariff from '../../../shared/store/reducers';
import * as selectors from '../../../shared/store/selectors';
import * as fromTariffValuesForm from 'app/shared/tariffs/store/reducers/tariff-values-form.store';
import {ngbDateNgrxValueConverter} from '../../../../../shared/helper/ngb-date-ngrx-value-converter';
import {NgbDateFullParserFormatter} from '../../../../../shared/helper/ngb-date-full-parser-formatter';
import {
  OrderVersion,
  Season,
  TariffLineItemValuesViewModel,
  TariffLineItemValueViewModel,
  TariffValuesViewModel,
  TimeOfUse,
  VersionViewModel
} from '@models';
import {NotificationService} from '@services';
import {ConfirmDialogComponent} from '@app/popups/confirm-dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'tariff-values',
  templateUrl: './tariff-values.component.html',
  styleUrls: ['./tariff-values.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFullParserFormatter}, {
    provide: NgbDateParserFormatter,
    useClass: NgbDateFRParserFormatter
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TariffValuesComponent implements OnInit, OnDestroy {
  error$: Observable<string>;
  destroyed$ = new Subject();
  valuesVersions$: Observable<TariffValueVersionInfoViewModel[]>;
  tariffVersionId$: Observable<string>;

  valueVersion: VersionViewModel<TariffValuesViewModel>

  supplierId: string;
  versionId: string;
  valueVersionId: string;

  orderIndex = 1;
  orderType = OrderVersion;
  seasons = Season;
  seasonsArr: string[] = Object.keys(Season).filter(key => !isNaN(Number(Season[key]))).reverse();

  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;

  formState: FormGroupState<fromTariffValuesForm.FormValue>;

  holidayArray = [
    {date: {day: 1, month: 1, year: 2018}, day: 'desc1r', actualDay: 'Friday'},
    {date: {day: 7, month: 1, year: 2018}, day: 'descr2', actualDay: 'Tuesday'},
    {date: {day: 14, month: 2, year: 2018}, day: 'descr5', actualDay: 'Wednesday'},
    {date: {day: 13, month: 5, year: 2018}, day: 'descr3', actualDay: 'Friday'}
  ];
  treatedDays = ['Sunday', 'Saturday'];

  tariffValueEndDate: string;
  tariffValueEndDate$: Observable<string>;

  isLastTariffVersion$: Observable<boolean>;

  tabId: string = 'demand-charge-0'
  otherTabId: string = 'tab-consumption-0'

  constructor(
    private readonly store: Store<fromTariff.State>,
    private readonly activeRoute: ActivatedRoute,
    private readonly modalService: NgbModal,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  getTimeOfUsesArr(timeOfUses: number[]): number[] {
    return timeOfUses.filter(t => t !== TimeOfUse.None);
  }

  isSimpleCharge(charge: TariffLineItemValuesViewModel): boolean {
    return (!charge.timeOfUses || charge.timeOfUses.length === 0) && (!charge.seasons || charge.seasons.length === 0);
  }

  isSimpleTimeOfUseCharge(charge: TariffLineItemValuesViewModel): boolean {
    return (charge.timeOfUses && charge.timeOfUses.length > 0) && (!charge.seasons || charge.seasons.length === 0);
  }

  isSeasonCharge(charge: TariffLineItemValuesViewModel): boolean {
    return (!charge.timeOfUses || charge.timeOfUses.length === 0) && (charge.seasons && charge.seasons.length > 0);
  }

  isSeasonTimeOfUseCharge(charge: TariffLineItemValuesViewModel): boolean {
    return (charge.timeOfUses && charge.timeOfUses.length > 0) && (charge.seasons && charge.seasons.length > 0);
  }

  isTabInvalid(
    form: FormGroupState<fromTariffValuesForm.FormValue>,
    values: FormGroupControls<TariffLineItemValueViewModel>[],
    seasonIndex: number
  ): boolean {
    const isError = values.find((item: any) => (item.value.seasonType === seasonIndex && item.isInvalid));

    if (form.isSubmitted && isError) {
      return true;
    }
    return false;
  }

  onSave(formState) {
    if (formState.isInvalid) {
      this.notificationService.error('Please review the form. Some values are missing or invalid.');
      this.store.dispatch(new MarkAsSubmittedAction(fromTariff.SupplierTariffValuesFormId));
      return null;
    }

    let tariffValue: TariffValueVersionInfoViewModel[];

    this.valuesVersions$.subscribe(values => {
      tariffValue = values.filter(value => value.startDate > formState.value.startDate);
    }).unsubscribe();

    if (tariffValue.length && this.tariffValueEndDate != formState.value.endDate) {
      const modalRef = this.modalService.open(ConfirmDialogComponent, {backdrop: 'static'});
      modalRef.componentInstance.popupText = 'Changed period of current tariff value will affect a period of the next one!';

      modalRef.result.then(() => {
        this.updateTariffValue(formState);
      }, () => {
        return;
      });
    } else {
      this.updateTariffValue(formState);
    }
  }

  updateTariffValue(formState: any): void {
    this.store.dispatch(new fromTariffValuesActions.UpdateTariffValues({
      ...formState.value,
      tariffVersionId: this.versionId,
      id: this.valueVersionId
    }));
  }

  onCancel(): void {
    window.scrollTo(0, 0);
    this.router.navigate(['admin', 'suppliers', this.supplierId, 'tariffs', this.versionId]);
  }

  getSortedVersions(order: number, versions: TariffValueVersionInfoViewModel[]): TariffValueVersionInfoViewModel[] {
    const v = [...versions];
    switch (order) {
      case OrderVersion.ValuesAsc:
        return v.sort((a, b) => sortRule(a.name, b.name));
      case OrderVersion.ValuesDesc:
        return v.sort((a, b) => sortRule(b.name, a.name));
      case OrderVersion.CreatedAsc:
        return v.sort((a, b) => sortRule(a.createdOn, b.createdOn));
      case OrderVersion.CreatedDesc:
        return v.sort((a, b) => sortRule(b.createdOn, a.createdOn));
      case OrderVersion.CreatedByAsc:
        return v.sort((a, b) => sortRule(a.createdByUser.fullName, b.createdByUser.fullName));
      case OrderVersion.CreatedByDesc:
        return v.sort((a, b) => sortRule(b.createdByUser.fullName, a.createdByUser.fullName));
      case OrderVersion.UpdatedAsc:
        return v.sort((a, b) => sortRule(a.updatedOn, b.updatedOn));
      case OrderVersion.UpdatedDesc:
        return v.sort((a, b) => sortRule(b.updatedOn, a.updatedOn));
      case OrderVersion.UpdatedByAsc:
        return v.sort((a, b) => sortRule(a.updatedByUser.fullName, b.updatedByUser.fullName));
      case OrderVersion.UpdatedByDesc:
        return v.sort((a, b) => sortRule(b.updatedByUser.fullName, a.updatedByUser.fullName));
      default:
        return v;
    }
  }

  trackByFn(index, item) {
    return (item && item.id) ? item.id : index;
  }

  ngOnInit() {
    this.store.pipe(select(selectors.selectTariffValues), takeUntil(this.destroyed$)).subscribe(version => {
      this.valueVersion = version;

      if (this.valueVersion) {
        this.store.dispatch(new SetValueAction(fromTariff.SupplierTariffValuesFormId,
          {
            ...version.entity,
            majorVersion: version.majorVersion,
            minorVersion: version.minorVersion,
            version: version.version,
            versionDate: version.versionDate,
            isActual: version.isActual
          }));
      }
    });

    this.activeRoute.params.subscribe(routeParams => {
      this.supplierId = routeParams['supplierId'];
      this.versionId = routeParams['versionId'];
      this.valueVersionId = routeParams['valueVersionId'];
    });

    this.valuesVersions$ = this.store.pipe(
      select(selectors.selectTariffValuesVersions),
      map(items => this.getSortedVersions(this.orderIndex, items))
    );

    this.error$ = this.store.pipe(
      select(selectors.selectTariffValuesError)
    );

    this.store.pipe(
      select(selectors.selectTariffValuesForm),
      takeUntil(this.destroyed$)).subscribe(formState => {
      this.formState = formState;
      this.tariffValueEndDate = formState.value.endDate;

      this.changeDetectorRef.detectChanges();
    })

    this.tariffVersionId$ = this.store.pipe(
      select(selectors.getTariffVersionId)
    );

    this.isLastTariffVersion$ = this.store.pipe(select(selectors.isLastVersion));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  addValueVersion(): void {
    this.store.dispatch(new fromTariffValuesActions.CreateTariffValueVersion({
      tariffValueId: this.formState.value.id,
      tariffVersionId: this.formState.value.tariffVersionId
    }));
  }
}
