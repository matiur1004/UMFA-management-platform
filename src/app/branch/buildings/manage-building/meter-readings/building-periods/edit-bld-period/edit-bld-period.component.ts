import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {distinctUntilChanged, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {FormGroupState, MarkAsSubmittedAction, unbox} from 'ngrx-forms';

import * as fromBuildingPeriods from '../../billing-readings/shared/store/reducers';
import * as fromBuildingPeriodFrom from '../shared/store/reducers/building-period-form.store';
import * as buildingPeriodFormAction from '../shared/store/actions/building-period-form.actions';
import {BuildingPeriodViewModel} from '../../../shared/models/building-period.model';
import {EditDialogModeEnum} from '../shared/models/edit-dialog-mode.enum';
import {monthNames} from '../shared/models/months';
import {ngbDateNgrxValueConverter} from 'app/shared/helper/ngb-date-ngrx-value-converter';
import {NgbDateFRParserFormatter} from '@shared-helpers';
import {BuildingPeriodsService} from '../../../shared/services/building-periods.service';
import {BldPeriodsValidationPopupComponent} from '../bld-periods-validation-popup/bld-periods-validation-popup.component';
import * as buildingCommonData from '../../../shared/store/selectors/common-data.selectors';

@Component({
  selector: 'edit-bld-period',
  templateUrl: './edit-bld-period.component.html',
  styleUrls: ['./edit-bld-period.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class EditBldPeriodComponent implements OnInit, OnDestroy {
  destroy = new Subject();
  editLinkedPeriods = false;

  buildingPeriods$: Observable<BuildingPeriodViewModel[]>;
  latestBuildingPeriod$: Observable<BuildingPeriodViewModel>;
  allowedPeriodNames$: Observable<string[]>;
  formState$: Observable<FormGroupState<any>>;
  mode$: Observable<EditDialogModeEnum>;
  EditDialogModeEnum = EditDialogModeEnum;
  monthNames = monthNames;
  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;
  linkedPeriodsNames$: Observable<string[]>;

  buildingId: string;
  buildingPeriodId: string;
  currentMode: EditDialogModeEnum;

  constructor(private activeModal: NgbActiveModal,
              private buildingPeriodsService: BuildingPeriodsService,
              private modalService: NgbModal,
              private store: Store<fromBuildingPeriods.State>
  ) {
    this.latestBuildingPeriod$ = store.pipe(select(fromBuildingPeriods.getLatestBuildingPeriod));
    this.formState$ = store.pipe(select(fromBuildingPeriods.getForm));
    this.mode$ = store.pipe(select(fromBuildingPeriods.getBuildingPeriodsEditDialogMode));

    this.mode$.pipe(takeUntil(this.destroy)).subscribe(r => {
      this.currentMode = r;
    });

    this.allowedPeriodNames$ = store.pipe(select(fromBuildingPeriods.getAllowedPeriodNames));
    this.buildingPeriods$ =
      combineLatest(store.pipe(select(fromBuildingPeriods.getBuildingPeriodReferences)),
        this.latestBuildingPeriod$.pipe(map(p => p.id)),
        this.mode$)
        .pipe(map(([periods, id, mode]) => mode === EditDialogModeEnum.Finalize ? periods : periods.filter(p => p.id !== id)));

    this.linkedPeriodsNames$ = combineLatest(
      this.formState$.pipe(map((form) => unbox(form.controls.linkedBuildingPeriodIds.value)), distinctUntilChanged()),
      store.pipe(select(fromBuildingPeriods.getBuildingPeriodsDictionary))
    ).pipe(
      map(([periodIds, periodsDict]) => periodIds ? periodIds.map(id => periodsDict[id].name) : [])
    );

    this.store.pipe(select(buildingCommonData.getBuildingId), takeUntil(this.destroy)).subscribe(r => {
      this.buildingId = r;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  onCancel() {
    this.activeModal.dismiss();
  }

  onSave() {
    if (this.currentMode === EditDialogModeEnum.Finalize) {
      this.validateData();
    } else {
      this.store.dispatch(new MarkAsSubmittedAction(fromBuildingPeriodFrom.InitState.id));
      this.store.dispatch(new buildingPeriodFormAction.SaveBuildingPeriod());
      this.activeModal.dismiss();
    }
  }

  validateData() {
    of(null).pipe(
      withLatestFrom(this.formState$.pipe(map(f => f.value.id))),
      switchMap(([_, buildingPeriodId]) => this.buildingPeriodsService.validate(this.buildingId, buildingPeriodId))
    ).subscribe(result => {
      if (result.isValid === true) {
        this.store.dispatch(new MarkAsSubmittedAction(fromBuildingPeriodFrom.InitState.id));
        this.store.dispatch(new buildingPeriodFormAction.SaveBuildingPeriod());
      } else {
        this.activeModal.dismiss();

        const modalRef = this.modalService.open(BldPeriodsValidationPopupComponent, {
          backdrop: 'static',
        });
        modalRef.componentInstance.message = result.validationMessage;
      }
    });
  }
}
