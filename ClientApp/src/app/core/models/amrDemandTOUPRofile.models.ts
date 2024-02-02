export interface IAmrChart {
    Id: number;
    Name: string;
    Description: string;
  }
  
  export interface IAmrChartDemProfParams {
    MeterId: number;
    StartDate: Date;
    EndDate: Date;
    TOUId: number;
  }
  
  export interface ITouHeader {
    Id: number;
    UtilitySupplierId: number;
    Name: string;
    IsDefault: boolean;
    Active: boolean;
  }
  
  export interface IDemandProfileResponse {
    Status: string;
    ErrorMessage: string;
    Header: IDemandProfileHeader;
    Detail: IDemandProfileDetail[];
  }
  
  export interface IDemandProfileHeader {
    MeterId: number;
    MeterNo: string;
    Description: string;
    StartDate: Date;
    EndDate: Date;
    MaxDemand: number;
    MaxDemandDate: Date;
    PeriodUsage: number;
    DataPercentage: number;
    PeakUsage: number;
    StandardUsage: number;
    OffPeakUsage: number;
    PeakDemand: number;
    StandardDemand: number;
    OffPeakDemand: number;
  }
  
  export interface IDemandProfileDetail {
    ReadingDate: Date;
    ReadingDateString: string;
    ShortName: string;
    Demand: number;
    ActEnergy: number;
    ReActEnergy: number;
    Calculated: boolean;
    Color: string;
  }
  