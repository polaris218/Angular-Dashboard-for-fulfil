import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './shared';
import { CustomPreloadingStrategy, AuthGuard } from './core';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: './modules/home/home.module#HomeModule',
        data: { preload: true, delay: true, delayTime: 3000 }
      },
      {
        path: 'orders',
        loadChildren: './modules/orders/orders.module#OrdersModule'
      },
      {
        path: 'elastic-search',
        loadChildren:
          './modules/elastic-search/elastic-search.module#ElasticSearchModule'
      },
      {
        path: 'create-item',
        loadChildren: './modules/item/item.module#ItemModule'
      },
      {
        path: 'add-meta-data',
        loadChildren: './modules/meta-data/meta-data.module#MetaDataModule'
      },
      {
        path: 'error-log',
        loadChildren: './modules/error-log/error-log.module#ErrorLogModule'
      },
      {
        path: 'documentation',
        loadChildren:
          './modules/documentation/documentation.module#DocumentationModule'
      },
      {
        path: 'demos',
        loadChildren: './modules/demos/demos.module#DemosModule'
      },
      {
        path: 'simulation',
        loadChildren: './modules/simulation/simulation.module#SimulationModule'
      },
      {
        path: 'feeds',
        loadChildren: './modules/feeds/feeds.module#FeedsModule'
      },
      {
        path: 'image-annotations',
        loadChildren:
          './modules/image-annotations/image-annotations.module#ImageAnnotationsModule'
      },
      {
        path: 'ground-truth-tool',
        loadChildren:
          './modules/ground-truth-tool/ground-truth-tool.module#GroundTruthToolModule'
      },
      {
        path: 'receiver',
        loadChildren: './modules/receiver/receiver.module#ReceiverModule'
      },
      {
        path: 'unauthorized',
        loadChildren:
          './modules/unauthorized/unauthorized.module#UnauthorizedModule'
      },
      {
        path: 'customer-order',
        loadChildren: './modules/reorder/reorder.module#ReordersModule'
      },
      {
        path: 'developer-portal',
        loadChildren:
          './modules/developer-portal/developer-portal.module#DeveloperPortalModule'
      },
      {
        path: 'implementation',
        loadChildren:
          './modules/implementation/implementation.module#ImplementationModule'
      },
      {
        path: 'system-uptime',
        loadChildren:
          './modules/system-uptime/system-uptime.module#SystemUptimeModule'
      },
      {
        path: 'manage-user-permissions',
        loadChildren:
          './modules/manage-user-permissions/manage-user-permissions.module#ManageUserPermissionsModule'
      }
    ]
  },
  {
    path: '',
    loadChildren: './modules/auth/auth.module#AuthModule'
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreloadingStrategy
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
