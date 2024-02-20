import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormArrayState, FormGroupState} from 'ngrx-forms';
import {BulkDropdownType} from '../../shared/models';
import {EquipmentTemplateFormValue} from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers/bulk-equipment-wizard-reducers/setup-step.store';
import {NgbDateFRParserFormatter, NgbDateFullParserFormatter, ngbDateNgrxValueConverter} from '@shared-helpers';
import {NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  EquipmentBulkStepActionType,
  Step
} from '@app/branch/buildings/manage-building/building-equipment/shared/models/bulk-action.model';
import {ImgModalComponent} from '@app/widgets/img-modal/img-modal.component';

@Component({
  selector: 'setup-equipment-bulk',
  templateUrl: './setup-equipment-bulk.component.html',
  styleUrls: ['./setup-equipment-bulk.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFullParserFormatter}, {
    provide: NgbDateParserFormatter,
    useClass: NgbDateFRParserFormatter
  }]
})
export class SetupEquipmentBulkComponent {
  @Input() dropdownData: any;
  @Input() form: FormGroupState<any>;
  @Input() total: number;
  @Input() isSelectedAllTemplates: boolean;
  @Output() nextStep = new EventEmitter();
  @Output() equipmentGroupChange = new EventEmitter();
  @Output() deviceChange = new EventEmitter();
  @Output() locationChange = new EventEmitter();
  @Output() selectAllTemplates = new EventEmitter();
  @Output() supplyToChange = new EventEmitter();
  @Output() photoChange = new EventEmitter();
  @Output() locationTypeChange = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() removeItem = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() addItem = new EventEmitter();
  @Output() setBulkAction: EventEmitter<{ step: Step, actionType: EquipmentBulkStepActionType }> = new EventEmitter();
  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;
  equipmentBulkActionType = EquipmentBulkStepActionType;
  bulkDropdownType = BulkDropdownType;
  checkedAllPartly: boolean;
  public step: Step = Step.EquipmentBulk;

  constructor(private modalService: NgbModal) {
  }

  private _selectedTemplates: number;

  get selectedTemplates() {
    return this._selectedTemplates;
  }

  @Input() set selectedTemplates(templates) {
    this._selectedTemplates = templates;
    this.checkedAllPartly = this.selectedTemplates > 0 && this.templates.value.length !== this.selectedTemplates;
  };

  get templates() {
    return this.form.controls.templates as FormArrayState<EquipmentTemplateFormValue[]>;
  }

  trackById(index) {
    return index;
  }

  onOpenImage(templateId: string, photo: string) {
    const modalRef = this.modalService.open(ImgModalComponent);
    modalRef.componentInstance.url = photo;
    modalRef.result.then((file) => {
      this.photoChange.emit({templateId: templateId, file});
    }, () => {
    });
  }
}
