/*export class ShopViewModel {
    id: string;
    name: string;
    isSelected: boolean;
}
*/
export class SelectedShopFilter {
  public static readonly ALL_SHOPS: string = 'All shops';
  public static readonly ADDED_SHOPS: string = 'Only to which added';
  public static readonly NOT_ADDED_SHOPS: string = 'To which not added';
}

export class SelectedUnitFilter {
  public static readonly ALL_UNITS = 'All Units';
  public static readonly ALL_SHOPS = 'All Shops';
  public static readonly ALL_COMMON_AREAS = 'All Common Areas';
  public static readonly CONNECTED_UNITS = 'Selected Units';
  public static readonly NOT_CONNECTED_UNITS = 'Not Selected Units';
}

export enum UnitFilter {
  AllUnits = 0,
  AllShops = 1,
  AllCommonAreas = 2,
  ConnectedUnits = 3,
  NotConnectedUnits = 4
}

export const unitsFiltersList = [{
  id: 0,
  label: 'All Units'
}, {
  id: 1,
  label: 'All Shops'
}, {
  id: 2,
  label: 'All Common Areas'
}, {
  id: 3,
  label: 'All Vacant'
}, {
  id: 4,
  label: 'All Not Vacant'
}];

export enum NodeUnitFilter {
  AllUnits = 0,
  LiableUnits = 1,
  NotLiableUnits = 2,
  VacantShops = 3
}

export const NodeUnitsFiltersList = [{
  id: 0,
  label: 'All Units'
}, {
  id: 1,
  label: 'Liable Units'
}, {
  id: 2,
  label: 'Not Liable Units'
}, {
  id: 3,
  label: 'Vacant Shops'
}];
