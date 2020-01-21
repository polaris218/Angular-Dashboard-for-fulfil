import { AddMetaDataComponent } from './add-meta-data/add-meta-data.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';

const routes: Routes = [{ path: '', component: AddMetaDataComponent }];

@NgModule({
  declarations: [AddMetaDataComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class MetaDataRoutingModule {}
