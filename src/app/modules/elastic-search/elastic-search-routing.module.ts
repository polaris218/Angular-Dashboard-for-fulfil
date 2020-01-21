import { ElasticSearchComponent } from './elastic-search.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';

const routes: Routes = [{ path: '', component: ElasticSearchComponent }];

@NgModule({
  declarations: [ElasticSearchComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class ElasticSearchRoutingModule {}
