import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserPermissionsComponent } from './manage-user-permissions.component';

describe('ManageUserPermissionsComponent', () => {
  let component: ManageUserPermissionsComponent;
  let fixture: ComponentFixture<ManageUserPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageUserPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
