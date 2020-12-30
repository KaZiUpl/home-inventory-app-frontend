import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { HouseRoutingModule } from './house-routing.module';
import { HouseListComponent } from './components/house-list/house-list.component';
import { HouseViewComponent } from './components/house-view/house-view.component';
import { HouseEditComponent } from './components/house-edit/house-edit.component';
import { NewHouseDialogComponent } from './components/new-house-dialog/new-house-dialog.component';
import { NewRoomDialogComponent } from './components/new-room-dialog/new-room-dialog.component';

@NgModule({
  declarations: [
    HouseListComponent,
    HouseViewComponent,
    HouseEditComponent,
    NewHouseDialogComponent,
    NewRoomDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HouseRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  entryComponents: [NewHouseDialogComponent],
})
export class HouseModule {}
