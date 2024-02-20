import {Injectable} from '@angular/core';
import {SupplyType} from '@models';
import {KeyValue} from '../models/key-value.model';

@Injectable({
  providedIn: 'root'
})
export class CostTariffSettingsService {
  private listOfRegisters = {
    [SupplyType.Electricity]: [
      //Prdefined Id of kWh
      {key: '94d95127-7d6c-49cb-a6e8-fd2378398d16', value: "kWh"}
    ],
    [SupplyType.Water]: [
      //Prdefined Id of kL
      {key: '69738f82-b5eb-4858-88ff-7da5ab5dc7c5', value: 'kL'}
    ]
  };
  private supplyTypeToUnitMap = {
    //Enum value of kWh
    [SupplyType.Electricity]: [2],
    //Enum value of kL
    [SupplyType.Water]: [7]
  };

  constructor() {
  }

  getRegistersBySupplyType(supplyType: SupplyType): KeyValue[] {
    return this.listOfRegisters[supplyType] ? this.listOfRegisters[supplyType] : [];
  }

  getFirstRegisterBySupplyType(supplyType: SupplyType): KeyValue {
    return this.listOfRegisters[supplyType] ? this.listOfRegisters[supplyType][0] : '';
  }

  getUnitsBySupplyType(supplyType: SupplyType): string[] {
    return this.supplyTypeToUnitMap[supplyType] ? this.supplyTypeToUnitMap[supplyType] : [];
  }

  getFirstUnitBySupplyType(supplyType: SupplyType): string {
    return this.supplyTypeToUnitMap[supplyType] ? this.supplyTypeToUnitMap[supplyType][0] : '';
  }
}
