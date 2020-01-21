import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePermissionGroupComponent } from './create-permission-group.component';

describe('LoadImageAnnotationImagesComponent', () => {
  let component: CreatePermissionGroupComponent;
  let fixture: ComponentFixture<CreatePermissionGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePermissionGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePermissionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
