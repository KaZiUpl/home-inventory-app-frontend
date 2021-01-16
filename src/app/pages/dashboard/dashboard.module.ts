import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StorageItemBottomSheetComponent } from './components/storage-item-bottom-sheet/storage-item-bottom-sheet.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BarcodeDialogComponent } from 'src/app/components/barcode-dialog/barcode-dialog.component';
import { EditStorageItemDialogComponent } from './components/edit-storage-item-dialog/edit-storage-item-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    DashboardComponent,
    StorageItemBottomSheetComponent,
    EditStorageItemDialogComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatDividerModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    MatBottomSheetModule,
    MatDatepickerModule,
    MatDialogModule,
  ],
  entryComponents: [StorageItemBottomSheetComponent, BarcodeDialogComponent],
})
export class DashboardModule {}
