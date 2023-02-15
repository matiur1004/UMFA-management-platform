import { Time } from "@angular/common";

export interface IAmrChartWaterProfParams {
    MeterId: number;
    StartDate: Date;
    EndDate: Date;
    nightFlowStart: Time;
    nightFlowEnd: Time;
  }
  
  export interface IWaterProfileResponse {
    Status: string;
    ErrorMessage: string;
    Header: IWaterProfileHeader;
    Detail: IWaterProfileDetail[];
  }
  
  export interface IWaterProfileHeader {
    MeterId: number;
    MeterNo: string;
    Description: string;
    StartDate: Date;
    EndDate: Date;
    MaxFlow: number;
    MaxFlowDate: Date;
    NightFlow: number;
    PeriodUsage: number;
    DataPercentage: number;
  }
  
  export interface IWaterProfileDetail {
    ReadingDate: Date;
    ReadingDateString: string;
    ActFlow: number;
    Calculated: boolean;
    Color: string;
  }
  