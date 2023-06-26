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
    FromPeriodId: number;
    ToPeriodId: number;
    AllTenants: number;
  }

  export interface IShopCostVarianceParams {
    BuildingId: number;
    FromPeriodId: number;
    ToPeriodId: number;
    AllTenants: number;
  }
  export interface IUtilityReportParams {
    BuildingId: number;
    FromPeriodId: number;
    ToPeriodId: number;
    Recoveries: number;
    Expenses: number;
    ReconType: number;
    NoteType: number;
    ServiceType: number;
    ViewClientExpense: number;
    ClientExpenseVisible: boolean;
    CouncilAccountVisible: boolean;
    BulkReadingVisible: boolean;
    PotentialRecVisible: boolean;
    NonRecVisible: boolean;
    UmfaReadingDatesVisible: boolean;
    CouncilReadingDatesVisible: boolean;
    UmfaRecoveryVisible: boolean;
    ClientRecoverableVisible: boolean;
  }
  
  export interface IConsumptionSummaryReportParams {
    BuildingId: number,
    PeriodId: number,
    SplitIndicator: number,
    Sort: string,
    Shops: number[]
  }