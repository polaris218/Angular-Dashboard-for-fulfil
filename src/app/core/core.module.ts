import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard, CommonService } from './services';
import { JwtInterceptor } from './interceptors';
import { CustomPreloadingStrategy } from './statergy';

@NgModule({
  imports: [CommonModule],
  providers: [
    AuthGuard,
    CommonService,
    CustomPreloadingStrategy,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  declarations: []
})
export class CoreModule {}
