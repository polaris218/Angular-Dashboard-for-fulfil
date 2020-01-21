import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from '../../../../core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-load-ground-truth-images',
  templateUrl: './load-ground-truth-images.component.html',
  styleUrls: ['./load-ground-truth-images.component.scss']
})
export class LoadGroundTruthImagesComponent implements OnInit {
  gradingType = 'Ungraded';
  gradings: string[] = ['Graded', 'Ungraded'];
  products: any[] = [];
  finalProducts: any[] = [];
  fillSelectedPId: any;
  fillStartTime: any;
  fillEndTime: any;
  isLoading = false;
  fillOperator: any;
  guideVersion: any;
  randomize = false;

  constructor(
    public dialogRef: MatDialogRef<LoadGroundTruthImagesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public router: Router,
    private commonService: CommonService,
    private snackBar: MatSnackBar
  ) {}

  /**
   *  code function on component load
   */
  ngOnInit() {
    this.getProducts();
    this.setOperator();
    this.getOperator();
    this.setGuideVersion();
    this.getGuideVersion();
    this.setRandomize();
    this.getRandomize();
  }
  /**
   * get operator from localstorege and set to variable.
   */
  getOperator(): void {
    this.fillOperator = window.localStorage.getItem('operator');
  }

  /**
   * set operator to localstorege.
   */
  setOperator(): void {
    if (window.localStorage.getItem('operator') === null) {
      window.localStorage.setItem('operator', '1');
    }
  }

  /**
   * set GuideVersion to localstorege.
   */
  setGuideVersion(): void {
    if (window.localStorage.getItem('guideVersion') === null) {
      window.localStorage.setItem('guideVersion', '');
    }
  }

  /**
   * Get GuideVersion from localstorege and set to variable.
   */
  getGuideVersion(): void {
    this.guideVersion = window.localStorage.getItem('guideVersion');
  }

  /**
   * set Randomize to localstorege.
   */
  setRandomize(): void {
    if (window.localStorage.getItem('randomize') === null) {
      window.localStorage.setItem('randomize', 'false');
    }
  }

  /**
   * Get Randomize from localstorege and set to variable.
   */
  getRandomize(): void {
    this.randomize =
      window.localStorage.getItem('randomize') === 'true' ? true : false;
  }

  /**
   * Get products.
   */
  getProducts() {
    this.isLoading = true;
    this.commonService.getProducts().subscribe(
      data => {
        this.finalProducts = [];
        this.products.push(data);
        this.products = this.products[0];
        this.fillSelectedPId = +window.localStorage.getItem('groundpId');
        // tslint:disable-next-line
        for (let i = 0; i < this.products.length; i++) {
          this.finalProducts.push(this.products[i]);
        }
        if (
          window.localStorage.getItem('groundStartTime') &&
          window.localStorage.getItem('groundStartTime') !== 'null'
        ) {
          this.fillStartTime = new Date(
            window.localStorage.getItem('groundStartTime')
          );
        }
        if (
          window.localStorage.getItem('groundEndTime') &&
          window.localStorage.getItem('groundEndTime') !== 'null'
        ) {
          this.fillEndTime = new Date(
            window.localStorage.getItem('groundEndTime')
          );
        }
        if (
          window.localStorage.getItem('gradingType') &&
          window.localStorage.getItem('gradingType') !== 'null'
        ) {
          this.gradingType = window.localStorage.getItem('gradingType');
        }
        this.isLoading = false;
      },
      error => {
        this.createErrorLog(error.message);
        this.isLoading = false;
      }
    );
  }

  /**
   * set values to localstorage and Load new set of images.
   */
  onLoadImage(): void {
    if (!this.fillSelectedPId) {
      window.localStorage.setItem('groundpId', 'null');
    } else {
      this.fillSelectedPId = this.fillSelectedPId;
      window.localStorage.setItem('groundpId', this.fillSelectedPId);
    }
    if (!this.fillStartTime) {
      window.localStorage.setItem('groundStartTime', 'null');
    } else {
      this.fillStartTime = new Date(this.fillStartTime).toISOString();
      window.localStorage.setItem('groundStartTime', this.fillStartTime);
    }
    if (!this.fillEndTime) {
      window.localStorage.setItem('groundEndTime', 'null');
    } else {
      this.fillEndTime = new Date(this.fillEndTime).toISOString();
      window.localStorage.setItem('groundEndTime', this.fillEndTime);
    }
    window.localStorage.setItem(
      'operator',
      this.fillOperator ? this.fillOperator : '1'
    );
    window.localStorage.setItem('randomize', this.randomize.toString());
    window.localStorage.setItem(
      'gradingType',
      this.gradingType ? this.gradingType : 'Ungraded'
    );
    this.dialogRef.close({ eventType: 'buttonClick' });
  }

  /**
   * Close dialog
   */
  onCloseMain(): void {
    this.dialogRef.close();
  }

  /**
   * Insert error log to db
   * @param error Error
   */
  createErrorLog(error) {
    this.commonService.createErrorLog(error).subscribe();
  }

  /**
   * Open snackbar
   * @param message message
   * @param action Action
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }

  /**
   * Set guide version value to localstorage on guide version textbox blur event.
   */
  onGuideVersionBlur() {
    window.localStorage.setItem('guideVersion', this.guideVersion);
  }

  /**
   * Reset filters
   */
  resetFilter() {
    this.fillSelectedPId = 0;
    this.fillStartTime = '';
    this.fillEndTime = '';
    this.fillOperator = '1';
    this.gradingType = 'Ungraded';
    this.guideVersion = '';
    this.randomize = false;
  }
}
