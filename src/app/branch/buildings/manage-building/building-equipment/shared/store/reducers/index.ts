import * as fromVirtualRegistersReducer
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers/virtual-registers-reducers/virtual-registers.reducer';
import * as fromVirtualRegisters
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/state/virtual-registers.state';
import {
  CommonAreaViewModel,
  EquipmentTemplateRegisterViewModel,
  RegisterType,
  RegisterViewModel,
  ShopOrder,
  ShopViewModel,
  SupplyType,
  SupplyTypeLiabilityModel,
  TotalRegister,
  UnitOfMeasurement,
  UnitOfMeasurementName,
  UnitType
} from '@models';
import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';
import * as buildingCommonData from '../../../../shared/store/selectors/common-data.selectors';
import {getRegisters, getUnitsOfMeasurementScales} from '../../../../shared/store/selectors/common-data.selectors';
import {
  AllocatedNodeEditViewModel,
  electricityAttributes,
  ElectricityAttributeType,
  getTreeChildrenIds,
  getTreesLookup,
  NodeEditViewModel,
  NodeType,
  OrderEquipment,
  OrderNodeType,
  UnitFilter
} from '../../models';
import {isAmrIntegrationAllowed, isBreaker} from '../utilities/equipment-type-resolver';
import {sortFunc} from '../utilities/sortFunc';
import * as fromEquipmentTemplate from './building-equip-template.store';
import * as fromAttributesStep from './bulk-equipment-wizard-reducers/attributes-step.store';

import * as fromBulkWizard from './bulk-equipment-wizard-reducers/bulk-wizard.store';
import * as fromRegistersAndReadingsStep from './bulk-equipment-wizard-reducers/registers-and-readings-step.store';
import * as fromSetupStep from './bulk-equipment-wizard-reducers/setup-step.store';
import * as fromShopsStep from './bulk-equipment-wizard-reducers/shops-step.store';
import {UnitMetersFormValue} from './bulk-equipment-wizard-reducers/shops-step.store';

import * as fromEquipmentForm from './equipment-form.store';
import * as fromEquipmentdStep from './equipment-step.store';
import * as fromEquipmentTree from './equipment-tree.reducer';
import * as fromEquipment from './equipment.store';
import * as fromLocationEquipment from './location-equipment.store';
import * as fromLocationForm from './location-form.store';
import * as fromLocationStep from './location-step.store';
import * as fromLocation from './location.store';
import * as fromNodeDetail from './node-detail.store';
import * as fromNodeFormAllocatedEquipment from './node-form-allocated-equipment.store';
import {AllocatedNodeFormValue} from './node-form-allocated-equipment.store';
import * as fromNodeFormAllocatedTariff from './node-form-allocated-tariffs.store';
import * as fromNodeFormAllocatedUnit from './node-form-allocated-units.store';
import * as fromNodeFormApplyTariff from './node-form-apply-new-tariff.store';
import * as fromNodeForm from './node-form.store';
import * as fromNodeSets from './node-sets.store';
import * as fromNode from './node.store';
import * as fromAddClosingReadingsStep from './replace-equipment-wizard-reducers/add-closing-readings-step.store';
import * as fromReplaceEquipmentStep from './replace-equipment-wizard-reducers/replace-equipment-step.store';
import * as fromReplaceNodeTariffStep from './replace-equipment-wizard-reducers/replace-node-tariff-step.store';

import * as fromReplaceWizard from './replace-equipment-wizard-reducers/replace-wizard.store';
import * as fromShopStep from './shop-step.store';
import * as fromWizard from './wizard.store';
import { EquipmentService } from '@services';

export interface State {
  wizard: fromWizard.State;
  equipmentForm: fromEquipmentForm.State;
  equipment: fromEquipment.State;
  locationForm: fromLocationForm.State;
  location: fromLocation.State;
  locationEquipment: fromLocationEquipment.State;
  equipmentStep: fromEquipmentdStep.State;
  locationStep: fromLocationStep.State;
  shopStep: fromShopStep.State;
  equipmentTemplate: fromEquipmentTemplate.State;
  node: fromNode.State;
  nodeDetail: fromNodeDetail.State;
  nodeForm: fromNodeForm.State;
  nodeFormAllocatedTariff: fromNodeFormAllocatedTariff.State;
  nodeFormApplyTariff: fromNodeFormApplyTariff.State;
  nodeFormAllocatedUnit: fromNodeFormAllocatedUnit.State;
  nodeFormAllocatedEquipment: fromNodeFormAllocatedEquipment.State;
  nodeSets: fromNodeSets.State;
  bulkWizard: fromBulkWizard.State;
  setupStep: fromSetupStep.State;
  shopsStep: fromShopsStep.State;
  attributesStep: fromAttributesStep.State;
  registersAndReadingsStep: fromRegistersAndReadingsStep.State;
  equipmentTree: fromEquipmentTree.State;
  replaceWizard: fromReplaceWizard.State;
  addClosingReadingsStep: fromAddClosingReadingsStep.State;
  replaceEquipmentStep: fromReplaceEquipmentStep.State;
  replaceNodeTariffStep: fromReplaceNodeTariffStep.State;
  virtualRegisters: fromVirtualRegisters.State;
}

export const reducers = combineReducers<State, any>({
  equipmentForm: fromEquipmentForm.reducer,
  equipment: fromEquipment.reducer,
  locationForm: fromLocationForm.reducer,
  location: fromLocation.reducer,
  locationEquipment: fromLocationEquipment.reducer,
  equipmentTemplate: fromEquipmentTemplate.reducer,
  wizard: fromWizard.reducer,
  equipmentStep: fromEquipmentdStep.reducer,
  locationStep: fromLocationStep.reducer,
  shopStep: fromShopStep.reducer,
  node: fromNode.reducer,
  nodeDetail: fromNodeDetail.reducer,
  nodeForm: fromNodeForm.reducer,
  nodeFormAllocatedTariff: fromNodeFormAllocatedTariff.reducer,
  nodeFormApplyTariff: fromNodeFormApplyTariff.reducer,
  nodeFormAllocatedEquipment: fromNodeFormAllocatedEquipment.reducer,
  nodeFormAllocatedUnit: fromNodeFormAllocatedUnit.reducer,
  nodeSets: fromNodeSets.reducer,
  bulkWizard: fromBulkWizard.reducer,
  setupStep: fromSetupStep.reducer,
  shopsStep: fromShopsStep.reducer,
  attributesStep: fromAttributesStep.reducer,
  registersAndReadingsStep: fromRegistersAndReadingsStep.reducer,
  equipmentTree: fromEquipmentTree.reducer,
  replaceWizard: fromReplaceWizard.reducer,
  addClosingReadingsStep: fromAddClosingReadingsStep.reducer,
  replaceEquipmentStep: fromReplaceEquipmentStep.reducer,
  replaceNodeTariffStep: fromReplaceNodeTariffStep.reducer,
  virtualRegisters: fromVirtualRegistersReducer.reducer
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];

export const _getState = createFeatureSelector<State>('buildingEquipment');

// #region Equipment Template Selectors

export const getEquipmentTemplateState = createSelector(
  _getState,
  state => state.equipmentTemplate
);

export const getVirtualRegisters = createSelector(
  _getState,
  state => state.virtualRegisters
);

export const getEquipmentTemplates = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getEquipmentTemplates
);

export const getEquipmentTemplateSearchKey = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getSearchKey
);

export const getEquipmentTemplateOrder = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getOrder
);

export const getEquipmentTemplatePage = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getPage
);

export const getEquipmentTemplateUnitsPerPage = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getUnitsPerPage
);

export const getAssignFilter = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getAssignFilter
);

export const getAssignedEquipmentTemplatesCount = createSelector(
  getEquipmentTemplates,
  (equipmentTemplates) => {
    return equipmentTemplates.filter(e => e.isAssigned).length;
  }
);

export const getFilterDetail = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getFilterDetail
);

export const getAllEquipmentTemplateModels = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getAllEquipmentTemplateModels
);

export const getTotal = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getTotal
);

// #endregion

// #region LocationEquipment Selectors */

export const getLocationEquipmentState = createSelector(
  _getState,
  state => state.locationEquipment
);

export const getLocationEquipmentDetail = createSelector(
  getLocationEquipmentState,
  fromLocationEquipment.getLocation
);

export const getLocationEquipmentLocationId = createSelector(
  getLocationEquipmentState,
  fromLocationEquipment.getLocationId
);

