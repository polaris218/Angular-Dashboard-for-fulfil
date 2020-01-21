import { CreateItemComponent } from './create-item/create-item.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';

const routes: Routes = [{ path: '', component: CreateItemComponent }];

@NgModule({
  declarations: [CreateItemComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class ItemRoutingModule {}
