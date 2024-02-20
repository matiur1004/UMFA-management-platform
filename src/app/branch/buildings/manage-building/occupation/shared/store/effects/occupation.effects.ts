import {Injectable} from '@angular/core';
import {Action, select, Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError, map, mergeMap, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {Router} from '@angular/router';

import {OccupationService, TenantService} from '@services';
import * as fromOccupation from '../reducers';
import * as occupationAction from '../actions/occupation.actions';
import * as buildingStepWizardAction from '../actions/building-step-wizard.actions';
import * as buildingAllocatedTariffsAction from '../../../../tariffs/store/actions/add-new-tariff-building.actions';
import * as allocatedTariffsAction from '../../../../tariffs/store/actions/allocated-tariffs.actions';

import {RelationshipDataCalculation} from '../../input-relationship-calc';
import {
  CommonAreaLiabilityViewModel,
  CommonAreaViewModel,
  Dictionary,
  LiabilityViewModel,
  OccupationViewModel,
  ShopLiabilityViewModel,
  ShopViewModel,
  SplitType,
  SupplyType,
  TenantViewModel,
  UpdateCommonAreaViewModel,
  VersionActionType,
  VersionResultViewModel,
  VersionViewModel
} from '@models';
import {ApplyResultModel, CommonAreaShopRelationsItemViewModel, CommonAreaShopRelationsViewModel} from '../../models';
import {OccupetionStoreEx} from '../reducers/occupation.store.ex';
import {ShopHelper} from '../../helpers/shop.helper';
import {State} from '../reducers/occupation.store';
import {ApplyResultService} from 'app/popups/apply-result-popup/apply-result.service';
import * as commonData from '../../../../shared/store/state/common-data.state';
import * as commonDataActions from '../../../../shared/store/actions/common-data.action';
import * as fromCommonData from '../../../../shared/store/selectors/common-data.selectors';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonAreaRelationsComponent} from '../../../occupation-view/dialogs/common-area-relations/common-area-relations.component';

@Injectable()
export class OccupationEffects {

