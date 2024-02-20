//TODO: need to create a separate module for each widget component
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadImageComponent} from 'app/widgets/uploadImage/upload-image.component';
import {CropImageComponent} from 'app/widgets/uploadImage/crop-image.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DeleteDialogComponent} from '../delete-dialog/delete-dialog.component';
import {PagerComponent} from '../pager/pager.component';
import {LogoComponent} from '../logo/logo.component';
import {PageLimitComponent} from '../page-limit/page-limit.component';
import {BackButtonComponent} from 'app/widgets/back-button/back-button.component';
import {ImgModalComponent} from '../img-modal/img-modal.component';
import {DunamisInputsModule} from '../inputs/shared/dunamis-inputs.module';
import {VersionOptionsComponent} from '../version-options/version-options.component';
import {SupplyTypeIconComponent} from '../supply-type-icon/supply-type-icon.component';
import {NotePopupComponent} from '../note-popup/note-popup.component';
import {SimpleSearchFormComponent} from '../simple-search-form/simple-search-form.component';
import {UploadFileComponent} from '../upload-file/upload-file.component';
import {AudioPlayerComponent} from '../audio-player/audio-player.component';
import {PipesModule} from '@app/shared/pipes/pipes.module';
import { NextPrevButtonComponent } from '../next-prev-button/next-prev-button.component';


@NgModule({
  imports: [
    CommonModule,
    ImageCropperModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DunamisInputsModule,
    PipesModule
  ],
  declarations: [
    CropImageComponent,
    UploadImageComponent,
    UploadFileComponent,
    DeleteDialogComponent,
    PagerComponent,
    LogoComponent,
    PageLimitComponent,
    BackButtonComponent,
    NextPrevButtonComponent,
    ImgModalComponent,
    SupplyTypeIconComponent,
    VersionOptionsComponent,
    NotePopupComponent,
    SimpleSearchFormComponent,
    AudioPlayerComponent,
  ],
  exports: [
    CropImageComponent,
    UploadImageComponent,
    UploadFileComponent,
    LogoComponent,
    PagerComponent,
    PageLimitComponent,
    BackButtonComponent,
    NextPrevButtonComponent,
    ImgModalComponent,
    VersionOptionsComponent,
    SupplyTypeIconComponent,
    SimpleSearchFormComponent,
    NotePopupComponent,
    AudioPlayerComponent
  ]
})
export class WidgetsModule {
}
