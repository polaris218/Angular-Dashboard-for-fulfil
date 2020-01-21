import { ImplementationComponent } from './implementation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';

const routes: Routes = [{ path: '', component: ImplementationComponent }];

@NgModule({
  declarations: [ImplementationComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class ImplementationRoutingModule {}
