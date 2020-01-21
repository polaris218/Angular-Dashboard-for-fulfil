import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';
import { ManageUserPermissionsComponent } from './manage-user-permissions.component';
import { CreatePermissionGroupComponent } from './dialog/create-permission-group/create-permission-group.component';

const routes: Routes = [{ path: '', component: ManageUserPermissionsComponent }];

@NgModule({
  declarations: [ManageUserPermissionsComponent, CreatePermissionGroupComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: [CreatePermissionGroupComponent]
})
export class ManageUserPermissionsRoutingModule {}
