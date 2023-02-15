import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { ConfirmComponent } from './components/dialogs/confirm/confirm.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalModule } from './components/modal/modal.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        SnackBarComponent,
        ConfirmComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        MatDialogModule,
        MatSnackBarModule,
        MatButtonModule,
        ReactiveFormsModule,        
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        MatSnackBarModule
    ]
})
export class SharedModule
{
}
