import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadGroundTruthImagesComponent } from './load-ground-truth-images.component';

describe('LoadGroundTruthImagesComponent', () => {
  let component: LoadGroundTruthImagesComponent;
  let fixture: ComponentFixture<LoadGroundTruthImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadGroundTruthImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadGroundTruthImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
