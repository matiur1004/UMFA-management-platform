import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import * as portfoliosActions from '../actions/portfolio.actions';
import * as buildingDetailsActions from '../actions/building-details.actions';

import * as buildingDetailsSelector from '../selectors/building-details.selector';
import * as portfoliosSelector from '../selectors/portfolios.selector';
import * as commonDataSelector from 'app/client/layout/shared/store/selectors/common-data.selector';

import * as fromPortfolios from '../reducers';

import {ClientBuildingsService} from '../../services/client-buildings.service';
import {ShopHelper} from 'app/branch/buildings/manage-building/occupation/shared/helpers/shop.helper';
import {BuildingDetailViewModel, BuildingShopViewModel} from '../../models/buildings.model';
import {IShopViewModel} from '@models';
import {MeterPhotoType} from 'app/branch/buildings/manage-building/building-equipment/shared/models/meter.model';

@Injectable()
export class BuildingsEffects {

  // Get list of portfolios
  getPortfolios = createEffect(() => this.actions$.pipe(
    ofType(portfoliosActions.CLIENT_PORTFOLIO_LIST_REQUEST),
    withLatestFrom(this.store$.pipe(select(commonDataSelector.getClientId)),
      (_, clientId) => ({clientId: clientId})),
    switchMap(({clientId}) => {
      return this.clientBuildingsService.getPortfolios(clientId).pipe(
        map(result => {
          result.forEach(item => {
            item.isSelected = false;
          });
          return new portfoliosActions.ClientPortfolioListRequestComplete(result);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Get building details
  getBuildingDetails = createEffect(() => this.actions$.pipe(
    ofType(buildingDetailsActions.BUILDING_DETAILS_REQUEST),
    withLatestFrom((action: any) => ({buildingId: action.payload})),
    switchMap(({buildingId}) => {
      return this.clientBuildingsService.getBuildingDetails(buildingId).pipe(
        map(result => {
          const buildingDetails = result.buildingDetails;
          const shops = result.shops;

          const model = <BuildingDetailViewModel>{
            id: buildingDetails.buildingId,
            name: buildingDetails.buildingName,
            address: buildingDetails.buildingAddress,
            totalGLA: buildingDetails.area,
            branchName: buildingDetails.branchName,
            categories: buildingDetails.categories,
            logoUrl: buildingDetails.logoUrl,
            shops: shops.map(s => {
              return <BuildingShopViewModel>{
                id: s.shopId,
                name: s.shopName,
                tenant: {
                  id: s.tenantId,
                  name: s.tenantName
                },
                area: s.area,
                floor: s.floor,
                isSpare: s.isSpare,
                status: ShopHelper.getStatus(<IShopViewModel>{
                  tenant: {
                    id: s.tenantId,
                    name: s.tenantName
                  },
                  isSpare: s.isSpare
                })
              };
            })
          };
          return new buildingDetailsActions.BuildingDetailsRequestComplete(model);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Get portfolio buidings
  getPorfolioBuildings = createEffect(() => this.actions$.pipe(
    ofType(portfoliosActions.UPDATE_IS_TOGGLE),
    withLatestFrom(this.store$.pipe(select(commonDataSelector.getClientId)),
      this.store$.pipe(select(portfoliosSelector.getPortfolios)),
      (action: any, clientId, portfolios) => ({
        portfolioIndex: action.payload,
        clientId: clientId,
        portfolios: portfolios
      })),
    switchMap(({portfolioIndex, clientId, portfolios}) => {

      const portfolio = portfolios.find((_, idx) => idx === portfolioIndex);

      if (portfolio.isSelected) {
        return this.clientBuildingsService.getBuildings(clientId, portfolio.id).pipe(
          map(result => {
            return new portfoliosActions.SetPortfolio({
              index: portfolioIndex,
              portfolio: {...portfolio, buildings: result}
            });
          }),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }

      return of({type: 'DUMMY'});
    })
  ));
  // Get shop details
  getShopDetails = createEffect(() => this.actions$.pipe(
    ofType(buildingDetailsActions.UPDATE_IS_TOGGLE),
    withLatestFrom(this.store$.pipe(select(buildingDetailsSelector.getShops)),
      (action: any, shops) => ({shopIndex: action.payload.index, buildingId: action.payload.buildingId, shops: shops})),
    switchMap(({shopIndex, buildingId, shops}) => {

      const shop = shops.find((_, idx) => idx === shopIndex);

      if (shop.isSelected) {
        return this.clientBuildingsService.getShopDetais(buildingId, shop.id).pipe(
          map(result => {

            result.meters.forEach(m => {
              m.appliedTariff = {
                versionId: m.tariffVersionId,
                name: m.tariffName
              };
              m.photoUrl = this.clientBuildingsService.getMeterPhotoUrl(buildingId, m.meterId, MeterPhotoType.ActualPhoto);
            });

            return new buildingDetailsActions.SetShopDetails({index: shopIndex, shop: {...shop, details: result}});
          }),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }

      return of({type: 'DUMMY'});
    })
  ));
  // Save building changes
  saveBuildingChanges = createEffect(() => this.actions$.pipe(
    ofType(buildingDetailsActions.SAVE_CHANGES_REQUEST),
    withLatestFrom(this.store$.pipe(select(buildingDetailsSelector.getBuilding)),
      (_, building) => ({building: building})),
    switchMap(({building}) => {
      const shops = building.shops.map(s => {
        return {
          shopId: s.id,
          shopName: s.name,
          tenantId: s.tenant ? s.tenant.id : null,
          tenantName: s.tenant ? s.tenant.name : null,
          area: s.area,
          floor: s.floor,
          isSpare: s.isSpare
        };
      });
      return this.clientBuildingsService.saveChanges(building.id, shops).pipe(
        map(result => new portfoliosActions.ClientPortfolioListRequest()),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(private actions$: Actions, private store$: Store<fromPortfolios.State>,
              private clientBuildingsService: ClientBuildingsService) {
  }
}
