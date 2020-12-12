import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { HouseRoutingModule } from './house-routing.module';
import { HouseComponent } from './house.component';
import { HouseListComponent } from './house-list/house-list.component';

@NgModule({
  declarations: [HouseComponent, HouseListComponent],
  imports: [CommonModule, HouseRoutingModule, MatCardModule],
})
export class HouseModule {}
