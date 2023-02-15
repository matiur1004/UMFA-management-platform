import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IConfirmDialogData } from 'app/core/models';
import { Observable } from 'rxjs';
import { ConfirmComponent } from '../components/dialogs/confirm/confirm.component';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  confirmDialog(data: IConfirmDialogData): Observable<boolean> {
    return this.dialog.open(ConfirmComponent, {
      data,
      width: '400px',
      disableClose: true
    }).afterClosed();
  }
}
