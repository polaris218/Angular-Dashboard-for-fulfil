import { UnauthorizedComponent } from './unauthorized.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: UnauthorizedComponent }];

@NgModule({
  declarations: [UnauthorizedComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class UnauthorizedRoutingModule {}
