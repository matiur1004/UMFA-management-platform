import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NodeAttributeValueViewModel} from '../../../shared/models';

interface NodeAttributeCustomizationEvent {
  attributeName: string;
  comment: string;
  file: any;
  value: any;
}

@Component({
  selector: 'custom-attributes-form',
  templateUrl: './custom-attributes-form.component.html',
  styleUrls: ['./custom-attributes-form.component.less']
})
export class CustomAttributesFormComponent implements OnInit {
  public model: any;
  @Input() branchId: string;
  @Input() buildingId: string;
  @Input() versionDay: string;
  @Input() buildingPeriodIsFinalized: boolean;
  
  @Output() nodeAttributesChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Input() totalOnePhaseAmperage: any;
  @Input() totalThreePhasesAmperage: any;
  private baseModel: any;

  constructor() {
  }

  @Input() set nodeAttributes(value: NodeAttributeValueViewModel[]) {
    if (value) {
      this.baseModel = value;
      this.initModel(value);
    }
  }

  get phase(): NodeAttributeValueViewModel {
    return this.model['Phase'];
  }

  get voltage(): NodeAttributeValueViewModel {
    return this.model['Voltage'];
  }

  get cbSize(): NodeAttributeValueViewModel {
    return this.model['CB size'];
  }

  get totalCbSize(): NodeAttributeValueViewModel {
    return this.model['Total CB size'];
  }

  get maxDemand(): NodeAttributeValueViewModel {
    return this.model['Notified Maximum Demand'];
  }

  ngOnInit() {

  }

  getVoltageNormalizedValue(): number {
    const voltage = this.voltage.billingValue || this.voltage.recommendedValue;
    let res = parseFloat(voltage);
    if (voltage && /[0-9]kv/.test(voltage.toLowerCase())) {
      res = res * 1000;
    }
    return res;
  }

  reculcMaxDemund() {
    const totalCbSize = parseFloat(this.totalCbSize.billingValue || this.totalCbSize.recommendedValue);
    const phase = parseInt(this.phase.billingValue || this.phase.recommendedValue);
    const voltage = this.getVoltageNormalizedValue();

    if (phase === 3) {
      this.maxDemand.billingValue = this.round(totalCbSize * 0.667);
      this.maxDemand.file = null;
      this.maxDemand.comment = '';
    } else {
      this.maxDemand.billingValue = this.round(totalCbSize * voltage / 1000);
      this.maxDemand.file = null;
      this.maxDemand.comment = '';
    }
  }

  onCustomizeField(attribute: NodeAttributeValueViewModel, ev: NodeAttributeCustomizationEvent) {
    attribute.comment = ev.comment;
    attribute.file = ev.file;
    switch (attribute.attribute.name) {
      case 'Phase': {
        this.changePhase(attribute, ev);
        break;
      }
      case 'CB size': {
        this.changeCBSize(attribute, ev)
        break;
      }
      case 'Total CB size': {
        this.changeTotalCBSize(attribute, ev)
        break;
      }
      case 'Voltage': {
        this.changeVoltage(attribute, ev);
        break;
      }
      case 'Notified Maximum Demand': {
        this.changeMaxDemand(attribute, ev);
        break;
      }
    }
  }

  onResetField(attribute: NodeAttributeValueViewModel) {
    attribute.comment = '';
    attribute.file = null;
    attribute.fileUrl = null;
    switch (attribute.attribute.name) {
      case 'Phase': {
        this.resetPhase(attribute);
        break;
      }
      case 'CB size': {
        this.resetCBSize(attribute)
        break;
      }
      case 'Total CB size': {
        this.resetTotalCBSize(attribute)
        break;
      }
      case 'Voltage': {
        this.resetVoltage(attribute);
        break;
      }
      case 'Notified Maximum Demand': {
        this.resetMaxDemand(attribute);
        break;
      }
    }
    this.resetRecalculatedFields();
  }

  emitChangeEvent() {
    this.nodeAttributesChanged.emit(Object.values(this.model));
  }

  onCancelForm() {
    this.initModel(this.baseModel);
    this.cancel.emit();
  }

  onSaveFormData() {
    this.emitChangeEvent();
    this.save.emit();

  }

  private initModel(value) {
    this.model = {};
    value.forEach(el => {
      this.model[el.attribute.name] = {
        ...el
      };
    });

  }

  private round(value) {
    return value;
  }

  private resetRecalculatedFields() {
    if (!this.phase.comment
      && !this.cbSize.comment
      && !this.totalCbSize.comment
      && !this.voltage.comment
      && !this.maxDemand.comment) {
      this.phase.billingValue = null;
      this.cbSize.billingValue = null;
      this.totalCbSize.billingValue = null;
      this.voltage.billingValue = null;
      this.maxDemand.billingValue = null;
    }
  }

  private changePhase(attribute: NodeAttributeValueViewModel, ev: NodeAttributeCustomizationEvent) {
    attribute.billingValue = ev.value;
    const phase = parseInt(ev.value);
    const cbSize = parseFloat(this.cbSize.billingValue || this.cbSize.recommendedValue);
    this.totalCbSize.billingValue = cbSize * phase;

    this.reculcMaxDemund();
  }

  private changeVoltage(attribute: NodeAttributeValueViewModel, ev: NodeAttributeCustomizationEvent) {
    attribute.billingValue = ev.value;

    this.reculcMaxDemund();
  }

