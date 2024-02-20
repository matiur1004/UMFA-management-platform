import {SupplyType} from "./supply-type.model";

export interface MeterTypeViewModel {
  id: string;
  name: string;
  supplyType: SupplyType;
  value: number;
  quantity: number;
}

export class MeterTypesViewModel {
  meterTypes: MeterTypeViewModel[];
}

