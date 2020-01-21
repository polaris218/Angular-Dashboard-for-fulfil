import { SharedModule } from './../../shared';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemUptimeComponent } from './system-uptime.component';
import { ChartsModule } from 'ng2-charts';

const routes: Routes = [{ path: '', component: SystemUptimeComponent }];

@NgModule({
  declarations: [SystemUptimeComponent],
  imports: [RouterModule.forChild(routes), SharedModule, ChartsModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class SystemUptimeRoutingModule {}
