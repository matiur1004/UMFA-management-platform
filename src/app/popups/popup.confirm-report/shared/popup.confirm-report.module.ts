import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupConfirmReportComponent} from '@app/popups/popup.confirm-report/popup.confirm-report.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';


@NgModule({
  declarations: [
    PopupConfirmReportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule
  ],
  exports: [PopupConfirmReportComponent]
})
export class PopupConfirmReportModule {
}
