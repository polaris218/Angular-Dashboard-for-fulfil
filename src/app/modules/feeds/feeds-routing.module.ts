import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';
import { FeedsComponent } from './feeds.component';
import { CsvErrorlogComponent } from './dialog/csv-errorlog/csv-errorlog.component';
import { DownloadFeedsComponent } from './dialog/download-feeds/download-feeds.component';

const routes: Routes = [{ path: '', component: FeedsComponent }];

@NgModule({
  declarations: [FeedsComponent, CsvErrorlogComponent, DownloadFeedsComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: [CsvErrorlogComponent, DownloadFeedsComponent]
})
export class FeedsRoutingModule {}
