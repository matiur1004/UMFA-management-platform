import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IWizardComponent} from 'app/shared/wizard/IWizardComponent';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngrx/store';

import {NewCommonAreaComponent} from '../../dialogs/new-common-area/new-common-area.component';
import {CommonAreaViewModel} from 'app/shared/models/common-area.model';
import {commonAreaServicesValidator} from '../../../../../../../shared/validators/common-area-services.validator';

import * as fromOccupation from '../../../shared/store/reducers';
import * as occupationAction from '../../../shared/store/actions/occupation.actions';

@Component({
  selector: 'manage-common-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-common-area.component.html',
  styleUrls: ['./manage-common-area.component.less']
})
export class ManageCommonAreaComponent implements OnInit, IWizardComponent {

  @Input() commonAreas: CommonAreaViewModel[];
  @Input() commonAreaCount: number;
  @Input() orderIndex: number;

  @Output() deleteCommonArea = new EventEmitter();
  @Output() updateCommonArea = new EventEmitter();
  @Output() updateCommonAreaSearchTerm = new EventEmitter();
  @Output() addCommonAreas = new EventEmitter<any>();
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() updateCommonAreaServices = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() updateCommonAreaOrderIndex = new EventEmitter<number>();
  @Output() defaultCommonAreas = new EventEmitter<CommonAreaViewModel[]>();

  isSubmitted: boolean = false;
  count: number;
  isFormInitialized: boolean = false;
  isSort: boolean = false;

  form: FormGroup;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private store: Store<fromOccupation.State>) {
  }

  ngOnInit() {
    this.defaultCommonAreas.emit(this.commonAreas);
  }

  ngOnChanges() {
    this.createForm(this.commonAreas);
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
          floor: [element.floor],
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

  onCreate() {
    let modalOptions: NgbModalOptions = {
      backdrop: 'static',
      windowClass: 'cmn-area-modal'
    };
    const modalRef = this.modalService.open(NewCommonAreaComponent, modalOptions);
    modalRef.result.then((result) => {
      this.count = result;
      this.addCommonAreas.emit(result);
    }, () => {
    });
  }

  onDelete(commonAreaId: string, index: number) {
    let control = this.form.controls['commonAreas'] as FormArray;
    control.removeAt(index);
    this.deleteCommonArea.emit(commonAreaId);
  }

  onNext() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.store.dispatch(new occupationAction.InitLiabilitiesByCommonAreaServices());
      this.save.emit();
      this.next.emit(3);
    }
  }

  canNavigate(): boolean {
    return this.form.valid;
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

  onSkip() {
    this.next.emit();
  }

}
