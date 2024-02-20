import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {EquipmentService} from '@services';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, debounceTime, flatMap, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {BuildingServicesService} from '../../../../../building-services/shared/building-services.service';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';

import {BuildingEquipmentTemplateService} from '../../building-equipment-template.service';
import {BuildingEquipTemplateFilterViewModel} from '../../models';

import * as equipmentTemplateAction from '../actions/building-equip-template.action';
import * as fromEquipmentTemplate from '../reducers';

@Injectable()
export class BuildingEquipmentTemplateEffects {

  // Get equipment templates
  getEquipmentTemplateRequest: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentTemplateAction.REQUEST_EQUIPMENT_TEMPLATE_LIST),
    withLatestFrom(this.store$.select(fromEquipmentTemplate.getEquipmentTemplateState), this.store$.pipe(select((commonData.getBuildingId))), (_, equipmentTemplateState, buildingId) => {
      return {
        state: equipmentTemplateState,
        buildingId: buildingId
      };
    }),
    flatMap((action) => {
        const filterDetail = action.state.filterDetail;

        const filterModel = new BuildingEquipTemplateFilterViewModel();
        filterModel.attributes = filterDetail.equipmentAttributes;
        filterModel.brandId = filterDetail.checkedBrand != null ? filterDetail.checkedBrand.id : null;
        filterModel.equipmentGroupId = filterDetail.checkedEquipmentGroup != null ? filterDetail.checkedEquipmentGroup.id : null;
        filterModel.isOldModel = filterDetail.isOldModel;
        filterModel.supplyTypes = filterDetail.supplyTypes.filter(s => s.isChecked === true).map(s => s.supplyType);
        filterModel.equipmentModel = filterDetail.checkedModel;

        const state = action.state;
        const assignFilterValue = action.state.assignFilter;
        const itemsOffset = state.page * state.unitsPerPage - state.unitsPerPage;
        return this.buildingEquipmentTemplateService.getAllEquipmentTemplates(action.buildingId, filterModel, state.order,
          assignFilterValue, state.searchKey, itemsOffset, state.unitsPerPage)
          .pipe(
            map(r => new equipmentTemplateAction.RequestEquipmentTemplateListComplete(r)),
            catchError(r => {
              return of({type: 'DUMMY'});
            })
          );
      }
    )
  ));
  // Update supply type, all supply types, equipment group, brand, model, attribute
  updateSupplyType: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentTemplateAction.UPDATE_SUPPLY_TYPE, equipmentTemplateAction.UPDATE_BRAND, equipmentTemplateAction.UPDATE_EQUIPMENT_GROUP,
      equipmentTemplateAction.UPDATE_ALL_SUPPLY_TYPES, equipmentTemplateAction.UPDATE_MODEL),
    withLatestFrom((action: any) => {
      return {
        payload: action.payload
      };
    }),
    map((action) => {
      return new equipmentTemplateAction.UpdateFilter();
    })
  ));
  // Reset filter
  resetFilter: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentTemplateAction.RESET_FILTER),
    switchMap((_) => {
      return of(new equipmentTemplateAction.UpdateFilter());
    })
  ));
  //Init filter detail
  initFilterDetail: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentTemplateAction.INIT_FILTER_DATA_COMPLETE),
    withLatestFrom(this.store$.select(commonData.getBuildingId), (action: any, buildingId) => {
      return {
        payload: action.payload,
        buildingId: buildingId
      };
    }),
    switchMap((action) => {
      return this.buildingServicesService.getStatus(action.buildingId).pipe(
        map(r => {
          return r;
        }),
        mergeMap(r => {
          if (r) {
            return this.buildingServicesService.getApplied(action.buildingId).pipe(
              map(r => new equipmentTemplateAction.InitFilterDetail(r))
            );
          } else {
            return of(new equipmentTemplateAction.InitFilterDetail(null));
          }
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    }),
    switchMap(action => {
      if (action.type !== 'DUMMY') {
        return [
          action,
          new equipmentTemplateAction.UpdateFilter(),
          new equipmentTemplateAction.RequestEquipmentTemplateList()
        ];
      } else {
        return [action];
      }
    })
  ));
  // Init equipment templates filter data
  initEquipmentFilterData: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentTemplateAction.INIT_FILTER_DATA),
    withLatestFrom((action: any, buildingId) => {
      return {
        payload: action.payload,
        buildingId: buildingId
      };
    }),
    switchMap((action) => {
      const equipmentGroups = this.equipmentService.getAllEquipmentGroups('');
      const brands = this.equipmentService.getAllBrands('');
      const equipmentAttributes = this.equipmentService.getAllEquipmentAttributes('');
      const equipmentTemplateAttributes = this.equipmentService.getAllEquipmentTemplateAttributes();
      const equipmentTemplateModels = this.equipmentService.getAllEquipmentTemplateModels();

      const join = forkJoin(equipmentGroups, brands, equipmentAttributes, equipmentTemplateAttributes, equipmentTemplateModels);
      return join.pipe(
        map(r => new equipmentTemplateAction.InitFilterDataComplete({
          equipmentGroups: r[0],
          brands: r[1],
          equipmentAttributes: r[2],
          equipmentTemplateAttributes: r[3],
          equipmentTemplateModels: r[4]
        })),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Update filter
  updateFilter: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentTemplateAction.UPDATE_FILTER),
    withLatestFrom(this.store$.select(fromEquipmentTemplate.getEquipmentTemplateState), (action: any, state) => {
      return {
        payload: action.payload,
        state: state
      };
    }),
    map((action) => {
      const allBrands = action.state.allBrands.map(i => Object.assign({}, i));
      const allEquipmentGroups = action.state.allEquipmentGroups.map(i => Object.assign({}, i));
      const allEquipmentTemplateAttributes =
        action.state.allEquipmentTemplateAttributes.map(i => Object.assign({}, i));
      const allEquipmentAttributes = action.state.allEquipmentAttributes.map(i => Object.assign({}, i));
      const filter = Object.assign({}, action.state.filterDetail);

      const types = filter.supplyTypes.filter(s => s.isChecked).map(s => s.supplyType);
      filter.equipmentGroups = allEquipmentGroups.filter(e => types.find(s => s === e.supplyType) != null);

      if (filter.checkedEquipmentGroup != null &&
        filter.equipmentGroups.find(e => e.id === filter.checkedEquipmentGroup.id) == null) {
        filter.checkedEquipmentGroup = null;
      }

      filter.brands = allBrands.filter(a => {
        let flag = false;
        a.equipmentGroups.forEach(elem => {
          if (filter.equipmentGroups.find(eq => eq.id == elem.id) != null) {
            flag = true;
          }
        });
        return flag;
      });

      if (filter.checkedBrand != null &&
        filter.brands.find(e => e.id === filter.checkedBrand.id) == null) {
        filter.checkedBrand = null;
      }

      filter.equipmentAttributes = allEquipmentAttributes.filter(a => {
        let flag = false;
        a.equipmentGroups.forEach(elem => {
          if (filter.equipmentGroups.find(eq => eq.id == elem.id) != null) {
            flag = true;
          }
        });
        return flag;
      }).map(a => {
        return {attribute: a, value: '', numberValue: ''};
      });


      filter.equipmentTemplateAttributes = {};

      filter.equipmentAttributes.forEach(item => {
        const values = allEquipmentTemplateAttributes
          .filter(a => a.attribute.id === item.attribute.id && (a.value != null || a.numberValue != null))
          .map(a => a.value || a.numberValue);
        filter.equipmentTemplateAttributes[item.attribute.id] = Array.from(new Set(values));
      });

      return new equipmentTemplateAction.UpdateFilterComplete(filter);
    })
  ));
  //Update search key
  updateSearchKey: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentTemplateAction.UPDATE_SEARCH_KEY),
    withLatestFrom((action: equipmentTemplateAction.UpdateSearchKey) => {
      return {
        searchKey: action.payload
      };
    }),
    debounceTime(300),
    map((action) => {
      return new equipmentTemplateAction.RequestEquipmentTemplateList();
    })
  ));
  //Update order, units per page, page
  updateOrderPageUnitsPerPage: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentTemplateAction.UPDATE_ORDER, equipmentTemplateAction.UPDATE_PAGE,
      equipmentTemplateAction.UPDATE_UNITS_PER_PAGE, equipmentTemplateAction.UPDATE_IS_ASSIGNED_FILTER),
    withLatestFrom((action: equipmentTemplateAction.UpdateOrder) => {
      return {
        order: action.payload
      };
    }),
    map((action) => {
      return new equipmentTemplateAction.RequestEquipmentTemplateList();
    })
  ));
  //Add Equipment Template from building
  addRemoveEquipmentTemplateFromBuilding: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentTemplateAction.ADD_EQUIPMENT_TEMPLATE),
    withLatestFrom(this.store$.select(commonData.getBuildingId), (action: equipmentTemplateAction.AddEquipmentTemplate, buildingId) => {
      return {
        equipmentTemplateId: action.payload,
        buildingId: buildingId
      };
    }),
    switchMap((action) => {
        return this.buildingEquipmentTemplateService.addEquipmentTemplateForBuilding(action.buildingId, action.equipmentTemplateId).pipe(
          map(r => new equipmentTemplateAction.RequestEquipmentTemplateList()),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }
    )
  ));
  //Remove Equipment Template from building
  removeEquipmentTemplateFromBuilding: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentTemplateAction.REMOVE_EQUIPMENT_TEMPLATE),
    withLatestFrom(this.store$.select(commonData.getBuildingId), (action: any, buildingId) => {
      return {
        equipmentTemplateId: action.payload,
        buildingId: buildingId
      };
    }),
    switchMap((action) => {
        return this.buildingEquipmentTemplateService.removeEquipmentTemplateFromBuilding(action.buildingId, action.equipmentTemplateId).pipe(
          map(r => new equipmentTemplateAction.RequestEquipmentTemplateList()),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }
    )
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromEquipmentTemplate.State>,
    private buildingEquipmentTemplateService: BuildingEquipmentTemplateService,
    private equipmentService: EquipmentService,
    private buildingServicesService: BuildingServicesService
  ) {
  }
}
