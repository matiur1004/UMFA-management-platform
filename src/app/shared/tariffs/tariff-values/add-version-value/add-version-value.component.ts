import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {NgbActiveModal, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {convertDateToNgbDate, NgbDateFRParserFormatter, ngbDateNgrxValueConverter} from '@shared-helpers';

@Component({
  selector: 'add-version-value',
  templateUrl: './add-version-value.component.html',
  styleUrls: ['./add-version-value.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class AddVersionValueComponent implements OnChanges, OnDestroy {

  @Input() tariff: any;
  @Input() lineItems: any[];
  @Input() closeOnSave = true;
  @Input() minEndDateForNewTariffValue: NgbDate;
  @Output() save = new EventEmitter();
  showAllErrors = false;
  form: FormGroup;
  destroyed$ = new Subject();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      name: fb.control('', [Validators.required]),
      startDate: fb.control('', [Validators.required]),
      endDate: fb.control('', [Validators.required]),
      increasePercentage: fb.control(0),
      lineItemIncreases: fb.array([])
    });
    this.form.controls.increasePercentage.valueChanges
      .pipe(takeUntil(this.destroyed$)).subscribe(
      (v) => {
        const increases = this.form.controls.lineItemIncreases as FormArray;
        increases.controls.forEach((c: FormGroup) => c.controls.increasePercentage.enabled && c.controls.increasePercentage.setValue(v));
      }
    );
  }

  private _lastTariffValueEndDate: string | Date;

  public get lastTariffValueEndDate(): string | Date {
    return this._lastTariffValueEndDate;
  }

  @Input()
  public set lastTariffValueEndDate(value: string | Date) {
    if (this.form) {
      this._lastTariffValueEndDate = value;
      this.form.controls.startDate.setValue(convertDateToNgbDate(this._lastTariffValueEndDate));
    }
  }

  get versionForm() {
    return this.form;
  }

  get lineItemIncreases(): FormArray {
    return this.versionForm.controls.lineItemIncreases as FormArray;
  }

  ngOnChanges(changes) {
    if (changes.lineItems) {
      this.updateLineItemControls();
    }
  }

  updateLineItemControls() {
    this.versionForm.controls.lineItemIncreases =
      this.fb.array((this.lineItems || []).map(li => {
        const enabledCtrl = this.fb.control(true);
        const increaseCtrl = this.fb.control(0);
        enabledCtrl.valueChanges.subscribe(v => {
          if (increaseCtrl.enabled === v) {
            return;
          }
          if (v) {
            increaseCtrl.enable();
          } else {
            increaseCtrl.setValue(0);
            increaseCtrl.disable();
          }
        });

        return this.fb.group({
          lineItemId: li.lineItemId,
          name: li.name,
          increasePercentage: increaseCtrl,
          enabled: enabledCtrl
        });
      }));
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  create() {
    this.versionForm.updateValueAndValidity();
    const startDate = this.versionForm.controls.startDate.value;
    const endDate = this.versionForm.controls.endDate.value;
    const resultVersion = {
      ...this.versionForm.value,
      startDate: ngbDateNgrxValueConverter.convertViewToStateValue(startDate),
      endDate: ngbDateNgrxValueConverter.convertViewToStateValue(endDate),
    };

    if (this.versionForm.valid) {
      this.save.emit(resultVersion);

      if (this.closeOnSave) {
        this.activeModal.close(resultVersion);
      }
    } else {
      this.showAllErrors = true;
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  trackById(index) {
    return index;
  }
}
