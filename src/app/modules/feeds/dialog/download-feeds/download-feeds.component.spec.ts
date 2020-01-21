import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFeedsComponent } from './download-feeds.component';

describe('DownloadFeedsComponent', () => {
  let component: DownloadFeedsComponent;
  let fixture: ComponentFixture<DownloadFeedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadFeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
