import { ImageAnnotationsComponent } from './image-annotations.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';
import { LoadImageAnnotationImagesComponent } from './dialog/load-image-annotation-images/load-image-annotation-images.component';

const routes: Routes = [{ path: '', component: ImageAnnotationsComponent }];

@NgModule({
  declarations: [ImageAnnotationsComponent, LoadImageAnnotationImagesComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [],
  entryComponents: [LoadImageAnnotationImagesComponent]
})
export class ImageAnnotationsRoutingModule {}
