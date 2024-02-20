import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {PopupCommentComponent} from '../popup.comment.component';
import {CommentBindDialogDirective} from '../comment-bind-dialog.directive';
import {PipesModule} from '@app/shared/pipes/pipes.module';
import { PopupCommentSameVersionComponent } from '../popup.comment-same-version/popup.comment-same-version.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PipesModule
  ],
  declarations: [
    PopupCommentComponent,
    PopupCommentSameVersionComponent,
    CommentBindDialogDirective
  ],
  exports: [
    PopupCommentComponent,
    PopupCommentSameVersionComponent,
    CommentBindDialogDirective
  ],
  // entryComponents: [PopupCommentComponent]
})
export class PopupCommentModule {
}
