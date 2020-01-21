import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttrComponent } from './attr.component';

describe('AttrComponent', () => {
  let component: AttrComponent;
  let fixture: ComponentFixture<AttrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
