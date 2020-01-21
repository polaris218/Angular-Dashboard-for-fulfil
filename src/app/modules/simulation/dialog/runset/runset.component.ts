import { IUser, IDialogData } from './../../../../core';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSelectionList
} from '@angular/material';
import { CommonService } from './../../../../core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-runset',
  templateUrl: './runset.component.html',
  styleUrls: ['./runset.component.css']
})
export class RunsetComponent implements OnInit {
  runsetLists: any[] = [];
  finalRunsetLists: any[] = [];
  dateLists: any[] = [];
  runsetInput = new FormControl();
  selectRunset = new FormControl();
  dateInput = new FormControl();
  @ViewChild(MatSelectionList) runsets: MatSelectionList;
  filteredOptions: Observable<IUser[]>;
  options: IUser[] = [];
  searchedDate: any;
  limitMessage: any;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<RunsetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    public router: Router,
    private commonService: CommonService,
    public datepipe: DatePipe
  ) {}

  /**
   *  call function on component load
   */
  ngOnInit() {
    this.getRunsetList('');
  }

  /**
   * displayFn
   * @param user user
   */
  displayFn(user?: IUser): string | undefined {
    return user ? user.name : undefined;
  }

  /**
   * _filter
   * @param name name
   */
  private _filter(name: string): IUser[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  /**
   * on Search Runset
   */
  onSearchRunset() {
    let getedDate: any;
    let startdate: any;
    const newDate = new Date(this.dateInput.value);
    this.runsetLists = [];
    let dates: any;
    this.searchedDate = this.datepipe.transform(newDate, 'MM/dd/yyyy');
    if (
      (this.dateInput.value == null && this.runsetInput.value == null) ||
      this.runsetInput.value === ''
    ) {
    } else if (this.dateInput.value == null) {
      this.getRunsetList(this.runsetInput.value.name);
    } else if (
      this.runsetInput.value == null ||
      this.runsetInput.value === '' ||
      this.runsetInput.value === undefined
    ) {
      for (const item of this.dateLists[0]) {
        startdate = new Date(item.DateStart);
        getedDate = this.datepipe.transform(startdate, 'MM/dd/yyyy');
        if (this.searchedDate === getedDate) {
          dates = item;
          this.runsetLists.push(dates);
          this.runsetLists.reverse();
        }
      }
    } else {
      for (const item of this.dateLists[0]) {
        startdate = new Date(item.DateStart);
        getedDate = this.datepipe.transform(startdate, 'MM/dd/yyyy');
        if (this.searchedDate === getedDate) {
          dates = item;
          this.runsetLists.push(dates);
          this.runsetLists.reverse();
        }
      }
    }
  }

  /**
   * Get RunsetList
   * @param runsetId runsetId
   */
  getRunsetList(runsetId) {
    this.isLoading = true;
    this.commonService.getGraphData(runsetId).subscribe(
      data => {
        this.runsetLists = [];
        this.finalRunsetLists = [];
        this.dateLists = [];
        this.finalRunsetLists.push(data);
        for (const item of this.finalRunsetLists[0]) {
          this.runsetLists.push(item);
        }
        this.runsetLists.reverse();
        this.dateLists.push(data);
        this.setAutoComplete();
        this.isLoading = false;
      },
      error => {
        this.createErrorLog(error.message);
        this.isLoading = false;
      }
    );
  }
  /**
   * Set AutoComplete
   */
  setAutoComplete() {
    for (const item of this.runsetLists) {
      this.options.push({ name: item.id });
    }
    this.filteredOptions = this.runsetInput.valueChanges.pipe(
      startWith<string | IUser>(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.options.slice()))
    );
  }

  /**
   * Insert error log to db
   * @param error Error
   */
  createErrorLog(error) {
    this.commonService.createErrorLog(error).subscribe();
  }
  /**
   * on Select Call Runset
   */
  onSelectCallRunset(): void {
    this.limitMessage = '';
    if (this.selectRunset.value == null) {
      this.limitMessage = 'Please select at least 1 Runset ID.';
    } else if (this.selectRunset.value.length > 3) {
      this.limitMessage = ' You cannot select more than 3 Runset ID.';
    } else {
      this.router.navigate([
        '/simulation',
        { runset: this.selectRunset.value }
      ]);
      this.dialogRef.close();
    }
  }
  /**
   * on CloseMain
   */
  onCloseMain(): void {
    this.isLoading = false;
    this.dialogRef.close();
  }
}
