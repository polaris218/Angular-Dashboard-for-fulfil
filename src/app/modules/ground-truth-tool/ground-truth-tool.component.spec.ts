import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundTruthToolComponent } from './ground-truth-tool.component';

describe('GroundTruthToolComponent', () => {
  let component: GroundTruthToolComponent;
  let fixture: ComponentFixture<GroundTruthToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroundTruthToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroundTruthToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
