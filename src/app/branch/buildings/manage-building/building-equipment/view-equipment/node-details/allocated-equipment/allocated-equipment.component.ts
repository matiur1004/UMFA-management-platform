import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FieldType, RegisterSuffix, TotalRegister, UnitOfMeasurementName} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';
import {Observable} from 'rxjs';
import {
  NodeAllocatedRegister,
  OrderNodeType,
  RegisterRemovedStatus,
  registerRemovedStatuses,
  registerRemovedStatusText,
  RegisterStatusType,
  registerStatusTypes,
  registerStatusTypeText,
  SelectedStatusFilter
} from '../../../shared/models';
import {CalcFactorComponent} from './calc-factor-modal/calc-factor.component';

@Component({
  selector: 'allocated-equipment',
  templateUrl: './allocated-equipment.component.html',
  styleUrls: ['./allocated-equipment.component.less']
})
export class AllocatedEquipmentComponent implements OnChanges {

  @Input() isMeter: boolean;

  @Input() nodes: any[];

  @Input() registers: any[];
  @Input() selectedRegister: any[];
  @Input() totalRegisters$: Observable<TotalRegister[]>;
  @Input() selectedStatus: SelectedStatusFilter;
  @Input() branchId: string;
  @Input() buildingId: string;
  @Input() versionDay: string;
  @Input() suppliesNames: { [key: string]: string } = {};
  @Input() locationTypesNames: { [key: string]: string } = {};
  @Input() buildingPeriodIsFinalized: boolean;

  @Output() removeNode = new EventEmitter();
  @Output() removeSelectedNodes = new EventEmitter();
  @Output() removeSelectedRegisters = new EventEmitter<NodeAllocatedRegister[]>();
  @Output() addSelectedRegisters = new EventEmitter<NodeAllocatedRegister[]>();
  @Output() registersFactorCahnged = new EventEmitter<{ register: NodeAllocatedRegister, factorValue: number }>();
  @Output() search = new EventEmitter();
  @Output() changeOrderIndex = new EventEmitter();
  @Output() updateRegisterFilter = new EventEmitter();
  @Output() updateStatus = new EventEmitter<SelectedStatusFilter>();
  @Output() showNodesAllocation = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() selectNodes = new EventEmitter();
  @Output() cancel = new EventEmitter();

  orderIndex = 2;
  orderType = OrderNodeType;

  fieldType = FieldType;

  registersDict = {};
  registerStatusType = RegisterStatusType;
  registerStatusTypes = registerStatusTypes;
  registerStatusTypeText = registerStatusTypeText;

  registerRemovedStatuses = registerRemovedStatuses;
  registerRemovedStatusText = registerRemovedStatusText;

  availableTotalRegisters: TotalRegister[];
  filteredRegisters: {
    [nodeId: string]: {
      totalRegister: TotalRegister,
      controls: any[]
    }[];
  } = {};

  constructor(private modalService: NgbModal) {

  }

  private static getRegisterIds(nodeId: string, register: { totalRegister: TotalRegister; controls: any[] }): Array<NodeAllocatedRegister> {
    const registerIds = [];

    registerIds.push(<NodeAllocatedRegister>{
      nodeId,
      registerIds: register.totalRegister.registerIds
    });

    return registerIds;
  }

  ngOnChanges(changes) {
    if (changes.registers) {
      this.registersDict = (this.registers || []).reduce((dict, r) => {
        dict[r.id] = r;
        return dict;
      }, {});

      this.updateAvailableRegisters();
    }
    if (changes.nodes || changes.selectedRegister || changes.selectedStatus) {
      this.filteredRegisters = {};
      this.nodes.forEach(n => this.updateFilteredRegisters(n));
    }
  }

  openCalcFactorModal(ids: string[]) {
    const modalRef = this.modalService.open(CalcFactorComponent, {centered: true, windowClass: 'calc-fact-modal'});
    modalRef.componentInstance.selectedItems = ids;
  }

  setFactorToSelectedNodes() {
    this.openCalcFactorModal(this.getSelectedItems().map(i => i.control.value.id));
  }

  setFactorToNode(id: string) {
    this.openCalcFactorModal([id]);
  }

  allNodesSelected() {
    return this.nodes && this.nodes.length && this.nodes.some(n => !n.control.value.selected) === false;
  }

  onSelectAllNodes(selected) {
    this.selectNodes.emit({
      nodeIds: this.nodes.map(n => n.node.nodeId),
      selected: !this.allNodesSelected()
    });
  }

