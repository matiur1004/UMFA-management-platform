import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PopupFilesListComponent} from '../popup.files.list.component';
import {FileItemComponent} from '../file-item/file-item.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PopupFilesListComponent,
    FileItemComponent
  ],
  exports: [
    PopupFilesListComponent,
    FileItemComponent
  ]
})
export class PopupFilesListModule {

}
