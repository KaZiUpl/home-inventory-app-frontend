import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingModule } from './default-routing.module';
import { DefaultComponent } from './default.component';
import { ComponentsModule } from '../../components/components.module';
import { AuthModule } from '../../pages/auth/auth.module';

@NgModule({
  declarations: [DefaultComponent],
  imports: [CommonModule, DefaultRoutingModule, ComponentsModule, AuthModule],
})
export class DefaultModule {}
