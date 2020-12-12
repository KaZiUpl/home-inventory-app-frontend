import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './components/item-list/item-list.component';
import { NewItemComponent } from './components/new-item/new-item.component';
import { ItemComponent } from './item.component';

const routes: Routes = [
  {
    path: '',
    component: ItemComponent,
    children: [
      { path: '', component: ItemListComponent },
      { path: 'new-item', component: NewItemComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemRoutingModule {}
