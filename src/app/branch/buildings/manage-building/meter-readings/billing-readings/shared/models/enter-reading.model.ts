import {ReadingSource, RegisterType, SupplyType, TimeOfUse} from "@models";
import {Boxed} from "ngrx-forms";

export interface EnterReadingViewModel {
  meterId: string;
  serialNumber: string;
  supplyType: SupplyType;
  registers: EnterReadingRegisterViewModel[];
  meterName: string;
}

export interface EnterReadingRegisterViewModel {
  registerTouKey: string;
  registerId: string;
  timeOfUse: TimeOfUse;
  readingId: string;
  name: string;
  previousReadingValue: number;
  lastReadingValue: number;
  averageUsage: number;
  estimatedReadingValue: number;
  currentReadingValue: number;
  currentReadingCreatedByUserName: string;
  usage: number;
  confirmed: boolean;
  notes: Boxed<{ currentReadingNotes: string; currentReadingCreatedByUserName: string; }>;
  registerType: RegisterType;
  isRollover: boolean;
  dialCount: number;
  ratio: number;
  registerScaleId: string;
  registerScaleRatio: number;
  registerScaleName: string;
}

export interface ReadingViewModel {
  readingId: string;
  registerId: string;
  timeOfUse: TimeOfUse;
  meterId: string;
  value: string;
  usage: string;
  date: string;
  currentReadingCreatedByUserName: string;
  readingSource: ReadingSource;
  notes: Boxed<{ currentReadingNotes: string; currentReadingCreatedByUserName: string; }>;
  recording: File;
  photo: File;
  confirmed: boolean;
  isRollover: boolean;
  ratio: number;
  registerScaleId: string;
}

export enum EnterReadingsShowFilter {
  AllReadings,
  HasNoReadings
}
