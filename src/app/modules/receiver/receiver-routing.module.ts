import { ReceiverComponent } from './receiver.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';

const routes: Routes = [{ path: '', component: ReceiverComponent }];

@NgModule({
  declarations: [ReceiverComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class ReceiverRoutingModule {}
