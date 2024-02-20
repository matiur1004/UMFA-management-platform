import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of, Subject} from 'rxjs';
import {FormGroupState, MarkAsSubmittedAction, SetValueAction,} from 'ngrx-forms';
import {select, Store} from '@ngrx/store';
import {map, takeUntil, withLatestFrom} from 'rxjs/operators';

import * as fromTariff from '../../store/reducers';
import * as fromTariffValuesForm from 'app/shared/tariffs/store/reducers/tariff-values-form.store';
import * as fromTariffValuesActions from '../../store/actions/tariff-values.actions';
import * as selectors from '../../store/selectors';

import {NotificationService} from '@services';
import {OrderVersion, TariffValuesViewModel, TariffValueVersionInfoViewModel, VersionViewModel} from '@models';

export const sortRule = (a, b) => (a > b) ? 1 : (a < b) ? -1 : 0;

@Component({
  selector: 'building-tariff-values',
  templateUrl: './building-tariff-values.component.html',
  styleUrls: ['./building-tariff-values.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildingTariffValuesComponent implements OnInit, OnDestroy {

  formState$: Observable<FormGroupState<fromTariffValuesForm.FormValue>>;
  formState: FormGroupState<fromTariffValuesForm.FormValue>;
  valuesVersions$: Observable<TariffValueVersionInfoViewModel[]>;

  tariffVersionId$: Observable<string>;

  valueVersion: VersionViewModel<TariffValuesViewModel>
  destroyed$ = new Subject();

  buildingId$: Observable<string>;

  versionId: string;
  valueVersionId: string;

  orderIndex = 1;
  orderType = OrderVersion;

  isLastTariffVersion$: Observable<boolean>;

  constructor(
    private readonly store: Store<fromTariff.State>,
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  onSave(formState) {
    if (formState.isInvalid) {
      this.notificationService.error('Please review the form. Some values are missing or invalid.');
      this.store.dispatch(new MarkAsSubmittedAction(fromTariff.buildingTariffValuesFormId));
      return null;
    }
    of(null)
      .pipe(withLatestFrom(this.buildingId$))
      .subscribe(([_, buildingId]) =>
        this.store.dispatch(new fromTariffValuesActions.UpdateTariffValues({
          model: {
            ...formState.value,
            tariffVersionId: this.versionId,
            id: this.valueVersionId
          },
          buildingId
        }))
      );

  }

  onCancel(): void {
    window.scrollTo(0, 0);
    this.router.navigate(['../../'], {relativeTo: this.activeRoute});
  }

  onChangeOrder(event: number, versions: TariffValueVersionInfoViewModel[]): void {
    this.orderIndex = event;
    this.store.dispatch(new fromTariffValuesActions.UpdateTariffValuesOrder(this.getSortedVersions(event, versions)));
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
        this.store.dispatch(new SetValueAction(fromTariff.buildingTariffValuesFormId,
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
      this.versionId = routeParams['tariffVersionId'];
      this.valueVersionId = routeParams['valueVersionId'];
    });

    this.buildingId$ = this.store.pipe(select(selectors.getBuildingId));
    this.valuesVersions$ = this.store.pipe(
      select(selectors.selectTariffValuesVersions),
      map(items => this.getSortedVersions(this.orderIndex, items))
    );

    this.store.pipe(
      select(selectors.getTariffValuesForm),
      takeUntil(this.destroyed$)).subscribe(formState => {
      this.formState = formState;
      this.changeDetectorRef.detectChanges();
    });

    this.isLastTariffVersion$ = this.store.pipe(
      select(selectors.isLastVersion)
    );
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
