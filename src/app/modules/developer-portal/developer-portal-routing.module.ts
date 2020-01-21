import { SharedModule } from './../../shared';
import { DeveloperPortalComponent } from './developer-portal.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: DeveloperPortalComponent }];

@NgModule({
  declarations: [DeveloperPortalComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class DeveloperPortalRoutingModule {}
