import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonAreaViewModel} from 'app/shared/models/common-area.model';
import {select, Store} from '@ngrx/store';
import * as fromOccupation from '../../../shared/store/reducers';
import * as occupationAction from '../../../shared/store/actions/occupation.actions';
import {Observable, Subscription} from 'rxjs';
import {commonAreaServicesValidator} from 'app/shared/validators/common-area-services.validator';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonAreaLiablityViewComponent} from '../../dialogs/common-area-liablity-view/common-area-liablity-view.component';
import {first} from 'rxjs/operators';
import * as buildingCommonData from '../../../../shared/store/selectors/common-data.selectors';

@Component({
  selector: 'view-common-areas',
  templateUrl: './view-common-areas.component.html',
  styleUrls: ['./view-common-areas.component.less']
})
export class ViewCommonAreasComponent implements OnInit {
  @Input() commonAreas: CommonAreaViewModel[];
  @Input() canEdit: boolean;
  @Input() orderIndex: number;

  @Output() deleteCommonArea = new EventEmitter();
  @Output() updateCommonArea = new EventEmitter();
  @Output() selectedCommonAreaById = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() addCommonArea = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();
  @Output() updateCommonAreaServices = new EventEmitter();
  @Output() updateCommonAreaOrderIndex = new EventEmitter<number>();
  @Output() goToNodeDetail = new EventEmitter<string>();

  isSubmitted = false;
  count: number;
  isFormInitialized: boolean = false;
  isSort: boolean = false;

  form: FormGroup;
  historySubj: Subscription;
  areaFromModel: CommonAreaViewModel[];
  buildingPeriodIsFinalized$: Observable<any>;
  
  constructor(private fb: FormBuilder, private store: Store<fromOccupation.State>, private modalService: NgbModal) {
  }

  get commonAreasControls() {
    return this.form.controls.commonAreas as FormArray;
  }

  ngOnInit() {
    this.historySubj = this.store.select(fromOccupation.getCurrentHistory).subscribe((_) => {
      this.createForm(this.commonAreas);
      this.areaFromModel = this.commonAreas;
      this.isFormInitialized = true;
    });
    this.buildingPeriodIsFinalized$ = this.store.pipe(select(buildingCommonData.getIsFinalized));
  }

  ngOnDestroy(): void {
    this.historySubj.unsubscribe();
  }

  ngOnChanges() {
    if ((this.commonAreas.length !== 0 && !this.isFormInitialized ||
      this.form && this.form.controls && this.commonAreas.length !== (this.form.controls['commonAreas'] as FormArray).length) || this.isSort) {
      this.createForm(this.commonAreas);
      this.isFormInitialized = true;
      this.isSort = false;
    }
  }

  createForm(model: CommonAreaViewModel[]) {
    this.form = this.fb.group({
      commonAreas: this.fb.array([])
    });

    let control = this.form.controls['commonAreas'] as FormArray;
    model.forEach(element => {
      control.push(
        this.fb.group({
          id: [element.id],
          name: [element.name, Validators.required],
          floor: [element.floor, [Validators.pattern(/^(?!-0(\.0+)?$)-?(0|[1-9]\d*)(\.\d+)?$/)]],
          isActive: [element.isActive],
          services: this.fb.group({
            electricity: [element.services.isElectricityEnable],
            water: [element.services.isWaterEnable],
            sewerage: [element.services.isSewerageEnable],
            gas: [element.services.isGasEnable],
            other: [element.services.isOtherEnable]
          }, {validator: commonAreaServicesValidator()})
        })
      );
    });
  }

  onDelete(commonAreaId: string, index: number) {
    let control = this.form.controls['commonAreas'] as FormArray;
    control.removeAt(index);
    this.deleteCommonArea.emit(commonAreaId);
  }

  onSave() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.save.emit();
    }
  }

  onCreate() {
    this.addCommonArea.emit();
  }

  onOpenLiability(commonAreaId: string) {
    this.store.dispatch(new occupationAction.InitLiabilitiesByCommonAreaServices());
    this.selectedCommonAreaById.emit(commonAreaId);
    const modalRef = this.modalService.open(CommonAreaLiablityViewComponent, {
      backdrop: 'static',
      windowClass: 'liability-modal'
    });
    this.goToNodeDetail.pipe(first()).subscribe(e => modalRef.dismiss());
    modalRef.componentInstance.goToNodeDetail = this.goToNodeDetail;
  }

  onRemoveCommonArea(commonAreaId: string) {
    this.store.dispatch(new occupationAction.RemoveCommonArea(commonAreaId));
  }

  changeOrderIndex(idx) {
    this.isSort = true;
    if (this.orderIndex === idx || (this.orderIndex === (idx * -1))) {
      this.orderIndex *= -1;
      this.updateCommonAreaOrderIndex.emit(this.orderIndex);
    } else {
      this.updateCommonAreaOrderIndex.emit(idx);
    }
  }

  onCancel() {
    const areaIds = this.areaFromModel.map(el => el.id);
    this.store.dispatch(new occupationAction.ReturnDefaultFormAreaValue({
      areaIds: areaIds,
      defaultAreas: this.areaFromModel
    }));
    this.createForm(this.areaFromModel);
  }
}
