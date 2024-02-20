import {TenantBuildingViewModel} from '../../profiles/models/profile.model';

/**
 * [State] interface for TenantBuildings
 */
export interface State {
  tenantBuildings: TenantBuildingViewModel[];
  searchKey: string;
  buildingId: string;
}

/**
 * Default State (TenantBuildings) value
 */
export const initialState: State = {
  tenantBuildings: [],
  searchKey: null,
  buildingId: null
}
