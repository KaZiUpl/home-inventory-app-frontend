import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { ComponentsModule } from './components/components.module';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ComponentsModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
