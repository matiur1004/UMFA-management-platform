export enum ReconCategory {
  Consumption,
  BasicCharge,
  ActiveEnergy,
  ApparentPower,
  ReactivePower
}

export const ReconCategoryText = {
  [ReconCategory.Consumption]: 'Consumption',
  [ReconCategory.BasicCharge]: 'Basic Charge',
  [ReconCategory.ActiveEnergy]: 'kWh',
  [ReconCategory.ApparentPower]: 'kVA',
  [ReconCategory.ReactivePower]: 'kVArh'
};