  private changeCBSize(attribute: NodeAttributeValueViewModel, ev: NodeAttributeCustomizationEvent) {
    attribute.billingValue = ev.value;
    const cbSize = parseFloat(ev.value);
    const phase = parseInt(this.phase.billingValue || this.phase.recommendedValue);
    this.totalCbSize.billingValue = cbSize * phase;
    this.totalCbSize.file = null;
    this.totalCbSize.comment = '';
    this.reculcMaxDemund();
  }

  private changeTotalCBSize(attribute: NodeAttributeValueViewModel, ev: NodeAttributeCustomizationEvent) {
    attribute.billingValue = ev.value;
    const totalCbSize = parseFloat(ev.value);
    const phase = parseInt(this.phase.billingValue || this.phase.recommendedValue);
    this.cbSize.billingValue = this.round(totalCbSize / phase);
    this.cbSize.file = null;
    this.cbSize.comment = '';
    this.reculcMaxDemund();
  }

  private changeMaxDemand(attribute: NodeAttributeValueViewModel, ev: NodeAttributeCustomizationEvent) {
    attribute.billingValue = ev.value;
    const totalCbSize = parseFloat(this.totalCbSize.billingValue || this.totalCbSize.recommendedValue);
    const cbSize = parseFloat(this.cbSize.billingValue || this.cbSize.recommendedValue);
    const phase = parseInt(this.phase.billingValue || this.phase.recommendedValue);
    const maxDemand = parseFloat(this.maxDemand.billingValue || this.maxDemand.recommendedValue);
    const voltage = this.getVoltageNormalizedValue();
    if (phase === 3) {
      this.totalCbSize.billingValue = this.round(maxDemand / 0.667);
      this.totalCbSize.file = null;
      this.totalCbSize.comment = '';

      this.cbSize.billingValue = this.round(this.totalCbSize.billingValue / phase);
      this.cbSize.file = null;
      this.cbSize.comment = '';
    } else {
      this.totalCbSize.billingValue = this.round(maxDemand * 1000 / voltage);
      this.totalCbSize.file = null;
      this.totalCbSize.comment = '';

      this.cbSize.billingValue = this.round(this.totalCbSize.billingValue / phase);
      this.cbSize.file = null;
      this.cbSize.comment = '';
    }

  }

  private resetPhase(attribute: NodeAttributeValueViewModel) {
    attribute.billingValue = null;
    if (this.totalCbSize.billingValue) {
      const phase = parseInt(this.phase.billingValue || this.phase.recommendedValue);
      const cbSize = parseFloat(this.cbSize.billingValue || this.cbSize.recommendedValue);
      this.totalCbSize.billingValue = cbSize * phase;
    }
    if (this.cbSize.billingValue) {
      const totalCbSize = parseFloat(this.totalCbSize.billingValue || this.totalCbSize.recommendedValue);
      const phase = parseInt(this.phase.billingValue || this.phase.recommendedValue);
      this.cbSize.billingValue = this.round(totalCbSize / phase);
    }
    this.reculcMaxDemund();
  }

  private resetVoltage(attribute: NodeAttributeValueViewModel) {
    attribute.billingValue = null;
    this.reculcMaxDemund();
  }

  private resetCBSize(attribute: NodeAttributeValueViewModel) {
    attribute.billingValue = null;
    if (this.totalCbSize.billingValue) {
      const phase = parseInt(this.phase.billingValue || this.phase.recommendedValue);
      const cbSize = parseFloat(this.cbSize.billingValue || this.cbSize.recommendedValue);
      this.totalCbSize.billingValue = cbSize * phase;
    } else {
      this.resetPhase(this.phase);
    }
    this.reculcMaxDemund();
  }

  private resetTotalCBSize(attribute: NodeAttributeValueViewModel) {
    attribute.billingValue = null;
    if (this.cbSize.billingValue) {
      const totalCbSize = parseFloat(this.totalCbSize.billingValue || this.totalCbSize.recommendedValue);
      const phase = parseInt(this.phase.billingValue || this.phase.recommendedValue);
      this.cbSize.billingValue = this.round(totalCbSize / phase);
    } else {
      this.resetPhase(this.phase);
    }
    this.reculcMaxDemund();
  }

  private resetMaxDemand(attribute: NodeAttributeValueViewModel) {
    attribute.billingValue = null;
    attribute.comment = '';
    attribute.file = null;

    this.phase.billingValue = null;
    this.phase.comment = null;
    this.phase.file = null;

    const totalCbSize = parseFloat(this.totalCbSize.billingValue || this.totalCbSize.recommendedValue);
    const cbSize = parseFloat(this.cbSize.billingValue || this.cbSize.recommendedValue);
    const phase = parseInt(this.phase.billingValue || this.phase.recommendedValue);
    const maxDemand = parseFloat(this.maxDemand.billingValue || this.maxDemand.recommendedValue);
    const voltage = this.getVoltageNormalizedValue();


    if (phase === 3) {
      this.totalCbSize.billingValue = this.round(maxDemand / 0.667);
      this.totalCbSize.file = null;
      this.totalCbSize.comment = '';

      this.cbSize.billingValue = this.round(this.totalCbSize.billingValue / phase);
      this.cbSize.file = null;
      this.cbSize.comment = '';
    } else {
      this.totalCbSize.billingValue = this.round(maxDemand * 1000 / voltage);
      this.totalCbSize.file = null;
      this.totalCbSize.comment = '';

      this.cbSize.billingValue = this.round(this.totalCbSize.billingValue / phase);
      this.cbSize.file = null;
      this.cbSize.comment = '';
    }

  }

}
