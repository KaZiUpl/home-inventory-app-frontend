import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HouseListComponent } from './components/house-list/house-list.component';
import { HouseEditComponent } from './components/house-edit/house-edit.component';
import { HouseViewComponent } from './components/house-view/house-view.component';

const routes: Routes = [
  { path: '', component: HouseListComponent },
  { path: ':id', component: HouseViewComponent },
  { path: ':id/edit', component: HouseEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HouseRoutingModule {}
