import {SupplyType} from '@models';

export class CommentViewModel {
  createdBy: string;
  createdDate: Date;
  comment: string;
}

export enum ReadingStatus {
  Unconfirmed,
  Confirmed,
  Estimated,
  Custom
}

export const ColorsStatus = {
  [ReadingStatus.Estimated]: '#ff082b',
  [ReadingStatus.Confirmed]: '#08ee3d',
  [ReadingStatus.Unconfirmed]: '#007bff',
  [ReadingStatus.Custom]: '#ffd700',
}

interface ReadingUsageViewModel {
  readingDate: Date;
  averageUsage: number;
  periodName: string;
  periodStartDate: Date;
  periodEndDate: Date;
  periodDurationDays: number;
  isPeriodPredefined: boolean;
  usage: number;
  readingStatus: ReadingStatus;
}

export interface MeterReadingChartViewModel {
  meterId: string;
  registersInfo: RegisterInfoViewModel[];
}

export const usagesText = [
  'Current Usage',
  'Average Usage'
]

export interface RegisterInfoViewModel {
  registerId: string;
  registerName: string;
  readingsInfo: ReadingInfoViewModel[];
}

export interface ReadingInfoViewModel {
  currentReadingUsage: ReadingUsageViewModel;
  previousReadingUsage: ReadingUsageViewModel;
}

export class BuildingPeriodUsageViewModel {
  periodName: string;
  totalDays: number;
  totalUsage: number;
}

export enum BillingReadingChartUsagesEnum {
  None,
  CurrentPeriod,
  YearOnYear
}

export const BillingReadingChartUsages = [
  {
    label: 'None',
    value: BillingReadingChartUsagesEnum.None,
  },
  {
    label: 'Current Period',
    value: BillingReadingChartUsagesEnum.CurrentPeriod
  },
  {
    label: 'Year On Year',
    value: BillingReadingChartUsagesEnum.YearOnYear
  }
];

export class MeterRegisterReadingDetailsViewModel {
  registerName: string;
  ratio: number;

  previousReadingValue: number;
  previousReadingComment: CommentViewModel;
  previousReadingImage: string;
  isPreviousReadingConfirmed: boolean;
  isPreviousReadingEstimated: boolean;

  currentReadingValue: number;
  currentReadingComment: CommentViewModel;
  currentReadingImage: string;
  isCurrentReadingConfirmed: boolean;
  isCurrentReadingEstimated: boolean;

  abnormalityLevel: number;
  estimatedReadingValue: number;
  averageUsage: number;
  currentUsage: number;
  beforeClosestReading: number;
  afterClosestReading: number;

  periodsUsageHistory: BuildingPeriodUsageViewModel[] = new Array<BuildingPeriodUsageViewModel>();
}

export class MeterReadingDetailsViewModel {
  id: string;
  serialNumber: string;
  meterDetails: MeterDetailsViewModel = new MeterDetailsViewModel();
  registers: MeterRegisterReadingDetailsViewModel[] = new Array<MeterRegisterReadingDetailsViewModel>();
}

export class MeterDetailsViewModel {
  sequinceNumber: number;
  location: string;
  supplyType: SupplyType;
  shopNames: string[] = new Array<string>();
  tenantNames: string[] = new Array<string>();
  nodeNames: string[] = new Array<string>();
}