export const getLocationEquipmentSearchKey = createSelector(
  getLocationEquipmentState,
  fromLocationEquipment.getSearchKey
);

export const getLocationEquipmentOrder = createSelector(
  getLocationEquipmentState,
  fromLocationEquipment.getOrderIdx
);

export const getLocationEquipmentSupplyTypeFilter = createSelector(
  getLocationEquipmentState,
  fromLocationEquipment.getSupplyTypeFilter
);

const _getLocationEquipmentSelectedNodeId = createSelector(
  getLocationEquipmentState,
  fromLocationEquipment.getSelectedNodeId
);

const _getLocationEquipmentSelectedUnitId = createSelector(
  getLocationEquipmentState,
  fromLocationEquipment.getSelectedUnitId
);

const _getLocationEquipmentNodes = createSelector(
  getLocationEquipmentState,
  fromLocationEquipment.getNodes
);

export const getLocationEquipmentNodes = createSelector(
  _getLocationEquipmentNodes,
  (nodes) => {
    const nodeIds = Object.keys(nodes);
    return nodeIds.map(id => nodes[id]);
  }
);

export const _getLocationEquipmentNodeFilter = createSelector(
  _getLocationEquipmentNodes,
  _getLocationEquipmentSelectedNodeId,
  (nodes, nodeId) => {
    return nodes[nodeId];
  }
);

const _getLocationEquipmentUnits = createSelector(
  getLocationEquipmentState,
  fromLocationEquipment.getUnits
);

export const getLocationEquipmentUnits = createSelector(
  _getLocationEquipmentUnits,
  (units) => {
    const unitIds = Object.keys(units);
    return unitIds.map(id => units[id]);
  }
);

export const getLocationEquipmentUnitFilter = createSelector(
  _getLocationEquipmentUnits,
  _getLocationEquipmentSelectedUnitId,
  (units, selectedId) => {
    return units[selectedId];
  }
);

export const getLocationEquipmentNodeFilter = createSelector(
  _getLocationEquipmentNodes,
  _getLocationEquipmentSelectedNodeId,
  (nodes, selectedId) => {
    return nodes[selectedId];
  }
);

export const getLocationEquipmentEquipmentList = createSelector(
  getLocationEquipmentDetail,
  getLocationEquipmentOrder,
  getLocationEquipmentSearchKey,
  getLocationEquipmentSupplyTypeFilter,
  _getLocationEquipmentSelectedNodeId,
  _getLocationEquipmentSelectedUnitId,
  (detail, orderIndex, search, supplyFilter, selectedNodeId, selectedUnitId) => {
    let equipment = [...detail.meters];

    if (supplyFilter != -1) {
      equipment = equipment.filter(e => e.supplyType == supplyFilter);
    }

    if (search) {
      equipment = equipment.filter(e => {
        const regExt = new RegExp(search, 'i');
        return (e.equipmentModel.match(regExt) != null || e.nodeName.match(regExt) != null || e.serialNumber.match(regExt) != null);
      });
    }

    if (selectedNodeId) {
      equipment = equipment.filter(e => e.nodeId === selectedNodeId);
    }

    if (selectedUnitId) {
      equipment = equipment.filter(e => e.unitIds.find(u => u === selectedUnitId) != null);
    }

    equipment = sortMeters(equipment, orderIndex);

    return equipment;
  }
);

// #endregion

// #region Location Selectors

export const getLocationFormState = createSelector(
  _getState,
  state => state.locationForm
);

export const getLocationState = createSelector(
  _getState,
  state => state.location
);

export const getLocationForm = createSelector(
  getLocationFormState,
  fromLocationForm.getFormState
);

export const getLocations = createSelector(
  getLocationState,
  fromLocation.getLocations
);

export const getIsNew = createSelector(
  getLocationFormState,
  fromLocationForm.getIsNew
);

export const getIsComplete = createSelector(
  getLocationFormState,
  fromLocationForm.getIsComplete
);

export const getSearchKey = createSelector(
  getLocationState,
  fromLocation.getSearchKey
);

export const getOrder = createSelector(
  getLocationState,
  fromLocation.getOrder
);

// #endregion

// #region Node Selectors

export const getNodeState = createSelector(
  _getState,
  state => state.node
);

export const getNodes = createSelector(
  getNodeState,
  fromNode.getNodes
);

export const getUnitFilter = createSelector(
  getNodeState,
  fromNode.getUnitFilter
);

export const getUnitModal = createSelector(
  getNodeState,
  fromNode.getUnitModal
);

export const getNodeSetsState = createSelector(
  _getState,
  state => state.nodeSets
);

export const getNodeSets = createSelector(
  getNodeSetsState,
  (item) => {
    return item['nodes'];
  }
);

export const getNodeTotal = createSelector(
  getNodeState,
  fromNode.getTotal
);

export const getNodeSearchKey = createSelector(
  getNodeState,
  fromNode.getSearchKey
);

export const getNodeOrder = createSelector(
  getNodeState,
  fromNode.getOrder
);

export const getNodeUnitsPerPage = createSelector(
  getNodeState,
  fromNode.getUnitsPerPage
);

export const getNodePage = createSelector(
  getNodeState,
  fromNode.getPage
);

export const getNodeTypeFilter = createSelector(
  getNodeState,
  fromNode.getNodeTypeFilter
);

export const getNodeSupplyTypeFilter = createSelector(
  getNodeState,
  fromNode.getSupplyTypeFilter
);

export const getAllSupplies = createSelector(
  getNodeState,
  fromNode.getAllSupplies
);

export const getSuppliesNames = createSelector(
  getAllSupplies,
  (supplies) => (supplies || []).reduce((acc, curr) => {
    acc[curr.id] = curr.name;
    return acc;
  }, {})
);

export const getSuppliesLocationTypeNames = createSelector(
  getAllSupplies,
  (supplies) => (supplies || []).reduce((acc, curr) => {
    curr.supplyTypes.forEach(s => s.supplyToLocations.forEach(l => acc[l.id] = l.name));
    return acc;
  }, {})
);

export const getSuppliesLocationTypes = createSelector(
  getAllSupplies,
  (supplies) => (supplies || []).reduce((acc, curr) => {
    acc.push({
      id: curr.id,
      name: curr.name,
      locationTypes: curr.supplyTypes.reduce((locationTypes, supplyType) => {
        locationTypes.push(...supplyType.supplyToLocations);
        return locationTypes;
      }, [])
    });
    return acc;
  }, [])
);

// #endregion

// #region Equipment step

export const getEquipmentStepState = createSelector(
  _getState,
  state => state.equipmentStep
);

const _getEquipmentStepEquipmentTemplates = createSelector(
  getEquipmentStepState,
  fromEquipmentdStep.getEquipmentTemplates
);

export const getStepSelecetedTemplate = createSelector(
  getEquipmentStepState,
  fromEquipmentdStep.getSelecetedTemplateState
);

export const getEquipmentStepEquipmentTemplates = createSelector(
  getEquipmentStepState,
  _getEquipmentStepEquipmentTemplates,
  (formStepState, equipmentTemplates) => {
    const equipmentId = formStepState.formState.value.id;
    return equipmentTemplates
      .filter(e => e.id !== equipmentId);
  }
);

export const getEquipmentStepFormState = createSelector(
  getEquipmentStepState,
  fromEquipmentdStep.getEquipmentStepFormState
);

export const _getEquipmentStepMeters = createSelector(
  getEquipmentStepState,
  fromEquipmentdStep.getMeters
);

export const getEquipmentStepMeters = createSelector(
  getEquipmentStepFormState,
  _getEquipmentStepMeters,
  (formState, meters: any[]) => {
    if (!meters) {
      return [];
    }

    const equipmentGroup = formState.value.equipmentGroup;
    return meters.filter(m => m.equipment.equipmentGroup.supplyType === equipmentGroup.supplyType);
  }
);

export const getEquipmentStepNotIncludedRegisters = createSelector(
  getStepSelecetedTemplate,
  getEquipmentStepFormState,
  (equipmentTemplate, formState) => {
    const equipmentTemplateId = formState.value.id;

    if (equipmentTemplate) {
      const includedEquipmentTemplateIds = formState.value.registers.map(r => r.id);
      return equipmentTemplate.registers
        .filter(r => !includedEquipmentTemplateIds.includes(r.id))
        .sort((a, b) => a.sequenceNumber < b.sequenceNumber ? -1 : (a.sequenceNumber > b.sequenceNumber ? 1 : 0));
    }

    return [];
  }
);

