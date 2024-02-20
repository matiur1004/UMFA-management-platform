import {ReadingStatus} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';

export enum ReadingSource {
  ManualCapture,
  Import,
  Estimate,
  Reset,
  AmrImport,
  MobileApp
}

export const ReadingSourceText = {
  [ReadingStatus.Unconfirmed]: 'Unconfirmed',
  [ReadingStatus.Confirmed]: 'Confirmed',
  [ReadingStatus.Estimated]: 'Estimated',
};
