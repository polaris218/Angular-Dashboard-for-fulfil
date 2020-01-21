import { ChartsModule } from 'ng2-charts';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent],
  imports: [RouterModule.forChild(routes), SharedModule, ChartsModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class HomeRoutingModule {}