export const getRegisterFiles = createSelector(
  getEquipmentStepState,
  fromEquipmentdStep.getRegisterFiles
);

export const convertEquipmentRegistersListToDictionary = (registers: EquipmentTemplateRegisterViewModel[], unitOfMeasurementScales) => {
  const registersDict = {};

  registers.forEach(r => {
    registersDict[r.register.id] = {
      ...r,
      scalesDict: unitOfMeasurementScales[r.register.unitOfMeasurement]
    };
  });

  return registersDict;
};

export const convertRegistersListToDictionary = (registers: RegisterViewModel[], unitOfMeasurementScales) => {
  const registersDict = {};

  registers.forEach(r => {
    registersDict[r.id] = {
      ...r,
      scalesDict: unitOfMeasurementScales[r.unitOfMeasurement]
    };
  });

  return registersDict;
};

export const getEquipmentStepEquipmentTemplateRegistersDict = createSelector(
  getStepSelecetedTemplate,
  getUnitsOfMeasurementScales,
  (template, unitsOfMeasurementScales) => {
    if (!template.registers) {
      return [];
    }
    
    template.registers.sort((a, b) => a.sequenceNumber < b.sequenceNumber ? -1 : (a.sequenceNumber > b.sequenceNumber ? 1 : 0));
    var registers = convertRegistersListToDictionary(template.registers, unitsOfMeasurementScales);
    return registers;
    }
);

// #endregion

// #region Location Step

export const getLocationStepState = createSelector(
  _getState,
  state => state.locationStep
);

export const getLocationStepFormState = createSelector(
  getLocationStepState,
  fromLocationStep.getLocationStepFormState
);

const _getLocationStepFormState = createSelector(
  getLocationStepState,
  fromLocationStep.getLocations,
);

export const getLocationStepLocations = createSelector(
  getLocationStepState,
  _getLocationStepFormState,
  (locationStepState, locations) => {
    const locationId = locationStepState.formState.value.id;
    return locations.filter(l => l.id != locationId);
  }
);

const _getLocationStepSupplies = createSelector(
  getLocationStepState,
  fromLocationStep.getSupplies
);

export const getLocationStepSupplies = createSelector(
  getLocationStepState,
  _getLocationStepSupplies,
  (locationStepState, supplies) => {
    const supplyId = locationStepState.formState.value.id;
    return supplies.filter(l => l.id != supplyId);
  }
);

export const getLocationStepLocationTypes = createSelector(
  getLocationStepFormState,
  getLocationStepSupplies,
  (form, supplies) => {
    const supplieId = form.value.supplyId;
    const locationType = form.value.locationType;

    const supplie = supplies.find(s => s.id === supplieId);
    if (supplie) {
      return supplie.supplyTypes[0].supplyToLocations.filter(l => l.name !== locationType);
    }

    return [];
  }
);

const _getLocationStepTechnicians = createSelector(
  getLocationStepState,
  fromLocationStep.getTechnicians
);

export const getLocationStepTechnicians = createSelector(
  getLocationStepState,
  _getLocationStepTechnicians,
  (formStepState, technicians) => {
    const technicianId = formStepState.formState.value.technicianId;

    return technicians.filter(t => t.id != technicianId);
  }
);

// #endregion

// #region Equipment Selectors

export const getEquipmentFormState = createSelector(
  _getState,
  state => state.equipmentForm
);

export const getEquipmentFormFormState = createSelector(
  getEquipmentFormState,
  fromEquipmentForm.getFormState
);

export const getEquipmentFormIsElectricityBreakersGroup = createSelector(
  getEquipmentFormFormState,
  form => isBreaker(form.value)
);

export const getEquipmentFormIsAmrIntegrationAllowed = createSelector(
  getEquipmentFormFormState,
  form => isAmrIntegrationAllowed(form.value)
);

export const isEquipmentContainRegisters = createSelector(
  getEquipmentFormState,
  getEquipmentFormFormState,
  (equipmentForm, equipmentFormState) => {
    return (equipmentForm.equipmentTemplate && !!equipmentForm.equipmentTemplate.registers.length) || !!equipmentFormState.value.registers.length;
  }
);

const _getEquipmentFormLocations = createSelector(
  getEquipmentFormState,
  fromEquipmentForm.getLocations
);

export const getEquipmentFormLocations = createSelector(
  getEquipmentFormState,
  _getEquipmentFormLocations,
  (equipmentState, locations) => {
    const locationId = equipmentState.formState.value.locationId;
    return locations.filter(l => l.id != locationId);
  }
);

const _getEquipmentSupplies = createSelector(
  getEquipmentFormState,
  fromEquipmentForm.getSupplies
);

export const getEquipmentSupplies = createSelector(
  getEquipmentFormState,
  _getEquipmentSupplies,
  (state, supplies) => {
    const supplyId = state.formState.value.supplyId;
    return supplies.filter(l => l.id != supplyId);
  }
);

export const getEquipmentLocationTypes = createSelector(
  getEquipmentFormFormState,
  _getEquipmentSupplies,
  (form, supplies) => {
    const supplieId = form.value.supplyId;
    const locationType = form.value.locationType;

    const supplie = supplies.find(s => s.id === supplieId);
    if (supplie) {
      return supplie.supplyTypes[0].supplyToLocations.filter(l => l.name !== locationType);
    }

    return [];
  }
);

const _getEquipmentShops = createSelector(
  getEquipmentFormState,
  fromEquipmentForm.getShops
);

const _getEquipmentCommonAreas = createSelector(
  getEquipmentFormState,
  fromEquipmentForm.getCommonAreas
);

export const getEquipmentUnitOptions = createSelector(
  _getEquipmentShops,
  _getEquipmentCommonAreas,
  (shops, commonAreas) =>
    [...shops.map(s => ({...s, unitType: UnitType.Shop})),
      ...commonAreas.map(s => ({...s, unitType: UnitType.CommonArea}))]
);

export const getEquipmentIsComplete = createSelector(
  getEquipmentFormState,
  fromEquipmentForm.getIsComplete
);

export const getEquipmentEquipmentTemplate = createSelector(
  getEquipmentFormState,
  fromEquipmentForm.getEquipmentTemplate
);

export const getEquipmentEquipmentTemplates = createSelector(
  getEquipmentFormState,
  fromEquipmentForm.getEquipmentTemplates
);

export const _getEquipmentMeters = createSelector(
  getEquipmentFormState,
  fromEquipmentForm.getMeters
);

export const getAvailableParentsMeters = createSelector(
  getEquipmentFormFormState,
  _getEquipmentMeters,
  (formState, meters: any[]) => {
    const meterId = formState.value.id;
    if (!meterId || !meters || meters.length == 0) {
      return [];
    }

    const equipmentGroup = formState.value.equipmentGroup;
    const filteredMeters = meters.filter(e => e.equipment.equipmentGroup.supplyType === equipmentGroup.supplyType);
    const treesLookup = getTreesLookup([...filteredMeters]);

    const meterTree = treesLookup[meterId];
    const meterChildrenIds = getTreeChildrenIds(meterTree);

    return filteredMeters.filter(e => e.id !== meterId && !meterChildrenIds.has(e.id));
  }
);

export const getEquipmentNotIncludedRegisters = createSelector(
  getEquipmentFormFormState,
  getEquipmentEquipmentTemplate,
  (formState, equipmentTemplate) => {
    const includedEquipmentTemplateIds = formState.value.registers.map(r => r.id);
    if (equipmentTemplate) {
      return equipmentTemplate.registers
        .filter(r => !includedEquipmentTemplateIds.includes(r.id))
        .sort((a, b) => a.sequenceNumber < b.sequenceNumber ? -1 : (a.sequenceNumber > b.sequenceNumber ? 1 : 0))
    } else {
      return [];
    }
  }
);

export const getEquipmentEquipmentTemplateRegistersDict = createSelector(
  getEquipmentEquipmentTemplate,
  getUnitsOfMeasurementScales,
  (template, unitsOfMeasurementScales) => {
    if (template && template.registers) {
      return convertRegistersListToDictionary(template.registers, unitsOfMeasurementScales);
    }

    return {};
  }
);

