import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  constructor(private matSnackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string,
    hPosition?: any, vPosition?: any,
    className?: any) {
    this.matSnackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: hPosition ? hPosition : this.horizontalPosition,
      verticalPosition: vPosition ? vPosition : this.verticalPosition,
      panelClass: className ? className : ["snack-style"]
      // direction: "rtl"
    });
  }

  passDataToSnackComponent(dataIn: any) {
    this.matSnackBar.openFromComponent(SnackBarComponent, {
      data: dataIn,
      duration: 3000,
      panelClass: ["snack-style"],
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

}
