import {ReadingSource, TimeOfUse} from '@models';

export interface InvalidateReadingViewModel {
  buildingId: string;
  meterId: string;
  value: number;
  notes: string;
}

export interface ReadingDetailsNavigation {
  previousHistoryReadingId: string;
  nextHistoryReadingId: string;
  previousMeterReadingId: string;
  nextMeterReadingId: string;
  registerReadings: Array<ReadingDetailsRegistersNavigation>;
}

export interface ReadingDetailsRegistersNavigation {
  readingId: string;
  registerId: string;
  image: string;
  active: boolean;
}

export interface ReadingsHistoryViewModel {
  id: string;
  buildingId: string;
  meterId: string;
  registerId: string;
  recordingUrl: string;
  timeOfUse: TimeOfUse;
  value: number;
  isBillable: boolean;
  isBilling: boolean;
  isOpening: boolean;
  date: string | Date;
  notes: string;
  reasonId: string;
  photoUrl: string;
  isEditable: boolean;
  confirmed: boolean;
  createdDate: string | Date;
  buildingPeriodId: string;
  buildingPeriodName: string;
  buildingPeriodStartDate: Date;
  buildingPeriodEndDate: Date;
  createdByUserName: string;
  createdByUserPhotoUrl: string;
  isPinned: boolean;
  readingSource: ReadingSource;
  usage: number;
  createdByUserId: string;
  ratio?: number;
  registerScaleId?: string;
  registerScaleRatio?: number;
  registerScaleName?: string;
  isActiveBuildingPeriod?: boolean;
  filesInfo: ReadingFileInfoViewModel[];
  baseFileRoute?: string;
  calculatedBPUsageFormula: string;
  calculatedBVUsageFormula: string;
  calculatedBPUsage: number;
  calculatedBVUsage?: number;
  currentReadingValue: number;
  currentUsageValue: number;
  currentRatio: number;
  precedingReadingValue: number;
  precedingUsageValue: number;
  precedingBvUsage: number;
  precedingRatio: number;
}

export interface ResetReadingModel {
  meterId: string;
  registerId: string;
  timeOfUse: TimeOfUse;
  value: number;
  notes: string;
  readingId: string;
}

export enum ReadingFileInfoType {
  Photo,
  File,
  Recording
}

export enum SORT_BY {
  'Reading date',
  'Created date'
}

export const sortByText = {
  [SORT_BY['Reading date']]: 'Reading Date',
  [SORT_BY['Created date']]: 'Created Date'
};

export interface GroupedReadingsByBuildingPeriodViewModel {
  buildingPeriodId: string;
  buildingPeriodName: string;
  buildingPeriodStartDate: Date;
  buildingPeriodEndDate: Date;
  readings: ReadingsHistoryViewModel[];
}

export interface ReadingHistoryFilterViewModel {
  registerId: string;
  sortBy: SORT_BY;
  meterId: string;
  timeOfUse: TimeOfUse | null;
  page: number;
  unitsPerPage: number;
}

export interface RegisterViewModel {
  id: string;
  name: string;
  timeOfUse: TimeOfUse;
  ratio: number;
}

export interface MeterViewModel {
  id: string;
  serialNumber: string;
  isChecked: boolean;
  shortName?: string;
  supplyType: number;
  registers: RegisterViewModel[];
}

export interface ReadingPinStatusViewModel {
  readingId: string;
  meterId: string;
  registerId: string;
  buildingPeriodId: string;
  isPinned: boolean;
}

export interface ReadingFileInfoViewModel {
  id: string;
  readingId: string;
  fileUrl: string;
  fileDisplayName: string;
  type: ReadingFileInfoType;
  isDefaultPhoto: boolean;
}

export class ReadingDetailsUpdateViewModel {
  id: string;
  notes: string;
  photosToUpload: File[] = [];
  filesToUpload: File[] = [];
  filesToDelete: string[] = [];
  defaultPhotoId: string;
}

export const shouldDisplayTime = (reading: ReadingsHistoryViewModel) => {
  return reading.readingSource === ReadingSource.AmrImport
    || reading.readingSource === ReadingSource.MobileApp;
};
