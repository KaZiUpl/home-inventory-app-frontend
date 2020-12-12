import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { ItemRoutingModule } from './item-routing.module';
import { ItemComponent } from './item.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { NewItemComponent } from './components/new-item/new-item.component';

@NgModule({
  declarations: [ItemComponent, ItemListComponent, NewItemComponent],
  imports: [CommonModule, ItemRoutingModule, MatCardModule],
})
export class ItemModule {}
