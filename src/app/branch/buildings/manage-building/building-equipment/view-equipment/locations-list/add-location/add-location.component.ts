import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {FormGroupState, MarkAsSubmittedAction, ResetAction, SetValueAction} from 'ngrx-forms';
import {Store} from '@ngrx/store';

import {NgbDateFRParserFormatter} from 'app/shared/helper/ngb-date-fr-parser-formatter';

import * as fromLocation from '../../../shared/store/reducers';
import * as locationFormActions from '../../../shared/store/actions/location-form.actions';
import {InitState} from '../../../shared/store/reducers/location-form.store';
import * as buildingCommonData from '../../../../shared/store/selectors/common-data.selectors';


@Component({
  selector: 'add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class AddLocationComponent implements OnInit {

  formState$: Observable<FormGroupState<any>>;
  isDocumentComplete$: Observable<boolean>;
  isLastVersion$: Observable<boolean>;
  title$: Observable<string>;

  isComplete$: Subscription;

  constructor(private activeModal: NgbActiveModal, private store: Store<any>) {
    this.formState$ = this.store.select(fromLocation.getLocationForm);
    this.isDocumentComplete$ = this.store.select(buildingCommonData.getIsComplete);
    this.isLastVersion$ = this.store.select(buildingCommonData.getIsLastVersion);
  }

  ngOnInit() {
    this.isComplete$ = this.store.select(fromLocation.getIsComplete).subscribe(isComplete => {
      if (isComplete)
        this.activeModal.close();
    });
    this.title$ = this.store.select(fromLocation.getIsNew).pipe(map(s => s ? 'Create new location' : 'Edit location'));
  }

  ngOnDestroy(): void {
    this.isComplete$.unsubscribe();
  }

  dismiss() {
    this.reset();
    this.activeModal.dismiss();
  }

  reset() {
    this.store.dispatch(new SetValueAction(InitState.id, InitState.value));
    this.store.dispatch(new ResetAction(InitState.id));
  }

  onSave() {
    this.store.dispatch(new MarkAsSubmittedAction(InitState.id));
    this.store.dispatch(new locationFormActions.SendLocationRequest());
  }
}
