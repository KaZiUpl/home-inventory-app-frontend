import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HouseComponent } from './house.component';
import { HouseListComponent } from './house-list/house-list.component';

const routes: Routes = [
  { path: '', component: HouseListComponent },
  { path: ':id', component: HouseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HouseRoutingModule {}
