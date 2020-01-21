/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CsvErrorlogComponent } from './csv-errorlog.component';

describe('CsvErrorlogComponent', () => {
  let component: CsvErrorlogComponent;
  let fixture: ComponentFixture<CsvErrorlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvErrorlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvErrorlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
