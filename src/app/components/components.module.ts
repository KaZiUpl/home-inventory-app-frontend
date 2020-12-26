import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeDialogComponent } from './barcode-dialog/barcode-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BarcodeDialogComponent],
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
  ],
  exports: [BarcodeDialogComponent],
})
export class ComponentsModule {}
