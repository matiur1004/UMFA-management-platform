export interface IAmrMeter {
    Id: number;
    MeterNo: string;
    Description?: string;
    UserId: number;
    BuildingId: number;
    BuildingName: string;
    UmfaId: number;
    MakeModelId: number;
    Make: string;
    Model: string;
    Phase: number;
    CbSize: number;
    CtSizePrim: number;
    CtSizeSec: number;
    ProgFact: number;
    Digits: number;
    Active: boolean;
    CommsId: string;
    MeterSerial: string;
    UtilityId: number;
    Utility: string;
  }
  
  export class AmrMeterUpdate {
    UserId: number;
    Meter: IAmrMeter;
  }
  
  export interface IMeterMakeModel {
    Id: number;
    Make: string;
    Model: string;
    Description: string;
    Active: boolean;
  }
  
  export interface IUtility {
    Id: number;
    Name: string;
    Active: boolean;
    MakeModels: IMeterMakeModel[];
  }
  
export interface IScadaRequestHeader {
  Id: number;
  Description: string;
  JobType: number;
  Status: number;
}

export interface IScadaScheduleStatus {
  Id: number;
  Description: string;
  Name: string;
}

export interface IScadaJobStatus{
  Id: number;
  Description: string;
  Name: string;
}
export interface IScadaRequestDetail {
  Id: number;
  AmrMeter?: any;
  HeaderId: number;
  AmrMeterId: number;
  Status: number;
  LastRunDTM: string;
  LastDataDate: string;
}