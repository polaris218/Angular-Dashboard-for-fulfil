import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUptimeComponent } from './system-uptime.component';

describe('SystemUptimeComponent', () => {
  let component: SystemUptimeComponent;
  let fixture: ComponentFixture<SystemUptimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemUptimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemUptimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
