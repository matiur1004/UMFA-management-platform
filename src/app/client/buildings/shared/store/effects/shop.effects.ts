import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {map, withLatestFrom} from 'rxjs/operators';


import * as shopActions from '../actions/shop.actions';
import * as buildingDetailsActions from '../actions/building-details.actions';

import * as buildingDetailsSelector from '../selectors/building-details.selector';

import * as fromPortfolios from '../reducers';
import {BuildingShopViewModel} from '../../models/buildings.model';
import {StringExtension} from '@shared-helpers';
import {ShopStatus} from '@models';


@Injectable()
export class ShopEffects {

  // Split shop
  splitShop = createEffect(() => this.actions$.pipe(
    ofType(shopActions.SPLIT_SHOP),
    withLatestFrom(this.store$.pipe(select(buildingDetailsSelector.getBuilding)),
      (action: any, building) => ({
        shopId: action.payload.shopId,
        shops: action.payload.shops,
        buildingShops: building.shops
      })),
    map(({shopId, shops, buildingShops}) => {
      const buildShops = buildingShops.filter(s => s.id !== shopId);
      shops.forEach(s => {
        buildShops.push(<BuildingShopViewModel>{
          id: StringExtension.NewGuid(),
          name: s.name,
          tenant: s.tenantName ? {
            id: StringExtension.NewGuid(),
            name: s.tenantName
          } : null,
          area: s.area,
          floor: s.floor,
          isSpare: false,
          isSelected: false,
          status: s.tenantName ? ShopStatus.Occupied : ShopStatus.Vacant,
          details: null
        });
      });

      buildShops[0].id = shopId;

      return new buildingDetailsActions.SetShops(buildShops);
    })
  ));

  constructor(private actions$: Actions, private store$: Store<fromPortfolios.State>) {
  }

}
