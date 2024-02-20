import {CbSizeFilterModel} from '@app/branch/buildings/manage-building/building-equipment/shared/models/search-filter.model';
import {UnitOfMeasurement} from '@models';
import {AssignedStatus, NodeType} from '@app/branch/buildings/manage-building/building-equipment/shared/models';

export class SearchFilterAssignedMetersModel {
  supplyType: number[];
  vrId: string;
  supplyToId: string;
  locationTypeId: string;
  cbSize: CbSizeFilterModel;
  unitIds: string[];
  nodeType: NodeType;
  status: AssignedStatus;
  amrRegisters: UnitOfMeasurement[];

  constructor() {
    this.vrId = '';
    this.supplyToId = '';
    this.supplyType = [];
    this.locationTypeId = '';
    this.unitIds = null;
    this.cbSize = {attributeId: '', min: 0, max: 0};
    this.nodeType = NodeType.Single;
    this.amrRegisters = [];
    this.status = AssignedStatus.All;
  }
}