export const getEquipmentUnitsOfMeasurement = createSelector(
  getEquipmentFormFormState,
  getRegisters,
  (formState, registers) => {
    let units: UnitOfMeasurement[] = [];

    const availableRegisters = formState.value.registers.map(r => {
      const register = registers.find(cr => cr.id === r.id);

      return {...register, unitOfMeasurement: register.unitOfMeasurement};
    });

    availableRegisters.forEach(r => {
      units = [...units, {
        unitType: r.unitOfMeasurement,
        defaultName: r.unit,
        scales: null,
        supplyTypes: null
      }];
    });

    return units.reduce((x, y) => x.findIndex(e => e.unitType === y.unitType) < 0 ? [...x, y] : x, []);
  }
);

// #endregion

// #region Equipment

export const getEquipmentState = createSelector(
  _getState,
  state => state.equipment
);

const _getEquipmentSelectedNodeId = createSelector(
  getEquipmentState,
  fromEquipment.getNodeIdFilter
);

const _getEquipmentSelectedUnitId = createSelector(
  getEquipmentState,
  fromEquipment.getUnitIdFilter
);

const _getEquipmentSelectedLocationId = createSelector(
  getEquipmentState,
  fromEquipment.getLocationIdFilter
);

const _getEquipmentSelectedSupplyType = createSelector(
  getEquipmentState,
  fromEquipment.getSupplyTypeFilter
);

const _getEquipmentNodes = createSelector(
  getEquipmentState,
  fromEquipment.getNodes
);

const _getEquipmentUnits = createSelector(
  getEquipmentState,
  fromEquipment.getUnits
);

const _getEquipmentLocations = createSelector(
  getEquipmentState,
  fromEquipment.getLocations
);

const _getEquipmentSupplyTypes = createSelector(
  getEquipmentState,
  fromEquipment.getSupplyTypes
);

export const getEquipmentNodeFilter = createSelector(
  _getEquipmentNodes,
  _getEquipmentSelectedNodeId,
  (nodes, nodeId) => {
    return nodes[nodeId];
  }
);

export const getEquipmentUnitFilter = createSelector(
  _getEquipmentUnits,
  _getEquipmentSelectedUnitId,
  (units, unitId) => {
    return units[unitId];
  }
);

export const getEquipmentLocationFilter = createSelector(
  _getEquipmentLocations,
  _getEquipmentSelectedLocationId,
  (locations, locationId) => {
    return locations[locationId];
  }
);

export const getEquipmentSupplyTypeFilter = createSelector(
  _getEquipmentSupplyTypes,
  _getEquipmentSelectedSupplyType,
  (supplyTypes, supplyType) => {
    return supplyTypes[supplyType];
  }
);

export const getEquipmentNodes = createSelector(
  _getEquipmentNodes,
  (nodes) => {
    const nodeIds = Object.keys(nodes);
    return nodeIds.map(id => nodes[id]);
  }
);

export const getEquipmentUnits = createSelector(
  _getEquipmentUnits,
  (units) => {
    const unitIds = Object.keys(units);
    return unitIds.map(id => units[id]);
  }
);

export const getEquipmentLocations = createSelector(
  _getEquipmentLocations,
  (locations) => {
    const locationIds = Object.keys(locations);
    return locationIds.map(id => locations[id]);
  }
);

export const getEquipmentSupplyTypes = createSelector(
  _getEquipmentSupplyTypes,
  (supplyTypes) => {
    const supplyTypeIds = Object.keys(supplyTypes);
    return supplyTypeIds.map(id => supplyTypes[id]);
  }
);

export const getEquipmentList = createSelector(
  getEquipmentState,
  fromEquipment.getEquipments
);

export const getEquipmentsTotal = createSelector(
  getEquipmentState,
  fromEquipment.getEquipmentsTotal
);

export const getEquipmentSearchKey = createSelector(
  getEquipmentState,
  fromEquipment.getSearchKey
);

export const getEquipmentOrder = createSelector(
  getEquipmentState,
  fromEquipment.getOrder
);

export const isBuildingWithAmrAccount = createSelector(
  getEquipmentState,
  (state) => {
    return state.isBuildingWithAmrAccount;
  }
);

export const getAmrImportLastDate = createSelector(
  getEquipmentList,
  (equipments, props) => {
    return equipments.find(e => e.id === props.meterId).amrImportLastDate;
  }
);

// #endregion

// #region Wizard

export const getWizardState = createSelector(
  _getState,
  state => state.wizard
);

export const getWizardStepStates = createSelector(
  _getState,
  buildingCommonData.getBuildingId,
  (state, buildingId) => {
    return {
      buildingId,
      wizardState: state.wizard,
      equipmentStep: state.equipmentStep,
      locationStep: state.locationStep,
      shopStep: state.shopStep
    };
  }
);

export const getWizardMode = createSelector(
  getWizardState,
  fromWizard.getWizardMode
);

export const getWizardStep = createSelector(
  getWizardState,
  fromWizard.getWizardStep
);

export const getIsLocationWizard = createSelector(
  getWizardState,
  fromWizard.getIsLocationWizard
);

export const getShouldDisplayVersionPopup = createSelector(
  getWizardState,
  fromWizard.getShouldDisplayVersionPopup
);

// #endregion

// #region Shop step state

export const getShopStepState = createSelector(
  _getState,
  state => state.shopStep
);

const _getAllShops = createSelector(
  getShopStepState,
  fromShopStep.getShops
);

const _getAllCommonAreas = createSelector(
  getShopStepState,
  fromShopStep.getCommonAreas
);

export const getSelectedShopIds = createSelector(
  getShopStepState,
  fromShopStep.getSelectedIds
);

export const getAllUnits = createSelector(
  _getAllShops,
  _getAllCommonAreas,
  getSelectedShopIds,
  (shops, commonAreas, selectedIds) => [...shops, ...commonAreas].map(s => ({
    ...s,
    isSelected: selectedIds.includes(s.id)
  }))
);

export const getShopStepFilter = createSelector(
  getShopStepState,
  fromShopStep.getShopFilter
);

export const getShopStepSearchTerm = createSelector(
  getShopStepState,
  fromShopStep.getSearchTerm
);

const filterUnits = (units, filter, searchStr) => {
  switch (filter) {
    case UnitFilter.AllShops:
      units = units.filter(u => u.unitType === UnitType.Shop);
      break;
    case UnitFilter.AllCommonAreas:
      units = units.filter(u => u.unitType === UnitType.CommonArea);
      break;
    case UnitFilter.ConnectedUnits:
      units = units.filter(u => u.isSelected);
      break;
    case UnitFilter.NotConnectedUnits:
      units = units.filter(u => !u.isSelected);
      break;
  }
  if (searchStr) {
    units = units.filter(s => !!s.name.match(new RegExp(searchStr, 'i')));
  }
  return units;
};

export const getAllUnitsWithFilters = createSelector(
  getAllUnits,
  getShopStepFilter,
  getShopStepSearchTerm,
  (units, filter, searchTerm) => filterUnits(units, filter, searchTerm)
);

// #endregion

// #region Node Detail

export const getNodeDetailState = createSelector(
  _getState,
  state => state.nodeDetail
);

export const getNodeDetail = createSelector(
  getNodeDetailState,
  fromNodeDetail.getNodeDetail
);

export const getNodeAttributes = createSelector(
  getNodeDetailState,
  fromNodeDetail.getNodeAttributes
);

export const getNodeDetailTab = createSelector(
  getNodeDetailState,
  fromNodeDetail.getActiveTab
);

export const getNodesAllocationVilibility = createSelector(
  getNodeDetailState,
  fromNodeDetail.getShowNodesAllocation
);

export const getNodeAllowedChildren = createSelector(
  getNodeDetailState,
  fromNodeDetail.getAllowedChildrenNodes
);

export const getNodeEditModel = createSelector(
  getNodeDetail,
  (n) => (n && <NodeEditViewModel>{
    id: n.id,
    commonAreaIds: n.commonAreaIds,
    shopIds: n.shopIds,
    buildingId: n.buildingId,
    name: n.name,
    description: n.description,
    meterOwnerId: n.meterOwner && n.meterOwner.id,
    nodeType: n.nodeType,
    ownersLiability: n.ownersLiability,
    includeNotLiable: n.includeNotLiable,
    includeVacant: n.includeVacant,
    splitType: n.splitType,
    costAllocationRegisterId: n.costAllocationRegisterId,
    costProvider: n.costProvider,
    allocatedUnits: {...n.allocatedUnits},
    nodes: n.nodes && n.nodes.map(i => (<AllocatedNodeEditViewModel>{
      nodeId: i.nodeId,
      calculationFactor: i.calculationFactor,
      registers: i.allocatedRegisters.map(r => ({registerId: r.registerId, calculationFactor: r.calculationFactor}))
    })),
    supplyToId: n.supplyToId,
    supplyToLocationId: n.supplyToLocationId,
    supplyType: n.supplyType,
    tariffs: n.tariffs,
    attributeValues: n.attributeValues,
    tariffApplyType: n.tariffApplyType,
    meterAllocation: n.meterAllocation ? <AllocatedNodeEditViewModel>{
      nodeId: n.meterAllocation.nodeId,
      calculationFactor: n.meterAllocation.calculationFactor,
      registers: n.meterAllocation.allocatedRegisters.map(r => ({
        registerId: r.registerId,
        calculationFactor: r.calculationFactor
      }))
    } : {}
  })
);

