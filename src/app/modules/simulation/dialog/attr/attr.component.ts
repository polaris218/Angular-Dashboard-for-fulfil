import { IDialogData } from './../../../../core';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-attr',
  templateUrl: './attr.component.html',
  styleUrls: ['./attr.component.css']
})
export class AttrComponent implements OnInit {
  selectedAttr: any[] = [];
  subSelectedArray: any[] = [];
  subSelectedArray1: any[] = [];
  withKey = 0;
  isLoading = false;

  constructor(
    public dialogRefAttr: MatDialogRef<AttrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData
  ) {}

  /**
   *  call function on component load
   */
  ngOnInit() {
    this.subSelectedArray = [];
    this.subSelectedArray1 = [];
    if (window.localStorage.getItem('arrayno') === '1') {
      this.selectedAttr.push(
        JSON.parse(window.localStorage.getItem('selectedArrt'))
      );
      this.withKey = 0;
      this.subSelectedArray = this.selectedAttr;
    } else if (window.localStorage.getItem('arrayno') === '2') {
      this.selectedAttr.push(
        JSON.parse(window.localStorage.getItem('GroupParameters'))
      );
      for (const key in this.selectedAttr) {
        if (key) {
          for (const innerKey in this.selectedAttr[key]) {
            if (innerKey) {
              for (const innerKey1 in this.selectedAttr[key][innerKey]) {
                if (innerKey1) {
                  this.subSelectedArray1.push({
                    Key: innerKey1,
                    value: this.selectedAttr[key][innerKey][innerKey1]
                  });
                }
              }
            }
          }
        }
      }
      this.withKey = 1;
    } else if (window.localStorage.getItem('arrayno') === '3') {
      this.selectedAttr.push(
        JSON.parse(window.localStorage.getItem('OrdersPerHour'))
      );
      this.withKey = 0;
      this.subSelectedArray = this.selectedAttr;
    } else if (window.localStorage.getItem('arrayno') === '4') {
      this.selectedAttr.push(
        JSON.parse(window.localStorage.getItem('RefillsPerHour'))
      );
      this.withKey = 0;
      this.subSelectedArray = this.selectedAttr;
    } else if (window.localStorage.getItem('arrayno') === '5') {
      this.selectedAttr.push(
        JSON.parse(window.localStorage.getItem('StorageTypeUsage'))
      );
      this.withKey = 0;
      this.subSelectedArray = this.selectedAttr;
    } else if (window.localStorage.getItem('arrayno') === '6') {
      this.selectedAttr.push(
        JSON.parse(window.localStorage.getItem('ItemCountProb'))
      );
      this.withKey = 0;
      this.subSelectedArray = this.selectedAttr;
    }
  }

  /**
   * on Close
   */
  onClose(): void {
    this.dialogRefAttr.close();
    this.isLoading = false;
  }
}
