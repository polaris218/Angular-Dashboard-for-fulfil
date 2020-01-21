import { ICSVErrorPeriodicElement } from './../../../../core/';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-csv-errorlog',
  templateUrl: './csv-errorlog.component.html',
  styleUrls: ['./csv-errorlog.component.css']
})
export class CsvErrorlogComponent implements OnInit {
  displayedColumns: string[] = ['no', 'error'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<CsvErrorlogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   *  code function on component load
   */
  ngOnInit() {
    let ELEMENT_DATA: ICSVErrorPeriodicElement[] = [];
    this.data.errorList.forEach((error: any, index) => {
      ELEMENT_DATA.push({
        no: index + 1,
        error: error.error
      });
    });
    this.dataSource = ELEMENT_DATA;
  }

  /**
   *  close dialog
   */
  close(): void {
    this.dialogRef.close();
  }
}
