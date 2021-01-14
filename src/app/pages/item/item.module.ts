import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatSortModule } from '@angular/material/sort';

import { ItemRoutingModule } from './item-routing.module';
import { ItemComponent } from './item.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { NewItemComponent } from './components/new-item/new-item.component';
import { EditItemComponent } from './components/edit-item/edit-item.component';
import { ComponentsModule } from '../../components/components.module';
import { BarcodeDialogComponent } from '../../components/barcode-dialog/barcode-dialog.component';

@NgModule({
  declarations: [
    ItemComponent,
    ItemListComponent,
    NewItemComponent,
    EditItemComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    ItemRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatDialogModule,
    MaterialFileInputModule,
    MatSortModule,
  ],

  entryComponents: [BarcodeDialogComponent],
})
export class ItemModule {}
