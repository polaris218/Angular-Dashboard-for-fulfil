import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadImageAnnotationImagesComponent } from './load-image-annotation-images.component';

describe('LoadImageAnnotationImagesComponent', () => {
  let component: LoadImageAnnotationImagesComponent;
  let fixture: ComponentFixture<LoadImageAnnotationImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadImageAnnotationImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadImageAnnotationImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