  removeCommonArea = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.REMOVE_COMMON_AREA),
    withLatestFrom(this.commonDataStore$.pipe(select(fromCommonData.getSelectedVersionId)),
      this.commonDataStore$.pipe(select(fromCommonData.getBuildingId)),
      (action: any, versionId, buildingId) => ({
        commonAreaId: action.payload,
        versionId,
        buildingId
      })),
    mergeMap(({commonAreaId, versionId, buildingId}):Observable<any> => {
      return this.occupatService.getCommonAreaRelations(buildingId, commonAreaId, versionId)
        .pipe(mergeMap((relations) => {

          if (relations && Object.keys(relations).length) {

            const modalRef = this.modalService.open(CommonAreaRelationsComponent, {
              backdrop: 'static',
              size: 'sm'
            });

            modalRef.componentInstance.relatedObjectNames = relations;
            modalRef.result.then(() => this.store$
              .dispatch(new occupationAction.DeleteCommonArea(commonAreaId)), () => {
            });

          } else {
            this.store$.dispatch(new occupationAction.DeleteCommonArea(commonAreaId));
            return EMPTY;
          }

          return EMPTY;
        }));
    })
  ));
  setTenants$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.SET_TENANTS),
    withLatestFrom(this.store$.select(fromOccupation.getOccupationState), (action, state) => {

      return {
        action: action,
        stateData: state
      };
    }),
    mergeMap((params) => {
      const state = params.stateData;

      return this.tenantService.getAll(state.buildingId).pipe(
        map(data => ({
          type: occupationAction.GET_TENANTS,
          payload: data.items
        })),
        catchError(() => of({
          type: 'TENANTS_ERROR'
        }))
      );
    })
  ));
  requestGetShopHistory$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.REQUEST_GET_SHOP_HISTORY),
    withLatestFrom(this.store$.select(fromOccupation.getOccupationState), (action, state) => {

      return {
        action: action,
        stateData: state
      };
    }),
    mergeMap((params: any) => {
      const state = params.stateData;
      const shopId = params.action.payload;

      return this.occupatService.getShopHistory(state.buildingId, shopId).pipe(
        map(data => ({
          type: occupationAction.REQUEST_GET_SHOP_HISTORY_COMPLETE,
          payload: {
            history: data,
            shopId: shopId
          }
        })),
        catchError(() => of({
          type: 'HISTORY_ERROR'
        }))
      );
    })
  ));
  setShops$ = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.SET_SHOPS),
    withLatestFrom(
      this.store$.select(fromOccupation.getOccupationState),
      this.store$.select(fromOccupation.getBuildingStepWizardLocations),
      (_, state, locations) => {

        return {
          action: {
            action: VersionActionType.Init,
            comment: '',
            startDate: null
          },
          state: state,
          locations: locations
        };
      }),
    mergeMap((params: any) => {
      return this.saveOccupation(params);
    })
  ));
  saveOccupation$ = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.SAVE_OCCUPATION),
    withLatestFrom(
      this.store$.select(fromOccupation.getOccupationState),
      this.store$.select(fromOccupation.getBuildingStepWizardLocations),
      (action: any, state, locations) => {
        return {
          action: action.payload,
          state: state,
          locations: locations
        };
      }),
    switchMap((params: any) => {
      return this.saveOccupation(params);
    })
  ));
  updateOccupation$ = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.UPDATE_OCCUPATION),
    withLatestFrom(
      this.store$.select(fromOccupation.getOccupationState),
      this.store$.select(fromOccupation.getBuildingStepWizardLocations),
      (action: any, state, locations) => {
        return {
          action: action.payload,
          state: state,
          locations: locations
        };
      }),
    switchMap((params: any) => {
      return this.saveOccupation(params);
    })
  ));
  addTenant$ = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.ADD_TENANT),
    withLatestFrom(
      this.commonDataStore$.pipe(select(fromCommonData.getBuildingId)),
      (action: occupationAction.AddTenant, buildingId: string) => {
        return {
          payload: action.payload,
          buildingId
        };
      }),
    switchMap(({payload, buildingId}) => {
      return this.tenantService.create(buildingId, payload).pipe(
        map((tenant: TenantViewModel) => new occupationAction.AddTenantSuccess(tenant))
      );
    })
  ));
  updateCommonAreas$ = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.SAVE_COMMON_AREA),
    withLatestFrom(
      this.store$.pipe(select(fromOccupation.getCommonAreas)),
      this.store$.pipe(select(fromOccupation.getCommonAreaLiabilities)),
      this.commonDataStore$.pipe(select(fromCommonData.getSelectedVersionId)),
      this.commonDataStore$.pipe(select(fromCommonData.getBuildingId)),
      (action: any, commonAreas, commonAreaLiabilities, versionId, buildingId) => {
        return {
          action: action.payload,
          updateModel: {
            commonAreas: commonAreas,
            commonAreaLiabilities: commonAreaLiabilities
          },
          versionId,
          buildingId
        };
      }),
    switchMap((params: {
      action: {
        action: VersionActionType,
        comment: string,
        startDate: Date | null
      }, updateModel: UpdateCommonAreaViewModel, versionId: string, buildingId: string
    }) => {
      const versionModel = new VersionViewModel<UpdateCommonAreaViewModel>(params.updateModel,
        params.action.comment, params.action.action, params.action.startDate, params.versionId);

      return this.occupatService.updateCommonAreas(params.buildingId, versionModel).pipe(
        mergeMap((data: VersionResultViewModel) => {

          if (params.action.action === VersionActionType.Apply) {
            this.applyVersionResultsService.showVersionUpdateResults(data.next);
          }

          return [
            new commonDataActions.UpdateUrlVersionAction(data.current.versionDate),
            new commonDataActions.GetHistoryWithVersionId(data.current.id)
          ];
        }),
        catchError(() => {
          const error: Action = {type: '[OCCUPATION] OCCUPATION_UPDATE_ERROR'};
          return of(error);
        })
      );
    })
  ));
  updateShops$ = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.SAVE_SHOPS),
    withLatestFrom(
      this.store$.pipe(select(fromOccupation.getShops)),
      this.commonDataStore$.pipe(select(fromCommonData.getSelectedVersionId)),
      this.commonDataStore$.pipe(select(fromCommonData.getBuildingId)),
      (action: any, shops, versionId, buildingId) => {
        return {
          action: action.payload,
          shops,
          versionId,
          buildingId
        };
      }),
    switchMap((params: {
      action: {
        action: VersionActionType,
        comment: string,
        startDate: Date | null
      }, shops: ShopViewModel[], versionId: string, buildingId: string
    }) => {
      const versionModel = new VersionViewModel<ShopViewModel[]>(params.shops,
        params.action.comment, params.action.action, params.action.startDate, params.versionId);

      return this.occupatService.updateShops(params.buildingId, versionModel).pipe(
        mergeMap((data: VersionResultViewModel) => {

          if (params.action.action === VersionActionType.Apply) {
            this.applyVersionResultsService.showVersionUpdateResults(data.next);
          }

          return [
            new commonDataActions.UpdateUrlVersionAction(data.current.versionDate),
            new commonDataActions.GetHistoryWithVersionId(data.current.id)
          ];
        }),
        catchError(() => {
          const error: Action = {type: '[OCCUPATION] OCCUPATION_UPDATE_ERROR'};
          return of(error);
        })
      );
    })
  ));
  getOccupationComplete: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.GET_OCCUPATION),
    withLatestFrom(this.store$.select(fromOccupation.getOccupationState), (action: any) => {
      return {
        payload: action.payload
      };
    }),
    mergeMap((action: any) => {

      const response: VersionResultViewModel = action.payload;

      const shops: Dictionary<ShopViewModel> = {};
      const shopIds = new Array<string>();
      const commonAreas: Dictionary<CommonAreaViewModel> = {};
      const commonAreaIds = new Array<string>();

      const commonAreaShopRelations: Dictionary<Dictionary<CommonAreaShopRelationsViewModel>> = {};

      response.entity.shops.forEach(shop => {
        shopIds.push(shop.id);
        shops[shop.id] = shop;
      });

      response.entity.commonAreas.forEach(ca => {
        commonAreaIds.push(ca.id);
        commonAreas[ca.id] = ca;
        commonAreaShopRelations[ca.id] = {};

        response.entity.shops.forEach(shop => {
          const relation = new CommonAreaShopRelationsViewModel();

          let isSelected = false;

          const commonAreaLiability = response.entity.commonAreaLiabilities.find(l => l.commonAreaId == ca.id);
          if (commonAreaLiability && commonAreaLiability.liabilities.length > 0) {

            commonAreaLiability.liabilities.forEach((liability) => {

              const shopLiability = liability.shopLiabilities.find(sl => sl.shopId == shop.id);
              if (shopLiability) {
                isSelected = true;

                const l = new CommonAreaShopRelationsItemViewModel();
                l.isLiable = shopLiability.isLiable;
                l.allocation = liability.splitType == SplitType.Custom ? shopLiability.allocation : shops[shopLiability.shopId].area;
                l.proportion = null;
                l.serviceType = liability.serviceType;

                relation.liabilities.push(l);
              }
            });
          }

          relation.commmonAreaId = ca.id;
          relation.shopId = shop.id;
          relation.isSelected = isSelected;

          commonAreaShopRelations[ca.id][shop.id] = relation;
        });
      });

      let selectedCommonAreaLiabilityServiceType = 0;

      if (response.entity.commonAreas.length) {
        const services = response.entity.commonAreas[0].services;
        if (services.isElectricityEnable) {
          selectedCommonAreaLiabilityServiceType = SupplyType.Electricity;
        } else if (services.isWaterEnable) {
          selectedCommonAreaLiabilityServiceType = SupplyType.Water;
        } else if (services.isSewerageEnable) {
          selectedCommonAreaLiabilityServiceType = SupplyType.Sewerage;
        } else if (services.isGasEnable) {
          selectedCommonAreaLiabilityServiceType = SupplyType.Gas;
        } else if (services.isOtherEnable) {
          selectedCommonAreaLiabilityServiceType = SupplyType.AdHoc;
        }
      }

      const result = {
        buildingId: response.entity.buildingId,
        isComplete: response.entity.isComplete,
        shopIds: shopIds,
        shops: shops,
        commonAreaIds: commonAreaIds,
        commonAreas: commonAreas,
        commonAreaShopRelations: commonAreaShopRelations,
        commonAreaLiabilities: response.entity.commonAreaLiabilities,
        selectedCommonAreaLiabilityServiceType: selectedCommonAreaLiabilityServiceType,
        versionId: response.current.id,
        comment: response.current.comment,
        buildingPeriod: response.entity.buildingPeriod
      };

      buildingStepWizardAction;

      return [
        new occupationAction.GetOccupationComplete(result),
        new buildingStepWizardAction.SetLocationsList(response.entity.locations)
      ];
    })
  ));
  recalcAllProportions = createEffect(() => this.actions$.pipe(
    ofType(
      occupationAction.RECALC_ALL_PROPORTION_REQUEST,
      occupationAction.GET_OCCUPATION_COMPLETE,
      occupationAction.ADD_ALL_COMMON_AREA_SHOP_BY_SHOP,
      occupationAction.DELETE_ALL_COMMON_AREA_SHOP_BY_SHOP
    ),
    withLatestFrom(this.store$.select(fromOccupation.getOccupationState), (_, state) => {
      return state;
    }),
    mergeMap((state) => {

      if (!state.isComplete) {
        return of({type: occupationAction.DUMMY_ACTION});
      }
      const relationData = JSON.parse(JSON.stringify(state.commonAreaShopRelations));

      state.commonAreaIds.forEach(caId => {
        const commonAreaData = relationData[caId];

        let calcParams = state.commonAreaLiabilities.find(cal => cal.commonAreaId == caId);
        if (!calcParams) {
          calcParams = new CommonAreaLiabilityViewModel();
          calcParams.liabilities = OccupetionStoreEx.initLiabilities(state.commonAreas[caId].services);
        }

        const shopProporions = new Array<CommonAreaShopRelationsViewModel>();

        state.shopIds.forEach(shopId => {
          const shopData: CommonAreaShopRelationsViewModel = commonAreaData[shopId];
          if (shopData.isSelected) {
            const shop = state.shops[shopId];
            if (!shop.isSpare) {

              if (shopData.liabilities.length != calcParams.liabilities.length) {
                calcParams.liabilities.forEach(l => {
                  let sopLiability = shopData.liabilities.find(sl => sl.serviceType == l.serviceType);
                  if (!sopLiability) {
                    sopLiability = new CommonAreaShopRelationsItemViewModel();
                    sopLiability.serviceType = l.serviceType;
                    sopLiability.isLiable = true;
                    sopLiability.allocation = shop.area;

                    shopData.liabilities.push(sopLiability);
                  }
                });

              }

              shopData.liabilities.forEach(sl => {
                sl.status = ShopHelper.getLiabilityStatusForRelation(sl.isLiable, shop);
              });

              shopProporions.push(shopData);
            }
          }
        });

        calcParams.liabilities.forEach((liability) => {
          RelationshipDataCalculation.evaluateLiabilityForRelations(liability, shopProporions, liability.serviceType, state.shops);
        });
      });

      return of(new occupationAction.FullRecalcProportionsComplete({commonAreaShopRelations: relationData}));
    })
  ));
  recalcCommonAreaGroupProportions = createEffect(() => this.actions$.pipe(
    ofType(
      occupationAction.UPDATE_COMMON_SERVICE_LIABILITY,
      occupationAction.ADD_ALL_COMMON_AREA_SHOP_BY_COMMON_AREA,
      occupationAction.DELETE_ALL_COMMON_AREA_SHOP_BY_COMMON_AREA,
      occupationAction.ADD_COMMON_AREA_SHOP,
      occupationAction.DELETE_COMMON_AREA_SHOP,
      occupationAction.UPDATE_SHOP_ALLOCATION_BY_SERVICE,
      occupationAction.UPDATE_SHOP_LIABLE_BY_SERVICE
    ),
    withLatestFrom(this.store$.select(fromOccupation.getOccupationState), (action: any, state) => {
      return {
        ...action.payload,
        state: state
      };
    }),
    mergeMap((params: {
        state: State,
        commonAreaId: string,
        serviceType: number | null

      }) => {

        const state = params.state;

        const relationData = state.commonAreaShopRelations;
        const commonAreaData = JSON.parse(JSON.stringify(relationData[params.commonAreaId]));

        let calcParams = state.commonAreaLiabilities.find(cal => cal.commonAreaId == params.commonAreaId);
        if (!calcParams) {
          calcParams = new CommonAreaLiabilityViewModel();
          calcParams.liabilities = OccupetionStoreEx.initLiabilities(state.commonAreas[params.commonAreaId].services);
        } else if (params.serviceType != null) {
          const isDefault = calcParams.liabilities.find(l => l.serviceType == params.serviceType).defaultSettings;
          if (isDefault) {
            params.serviceType = null;
          }
        }

        const shopProporions = new Array<CommonAreaShopRelationsViewModel>();

        state.shopIds.forEach(shopId => {
          const shopData: CommonAreaShopRelationsViewModel = commonAreaData[shopId];
          if (shopData.isSelected) {
            const shop = state.shops[shopId];
            if (!shop.isSpare) {
              shopData.liabilities.forEach(sl => {
                sl.status = ShopHelper.getLiabilityStatusForRelation(sl.isLiable, shop);
              });

              shopProporions.push(shopData);
            }
          }
        });

        if (params.serviceType == null) {
          calcParams.liabilities.forEach((liability, idx) => {
            RelationshipDataCalculation.evaluateLiabilityForRelations(liability, shopProporions, liability.serviceType, state.shops);
          });
        } else {
          const liability = calcParams.liabilities.find(l => l.serviceType == params.serviceType);
          if (liability) {
            RelationshipDataCalculation.evaluateLiabilityForRelations(liability, shopProporions, params.serviceType, state.shops);
          }
        }

        const result = {};
        result[params.commonAreaId] = commonAreaData;

        return of(new occupationAction.RecalcCommonAreaGroupComplete(result));
      }
    )));
  occupationCancelPress = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.OCCUPATION_CANCEL_PRESS),
    withLatestFrom(this.store$.select(fromOccupation.getOccupationState), (action, state) => {
      return state;
    }),
    tap((state) => {
      if (state.canEdit) {
        this.router.navigate(['/buildings']);
      } else {
        this.router.navigate(['/buildings', state.buildingId, 'occupation']);
      }
    })
  ), {dispatch: false});
  getHistories = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.GET_HISTORY_REQUEST, occupationAction.GET_OCCUPATION_COMPLETE),
    withLatestFrom(this.store$.select(fromOccupation.getOccupationState), (action: any, state) => {
      return {
        buildingId: action.payload.buildingId || action.payload.entity.buildingId,
        isComplete: state.isComplete
      };
    }),
    mergeMap((params: any) => {
        if (!params.isComplete) {
          return of({type: occupationAction.DUMMY_ACTION});
        }

        return this.occupatService.getLog(params.buildingId).pipe(map((data) => {
          return new occupationAction.GetHistoryRequestComplete(data);
        }));
      }
    )));
  historyChange = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.HISTORY_CHANGE),
    withLatestFrom(this.store$.select(fromOccupation.getOccupationState), (action: any, state) => {
      return {
        versionId: action.payload,
        buildingId: state.buildingId
      };
    }),
    mergeMap((params: any) => {

        return this.occupatService.get(params.buildingId, params.versionId).pipe(map(data => {
          return new occupationAction.Get(data);
        }));
      }
    )));
  updateCommonAreaServices = createEffect(() => this.actions$.pipe(
    ofType(occupationAction.INIT_LIABILITIES_BY_COMMON_AREA_SERVICES),
    withLatestFrom(this.store$.select(fromOccupation.getOccupationState), (_, state) => {
      return state;
    }),
    mergeMap((state: State) => {
      const updatedLiabilities: any = [];
      const commonAreaLiabilities = JSON.parse(JSON.stringify(state.commonAreaLiabilities));

      state.commonAreaIds.forEach(caId => {
        const commonArea = state.commonAreas[caId];
        let commonAreaLiability = commonAreaLiabilities.find(cal => cal.commonAreaId == caId);

        if (commonAreaLiability) {
          commonAreaLiability.liabilities = commonAreaLiability.liabilities.filter(l =>
            commonArea.services.isElectricityEnable && l.serviceType == SupplyType.Electricity ||
            commonArea.services.isWaterEnable && l.serviceType == SupplyType.Water ||
            commonArea.services.isSewerageEnable && l.serviceType == SupplyType.Sewerage ||
            commonArea.services.isGasEnable && l.serviceType == SupplyType.Gas ||
            commonArea.services.isOtherEnable && l.serviceType == SupplyType.AdHoc
          );
        }

        const liabilities = new Array<LiabilityViewModel>();
        if (commonArea.services.isElectricityEnable) {
          const shouldAdd = !commonAreaLiability || !commonAreaLiability.liabilities.find(l => l.serviceType == SupplyType.Electricity);
          if (shouldAdd) {
            const liability = new LiabilityViewModel();
            liability.serviceType = SupplyType.Electricity;
            liability.splitType = SplitType.Proportional;
            liabilities.push(liability);
          }
        }
        if (commonArea.services.isWaterEnable) {
          const shouldAdd = !commonAreaLiability || !commonAreaLiability.liabilities.find(l => l.serviceType == SupplyType.Water);
          if (shouldAdd) {
            const liability = new LiabilityViewModel();
            liability.serviceType = SupplyType.Water;
            liability.splitType = SplitType.Proportional;
            liabilities.push(liability);
          }
        }
        if (commonArea.services.isSewerageEnable) {
          const shouldAdd = !commonAreaLiability || !commonAreaLiability.liabilities.find(l => l.serviceType == SupplyType.Sewerage);
          if (shouldAdd) {
            const liability = new LiabilityViewModel();
            liability.serviceType = SupplyType.Sewerage;
            liability.splitType = SplitType.Proportional;
            liabilities.push(liability);
          }
        }
        if (commonArea.services.isGasEnable) {
          const shouldAdd = !commonAreaLiability || !commonAreaLiability.liabilities.find(l => l.serviceType == SupplyType.Gas);
          if (shouldAdd) {
            const liability = new LiabilityViewModel();
            liability.serviceType = SupplyType.Gas;
            liability.splitType = SplitType.Proportional;
            liabilities.push(liability);
          }
        }
        if (commonArea.services.isOtherEnable) {
          const shouldAdd = !commonAreaLiability || !commonAreaLiability.liabilities.find(l => l.serviceType == SupplyType.AdHoc);
          if (shouldAdd) {
            const liability = new LiabilityViewModel();
            liability.serviceType = SupplyType.AdHoc;
            liability.splitType = SplitType.Proportional;
            liabilities.push(liability);
          }
        }

        if (commonAreaLiability) {
          commonAreaLiability.liabilities = commonAreaLiability.liabilities.concat(liabilities);
        } else {
          commonAreaLiability = new CommonAreaLiabilityViewModel();
          commonAreaLiability.commonAreaId = caId;
          commonAreaLiability.liabilities = liabilities;
        }

        updatedLiabilities.push(commonAreaLiability);
      });

      const relations = JSON.parse(JSON.stringify(state.commonAreaShopRelations));
      state.commonAreaIds.forEach(caId => {

        if (!relations[caId]) {
          relations[caId] = {};

          state.shopIds.forEach(shopId => {
            const relation = new CommonAreaShopRelationsViewModel();
            relation.commmonAreaId = caId;
            relation.shopId = shopId;
            relation.isSelected = false;

            relation.liabilities = OccupetionStoreEx.initRelations(state.commonAreas[caId].services, state.shops[shopId].area);

            relations[caId][shopId] = relation;
          });
        }
      });

      const result = {
        liabilities: updatedLiabilities,
        relations: relations
      };

      return of(new occupationAction.InitLiabilitiesByCommonAreaServicesComplete(result));
    })
  ));
  buildingVersionChange = createEffect(() => this.actions$.pipe(
    ofType(buildingAllocatedTariffsAction.ADD_NEW_TARIFF_BUILDING_SUCCESS,
      allocatedTariffsAction.DELETE_ALLOCATED_BUILDING_TARIFF_SUCCESS),
    withLatestFrom((action: any) => {
      return {
        versionId: action.payload.current.id
      };
    }),
    map((params: any) => {
      return new occupationAction.VersionChangeResult(params.versionId);
    })
  ));

  constructor(
    private actions$: Actions,
    private occupatService: OccupationService,
    private tenantService: TenantService,
    private store$: Store<fromOccupation.State>,
    private router: Router,
    private applyVersionResultsService: ApplyResultService,
    private commonDataStore$: Store<commonData.State>,
    private modalService: NgbModal
  ) {
  }

  saveOccupation(params: {
    action: {
      action: VersionActionType,
      comment: string,
      startDate: Date | null
    },
    state: any,
    locations: any[]
  }) {
    const state = params.state;
    const action = params.action;
    const actionType = (params.action.action === VersionActionType.Init && state.isComplete)
      ? VersionActionType.Init
      : params.action.action;

    const model = new OccupationViewModel();
    model.buildingId = state.buildingId;
    model.shops = state.shopIds.map(id => state.shops[id]);
    model.commonAreas = state.commonAreaIds.map(id => state.commonAreas[id]);
    model.commonAreaLiabilities = new Array<CommonAreaLiabilityViewModel>();
    model.locations = params.locations;
    model.buildingPeriod = state.buildingPeriod;

    state.commonAreaIds.forEach(commonAreaId => {
      let cal: CommonAreaLiabilityViewModel = null;
      const commonArea: CommonAreaViewModel = state.commonAreas[commonAreaId];
      let srcCommonAreaLiabilit: any = null;

      if (commonArea.isActive) {
        srcCommonAreaLiabilit = state.commonAreaLiabilities.find(src => src.commonAreaId == commonAreaId);

        state.shopIds.forEach(shopId => {
          const relation = state.commonAreaShopRelations[commonAreaId][shopId] as CommonAreaShopRelationsViewModel;
          if (relation && relation.isSelected) {

            if (!cal) {
              cal = new CommonAreaLiabilityViewModel();
              cal.commonAreaId = commonAreaId;
              cal.commonArea = state.commonAreas[commonAreaId];
              cal.liabilities = OccupetionStoreEx.initLiabilities(state.commonAreas[commonAreaId].services);
              if (srcCommonAreaLiabilit) {
                cal.liabilities.forEach(l => {
                  const srcLiabilit = srcCommonAreaLiabilit.liabilities.find(src => src.serviceType == l.serviceType);
                  if (srcLiabilit) {
                    l.splitType = srcLiabilit.splitType;
                    l.includeNotLiableShops = srcLiabilit.includeNotLiableShops;
                    l.includeVacantShopSqM = srcLiabilit.includeVacantShopSqM;
                    l.ownerLiable = srcLiabilit.ownerLiable;
                    l.defaultSettings = srcLiabilit.defaultSettings;
                  }
                });
              }
            }

            cal.liabilities.forEach((liability, idx) => {
              const shopLiability = new ShopLiabilityViewModel();
              shopLiability.shopId = shopId;

              if (relation.liabilities[idx]) {
                shopLiability.allocation = relation.liabilities[idx].allocation;
                shopLiability.isLiable = relation.liabilities[idx].isLiable;
              } else {
                shopLiability.allocation = state.shops[shopId].area;
                shopLiability.isLiable = false;
              }
              liability.shopLiabilities.push(shopLiability);
            });
          }
        });
      }

      if (cal) {
        model.commonAreaLiabilities.push(cal);

      } else if (srcCommonAreaLiabilit) {
        const commonAreaLiability = new CommonAreaLiabilityViewModel();
        commonAreaLiability.commonAreaId = srcCommonAreaLiabilit.commonAreaId;
        commonAreaLiability.liabilities = srcCommonAreaLiabilit.liabilities.map(l => {
          const liability = Object.assign({}, l);
          liability.shopLiabilities = [];

          return liability;
        });

        model.commonAreaLiabilities.push(commonAreaLiability);
      }
    });

    const versionModel = new VersionViewModel<OccupationViewModel>(model, action.comment, actionType, action.startDate, state.versionId);

    return this.occupatService.update(model.buildingId, versionModel).pipe(
      mergeMap((data: VersionResultViewModel) => {

        if (actionType === VersionActionType.Apply) {
          this.applyVersionResultsService.showVersionUpdateResults(data.next);
        }

        return [
          new commonDataActions.UpdateUrlVersionAction(data.current.versionDate),
          new commonDataActions.GetHistoryWithVersionId(data.current.id),
          new commonDataActions.GetActiveBuildingPeriod({buildingId: data.entity.buildingId}),
          new occupationAction.Get(data)
        ];
      }),
      catchError(() => {
        const error: Action = {type: '[OCCUPATION] OCCUPATION_UPDATE_ERROR'};
        return of(error);
      })
    );
  }

  getApplyResultList(data: VersionResultViewModel): ApplyResultModel[] {
    const result = new Array<ApplyResultModel>();

    let version = new ApplyResultModel();
    version.id = data.current.id;
    version.comment = data.current.comment;
    version.startDate = data.current.versionDate;
    version.status = data.current.status;

    result.push(version);

    if (data.next) {
      data.next.forEach(v => {

        version = new ApplyResultModel();
        version.id = v.id;
        version.comment = v.comment;
        version.startDate = v.versionDate;
        version.status = v.status;

        result.push(version);
      });
    }

    return result;
  }
}
