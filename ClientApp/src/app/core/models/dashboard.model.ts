export interface IHomePageStats {
    Partners: number;
    Clients: number;
    Buildings: number;
    Tenants: number;
    Shops: number;
    Users: number
  }
  
  export enum EHomeTabType {
    Buildings,
    Tenants,
    Shops
  }

  export const CHomeTabTypeText = {
    [EHomeTabType.Buildings]: 'Buildings',
    [EHomeTabType.Tenants]: 'Tenants',
    [EHomeTabType.Shops]: 'Shops',
  };
  export interface IHomeTab {
    id: number;
    title: string;
    apiEndpoint?: string;
    dataSource?: any[]
  }