export const getNodeDetailTariffs = createSelector(
  getNodeDetailState,
  fromNodeDetail.getTariffs
);

export const getAttributesDictionary = createSelector(
  buildingCommonData.getAttributes,
  (attributes) => (attributes || []).reduce((acc, a) => {
    acc[a.id] = a;
    return acc;
  }, {})
);

export const getRegistersDictionary = createSelector(
  buildingCommonData.getRegisters,
  (registers) => (registers || []).reduce((acc, r) => {
    acc[r.id] = r;
    return acc;
  }, {})
);

export const getDefaultRegister = createSelector(
  getEquipmentEquipmentTemplateRegistersDict,
  (registersDict, props: { name: string }) => {
    let register = null;
    Object.keys(registersDict).forEach(key => {
      if (registersDict.hasOwnProperty(key)) {
        Object.keys(registersDict[key].scalesDict).forEach(scaleKey => {
          if (registersDict[key].scalesDict[scaleKey].isDefault
            && props.name === registersDict[key].scalesDict[scaleKey].name) {
            register = registersDict[key];
            return;
          }
        });
      }
      return;
    });

    return register;
  }
);


export const getNodeDetailAttributeValues = createSelector(
  getNodeAttributes,
  buildingCommonData.getAttributes,
  (attributeValues: any, attributes: any[]) => {
    if (!attributeValues) {
      return [];
    }

    return attributeValues.map((attr: any) => {
      const result = {...attr};
      result.attribute = attributes.find(a => a.id === result.attributeId);

      return result;
    });
  }
);

// #endregion

// #region Node Form

export const getNodeFormState = createSelector(
  _getState,
  state => state.nodeForm
);

export const getNodeForm = createSelector(
  getNodeFormState,
  fromNodeForm.getFormState
);

export const getNodeFormSupplies = createSelector(
  getNodeForm,
  getAllSupplies,
  (form, supplies) => {
    const supplyType = form.value.supplyType;
    const result = [];
    if (supplyType === null || !supplies) {
      return result;
    }

    supplies.forEach(s => {
      const filteredSupplieTypes = s.supplyTypes.filter(t => t.supplyType === supplyType);
      if (filteredSupplieTypes.length) {
        result.push({...s, supplyTypes: filteredSupplieTypes});
      }
    });
    return result;
  }
);

const _getNodeFormSupplyId = createSelector(
  getNodeForm,
  (form) => {
    return form.value.supplyToId;
  }
);

const _getNodeFormLocationTypeId = createSelector(
  getNodeForm,
  (form) => {
    return form.value.supplyToLocationId;
  }
);

export const getNodeFormEquipmentSupplies = createSelector(
  getNodeFormSupplies,
  _getNodeFormSupplyId,
  (supplies, supplyId) => {
    return {
      supplies: supplies.filter(s => s.id !== supplyId),
      selectedSupply: supplies.find(s => s.id === supplyId)
    };
  }
);

export const getNodeFormEquipmentLocationsTypes = createSelector(
  getNodeFormSupplies,
  _getNodeFormSupplyId,
  _getNodeFormLocationTypeId,
  (supplies, supplyId, locationTypeId) => {
    const supply = supplies.find(s => s.id === supplyId);

    if (supply && supply.supplyTypes.length) {
      return {
        locationTypes: supply.supplyTypes[0].supplyToLocations.filter(l => l.id !== locationTypeId),
        selectedLocationType: supply.supplyTypes[0].supplyToLocations.find(l => l.id === locationTypeId)
      };
    }
    return {locationTypes: [], selectedLocationType: null};
  }
);

// #endregion

// #region Node Form Allocated Equipment

const defaultString = '';
const sortMeters = (meters: any[], orderType: number, sortMapFn = null) => {
  meters = [...meters];
  let sortByFunc = null;
  switch (orderType) {
    case OrderEquipment.SequenceNumberAsc:
      sortByFunc = (a, b) => sortFunc(a.sequenceNumber, b.sequenceNumber);
      break;
    case OrderEquipment.SequenceNumberDesc:
      sortByFunc = (a, b) => sortFunc(b.sequenceNumber, a.sequenceNumber);
      break;
    case OrderEquipment.SerialNumberAsc:
      sortByFunc = (a, b) => sortFunc(a.serialNumber, b.serialNumber);
      break;
    case OrderEquipment.SerialNumberDesc:
      sortByFunc = (a, b) => sortFunc(b.serialNumber, a.serialNumber);
      break;
    case OrderEquipment.BrandModelAsc:
      sortByFunc = (a, b) => sortFunc(a.equipment ? a.equipment.equipmentModel : a.equipmentModel,
        b.equipment ? b.equipment.equipmentModel : b.equipmentModel);
      break;
    case OrderEquipment.BrandModelDesc:
      sortByFunc = (a, b) => sortFunc(b.equipment ? b.equipment.equipmentModel : b.equipmentModel,
        a.equipment ? a.equipment.equipmentModel : a.equipmentModel);
      break;
    case OrderEquipment.SupplyTypeAsc:
      sortByFunc = (a, b) => sortFunc(a.supplyType, b.supplyType);
      break;
    case OrderEquipment.SupplyTypeDesc:
      sortByFunc = (a, b) => sortFunc(b.supplyType, a.supplyType);
      break;
    case OrderEquipment.NumberOfUnitsAsc:
      sortByFunc = (a, b) => sortFunc(a.numberOfUnits, b.numberOfUnits);
      break;
    case OrderEquipment.NumberOfUnitsDesc:
      sortByFunc = (a, b) => sortFunc(b.numberOfUnits, a.numberOfUnits);
      break;
    case OrderEquipment.SupplyToAsc:
      sortByFunc = (a, b) =>
        sortFunc(a.location ? a.location.supplyDetail.name ? a.location.supplyDetail.name : defaultString : defaultString,
          b.location ? b.location.supplyDetail.locationType ? b.location.supplyDetail.locationType : defaultString : defaultString);
      break;
    case OrderEquipment.SupplyToDesc:
      sortByFunc = (a, b) =>
        sortFunc(b.location ? b.location.supplyDetail.name ? b.location.supplyDetail.name : defaultString : defaultString,
          a.location ? a.location.supplyDetail.locationType ? a.location.supplyDetail.locationType : defaultString : defaultString);
  }
  if (sortByFunc) {
    meters.sort((a, b) => {
      if (sortMapFn) {
        a = sortMapFn(a);
        b = sortMapFn(b);
      }
      return sortByFunc(a, b);
    });
  }

  return meters;
};