  onChangeOrderIndex(idx) {
    if (this.orderIndex === idx || (this.orderIndex === (idx * -1))) {
      this.orderIndex *= -1;
    } else {
      this.orderIndex = idx;
    }

    this.changeOrderIndex.emit(this.orderIndex);
  }

  trackById(index) {
    return index;
  }

  onAddEquipment() {
    this.showNodesAllocation.emit(true);
  }

  getSelectedItems() {
    return (this.nodes || []).filter(i => i.control.value.selected);
  }

  getSelectedItemCount() {
    return this.getSelectedItems().length;
  }

  openDeleteConfirmation(deleteAction) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      backdrop: 'static',
      windowClass: 'confirm-del-modal'
    });
    modalRef.result.then(deleteAction);
  }

  onDeleteSelected() {
    this.openDeleteConfirmation(() => {
      const nodeIds = this.getSelectedItems().map(i => i.node.id);
      this.removeSelectedNodes.emit(nodeIds);
    });
  }

  onDeleteNode(nodeId) {
    this.openDeleteConfirmation(() => this.removeNode.emit(nodeId));
  }

  onDeleteSelectedRegisters() {
    this.openDeleteConfirmation(() => {
      const nodeRegisterIds = this.getSelectedItems().map(i =>
        (<NodeAllocatedRegister>{
          nodeId: i.node.nodeId,
          registerIds: this.getFilteredRegisterIds(i.node.nodeId, false)
        })
      );
      this.removeSelectedRegisters.emit(nodeRegisterIds);
    });
  }

  onAddSelectedRegisters() {
    const nodeRegisterIds = this.getSelectedItems().map(i =>
      (<NodeAllocatedRegister>{
        nodeId: i.node.nodeId,
        registerIds: this.getFilteredRegisterIds(i.node.nodeId, true)
      })
    );
    this.addSelectedRegisters.emit(nodeRegisterIds);
  }

  getFilteredRegisterIds(nodeId: string, isRemoved: boolean): string[] {
    return this.filteredRegisters[nodeId]
      .filter(r => r.totalRegister.isRemoved === isRemoved)
      .reduce((prev, curr) => {
        curr.totalRegister.registerIds.forEach(rId => prev.push(rId));
        return prev;
      }, []);
  }

  canShowBulkActions() {
    return this.getSelectedItemCount() > 0;
  }

  updateAvailableRegisters() {
    const nodesRegisters = this.nodes.reduce((prev: TotalRegister[], curr) => {
      return [...(curr.node.meterAllocation || curr.node).registers, ...prev];
    }, []);

    let registersEntity = nodesRegisters.reduce((p, c) => {
      return {[c.registerId]: {...c, id: c.registerId}, ...p};
    }, {});

    let filterRegisters = this.registers.reduce((prev: TotalRegister[], curr) => {
      prev.push({...curr, ...registersEntity[curr.id]});

      return prev;
    }, []);

    this.availableTotalRegisters = filterRegisters.reduce((prev: TotalRegister[], curr) => {
      const absentInResults = prev.every(tr => (tr.unitOfMeasurement !== curr.unitOfMeasurement || tr.timeOfUse !== curr.timeOfUse)
        || (!this.isVirtualRegisterEqual(curr, tr)));

      if (absentInResults) {
        const selected = this.selectedRegister.find(tr => tr.unitOfMeasurement === curr.unitOfMeasurement
          && tr.timeOfUse === curr.timeOfUse);
        if (selected) {
          prev.push(selected);
        } else {
          prev.push(<TotalRegister>{
            unitName: this.getUnitName(curr),
            name: curr.name,
            unitOfMeasurement: curr.unitOfMeasurement,
            timeOfUse: curr.timeOfUse,
            virtualRegisterInfo: curr.virtualRegisterInfo
          });
        }
      }
      return prev;
    }, []);
  }

  updateFilteredRegisters({node, control}) {
    control.controls.registers.controls.forEach(c => {
      const registerId = c.value.registerId;
      const register = this.registersDict[registerId];

      if (!this.filteredRegisters[node.nodeId]) {
        this.filteredRegisters[node.nodeId] = [];
      }

      let totalRegister = this.filteredRegisters[node.nodeId]
        .find(tr => tr.totalRegister.unitOfMeasurement === register.unitOfMeasurement
          && tr.totalRegister.timeOfUse === register.timeOfUse);

      const nodeRegister = this.isMeter ? node.meterAllocation.registers.find(r => r.registerId === registerId)
        : node.registers.find(r => r.registerId === registerId);

      if (!totalRegister || node.meterOwnerId) {
        totalRegister = {
          totalRegister: {
            unitName: this.getUnitName(nodeRegister),
            registerId,
            unitOfMeasurement: nodeRegister.unitOfMeasurement,
            name: register.name,
            timeOfUse: nodeRegister.timeOfUse,
            calculationFactor: c.value.calculationFactor,
            registerIds: [],
            isRemoved: c.value.isRemoved,
            isBilling: c.value.isBilling,
            virtualRegisterInfo: nodeRegister.virtualRegisterInfo
          },
          controls: c.controls
        };

        this.filteredRegisters[node.nodeId].push(totalRegister);
      }

      totalRegister.totalRegister.registerIds.push(registerId);
    }, []);

    if (this.selectedRegister && this.selectedRegister.length > 0) {
      this.filteredRegisters[node.nodeId] = this.filteredRegisters[node.nodeId]
        .filter(r => this.selectedRegister.some(selected => selected.virtualRegisterInfo !== null
          ? this.isVirtualRegisterEqual(selected, r.totalRegister)
          : this.isRealRegisterEqual(selected, r.totalRegister)));
    }

    if (this.selectedStatus.isBilling === RegisterStatusType.Billing) {
      this.filteredRegisters[node.nodeId] = this.filteredRegisters[node.nodeId].filter(r => r.totalRegister.isBilling === true);
    } else if (this.selectedStatus.isBilling === RegisterStatusType.Readonly) {
      this.filteredRegisters[node.nodeId] = this.filteredRegisters[node.nodeId].filter(r => r.totalRegister.isBilling === false);
    }

    if (this.selectedStatus.isRemoved === RegisterRemovedStatus.Removed) {
      this.filteredRegisters[node.nodeId] = this.filteredRegisters[node.nodeId].filter(r => r.totalRegister.isRemoved === true);
    } else if (this.selectedStatus.isRemoved === RegisterRemovedStatus.NotRemoved) {
      this.filteredRegisters[node.nodeId] = this.filteredRegisters[node.nodeId].filter(r => r.totalRegister.isRemoved === false);
    }
  }

  onBillingStatusUpdate(status: RegisterStatusType) {
    this.updateStatus.emit({
      ...this.selectedStatus,
      isBilling: status
    });
  }

  onRemovedStatusUpdate(status: RegisterRemovedStatus) {
    this.updateStatus.emit({
      ...this.selectedStatus,
      isRemoved: status
    });
  }

  onRegisterFactorChange(nodeId: string, register: TotalRegister) {
    this.registersFactorCahnged.emit({
      register: <NodeAllocatedRegister>{
        nodeId: nodeId,
        registerIds: register.registerIds
      },
      factorValue: register.calculationFactor
    });
  }

  onSave() {
    this.save.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onAllocatedChange(event, register: {
    totalRegister: TotalRegister,
    controls: any[]
  }, nodeId: string) {
    let nodeRegisterIds = [];
    register.totalRegister.isRemoved = !register.totalRegister.isRemoved;
    nodeRegisterIds = AllocatedEquipmentComponent.getRegisterIds(nodeId, register);

    if (register.totalRegister.isRemoved) {
      this.removeSelectedRegisters.emit(nodeRegisterIds);
    } else {
      this.addSelectedRegisters.emit(nodeRegisterIds);
    }
  }

  private getUnitName(nodeRegister: TotalRegister) {
    const unitName = UnitOfMeasurementName[nodeRegister.unitOfMeasurement];
    let suffix = '';

    if (nodeRegister.virtualRegisterInfo !== null) {
      const suffixKey =
        `${nodeRegister.virtualRegisterInfo.virtualType}${nodeRegister.virtualRegisterInfo.signalMeterRegisterType !== null
          ? nodeRegister.virtualRegisterInfo.signalMeterRegisterType : ''}`;

      suffix = RegisterSuffix[suffixKey];
    }

    return `${unitName}${suffix}`;
  }

  private isVirtualRegisterEqual(register1: TotalRegister, register2: TotalRegister) {
    return (register2.virtualRegisterInfo !== null && register1.virtualRegisterInfo !== null)
      && (register1.virtualRegisterInfo.signalMeterRegisterType === register2.virtualRegisterInfo.signalMeterRegisterType
        && register1.timeOfUse === register2.timeOfUse
        && register1.unitOfMeasurement === register2.unitOfMeasurement
        && register1.virtualRegisterInfo.virtualType === register2.virtualRegisterInfo.virtualType);
  }

  private isRealRegisterEqual(register1: TotalRegister, register2: TotalRegister) {
    return register1.unitOfMeasurement === register2.unitOfMeasurement
      && register1.timeOfUse === register2.timeOfUse
      && register1.virtualRegisterInfo === null && register2.virtualRegisterInfo === null;
  }
}
