import { OrdersComponent } from './orders.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';

const routes: Routes = [{ path: '', component: OrdersComponent }];

@NgModule({
  declarations: [OrdersComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class OrdersRoutingModule {}