const sortNodes = (nodes: any[], orderType: number, sortMapFn = null) => {
  nodes = [...nodes];
  let sortByFunc = null;
  const getName = a => a && a.name;
  const getSerialNumber = a => a.meterOwner && a.meterOwner.serialNumber;
  const getEquipmentModel = a => a.meterOwner && a.meterOwner.equipmentModel;
  const getDescription = a => a.meterOwner && a.meterOwner.description || a.description;
  const getSupplyTo = a => (a.supplyTo ? a.supplyTo : '') + (a.supplyToLocation ? a.supplyToLocation : '');
  switch (orderType) {
    case OrderNodeType.NameAsc:
      sortByFunc = (a, b) => sortFunc(getName(a), getName(b));
      break;
    case OrderNodeType.NameDesc:
      sortByFunc = (a, b) => sortFunc(getName(b), getName(a));
      break;
    case OrderNodeType.DescriptionAsc:
      sortByFunc = (a, b) => sortFunc(getDescription(a), getDescription(b));
      break;
    case OrderNodeType.DescriptionDesc:
      sortByFunc = (a, b) => sortFunc(getDescription(b), getDescription(a));
      break;
    case OrderNodeType.MeterSerialNumberAsc:
      sortByFunc = (a, b) => sortFunc(getSerialNumber(a), getSerialNumber(b));
      break;
    case OrderNodeType.MeterSerialNumberDesc:
      sortByFunc = (a, b) => sortFunc(getSerialNumber(b), getSerialNumber(a));
      break;
    case OrderNodeType.MeterBrandModelAsc:
      sortByFunc = (a, b) => sortFunc(getEquipmentModel(a), getEquipmentModel(b));
      break;
    case OrderNodeType.MeterBrandModelDesc:
      sortByFunc = (a, b) => sortFunc(getEquipmentModel(b), getEquipmentModel(a));
      break;
    case OrderNodeType.SupplyTypeAsc:
      sortByFunc = (a, b) => sortFunc(a.supplyType, b.supplyType);
      break;
    case OrderNodeType.SupplyTypeDesc:
      sortByFunc = (a, b) => sortFunc(b.supplyType, a.supplyType);
      break;
    case OrderNodeType.AllocatedUnitsAsc:
      sortByFunc = (a, b) => sortFunc(a.numberOfUnits, b.numberOfUnits);
      break;
    case OrderNodeType.AllocatedUnitsDesc:
      sortByFunc = (a, b) => sortFunc(b.numberOfUnits, a.numberOfUnits);
      break;
    case OrderNodeType.AllocatedEquipmentsAsc:
      sortByFunc = (a, b) => sortFunc(a.numberOfMeters, b.numberOfMeters);
      break;
    case OrderNodeType.AllocatedEquipmentsDesc:
      sortByFunc = (a, b) => sortFunc(b.numberOfMeters, a.numberOfMeters);
      break;
    case OrderNodeType.SupplyToAsc:
      sortByFunc = (a, b) => sortFunc(getSupplyTo(a), getSupplyTo(b));
      break;
    case OrderNodeType.SupplyToDesc:
      sortByFunc = (a, b) => sortFunc(getSupplyTo(b), getSupplyTo(a));
  }
  if (sortByFunc) {
    nodes.sort((a, b) => {
      if (sortMapFn) {
        a = sortMapFn(a);
        b = sortMapFn(b);
      }
      return sortByFunc(a, b);
    });
  }

  return nodes;
};

export const getNodeFormAllocatedEquipmentState = createSelector(
  _getState,
  state => state.nodeFormAllocatedEquipment
);

export const getNodeFormAllocatedEquipmentForm = createSelector(
  getNodeFormAllocatedEquipmentState,
  fromNodeFormAllocatedEquipment.getFormState
);

export const getNodeFormAllocatedEquipmentOrder = createSelector(
  getNodeFormAllocatedEquipmentState,
  fromNodeFormAllocatedEquipment.getOrder
);

export const getNodesDict = createSelector(
  getNodeDetail,
  getNodeAllowedChildren,
  getSuppliesNames,
  getSuppliesLocationTypeNames,
  getAttributesDictionary,
  (nodeDetail, childOptions, supplies, locationTypes, attributes) => {
    if (!nodeDetail || nodeDetail.nodeType === NodeType.Single) {
      return {};
    }
    const setNodeData = (n) => ({
      ...n,
      supplyTo: supplies[n.supplyToId],
      supplyToLocation: locationTypes[n.supplyToLocationId],
      attributes: n.attributes.map(a => ({...a, attribute: attributes[a.attributeId]}))
    });
    const addToDict = (acc, n) => {
      if (!acc[n.nodeId]) {
        acc[n.nodeId] = setNodeData(n);
      }
      return acc;
    };
    const nodes = nodeDetail.nodes.reduce(addToDict, {});
    if (childOptions) {
      childOptions.reduce(addToDict, nodes);
    }
    return nodes;
  }
);

export const getNodeFormAllocatedNodes = createSelector(
  getNodeFormAllocatedEquipmentForm,
  getNodesDict,
  (nodesForm, nodesInfoDict) => {
    if (!nodesForm || !nodesForm.controls.nodes) {
      return [];
    }
    return nodesForm.controls.nodes.controls.map(c => ({
      control: c,
      node: nodesInfoDict[c.value.id]
    }));
  }
);

export const getAllocatedNodesDict = createSelector(
  getNodeFormAllocatedEquipmentForm,
  (nodesForm) => nodesForm.value.nodes.reduce((acc, n) => {
    acc[n.id] = true;
    return acc;
  }, {})
);

export const getNodeFormAllocatedEquipmentRegisterFilter = createSelector(
  getNodeFormAllocatedEquipmentState,
  fromNodeFormAllocatedEquipment.getRegisterFilter
);

export const getNodeFormAllocatedEquipmentSearchKey = createSelector(
  getNodeFormAllocatedEquipmentState,
  fromNodeFormAllocatedEquipment.getSearchKey
);

const getRegistersList = (nodes: any[], registers) => {
  const keysObj = {};
  let nodeRegisters = [];
  if (nodes && nodes[0]) {
    nodeRegisters = (nodes || []).map(n => n.registers).reduce((acc, curr) => {
      curr.forEach(r => {
        if (!keysObj[r.registerId]) {
          acc.push(registers[r.registerId]);
          keysObj[r.registerId] = true;
        }
      });
      return acc;
    }, []);
  }
  return nodeRegisters;
};

const getTotalRegistersList = (nodes: AllocatedNodeFormValue[], registers): TotalRegister[] => {
  let totalRegisters: TotalRegister[] = [];
  let resultInitialized = false;
  if (nodes && nodes[0]) {
    totalRegisters = (nodes || []).reduce((acc: TotalRegister[], curr) => {
      if (!resultInitialized && acc.length === 0) {
        curr.registers.filter(r => !r.isRemoved && r.isBilling).forEach(r => {
          if (acc.every(tr => tr.unitOfMeasurement !== r.unitOfMeasurement
            || tr.timeOfUse !== r.timeOfUse)) {
            acc.push(<TotalRegister>{
              unitName: UnitOfMeasurementName[r.unitOfMeasurement],
              unitOfMeasurement: r.unitOfMeasurement,
              timeOfUse: r.timeOfUse,
              isBilling: r.isBilling
            });
          }
        });
        resultInitialized = true;
        return acc;
      }
      return acc.filter(tr => curr.registers.filter(r => !r.isRemoved && r.isBilling).some(r =>
        (r.unitOfMeasurement === tr.unitOfMeasurement) && (r.timeOfUse === tr.timeOfUse)));
    }, []);
  }

  return totalRegisters;
};

export const getTotalRegisters = createSelector(
  getNodeFormAllocatedEquipmentForm,
  getRegistersDictionary,
  (nodes, registers) => {
    if (nodes) {
      const allocatedItems = nodes.value.meterAllocation ? [nodes.value.meterAllocation] : [...nodes.value.nodes];
      return getTotalRegistersList(allocatedItems, registers);
    }
    return [];
  }
);

export const getNodeFormAllocatedNode = createSelector(
  getNodeDetail,
  getNodeFormAllocatedEquipmentForm,
  (node, nodeForm) => {
    node['nodeId'] = node.id;

    return nodeForm.controls.nodes.controls.map(c => ({
      control: c,
      node
    }));
  }
);

export const getMeterAllocationForm = createSelector(
  getNodeDetail,
  getNodeFormAllocatedEquipmentForm,
  (node, nodeForm) => [{
    control: nodeForm.controls.meterAllocation,
    node
  }]);

export const getNodeFormAllocatedEquipmentRegisters = createSelector(
  getNodeFormAllocatedNodes,
  getRegistersDictionary,
  (nodes, registers) => getRegistersList(nodes.map(n => n.node), registers)
);

export const getSingleNodeFormAllocatedEquipmentRegisters = createSelector(
  getNodeDetail,
  getRegistersDictionary,
  (node, registers) => {
    return getRegistersList([node.meterAllocation], registers);
  }
);

export const getNodeFormAllowedChildrenRegisters = createSelector(
  getNodeAllowedChildren,
  getRegistersDictionary,
  (nodes, registers) => getRegistersList(nodes, registers)
);

export const getNodeFormAllocatedEquipmentRegisterStatus = createSelector(
  getNodeFormAllocatedEquipmentState,
  fromNodeFormAllocatedEquipment.getStatusFilter
);

export const getNodeFormAddEquipmentSearchKey = createSelector(
  getNodeFormAllocatedEquipmentState,
  fromNodeFormAllocatedEquipment.getAddEquipmentSearchKey
);

export const getNodeFormAddEquipmentRegisterFilter = createSelector(
  getNodeFormAllocatedEquipmentState,
  fromNodeFormAllocatedEquipment.getAddEquipmentRegisterFilter
);

