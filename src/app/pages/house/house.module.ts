import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { HouseRoutingModule } from './house-routing.module';
import { HouseListComponent } from './components/house-list/house-list.component';
import { HouseViewComponent } from './components/house-view/house-view.component';
import { HouseEditComponent } from './components/house-edit/house-edit.component';
import { NewHouseComponent } from './components/new-house/new-house.component';

@NgModule({
  declarations: [
    HouseListComponent,
    HouseViewComponent,
    HouseEditComponent,
    NewHouseComponent,
  ],
  imports: [CommonModule, HouseRoutingModule, MatCardModule],
})
export class HouseModule {}
