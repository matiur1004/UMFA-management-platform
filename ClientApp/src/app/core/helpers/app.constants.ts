import { IConfirmDialogData } from "../models";

function initDialog(props?: Partial<IConfirmDialogData>): IConfirmDialogData {
  const defaults = {
    Title: 'Are you Sure?',
    Message: 'Please confirm your action',
    ConfirmText: 'Yes',
    CancelText: 'No'
  }

  return {
    ...defaults,
    ...props,
  };

}

export class DialogConstants {

  public static deleteDialog: IConfirmDialogData = initDialog({
    Title: 'Please confirm your Action',
    Message: 'Are you sure you want to remove this item?',
  })

  public static updateDialog: IConfirmDialogData = initDialog({
    Title: 'Please confirm your Action',
    Message: 'Are you sure you want to change this item?',
  })

  public static createDialog: IConfirmDialogData = initDialog({
    Title: 'Please confirm your Action',
    Message: 'Are you sure you want to create a new item?',
  })
}

export const AllowedPageSizes = [10, 15, 20, 'All'];


