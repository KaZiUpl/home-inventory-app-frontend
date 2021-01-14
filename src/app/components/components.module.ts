import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MaterialFileInputModule } from 'ngx-material-file-input';

import { AcceptDialogComponent } from './accept-dialog/accept-dialog.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { BarcodeDialogComponent } from './barcode-dialog/barcode-dialog.component';
import { CutToLengthPipe } from '../pipe/cut-to-length.pipe';
@NgModule({
  declarations: [
    BarcodeDialogComponent,
    AcceptDialogComponent,
    CutToLengthPipe,
    LoadingScreenComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MaterialFileInputModule,
    MatSnackBarModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    BarcodeDialogComponent,
    AcceptDialogComponent,
    CutToLengthPipe,
    LoadingScreenComponent,
  ],
})
export class ComponentsModule {}
