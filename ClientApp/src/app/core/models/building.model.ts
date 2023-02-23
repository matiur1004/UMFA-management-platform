export interface IUmfaBuilding {
    BuildingId: number;
    Name: string;
    PartnerId: number;
    Partner: string;
    IsSmart: boolean;
}
  
  export interface IUmfaPartner {
    Id: number;
    Name: string;
  }
  
  export interface IUmfaPeriod {
    PeriodId: number;
    PeriodName: string;
    PeriodStart: Date;
    PeriodEnd: Date;
  }
  