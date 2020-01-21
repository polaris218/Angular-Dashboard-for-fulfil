import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElasticSearchComponent } from './elastic-search.component';

describe('ElasticSearchComponent', () => {
  let component: ElasticSearchComponent;
  let fixture: ComponentFixture<ElasticSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ElasticSearchComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElasticSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
