export enum UnitOfMeasurementType {
  None,
  kW,
  kWh,
  kVA,
  kV,
  kA,
  kVArh,
  kL,
  CubicMeter
}

export const UnitOfMeasurementName = {
  [UnitOfMeasurementType.None]: 'None',
  [UnitOfMeasurementType.kW]: 'kW',
  [UnitOfMeasurementType.kWh]: 'kWh',
  [UnitOfMeasurementType.kVA]: 'kVA',
  [UnitOfMeasurementType.kV]: 'kV',
  [UnitOfMeasurementType.kA]: 'kA',
  [UnitOfMeasurementType.kVArh]: 'kVArh',
  [UnitOfMeasurementType.kL]: 'kL',
  [UnitOfMeasurementType.CubicMeter]: 'm³'
};

export const UnitOfMeasurementMap = {
  'None': UnitOfMeasurementType.None,
  'kW': UnitOfMeasurementType.kW,
  'kWh': UnitOfMeasurementType.kWh,
  'kVA': UnitOfMeasurementType.kVA,
  'kV': UnitOfMeasurementType.kV,
  'kA': UnitOfMeasurementType.kA,
  'kVArh': UnitOfMeasurementType.kVArh,
  'kL': UnitOfMeasurementType.kL,
  'm³': UnitOfMeasurementType.CubicMeter
};

export const AmrUnits = {
  kWh: UnitOfMeasurementType.kWh,
  kVA: UnitOfMeasurementType.kVA,
  kVArh: UnitOfMeasurementType.kVArh
};
