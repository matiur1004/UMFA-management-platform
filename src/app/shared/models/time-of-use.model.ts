export enum TimeOfUse {
  None,
  Peak,
  OffPeak,
  Standard
}

export const TimeOfUseName = {
  [TimeOfUse.None]: 'None',
  [TimeOfUse.Peak]: 'Peak',
  [TimeOfUse.OffPeak]: 'Off Peak',
  [TimeOfUse.Standard]: 'Standard'
};

export const TimeOfUseMap = {
  'None': TimeOfUse.None,
  'Peak': TimeOfUse.Peak,
  'OffPeak': TimeOfUse.OffPeak,
  'Standard': TimeOfUse.Standard
};

export const kWhTimeOfUseName = {
  [TimeOfUse.None]: 'kWh',
  [TimeOfUse.Peak]: 'kWh-P',
  [TimeOfUse.OffPeak]: 'kWh-O',
  [TimeOfUse.Standard]: 'kWh-S'
}
