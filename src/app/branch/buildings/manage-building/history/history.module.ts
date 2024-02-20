import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PopupCommentModule} from 'app/popups/popup.comment/shared/popup-comment.module';

import {HistoryComponent} from "./page-history/history.component";
import { PipesModule } from "@app/shared/pipes/pipes.module";


export const historyRoutes: Routes = [
  {path: '', component: HistoryComponent}
];

@NgModule({
  declarations: [
    HistoryComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    PipesModule,
    PopupCommentModule,
    RouterModule.forChild([]/*historyRoutes*/)
  ],
  exports: [
    RouterModule
  ]
})
export class HistoryModule {
}
