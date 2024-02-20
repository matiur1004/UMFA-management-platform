import {Dictionary} from './dictionary.model';

export class ConfirmationPopupMessage {
  title: string;
  message: string;
  values: Dictionary<string[]>;
  hasError = false;
  actions: ConfimationPopupActions[];
}

export enum ConfimationPopupActions {
  cancel,
  confirm
}
