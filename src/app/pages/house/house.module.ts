import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { HouseRoutingModule } from './house-routing.module';
import { HouseListComponent } from './components/house-list/house-list.component';
import { HouseViewComponent } from './components/house-view/house-view.component';
import { HouseEditComponent } from './components/house-edit/house-edit.component';
import { NewHouseDialogComponent } from './components/new-house-dialog/new-house-dialog.component';
import { NewRoomDialogComponent } from './components/new-room-dialog/new-room-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditableCellComponent } from './components/editable-cell/editable-cell.component';

@NgModule({
  declarations: [
    HouseListComponent,
    HouseViewComponent,
    HouseEditComponent,
    NewHouseDialogComponent,
    NewRoomDialogComponent,
    EditableCellComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HouseRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  entryComponents: [NewHouseDialogComponent],
})
export class HouseModule {}
