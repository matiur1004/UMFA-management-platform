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
  