import { ImageViewerComponent } from './dialog/image-viewer/image-viewer.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroundTruthToolComponent } from './ground-truth-tool.component';
import { LoadGroundTruthImagesComponent } from './dialog/load-ground-truth-images/load-ground-truth-images.component';
import { ImageViewerModule } from 'ngx-image-viewer';
import { SharedModule } from '../../shared';

const routes: Routes = [{ path: '', component: GroundTruthToolComponent }];

@NgModule({
  declarations: [
    GroundTruthToolComponent,
    ImageViewerComponent,
    LoadGroundTruthImagesComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    ImageViewerModule.forRoot(),
    SharedModule
  ],
  exports: [RouterModule],
  providers: [],
  entryComponents: [ImageViewerComponent, LoadGroundTruthImagesComponent]
})
export class GroundTruthToolRoutingModule {}
