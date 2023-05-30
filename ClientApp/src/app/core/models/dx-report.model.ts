export interface IDXReport {
    Id: number;
    Name: string;
    Description: string;
    DXReportName: string;
  }
  
  export interface IBuildingRecoveryParams {
    BuildingId: number;
    StartPeriodId: number;
    EndPeriodId: number;
  }
  
  export interface IShopUsageVarianceParams {
    BuildingId: number;
    StartPeriodId: number;
    ToPeriodId: number;
    AllTenants: number;
  }

  export interface IShopCostVarianceParams {
    BuildingId: number;
    StartPeriodId: number;
    ToPeriodId: number;
    AllTenants: number;
  }
  