import { DocumentationComponent } from './documentation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';

const routes: Routes = [{ path: '', component: DocumentationComponent }];

@NgModule({
  declarations: [DocumentationComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class DocumentationRoutingModule {}