export const getNodeAllowedChildrenFiltered = createSelector(
  getNodeAllowedChildren,
  getNodeFormAddEquipmentRegisterFilter,
  getNodeFormAddEquipmentSearchKey,
  (nodes, register, search) => {
    let filteredNodes = [...nodes];
    if (search) {
      const searchExpr = new RegExp(search.trim(), 'i');
      filteredNodes = filteredNodes.filter(n => n.name.match(searchExpr));
    }
    if (register) {
      filteredNodes = filteredNodes.filter(n => n.registers.find(r => r.registerId === register.id));
    }

    return filteredNodes;
  }
);

export const getNodeFormAllocatedEquipmentMeterOrder = createSelector(
  getNodeFormAllocatedEquipmentState,
  fromNodeFormAllocatedEquipment.getMeterOrder
);

export const getNodeFormAllocatedNodesFiltered = createSelector(
  getNodeFormAllocatedNodes,
  getNodeFormAllocatedEquipmentSearchKey,
  getNodeFormAllocatedEquipmentRegisterFilter,
  getRegistersDictionary,
  (nodes, search, filter, registers) => {
    let filteredNodes = nodes ? [...nodes] : [];
    if (search) {
      const searchExpr = new RegExp(search.trim(), 'i');
      filteredNodes = filteredNodes.filter(n => n.node.name.match(searchExpr));
    }

    if (filter && filter.length > 0) {
      filteredNodes = filteredNodes.filter(n => {
        if (n.node && n.node.registers) {
          return n.node.registers.find(r =>
            filter.some(f =>
              f.unitOfMeasurement === registers[r.registerId].unitOfMeasurement
              && f.timeOfUse === registers[r.registerId].timeOfUse));
        }
      });
    }
    return filteredNodes;
  }
);

export const getNodeFormAllocatedNodesSorted = createSelector(
  getNodeFormAllocatedNodesFiltered,
  getNodeFormAllocatedEquipmentOrder,
  (items, order) => sortNodes(items, order, (i => i.node))
);

const getAmperageByPhaseType = (phaseType: number, nodeType, nodeAttributes, allocatedNodes: any[]) => {
  const isAttrOfType = (a, attrType: ElectricityAttributeType) => a.attribute.name.toLowerCase() === electricityAttributes[attrType];
  if (nodeType === NodeType.Single) {
    const phaseAttr = nodeAttributes.find(a => isAttrOfType(a, ElectricityAttributeType.Phase));
    if (phaseAttr && phaseAttr.value && phaseAttr.value.toLowerCase() === electricityAttributes[phaseType]) {
      const cbSizeAttr = nodeAttributes.find(a => isAttrOfType(a, ElectricityAttributeType.CbSize));
      return cbSizeAttr && cbSizeAttr.value || 0;
    }
    return 0;
  } else {
    return allocatedNodes.reduce((acc, curr) => {
      const attributes = curr.node.attributes;
      if (attributes && attributes.find(a => isAttrOfType(a, ElectricityAttributeType.Phase)
        && a.value && a.value.toLowerCase() === electricityAttributes[phaseType]
      )) {
        const attr = attributes.find(a => isAttrOfType(a, ElectricityAttributeType.CbSize));
        if (attr) {
          acc += +attr.value;
        }
      }
      return acc;
    }, 0);
  }
};

export const getNodeFormAllocatedEquipmentTotalOnePhaseAmperage = createSelector(
  getNodeDetail,
  getNodeDetailAttributeValues,
  getNodeFormAllocatedNodes,
  (node, nodeAttributes, allocatedNodes) =>
    getAmperageByPhaseType(ElectricityAttributeType.OnePhase, node.nodeType, nodeAttributes, allocatedNodes)
);

export const getNodeFormAllocatedEquipmentTotalThreePhasesAmperage = createSelector(
  getNodeDetail,
  getNodeDetailAttributeValues,
  getNodeFormAllocatedNodes,
  (node, nodeAttributes, allocatedNodes) =>
    getAmperageByPhaseType(ElectricityAttributeType.ThreePhases, node.nodeType, nodeAttributes, allocatedNodes) * 3
);
// #endregion

// #region Node Form Allocated Unit

export const getNodeFormAllocatedUnitState = createSelector(
  _getState,
  state => state.nodeFormAllocatedUnit
);

export const getNodeFormAllShops = createSelector(
  getNodeFormAllocatedUnitState,
  fromNodeFormAllocatedUnit.getShops
);

export const getNodeFormAllCommonAreas = createSelector(
  getNodeFormAllocatedUnitState,
  fromNodeFormAllocatedUnit.getCommonAreas
);

export const getNodeFormSelectedUnits = createSelector(
  getNodeFormAllocatedUnitState,
  fromNodeFormAllocatedUnit.getSelectedUnits
);

const hasSupplyType = (ca, supplyType) => {
  switch (supplyType) {
    case SupplyType.Electricity:
      return ca.services.isElectricityEnable;
    case SupplyType.Water:
      return ca.services.isWaterEnable;
    case SupplyType.Gas:
      return ca.services.isGasEnable;
    case SupplyType.Sewerage:
      return ca.services.isSewerageEnable;
    case SupplyType.AdHoc:
      return ca.services.isOtherEnable;
    default:
      return false;
  }
};

const _getNodeFormAllocatedUnitsList = createSelector(
  getNodeFormAllShops,
  getNodeFormAllCommonAreas,
  getNodeDetail,
  getNodeFormSelectedUnits,
  (shops, commonAreas, node, selectedUnits) => [
    ...(shops || []).map(s => ({...s, isSelected: !!selectedUnits[s.id], unitType: UnitType.Shop})),
    ...(commonAreas || []).filter(ca => hasSupplyType(ca, node.supplyType))
      .map(a => ({...a, isSelected: !!selectedUnits[a.id], unitType: UnitType.CommonArea}))
  ]
);

export const getNodeDetailTabsDataRestrictions = createSelector(
  getNodeFormAllShops,
  getNodeFormAllCommonAreas,
  (shops, commonAreas) => ({
    units: !shops || !commonAreas
  })
);

export const getNodeFormAllocatedUnitShopOrder = createSelector(
  getNodeFormAllocatedUnitState,
  fromNodeFormAllocatedUnit.getShopOrder
);

export const getNodeFormAllocatedUnitShopFilter = createSelector(
  getNodeFormAllocatedUnitState,
  fromNodeFormAllocatedUnit.getShopFilter
);

const _getNodeFormAllocatedUnitShopSearchKey = createSelector(
  getNodeFormAllocatedUnitState,
  fromNodeFormAllocatedUnit.getShopSearchKey
);

const sortShops = (shops: ShopViewModel[], orderType: number) => {
  shops = [...shops];
  switch (orderType) {
    case ShopOrder.ShopNameAsc:
      return shops.sort((a, b) => sortFunc(a.name, b.name));
    case ShopOrder.ShopNameDesc:
      return shops.sort((a, b) => sortFunc(b.name, a.name));
    case ShopOrder.TenantNameAsc:
      return shops.sort((a, b) => sortFunc(a.tenant && a.tenant.name, b.tenant && b.tenant.name));
    case ShopOrder.TenantNameDesc:
      return shops.sort((a, b) => sortFunc(b.tenant && b.tenant.name, a.tenant && a.tenant.name));
    case ShopOrder.FloorAsc:
      return shops.sort((a, b) => sortFunc(a.floor, b.floor));
    case ShopOrder.FloorDesc:
      return shops.sort((a, b) => sortFunc(b.floor, a.floor));
  }
};

export const getNodeFormAllocatedUnitFilteredUnits = createSelector(
  _getNodeFormAllocatedUnitsList,
  (s) => s
);

export const getUnits = createSelector(
  getNodeFormAllShops,
  getNodeFormAllCommonAreas,
  (shops, area): (ShopViewModel | CommonAreaViewModel)[] => {
    let res = [];
    res = shops ? res.concat(shops.map(s => ({
      ...s,
      unitType: UnitType.Shop,
      tenantName: s.tenant ? s.tenant.name : ''
    }))) : res;
    res = area ? res.concat(area.map(s => ({
      ...s,
      unitType: UnitType.CommonArea,
      tenantName: s.tenant ? s.tenant.name : ''
    }))) : res;
    return res;
  }
);

