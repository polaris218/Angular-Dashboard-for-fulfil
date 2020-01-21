import { ChartsModule } from 'ng2-charts';
import { AttrComponent } from './dialog/attr/attr.component';
import { SimulationComponent } from './simulation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';
import { RunsetComponent } from './dialog/runset/runset.component';

const routes: Routes = [{ path: '', component: SimulationComponent }];

@NgModule({
  declarations: [SimulationComponent, AttrComponent, RunsetComponent],
  imports: [RouterModule.forChild(routes), SharedModule, ChartsModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: [AttrComponent, RunsetComponent]
})
export class SimulationRoutingModule {}
