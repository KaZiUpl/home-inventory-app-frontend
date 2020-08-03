import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingModule } from './default-routing.module';
import { DefaultComponent } from './default.component';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [DefaultComponent],
  imports: [CommonModule, DefaultRoutingModule, ComponentsModule],
})
export class DefaultModule {}
