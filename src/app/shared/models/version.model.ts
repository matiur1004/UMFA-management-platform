import {TariffViewModel} from '@app/shared/models/tariff.model';

export class Version<T> {
  entity: T;
  comment: string;
  baseVersionId: string;
  action: VersionActionType;
  startDate: Date;
  isComplete: boolean;
  status: boolean;
  nextVersions: Version<T>[];

  constructor(entity: T, comment: string, action: VersionActionType, startDate: Date, baseVersionId: string) {
    this.entity = entity;
    this.comment = comment;
    this.action = action;
    this.startDate = startDate;
    this.baseVersionId = baseVersionId;
  }
}

export interface IVersionModel {
  isActual?: boolean;
}

export class VersionViewModel<T> implements IVersionModel {
  entity: T;
  comment: string;
  id: string;
  action: VersionActionType;
  versionDate?: Date;
  majorVersion: number;
  minorVersion? = 0;
  version? = '1.0';
  isActual? = true;

  constructor(entity: T, comment: string, action: VersionActionType, versionDate: Date, baseVersionId: string, majorVersion = 1) {
    this.entity = entity;
    this.comment = comment;
    this.action = action;
    this.versionDate = versionDate;
    this.id = baseVersionId;
    this.majorVersion = majorVersion;
  }
}

export class NewTariffVersionCurrentTariff extends TariffViewModel {
  versionId: string;
}

export class NewTariffVersionViewModel {
  versions: Array<VersionViewModel<TariffViewModel>>;
  currentTariff: NewTariffVersionCurrentTariff;
  vId: string;
}

export interface VersionResultViewModel {
  entity: any;
  current: VersionStatusViewModel;
  next: VersionStatusViewModel[];
}

export interface VersionStatusViewModel {
  id: string;
  comment: string;
  status: true;
  versionDate: Date;
}

export enum VersionActionType {
  Init,
  Insert,
  Overwrite,
  Apply
}
