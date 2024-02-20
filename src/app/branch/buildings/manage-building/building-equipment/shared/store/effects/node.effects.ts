import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {TariffLineItemChargingType, TariffViewModel, UnitType, VersionActionType, VersionViewModel} from '@models';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {AuthService} from '@services';
import {ApplyResultService} from 'app/popups/apply-result-popup/apply-result.service';
import {versionDayKey} from 'app/shared/helper/version-date-key';
import {CostTariffSettingsService} from 'app/shared/services/cost-tariff-settings.service';
import {SetValueAction} from 'ngrx-forms';
import {forkJoin, merge, Observable, of} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import * as commonDataActions from '../../../../shared/store/actions/common-data.action';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';
import {MeterService} from '../../meter.service';
import {
  AllocatedNodeDetailViewModel,
  AllocatedNodeEditViewModel,
  NodeEditViewModel,
  NodeTariffApplyType,
  NodeType,
  SearchFilterUnitsModel
} from '../../models';
import {
  AllocatedTariffDetailViewModel,
  AllocatedTariffLineItemViewModel,
  ApprovalInfoViewModel,
  GroupedTariffViewModel
} from '../../models/node-allocated-tariff.model';

import {NodeService} from '../../node.service';
import * as nodeFormAllocatedTariffsAction from '../actions/node-form-allocated-tariffs.actions';
import * as nodeFormAction from '../actions/node-form.actions';

import * as nodeAction from '../actions/node.actions';
import * as fromNode from '../reducers';
import * as fromNodeFormAllocatedEquipment from '../reducers/node-form-allocated-equipment.store';
import {AllocatedNodeFormValue, RegisterFormValue} from '../reducers/node-form-allocated-equipment.store';
import * as fromNodeForm from '../reducers/node-form.store';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DialogAddUnitComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/dialogs/dialog-add-unit/dialog-add-unit.component';
import * as buildingCommonData
  from '@app/branch/buildings/manage-building/shared/store/selectors/common-data.selectors';

@Injectable()
export class NodeEffects {

