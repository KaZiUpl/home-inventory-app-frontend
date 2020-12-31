import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { DefaultRoutingModule } from './default-routing.module';
import { DefaultComponent } from './default.component';
import { ComponentsModule } from '../../components/components.module';
import { AuthModule } from '../../pages/auth/auth.module';
import { ResponsiveSidenavModule } from '../../directives/responsive-sidenav/responsive-sidenav.module';

import { HouseService } from '../../services/house.service';
import { ItemService } from '../../services/item.service';
import { RoomService } from '../../services/room.service';
@NgModule({
  declarations: [DefaultComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    DefaultRoutingModule,
    ComponentsModule,
    AuthModule,
    ResponsiveSidenavModule,
  ],
  providers: [HouseService, ItemService, RoomService],
})
export class DefaultModule {}
