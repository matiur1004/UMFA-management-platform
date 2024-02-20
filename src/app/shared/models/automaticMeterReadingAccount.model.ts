export interface AutomaticMeterReadingAccountViewModel {
  id: string;
  subDomain: string;
  userName: string;
  password: string;
  description: string;
  callFrequency: CallFrequency;
  buildingIds: string[];
}

export enum CallFrequency {
  HalfHour,
  Hour,
  Day,
  Week
}

export const callFrequencyText = {
  [CallFrequency.HalfHour]: 'Once per 30 min',
  [CallFrequency.Hour]: 'Once per hour',
  [CallFrequency.Day]: 'Once per day',
  [CallFrequency.Week]: 'Once per week'
}

export const callFrequencyArray = [CallFrequency.HalfHour, CallFrequency.Hour, CallFrequency.Day, CallFrequency.Week];