  // Get nodes
  getNodeRequest: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.REQUEST_NODE_LIST),
    withLatestFrom(
      this.store$.pipe(select(fromNode.getNodeState)),
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (_, nodeState, buildingId, versionId) => {
        return {
          state: nodeState,
          buildingId: buildingId,
          versionId: versionId
        };
      }),
    switchMap(({state, buildingId, versionId}) => {

        return this.nodeService.getAllNodesByBuilding(buildingId,
          versionId,
          state.searchKey,
          state.order,
          state.supplyTypeFilter,
          state.nodeTypeFilter,
          state.page * state.unitsPerPage - state.unitsPerPage,
          state.unitsPerPage)
          .pipe(
            map(r => new nodeAction.RequestNodeListComplete(r)),
            catchError(() => {
              return of({type: 'DUMMY'});
            })
          );
      }
    )
  ));
  // Update search key
  updateSearchKey: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.UPDATE_SEARCH_KEY),
    withLatestFrom((action: any) => {
      return {
        searchKey: action.payload
      };
    }),
    debounceTime(300),
    distinctUntilChanged(),
    map(() => {
      return new nodeAction.RequestNodeList();
    })
  ));
  // Update order, page, supply type, node type, unitsPerPage
  updateOrderPageNodeTypeSupplyTypeUnitsPerPage: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.UPDATE_ORDER, nodeAction.UPDATE_PAGE, nodeAction.UPDATE_SUPPLY_TYPE_FILTER,
      nodeAction.UPDATE_NODE_TYPE_FILTER, nodeAction.UPDATE_UNITS_PER_PAGE),
    withLatestFrom((action: any) => {
      return {
        order: action.payload
      };
    }),
    map(() => {
      return new nodeAction.RequestNodeList();
    })
  ));
  // Delete node
  deleteNode: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.DELETE_NODE),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (action: any, buildingId, versionId) => {
        return {
          nodeId: action.payload,
          buildingId: buildingId,
          versionId: versionId
        };
      }),
    switchMap(({nodeId, buildingId, versionId}) => {
      return this.nodeService.deleteNode(buildingId, nodeId, versionId).pipe(
        map(r => {
          return new commonDataActions.GetHistoryWithVersionId(r.id);
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Get list of supplies
  getSupplies = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.GET_SUPPLIES_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(fromNode.getAllSupplies)),
      (_, buildingId, supplies) => {
        return {
          buildingId: buildingId,
          supplies: supplies
        };
      }),
    switchMap(({buildingId, supplies}) => {
      if (supplies) {
        return of(new nodeAction.GetSuppliesRequestComplete(supplies));
      }

      return this.meterService.getSupplies(buildingId, null).pipe(
        mergeMap(items => {
          return [
            new nodeAction.GetSuppliesRequestComplete(items),
            new nodeFormAction.SetDefaultSupplyTo() //TODO:review&fix
          ];
        }),
        catchError(() => of(new nodeAction.GetSuppliesRequestFailed()))
      );
    })
  ));
  getNodeDetail: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.GET_NODE_DETAILS, nodeFormAction.SEND_NODE_REQUEST_COMPLETE),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (action: any, buildingId, versionId) => {
        return {
          nodeId: action.payload.nodeId,
          buildingId: buildingId,
          versionId: versionId
        };
      }),
    switchMap(({buildingId, nodeId, versionId}) => {
      return this.nodeService.getNode(buildingId, nodeId, versionId)
        .pipe(map(node => {
          const costSplitRegister = this.costTariffSettingsService.getFirstRegisterBySupplyType(node.supplyType).key;
          return new nodeAction.SetNodeDetail({node, costSplitRegister});
        }));
    }),
    catchError((e) => of(new nodeAction.GetNodeDetailsFailed()))
  ));
  addChildNodeClicked = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.OPEN_ADD_CHILD_NODES),
    withLatestFrom(
      this.store$.pipe(select(fromNode.getNodeDetail)),
      this.store$.pipe(select(fromNode.getNodeAllowedChildren))
    ),
    mergeMap(([_, node, allowedChildNodes]) => {
      if (allowedChildNodes) {
        return [new nodeAction.ToggleAddChildNodesDisplay({show: true})];
      } else {
        return merge(
          of(new nodeAction.GetAllowedChildrenForNode({nodeId: node.id})),
          this.actions$
            .pipe(
              ofType(nodeAction.GET_NODE_ALLOWED_CHILDREN_SUCCESS, nodeAction.GET_NODE_ALLOWED_CHILDREN_FAILED),
              map((a: any) => a.type === nodeAction.GET_NODE_ALLOWED_CHILDREN_SUCCESS
                ? new nodeAction.ToggleAddChildNodesDisplay({show: true}) : {type: 'DUMMY'}),
              first()
            ));
      }

    }),
    catchError(() => {
      return of({type: 'DUMMY'});
    })
  ));
  getAllowedChildrenNodes: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.GET_NODE_ALLOWED_CHILDREN),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      this.store$.pipe(select(fromNode.getNodeDetail)),
      (action: any, buildingId, versionId, node) => {
        return {
          nodeId: node.id,
          buildingId: buildingId,
          versionId: versionId
        };
      }),
    switchMap(({buildingId, nodeId, versionId}) => {
      return this.nodeService.getAllowedChildrenForNode(buildingId, nodeId, versionId)
        .pipe(map(nodes => new nodeAction.GetAllowedChildrenForNodeSuccess({nodes})));
    }),
    catchError((e) => of(new nodeAction.GetAllowedChildrenForNodeFailed()))
  ));
  getShops: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.GET_SHOPS),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId))),
    switchMap(([a, buildingId, versionId]) => {
      return this.meterService.getShops(buildingId, versionId)
        .pipe(map(items => new nodeAction.GetShopsSuccess({shops: items})));
    }),
    catchError((e) => of(new nodeAction.GetShopsFailed()))
  ));
  getCommonAreas: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.GET_COMMON_AREAS),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId))),
    switchMap(([a, buildingId, versionId]) => {
      return this.meterService.getCommonAreas(buildingId, versionId)
        .pipe(map(items => new nodeAction.GetCommonAreasSuccess({commonAreas: items})));
    }),
    catchError((e) => of(new nodeAction.GetCommonAreasFailed()))
  ));
  //TODO check to remove
  openNodeAllocatedUnits = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.TRY_OPEN_NODE_UNIT_ALLOCATION),
    withLatestFrom(
      this.store$.pipe(select(fromNode.getNodeFormAllShops)),
      this.store$.pipe(select(fromNode.getNodeFormAllCommonAreas))),
    switchMap(([action, shops, commonAreas]) => {
      let shopDependency;
      let commonAreaDependency;
      if (!shops) {
        this.store$.dispatch(new nodeAction.GetShops());
        shopDependency = this.actions$.pipe(
          ofType(nodeAction.GET_SHOPS_SUCCESS, nodeAction.GET_SHOPS_FAILED),
          map((a: any) => a.type === nodeAction.GET_SHOPS_SUCCESS),
          first()
        );
      } else {
        shopDependency = of(true);
      }

      if (!commonAreas) {
        this.store$.dispatch(new nodeAction.GetCommonAreas());
        commonAreaDependency = this.actions$.pipe(
          ofType(nodeAction.GET_COMMON_AREAS_SUCCESS, nodeAction.GET_COMMON_AREAS_FAILED),
          map((a: any) => a.type === nodeAction.GET_COMMON_AREAS_SUCCESS),
          first()
        );
      } else {
        commonAreaDependency = of(true);
      }
      return forkJoin(shopDependency, commonAreaDependency)
        .pipe(map(([shopsLoaded, caLoaded]) =>
          shopsLoaded && caLoaded ? new nodeAction.OpenTab({tab: 'units'}) : {type: 'DUMMY'}));
    }),
    catchError((e) => of({type: 'DUMMY'}))
  ));
  getAllUnits = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.GET_ALL_UNITS),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId))),
    switchMap(([_, buildingId, versionId]) => {
      const getShopsRequest = this.meterService.getShops(buildingId, versionId);
      const getCommonAreaRequest = this.meterService.getCommonAreas(buildingId, versionId);

      return forkJoin(getShopsRequest, getCommonAreaRequest).pipe(map(([shopsRes, areaRes]) => {
        return new nodeAction.GetUnitsSuccess({shops: shopsRes, commonAreas: areaRes});
      }));
    }),
    catchError((e) => of({type: 'DUMMY'}))
  ));
  getAllMetersWithSupply = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.GET_ALL_METERS_WITH_SUPPLY),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId))),
    switchMap(([action, buildingId, versionId]) => {

      return this.meterService.getMetersWithSupply(buildingId, versionId, action['payload']).pipe(
        mergeMap(r => {
          return [
            new nodeAction.GetMettersWithSupplySuccess(r)
          ];
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    }),
    catchError((e) => of({type: 'DUMMY'}))
  ));
  initNodeForm = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.SET_NODE_DETAIL, nodeFormAction.RESET_NODE_DETAIL_CHANGES),
    withLatestFrom(this.store$.pipe(select(fromNode.getNodeDetail))),
    map(([a, node]) => {
      const form = {
        id: node.id,
        name: node.name,
        supplyType: node.supplyType,
        supplyToId: node.supplyToId,
        supplyToLocationId: node.supplyToLocationId,
        description: node.description,
        tariffApplyType: node.tariffApplyType,
        costProviderActive: node.costProvider.isActive,
        costProviderFactor: node.costProvider.costFactor,
        costProviderRegister: node.costProvider.registerId
      };

      return new SetValueAction(fromNodeForm.FORM_ID, form);
    })
  ));
  initAllocatedNodesForm = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.SET_NODE_DETAIL, nodeAction.ALLOCATED_EQUIPMENT_CANCEL),
    withLatestFrom(this.store$.pipe(select(fromNode.getNodeDetail))),
    map(([a, node]) => {
      if (node.nodeType === NodeType.Single) {
        return new SetValueAction(fromNodeFormAllocatedEquipment.FORM_ID, {
          meterAllocation: <AllocatedNodeFormValue>{
            id: node.meterAllocation.nodeId,
            selected: false,
            calculationFactor: node.meterAllocation.calculationFactor,
            registers: this.GetRegisterFormValues(node.meterAllocation)
          }
        });
      }

      return new SetValueAction(fromNodeFormAllocatedEquipment.FORM_ID, {
        nodes: (node.nodes || []).map(n => ({
          id: n.nodeId,
          calculationFactor: n.calculationFactor,
          selected: false,
          registers: this.GetRegisterFormValues(n)
        }))
      });
    })));
  // get tariffs
  getTariffs = createEffect(() => this.actions$.pipe(
    ofType(nodeFormAction.GET_TARIFFS),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(fromNode.getNodeForm)),
      this.store$.pipe(select(commonData.getAttributes)),
      this.store$.pipe(select(commonData.getUnitsOfMeasurement)),
      this.store$.pipe(select(fromNode.getNodeDetail)),
      (action: nodeFormAction.GetTariffs, buildingId, nodeForm, attributes, units, nodeDetail) => {
        return {
          buildingId: buildingId,
          nodeForm: nodeForm,
          attributes: attributes,
          units: units,
          srcAllocatedTariffs: nodeDetail.tariffs,
          versionId: action.payload.versionId
        };
      }),
    switchMap(({buildingId, nodeForm, attributes, units, srcAllocatedTariffs, versionId}) => {
      return this.nodeService.getTariffsForBuilding(buildingId, nodeForm.value.supplyType, versionId).pipe(
        mergeMap(r => {
          const allocatedTariffs = [...srcAllocatedTariffs.filter(t => r.find(x => x.id === t.id) !== undefined)];

          const allocTariffs = allocatedTariffs.map(t => {
            const tariffVersion = r.find(item => item.id == t.id);
            return {
              ...t,
              name: tariffVersion.entity.name,
              code: tariffVersion.entity.code,
              supplierName: tariffVersion.entity.supplier && tariffVersion.entity.supplier.name,
              versionDate: tariffVersion.versionDate,
              majorVersion: tariffVersion.majorVersion,
              minorVersion: tariffVersion.minorVersion,
              version: tariffVersion.version,
              isActual: tariffVersion.isActual,
              lineItems: t.lineItems
                .map(lineItem => ({
                  lineItem,
                  lItem: tariffVersion.entity.lineItems.find(l => l.id == lineItem.id)
                }))
                .filter(li => !!li.lItem)
                .map(({lineItem, lItem}) => ({
                    ...lineItem,
                    name: lItem.name,
                    chargingType: lItem.chargingType,
                    chargingMethod: lItem.chargingMethod,
                    categories: lItem.categories,
                    unitName: lItem.chargingType == +TariffLineItemChargingType.BasedOnReadings ? units.find(r => r.unitType == lItem.unitOfMeasurement).defaultName : null,
                    attributeName: lItem.chargingType == +TariffLineItemChargingType.BasedOnAttributes ? attributes.find(a => a.id == lItem.attributeId).name : null,
                    categoryId: !lineItem.categoryId && lItem.categories.length ? lItem.categories[0].id : lineItem.categoryId,
                    hasDuplicationFactor: lItem.hasDuplicationFactor
                  })
                )
            };
          });

          if (allocTariffs.length) {
            const isBillingArray = allocatedTariffs.filter(t => t.isBilling);
            if (!isBillingArray.length) {
              allocatedTariffs[0].isBilling = true;
            }
          }

          return [
            new nodeFormAction.SetTariffs(r),
            new nodeFormAllocatedTariffsAction.SetNodeTariffs(allocTariffs)
          ];
        }),
        catchError((err) => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // get tariffs
  getRecommendedTariffs = createEffect(() => this.actions$.pipe(
    ofType(nodeFormAction.GET_RECOMMENDED_TARIFFS),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(fromNode.getNodeForm)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (_, buildingId, nodeForm, versionId) => {
        return {
          buildingId: buildingId,
          nodeForm: nodeForm,
          versionId: versionId,
        };
      }),
    switchMap(({buildingId, nodeForm, versionId}) => {
      return this.nodeService.getRecomendedCategoriesForTariffsByNode(buildingId, versionId, [nodeForm.value.id]).pipe(
        mergeMap(r => {
          return [
            new nodeFormAllocatedTariffsAction.SetNodeRecommendedTariffs(r)
          ];
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // get grouped tariffs
  getGroupedTariffsForApplying = createEffect(() => this.actions$.pipe(
    ofType(nodeFormAllocatedTariffsAction.GET_TARIFFS_FOR_APPLYING),
    withLatestFrom(
      this.store$.pipe(select(fromNode.getNodeDetailTariffs)),
      this.store$.pipe(select(fromNode.getNodeFormAllocatedTariffTariffs)),
      (_, tariffs, allocatedTariffs) => {
        return {
          tariffs: tariffs,
          allocatedTariffs: allocatedTariffs
        };
      }),
    switchMap(({tariffs, allocatedTariffs}) => {
      const allocTariffs = [...allocatedTariffs];
      const groupedTariffs = this.getGroupedTariffs(tariffs, allocTariffs);

      const suppliers = this.getSuppliers(tariffs);
      const supplierId = suppliers.length ? suppliers[0].id : null;
      return [
        new nodeFormAllocatedTariffsAction.SetTariffsForApplying(
          {
            tariffs: groupedTariffs,
            suppliers: suppliers,
            supplierId: supplierId
          })
      ];
    }),
    catchError(() => {
      return of({type: 'DUMMY'});
    })
  ));
  // apply new tariff
  applyNewTariff = createEffect(() => this.actions$.pipe(
    ofType(nodeFormAllocatedTariffsAction.APPLY_NEW_TARIFF),
    withLatestFrom(
      this.store$.pipe(select(fromNode.getNodeDetail)),
      this.store$.pipe(select(fromNode.getNodeDetailTariffs)),
      this.store$.pipe(select(fromNode.getNodeFormAllocatedTariffTariffs)),
      this.store$.pipe(select(fromNode.getNodeFormAllocatedRecommendedTariffs)),
      this.store$.pipe(select(fromNode.getNodeFormApplyTariffVersionId)),
      this.store$.pipe(select(commonData.getAttributes)),
      this.store$.pipe(select(commonData.getUnitsOfMeasurement)),
      (_, node, tariffs, allocatedTariffs, recommendedTariffs, versionId, attributes, units) => {
        return {
          node,
          isRecommended: _.payload.isRecommended,
          tariffs: tariffs,
          allocatedTariffs: allocatedTariffs,
          recommendedTariffs,
          versionId: versionId,
          attributes: attributes,
          units: units
        };
      }),
    switchMap(({isRecommended, node, tariffs, allocatedTariffs, recommendedTariffs, versionId, attributes, units}) => {
      const tariff = tariffs.find(t => t.id === versionId);
      const allocTariff = <AllocatedTariffDetailViewModel>{
        id: tariff.id,
        name: tariff.entity.name,
        code: tariff.entity.code,
        supplierName: tariff.entity.supplier && tariff.entity.supplier.name,
        versionDate: tariff.versionDate,
        majorVersion: tariff.majorVersion,
        minorVersion: tariff.minorVersion,
        version: tariff.version,
        isActual: tariff.isActual,
        isBilling: true,
        duplicationFactor: 1,
        lineItems: tariff.entity.lineItems.map(l => {
          return <AllocatedTariffLineItemViewModel>{
            id: l.id,
            name: l.name,
            chargingType: l.chargingType,
            chargingMethod: l.chargingMethod,
            unitName: l.unitOfMeasurement ? units.find(r => r.unitType === l.unitOfMeasurement).defaultName : null,
            attributeName: l.attributeId ? attributes.find(a => a.id === l.attributeId).name : null,
            isActive: true,
            isBilling: true,
            categoryId: this.getLineItemCategoryId(l.categoryId, l.categories),
            categories: l.categories,
            hasDuplicationFactor: l.hasDuplicationFactor,
            approvalInfo: this.isCategoryRecommended(recommendedTariffs[node.id], tariff.id,
              this.getLineItemCategoryId(l.categoryId, l.categories))
              ? null : <ApprovalInfoViewModel>{userName: this.authService.getFullName()}
          };
        }),
        approvalInfo: isRecommended ? null : <ApprovalInfoViewModel>{userName: this.authService.getFullName()}
      };
      return [new nodeFormAllocatedTariffsAction.SetNodeTariffs([...allocatedTariffs, allocTariff])];
    }),
    catchError((error) => {
      console.log(error);
      return of({type: 'DUMMY'});
    })
  ));
  // save allocated tariffs
  saveAllocatedTariffs = createEffect(() => this.actions$.pipe(
    ofType(nodeFormAllocatedTariffsAction.SAVE_TARIFFS),
    withLatestFrom(
      this.store$.pipe(select(fromNode.getNodeFormAllocatedTariffTariffs)),
      this.store$.pipe(select(fromNode.getNodeEditModel)),
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      this.store$.pipe(select(commonData.getIsComplete)),
      this.store$.pipe(select(fromNode.getNodeForm)),
      (action: any, tariffs, nodeDetail, buildingId, versionId, isDocumentComplete, nodeForm) => {
        return {
          action: action.payload,
          tariffs: tariffs,
          nodeDetail: nodeDetail,
          buildingId: buildingId,
          versionId: versionId,
          isDocumentComplete: isDocumentComplete,
          nodeForm: nodeForm
        };
      }),
    switchMap(({action, tariffs, nodeDetail, buildingId, versionId, isDocumentComplete, nodeForm}) => {
      const isPerMeter = action.tariffApplyType === NodeTariffApplyType.PerMeter;
      const filteredTariffs = tariffs.filter(el => isPerMeter ? !!el.nodeId : !el.nodeId);

      const model = {
        ...nodeDetail,
        costProvider: nodeDetail.costProvider && nodeDetail.costProvider.isActive === false ? null : nodeDetail.costProvider,
        tariffApplyType: action.tariffApplyType,
        buildingId: buildingId,
        tariffs: filteredTariffs
      };

      if (nodeForm.value.costProviderActive) {
        model.costProvider = {
          costFactor: nodeForm.value.costProviderFactor,
          registerId: nodeForm.value.costProviderRegister
        };
      } else {
        model.costProvider = null;
      }

      return this.sendNodeRequest(action.version, model, versionId, isDocumentComplete);

    }),
    switchMap(result => {
      if (!result.status) {
        return of({type: 'DUMMY'});
      }
      const versionDate = result.payload.current.versionDate;
      this.versionUpdateService.showVersionUpdateResults(result.payload.next);
      return [
        new commonDataActions.UpdateUrlVersionAction(versionDate),
        new commonDataActions.GetHistoryWithVersionId(result.payload.current.id),
        new nodeFormAction.SendNodeRequestComplete({nodeId: result.nodeId})
      ];
    })
  ));
  // save allocated meters
  saveAllocatedNodes = createEffect(() => this.actions$.pipe(
    ofType(nodeFormAction.SAVE_ALLOCATED_NODES),
    withLatestFrom(
      this.store$.pipe(select(fromNode.getNodeFormAllocatedEquipmentForm)),
      this.store$.pipe(select(fromNode.getNodeEditModel)),
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      this.store$.pipe(select(commonData.getIsComplete)),
      (action: any, allocatedNodesForm, nodeDetail, buildingId, versionId, isDocumentComplete) => {
        return {
          action: action.payload,
          form: allocatedNodesForm,
          nodeDetail: nodeDetail,
          buildingId: buildingId,
          versionId: versionId,
          isDocumentComplete: isDocumentComplete
        };
      }),
    switchMap(({action, form, nodeDetail, buildingId, versionId, isDocumentComplete}) => {
      if (!form.isValid) {
        return of({status: false, payload: null, nodeId: nodeDetail.id});
      }

      const allocatedNodesFormValue = {...form.value};
      const model = <NodeEditViewModel>{
        ...nodeDetail,
        costProvider: nodeDetail.costProvider && nodeDetail.costProvider.isActive === false ? null : nodeDetail.costProvider,
        buildingId: buildingId
      };
      if (model.nodeType === NodeType.Multi) {
        model.nodes = allocatedNodesFormValue.nodes.map(n => ({
          nodeId: n.id,
          calculationFactor: n.calculationFactor,
          registers: n.registers.filter(r => !r.isRemoved)
            .map(r => ({
              registerId: r.registerId,
              calculationFactor: r.calculationFactor,
              timeOfUse: r.timeOfUse,
              unitOfMeasurement: r.unitOfMeasurement
            }))
        }));
      } else if (model.nodeType === NodeType.Single) {
        model.meterAllocation = <AllocatedNodeEditViewModel>{
          nodeId: allocatedNodesFormValue.meterAllocation.id,
          calculationFactor: allocatedNodesFormValue.meterAllocation.calculationFactor,
          registers: allocatedNodesFormValue.meterAllocation.registers.filter(r => !r.isRemoved)
            .map(r => ({
              registerId: r.registerId,
              calculationFactor: r.calculationFactor,
              timeOfUse: r.timeOfUse,
              unitOfMeasurement: r.unitOfMeasurement
            }))
        };
      }

      return this.sendNodeRequest(action, model, versionId, isDocumentComplete);
    }),
    switchMap(result => {
      if (!result.status) {
        return of({type: 'DUMMY'});
      }
      const versionDate = result.payload.current.versionDate;
      this.versionUpdateService.showVersionUpdateResults(result.payload.next);
      return [
        new commonDataActions.UpdateUrlVersionAction(versionDate),
        new commonDataActions.HistoryChange(result.payload.current.id),
        new commonDataActions.GetHistoryWithVersionId(result.payload.current.id),
        new nodeFormAction.SendNodeRequestComplete({nodeId: result.nodeId})
      ];
    })
  ));
  // save allocated shops
  saveAllocatedShops = createEffect(() => this.actions$.pipe(
    ofType(nodeFormAction.SAVE_UNITS),
    withLatestFrom(
      this.store$.pipe(select(fromNode.getNodeFormAllocatedUnitFilteredUnits)),
      this.store$.pipe(select(fromNode.getNodeEditModel)),
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      this.store$.pipe(select(commonData.getIsComplete)),
      (action: any, units, nodeDetail, buildingId, versionId, isDocumentComplete) => ({
        action: action.payload,
        units: units,
        nodeDetail: nodeDetail,
        buildingId: buildingId,
        versionId: versionId,
        isDocumentComplete: isDocumentComplete
      })
    ),
    switchMap(({action, units, nodeDetail, buildingId, versionId, isDocumentComplete}) => {

      const model: any = {
        ...nodeDetail,
        costProvider: nodeDetail.costProvider && nodeDetail.costProvider.isActive === false ? null : nodeDetail.costProvider,
        buildingId: buildingId,
        allocatedUnits: units.filter(u => u.isSelected).map(u => ({unitType: u.unitType, id: u.id, isLiable: true})),
        shopIds: units.filter(s => s.unitType === UnitType.Shop && s.isSelected).map(s => s.id),
        commonAreaIds: units.filter(s => s.unitType === UnitType.CommonArea && s.isSelected).map(s => s.id)
      };

      return this.sendNodeRequest(action, model, versionId, isDocumentComplete);
    }),
    switchMap(result => {
      if (!result.status) {
        return of({type: 'DUMMY'});
      }
      const versionDate = result.payload.current.versionDate;
      this.versionUpdateService.showVersionUpdateResults(result.payload.next);
      return [
        new commonDataActions.UpdateUrlVersionAction(versionDate),
        new commonDataActions.HistoryChange(result.payload.current.id),
        new commonDataActions.GetHistoryWithVersionId(result.payload.current.id),
        new nodeFormAction.SendNodeRequestComplete({nodeId: result.nodeId})
      ];
    })
  ));
  //save node detail
  saveNodeDetail = createEffect(() => this.actions$.pipe(
    ofType(nodeFormAction.SAVE_NODE_DETAIL),
    withLatestFrom(
      this.store$.pipe(select(fromNode.getNodeForm)),
      this.store$.pipe(select(fromNode.getNodeEditModel)),
      this.store$.pipe(select(fromNode.getNodeAttributes)),
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      this.store$.pipe(select(commonData.getIsComplete)),
      (action: any, nodeDetailForm, nodeDetail, attributes, buildingId, versionId, isDocumentComplete) => {
        nodeDetail.attributeValues = attributes;
        return {
          action: action.payload,
          form: nodeDetailForm,
          nodeDetail: nodeDetail,
          buildingId: buildingId,
          versionId: versionId,
          isDocumentComplete: isDocumentComplete
        };
      }),
    switchMap(({action, form, nodeDetail, buildingId, versionId, isDocumentComplete}) => {
      if (!form.isValid) {
        return of({status: false, payload: null, nodeId: nodeDetail.id});
      }
      const nodeForm = {...form.value};
      const model: NodeEditViewModel = {
        ...nodeDetail,
        id: nodeForm.id,
        buildingId: buildingId,
        name: nodeForm.name,
        supplyType: nodeForm.supplyType,
        supplyToId: nodeForm.supplyToId,
        supplyToLocationId: nodeForm.supplyToLocationId,
        description: nodeForm.description,
        tariffApplyType: nodeForm.tariffApplyType
      };

      if (nodeForm.costProviderActive) {
        model.costProvider = {
          costFactor: nodeForm.costProviderFactor,
          registerId: nodeForm.costProviderRegister
        };
      } else {
        model.costProvider = null;
      }

      return this.sendNodeRequest(action, model, versionId, isDocumentComplete);
    }),
    switchMap(result => {
      if (!result.status) {
        return of({type: 'DUMMY'});
      }
      const versionDate = result.payload.current.versionDate;
      this.versionUpdateService.showVersionUpdateResults(result.payload.next);
      return [
        new commonDataActions.UpdateUrlVersionAction(versionDate),
        new commonDataActions.GetHistoryWithVersionId(result.payload.current.id),
        new nodeFormAction.SendNodeRequestComplete({nodeId: result.nodeId})
      ];
    })
  ));
  nodeUpdate = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.API_REQUEST_UPDATE_NODE_SUCCESS),
    withLatestFrom(
      (a: nodeAction.ApiRequestCreateNodeSuccess) => ({node: a.payload})),
    switchMap(({node}) => {
      const nodeId = node.nodeId;
      const versionDate = node.versionDate;
      let url = this.router.url;
      if (versionDate) {
        url = url.replace(/version\/[0-9]{8}\//, 'version/' + versionDayKey(versionDate) + '/');
      }
      return of(new commonDataActions.SetNavigationUrl(url));
    })
  ));
  saveCostAllocation = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.SAVE_NODE_COST_ALLOCATION),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId))
    ),
    mergeMap(([action, buildingId, versionId]) => {
      return this.nodeService.updateCostAllocation(buildingId, versionId, action['payload']);
    }),
    switchMap(result => {
      const versionDate = result.current.versionDate;
      this.versionUpdateService.showVersionUpdateResults(result.next);
      return [
        new nodeAction.ApiRequestCreateNodeSuccess({nodeId: result.entity, versionDate: versionDate}),
        new commonDataActions.HistoryChange(result.current.id),
        new commonDataActions.GetHistoryWithVersionId(result.current.id)
      ];
    }),
    catchError(() => {
      return of({type: 'DUMMY'});
    })
  ));
  toggleUnitPopup = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.TOGGLE_UNIT_POPUP),
    withLatestFrom(this.store$.pipe(select(buildingCommonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (action: nodeAction.ToggleUnitPopup, buildingId, versionId) =>
        ({payload: action.payload, buildingId: buildingId, versionId: versionId})),
    switchMap(({payload, buildingId, versionId}) => {
      this.store$.dispatch(new nodeAction.UnitPopupFilter(payload.filterData));

      return this.nodeService.getRegistersByNodes(buildingId, versionId, payload.filterData);
    }),
    map((response: SearchFilterUnitsModel[]) => {
      return new nodeAction.ToggleUnitPopupSuccess(response);
    }),
    catchError(() => {
      return of({type: 'DUMMY'});
    })
  ));
  modalOpen = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.MODAL_POPUP),
    tap((action: nodeAction.ModalPopup) => {
      this.modalService.open(DialogAddUnitComponent, {
        backdrop: 'static',
        windowClass: 'add-unit-popup'
      });
    }),
    catchError(() => {
      return of({type: 'DUMMY'});
    })
  ), {dispatch:false});
  createNode = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.API_REQUEST_CREATE_NODE),
    withLatestFrom(this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId))
    ),
    mergeMap(([action, buildingId, versionId]: [nodeAction.ApiRequestCreateNode, string, string]) => {
      const versionModel = {...action.payload};
      versionModel.id = versionId;
      versionModel.entity.buildingId = buildingId;
      return this.nodeService.createNode(buildingId, versionModel);
    }),
    switchMap(result => {
      const versionDate = result.current.versionDate;
      this.versionUpdateService.showVersionUpdateResults(result.next);
      return [
        new nodeAction.ApiRequestCreateNodeSuccess({nodeId: result.entity, versionDate: versionDate}),
        new commonDataActions.HistoryChange(result.current.id),
        new commonDataActions.GetHistoryWithVersionId(result.current.id)
      ];
    }),
    catchError(() => {
      return of({type: 'DUMMY'});
    })
  ));
  nodeCreated = createEffect(() => this.actions$.pipe(
    ofType(nodeAction.API_REQUEST_CREATE_NODE_SUCCESS),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      (a: nodeAction.ApiRequestCreateNodeSuccess, buildingId) => ({node: a.payload, buildingId})),
    switchMap(({node, buildingId}) => {
      const nodeId = node.nodeId;
      const versionDate = node.versionDate;
      let url = this.router.url;
      if (versionDate) {
        url = url.replace(/version\/[0-9]{8}\//, 'version/' + versionDayKey(versionDate) + '/');
      }
      url = url.replace(/nodes\/new/, 'nodes/' + nodeId);
      return of(new commonDataActions.SetNavigationUrl(url));
    })
  ));

  constructor(private actions$: Actions, private store$: Store<fromNode.State>,
              private nodeService: NodeService,
              private meterService: MeterService,
              private router: Router,
              private modalService: NgbModal,
              private versionUpdateService: ApplyResultService,
              private costTariffSettingsService: CostTariffSettingsService,
              private authService: AuthService
  ) {
  }

  sendNodeRequest(action: any, model: NodeEditViewModel, versionId: string, isDocumentComplete: boolean) {

    const actionType = isDocumentComplete ? action.actionType : VersionActionType.Init;
    const version: VersionViewModel<NodeEditViewModel> = new VersionViewModel(model, action.comment,
      actionType, action.date, versionId);

    return this.nodeService.updateNode(model.buildingId, version).pipe(
      map(r => {
        return {status: true, payload: r, nodeId: model.id};
      }),
      catchError(() => {
        return of({status: false, payload: null, nodeId: model.id});
      })
    );
  }

  getGroupedTariffs(tariffs: VersionViewModel<TariffViewModel>[], allocatedTariffs: AllocatedTariffDetailViewModel[]) {
    const groupedTariffsDictionary = {};
    const groupedTariffs = [];

    tariffs.forEach(item => {
      if (!allocatedTariffs.find(t => t.id == item.id)) {
        if (groupedTariffsDictionary[item.entity.id]) {
          groupedTariffsDictionary[item.entity.id].push(item);
        } else {
          groupedTariffsDictionary[item.entity.id] = [item];
        }
      }
    });

    for (const key in groupedTariffsDictionary) {
      const groupedTariff = new GroupedTariffViewModel();
      groupedTariff.versions = groupedTariffsDictionary[key];
      groupedTariffs.push(groupedTariff);
    }

    return groupedTariffs;
  }

  getSuppliers(tariffs: VersionViewModel<TariffViewModel>[]) {
    const suppliersDictionary = {};
    const suppliers = [];

    tariffs.forEach(item => {
      if (!suppliersDictionary[item.entity.supplierId]) {
        suppliersDictionary[item.entity.supplierId] = {
          id: item.entity.supplierId,
          name: item.entity.supplier.name
        };
      }
    });

    for (const key in suppliersDictionary) {
      suppliers.push(suppliersDictionary[key]);
    }

    return suppliers;
  }

  private GetRegisterFormValues(allocated: AllocatedNodeDetailViewModel): RegisterFormValue[] {
    return allocated.registers.map(r => {
      const allocatedRegister = allocated.allocatedRegisters.find(ar => ar.registerId === r.registerId);
      return <RegisterFormValue>{
        registerId: r.registerId,
        calculationFactor: allocatedRegister ? allocatedRegister.calculationFactor : 1,
        timeOfUse: r.timeOfUse,
        unitOfMeasurement: r.unitOfMeasurement,
        isRemoved: allocatedRegister === undefined,
        isBilling: r.useForBilling
      };
    });
  }

  private isCategoryRecommended(recommendedTariffs: any[], tariffId: string, categoryId: string): boolean {

    if (!categoryId) {
      return true;
    }

    if (!recommendedTariffs) {
      return false;
    }

    const recommendedForTariff = recommendedTariffs.find(t => t.tariffVerionId === tariffId);
    if (!recommendedForTariff || !recommendedForTariff.applicableLineItemsCategories.length) {
      return false;
    }

    return recommendedForTariff.applicableLineItemsCategories.some(c => c === categoryId);
  }

  private getLineItemCategoryId(categoryId: string, lineItemCategories: any[]): string {
    if (categoryId) {
      return categoryId;
    }

    if (lineItemCategories.length && lineItemCategories[0].id) {
      return lineItemCategories[0].id;
    }

    return null;
  }
}
