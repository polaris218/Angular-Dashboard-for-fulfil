import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunsetComponent } from './runset.component';

describe('RunsetComponent', () => {
  let component: RunsetComponent;
  let fixture: ComponentFixture<RunsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
