import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAnnotationsComponent } from './image-annotations.component';

describe('ImageAnnotationsComponent', () => {
  let component: ImageAnnotationsComponent;
  let fixture: ComponentFixture<ImageAnnotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageAnnotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