export const getUnitsFilteredBySypplyType = createSelector(
  getUnits,
  (list, props): (ShopViewModel | CommonAreaViewModel)[] => {
    let res = list.filter((el: any) => !el.supplyTypeLiabilities || el.supplyTypeLiabilities.some(st => st.supplyType === props.supplyType));
    res = res.map(el => {
      if (el.supplyTypeLiabilities) {
        const supplyTypeLiability = el.supplyTypeLiabilities.find(st => st.supplyType === props.supplyType);
        return {
          ...el,
          area: supplyTypeLiability ? supplyTypeLiability.areaOfActiveShops : null
        };
      } else {
        return el;
      }
    });
    return res;
  }
);

export const getMetersWithSupply = createSelector(
  getNodeFormAllocatedUnitState,
  (state) => {
    return [...state.metersWithSupply];
  }
);

export const getCostAllocationUnits = createSelector(
  getNodeDetail,
  getUnits,
  (nodeDetails, units) => {
    const res = {
      ...nodeDetails
    };
    if (units.length) {
      res.allocatedUnits = nodeDetails.allocatedUnits.map(aUnit => {
        const unit = (units as ShopViewModel[]).find(el => el.id === aUnit.id);
        let area = null;
        if (unit.unitType === UnitType.Shop) {
          area = unit.area;
        } else if (unit.unitType === UnitType.CommonArea) {
          const supplyTypeLiabilities = (unit as any).supplyTypeLiabilities || [];
          const supplyTypeLiabilitie: SupplyTypeLiabilityModel = supplyTypeLiabilities.find(el => el.supplyType === nodeDetails.supplyType);
          if (supplyTypeLiabilitie) {
            area = supplyTypeLiabilitie.areaOfActiveShops;
          }
        }

        return {
          ...aUnit,
          name: unit ? unit.name : '',
          floor: unit ? unit.floor : null,
          area: area,
          tenantName: unit.tenant ? unit.tenant.name : '',
          usage: 0
        };
      });

    }
    return res;
  }
);

export const getNodeFormAllocatedUnitsCount = createSelector(
  getNodeFormSelectedUnits,
  (units) => Object.getOwnPropertyNames(units).length
);

// #endregion

//#region Node Form allocated tariffs

export const getNodeFormAllocatedTariffState = createSelector(
  _getState,
  state => state.nodeFormAllocatedTariff
);

const markRecommendedTariffs = (tariffs) => {
  const newTariffs = [];
  if (tariffs.recommendedTariffs) {
    const recommendedTariffsData: any[][] = Object.values(tariffs.recommendedTariffs);
    if (recommendedTariffsData && recommendedTariffsData.length) {
      const recommendedTariffs: any[] = recommendedTariffsData[0];
      tariffs.tariffs.forEach(tariff => {
        const recomendedItem = recommendedTariffs.find(el => el.tariffVerionId === tariff.id);
        newTariffs.push({
          ...tariff,
          isRecommended: recomendedItem && recomendedItem.isApplicable
        });
      });
    }
  }

  return newTariffs;
};

export const getHasCostReceiverTariffStatus = createSelector(
  getNodeFormAllocatedTariffState,
  fromNodeFormAllocatedTariff.getTariffs,
  getNodeDetailTariffs,
  (nodeTariffs, t, listOfTariffs) => {
    let hasCostReceiverTariffStatus = false;
    const tariffsIds = nodeTariffs.tariffs.map(tariff => tariff.id);
    listOfTariffs.forEach(tariff => {
      const lineItems = tariff.entity.lineItems ? tariff.entity.lineItems : [];
      if (tariffsIds.indexOf(tariff.id) !== -1) {
        lineItems.forEach(lineItem => {
          if (lineItem.isCostReceiver) {
            hasCostReceiverTariffStatus = true;
          }
        });
      }
    });
    return hasCostReceiverTariffStatus;
  }
);

export const getHasCostReceiverTariffs = createSelector(
  getNodeFormAllocatedTariffState,
  fromNodeFormAllocatedTariff.getTariffs,
  getNodeDetailTariffs,
  (nodeTariffs, t, listOfTariffs) => {
    const hasCostReceiverTariffs: string[] = [];
    const tariffsIds = nodeTariffs.tariffs.map(tariff => tariff.id);
    listOfTariffs.forEach(tariff => {
      const lineItems = tariff.entity.lineItems ? tariff.entity.lineItems : [];
      if (tariffsIds.indexOf(tariff.id) !== -1) {
        lineItems.forEach(lineItem => {
          if (lineItem.isCostReceiver) {
            hasCostReceiverTariffs.push(tariff.entity.name);
          }
        });
      }
    });
    return hasCostReceiverTariffs;
  }
);

export const getNodeFormAllocatedTariffTariffs = createSelector(
  getNodeFormAllocatedTariffState,
  fromNodeFormAllocatedTariff.getTariffs,
  markRecommendedTariffs
);

export const getNodeFormAllocatedRecommendedTariffs = createSelector(
  getNodeFormAllocatedTariffState,
  fromNodeFormAllocatedTariff.getRecommendedTariffs,
);

// #endregion

// #region apply new tariff

export const getNodeFormApplyTariffState = createSelector(
  _getState,
  state => state.nodeFormApplyTariff
);

const _getNodeFormApplyTariffTariffs = createSelector(
  getNodeFormApplyTariffState,
  fromNodeFormApplyTariff.getTariffs
);

export const _getNodeFormApplyTariffVersionId = createSelector(
  getNodeFormApplyTariffState,
  fromNodeFormApplyTariff.getTariffVersionId
);

const _getNodeFormApplyTariffSupplierId = createSelector(
  getNodeFormApplyTariffState,
  fromNodeFormApplyTariff.getSupplierId
);

const _getNodeFormApplyTariffSuppliers = createSelector(
  getNodeFormApplyTariffState,
  fromNodeFormApplyTariff.getSuppliers,
);

export const getNodeFormApplyTariffSuppliers = createSelector(
  _getNodeFormApplyTariffSuppliers,
  _getNodeFormApplyTariffSupplierId,
  (suppliers, supplierId) => {
    if (supplierId) {
      return {
        suppliers: suppliers.filter(s => s.id !== supplierId),
        selectedSupplier: suppliers.find(s => s.id == supplierId)
      };
    }
    return {suppliers: suppliers, selectedSupplier: null};
  }
);

export const getNodeFormApplyTariffFilteredTariffs = createSelector(
  _getNodeFormApplyTariffTariffs,
  _getNodeFormApplyTariffSupplierId,
  (tariffs, supplierId) => {
    let filteredTariffs = tariffs;
    if (filteredTariffs.length) {
      if (supplierId) {
        filteredTariffs = filteredTariffs.filter(t => !!t.versions.find(v => v.entity.supplierId == supplierId));
      }

      filteredTariffs.forEach(item => {
        item.versions.sort((a, b) => sortFunc(b.majorVersion, a.majorVersion));
      });

      filteredTariffs = filteredTariffs.sort((a, b) => sortFunc(b.versions[0].majorVersion, a.versions[0].majorVersion));
    }

    return filteredTariffs;
  }
);

export const getNodeFormApplyTariffVersionId = createSelector(
  _getNodeFormApplyTariffVersionId,
  getNodeFormApplyTariffFilteredTariffs,
  (versionId, tariffs) => {
    return versionId ? versionId : tariffs.length ? tariffs[0].versions[0].id : versionId;
  }
);

// #endregion

export const getBulkWizardState = createSelector(
  _getState,
  state => state.bulkWizard
);

export const getSetupStepState = createSelector(
  _getState,
  state => state.setupStep
);

export const getShopsStepState = createSelector(
  _getState,
  state => state.shopsStep
);

export const getShopStepMeters = createSelector(
  getShopsStepState,
  state => state.formState.value.locationGroupMeters
    .reduce<UnitMetersFormValue[]>((prev, curr) => prev.concat(curr.meters), [])
);

export const getAttributesStepState = createSelector(
  _getState,
  state => state.attributesStep
);

export const getRegistersAndReadingsState = createSelector(
  _getState,
  state => state.registersAndReadingsStep
);

export const getEquipmentTreeState = createSelector(
  _getState,
  state => state.equipmentTree
);

export const getAddClosingReadingsStepState = createSelector(
  _getState,
  state => state.addClosingReadingsStep
);

export const getReplaceWizardState = createSelector(
  _getState,
  state => state.replaceWizard
);

export const getReplaceEquipmentStepState = createSelector(
  _getState,
  state => state.replaceEquipmentStep
);

export const getReplaceNodeTariffStepState = createSelector(
  _getState,
  state => state.replaceNodeTariffStep
);
