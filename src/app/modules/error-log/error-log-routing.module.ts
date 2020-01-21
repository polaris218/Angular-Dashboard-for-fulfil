import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';
import { ErrorLogComponent } from './error-log.component';

const routes: Routes = [{ path: '', component: ErrorLogComponent }];

@NgModule({
  declarations: [ErrorLogComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class ErrorLogRoutingModule {}
