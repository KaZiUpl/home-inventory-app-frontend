import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ResponsiveSidenavDirective } from './responsive-sidenav.directive';

@NgModule({
  declarations: [ResponsiveSidenavDirective],
  imports: [CommonModule, LayoutModule, MatSidenavModule],
  exports: [ResponsiveSidenavDirective]
})
export class ResponsiveSidenavModule {}
