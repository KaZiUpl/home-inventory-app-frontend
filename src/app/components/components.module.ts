import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeDialogComponent } from './barcode-dialog/barcode-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [BarcodeDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [BarcodeDialogComponent],
})
export class ComponentsModule {}
