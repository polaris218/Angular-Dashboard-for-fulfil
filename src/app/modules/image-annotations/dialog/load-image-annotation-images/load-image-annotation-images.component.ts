import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from '../../../../core';

@Component({
  selector: 'app-load-image-annotation-images',
  templateUrl: './load-image-annotation-images.component.html',
  styleUrls: ['./load-image-annotation-images.component.css']
})
export class LoadImageAnnotationImagesComponent implements OnInit {
  startTime = new FormControl();
  endTime = new FormControl();
  productSel = new FormControl();
  irChk = new FormControl();
  rgbChk = new FormControl();
  labelledChk = new FormControl();
  unlabelledChk = new FormControl();
  gradeAChk = new FormControl();
  gradeBChk = new FormControl();
  gradeCChk = new FormControl();
  gradePassChk = new FormControl();
  gradeFailChk = new FormControl();
  products: any[] = [];
  finalProducts: any[] = [];
  fillSelectedPId: any;
  fillStartTime: any;
  fillEndTime: any;
  fillIrChk = true;
  fillRgbChk = true;
  isLoading = false;
  fillUnlabelledChk = true;
  fillLabelledChk = false;
  fillGradeAChk = false;
  fillGradeBChk = false;
  fillGradeCChk = false;
  fillGradePassChk = false;
  fillGradeFailChk = false;
  fillDialogVersion = '';
  dialogVersion = new FormControl();
  fillgroupId = '';
  groupId = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<LoadImageAnnotationImagesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public router: Router,
    private commonService: CommonService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * call function on component load
   */
  ngOnInit() {
    this.fillDialogVersion = window.localStorage.getItem('dialogVersion');
    if (window.localStorage.getItem('groupId') != null) {
      this.fillgroupId = window.localStorage.getItem('groupId');
    }
    this.getProducts();
    if (window.localStorage.getItem('irChk') != null) {
      this.fillIrChk = JSON.parse(window.localStorage.getItem('irChk'));
    }
    if (window.localStorage.getItem('rgbChk') != null) {
      this.fillRgbChk = JSON.parse(window.localStorage.getItem('rgbChk'));
    }
    if (window.localStorage.getItem('labelledChk') != null) {
      this.fillLabelledChk = JSON.parse(
        window.localStorage.getItem('labelledChk')
      );
    }
    if (window.localStorage.getItem('unLabelledChk') != null) {
      this.fillUnlabelledChk = JSON.parse(
        window.localStorage.getItem('unLabelledChk')
      );
    }
    if (window.localStorage.getItem('gradeAChk') != null) {
      this.fillGradeAChk = JSON.parse(window.localStorage.getItem('gradeAChk'));
    }
    if (window.localStorage.getItem('gradeBChk') != null) {
      this.fillGradeBChk = JSON.parse(window.localStorage.getItem('gradeBChk'));
    }
    if (window.localStorage.getItem('gradeCChk') != null) {
      this.fillGradeCChk = JSON.parse(window.localStorage.getItem('gradeCChk'));
    }
    if (window.localStorage.getItem('gradePassChk') != null) {
      this.fillGradePassChk = JSON.parse(
        window.localStorage.getItem('gradePassChk')
      );
    }
    if (window.localStorage.getItem('gradeFailChk') != null) {
      this.fillGradeFailChk = JSON.parse(
        window.localStorage.getItem('gradeFailChk')
      );
    }
  }

  /**
   * Get Products
   */
  getProducts() {
    this.isLoading = true;
    this.commonService.getProducts().subscribe(
      data => {
        this.finalProducts = [];
        this.products.push(data);
        this.products = this.products[0];
        for (const item of this.products) {
          this.finalProducts.push(item);
        }
        this.fillSelectedPId = +window.localStorage.getItem('selectedPId');
        if (
          window.localStorage.getItem('startDate') !== 'null' &&
          window.localStorage.getItem('startDate') !== null
        ) {
          this.fillStartTime = new Date(
            window.localStorage.getItem('startDate')
          );
        }
        if (
          window.localStorage.getItem('endDate') !== 'null' &&
          window.localStorage.getItem('endDate') !== null
        ) {
          this.fillEndTime = new Date(window.localStorage.getItem('endDate'));
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
   * On LoadImage
   */
  onLoadImage(): void {
    let imgType = '';
    let labelled = '';
    let unLabelled = '';
    let gradeType = '["null"]';
    const validate = this.checkValidation();
    if (validate === true) {
      window.localStorage.setItem('dialogVersion', this.dialogVersion.value);
      window.localStorage.setItem('groupId', this.groupId.value);
      imgType = this.getImageType();
      gradeType = this.getGradeType();
      if (this.labelledChk.value === true) {
        labelled = 'yes';
        window.localStorage.setItem('labelledChk', 'true');
      }
      if (this.unlabelledChk.value === true) {
        unLabelled = 'yes';
        window.localStorage.setItem('unLabelledChk', 'true');
      }
      let startDate = '';
      let endDate = '';
      if (this.startTime.value == null) {
        startDate = null;
      } else {
        startDate = new Date(this.startTime.value).toISOString();
      }
      if (this.endTime.value == null) {
        endDate = null;
      } else {
        endDate = new Date(this.endTime.value).toISOString();
      }
      window.localStorage.setItem('startDate', startDate);
      window.localStorage.setItem('endDate', endDate);
      if (this.productSel.value !== 0) {
        const selectedProduct = this.finalProducts.find(
          x => x.id === this.productSel.value
        );
        window.localStorage.setItem('selectedSku', selectedProduct.sku);
        window.localStorage.setItem('selectedPId', selectedProduct.id);
        window.localStorage.setItem('selectedPName', selectedProduct.name);
        this.dialogRef.close();
      } else {
        this.openSnackBar('Please Select Product', 'Close');
      }
      const pId = window.localStorage.getItem('selectedPId');
      if (gradeType === '["null"]') {
        this.commonService
          .getSearchImages(
            pId,
            startDate,
            endDate,
            0,
            imgType,
            labelled,
            unLabelled
          )
          .subscribe(
            data => {
              window.localStorage.setItem('imageArray', JSON.stringify(data));
            },
            error => {
              this.createErrorLog(error.message);
            }
          );
      } else {
        this.commonService
          .getSearchImages(
            pId,
            startDate,
            endDate,
            0,
            imgType,
            labelled,
            unLabelled
          )
          .subscribe(
            data => {
              const mainData = data;
              const blankArray = [];
              window.localStorage.setItem(
                'imageArray',
                JSON.stringify(mainData)
              );
              this.commonService
                .getGradeFilter(gradeType, data[0].inventory_id)
                .subscribe(
                  result => {
                    const datas = [];
                    datas.push(result);
                    if (datas[0].length === 0) {
                      window.localStorage.setItem(
                        'imageArray',
                        JSON.stringify(blankArray)
                      );
                    } else {
                      window.localStorage.setItem(
                        'imageArray',
                        JSON.stringify(mainData)
                      );
                    }
                  },
                  error => {
                    this.createErrorLog(error.message);
                  }
                );
            },
            error => {
              this.createErrorLog(error.message);
            }
          );
      }
    }
  }
  /**
   * Check Validation
   */
  checkValidation() {
    if (this.irChk.value === false && this.rgbChk.value === false) {
      this.openSnackBar('Please Select Atleast One Image Type', 'Close');
      return false;
    } else if (
      this.labelledChk.value === false &&
      this.unlabelledChk.value === false
    ) {
      this.openSnackBar('Please Select Labelled or Unlabelled', 'Close');
      return false;
    } else if (this.dialogVersion.value === '') {
      this.openSnackBar('Please Enter Version', 'Close');
      return false;
    } else if (!this.groupId || !this.groupId.value) {
      this.openSnackBar('Please Enter Group ID', 'Close');
      return false;
    } else {
      return true;
    }
  }
  /**
   * Get ImageType
   */
  getImageType() {
    if (this.irChk.value === true && this.rgbChk.value === false) {
      window.localStorage.setItem('irChk', 'true');
      window.localStorage.setItem('rgbChk', 'false');
      return 'ir';
    }
    if (this.irChk.value === false && this.rgbChk.value === true) {
      window.localStorage.setItem('irChk', 'false');
      window.localStorage.setItem('rgbChk', 'true');
      return 'rgb';
    }
    if (this.irChk.value === true && this.rgbChk.value === true) {
      window.localStorage.setItem('irChk', 'true');
      window.localStorage.setItem('rgbChk', 'true');
      return 'ir,rgb';
    }
  }
  /**
   * Get GradeType
   * @param items items
   */
  getGradeType() {
    const selectedGradeTypes = [];
    window.localStorage.setItem('gradePassChk', 'false');
    window.localStorage.setItem('gradeFailChk', 'false');
    window.localStorage.setItem('gradeAChk', 'false');
    window.localStorage.setItem('gradeBChk', 'false');
    window.localStorage.setItem('gradeCChk', 'false');

    if (this.gradeAChk.value === true) {
      window.localStorage.setItem('gradeAChk', 'true');
      selectedGradeTypes.push('"a"');
    }
    if (this.gradeBChk.value === true) {
      window.localStorage.setItem('gradeBChk', 'true');
      selectedGradeTypes.push('"b"');
    }
    if (this.gradeCChk.value === true) {
      window.localStorage.setItem('gradeCChk', 'true');
      selectedGradeTypes.push('"c"');
    }
    if (this.gradePassChk.value === true) {
      window.localStorage.setItem('gradePassChk', 'true');
      selectedGradeTypes.push('"pass"');
    }
    if (this.gradeFailChk.value === true) {
      window.localStorage.setItem('gradeFailChk', 'true');
      selectedGradeTypes.push('"fail"');
    }
    if (selectedGradeTypes.length === 0) {
      selectedGradeTypes.push('"null"');
    }
    return `[${selectedGradeTypes.join(',')}]`;
  }
  /**
   * CloseMain
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
   * Open the snackbar
   * @param message message
   * @param action action
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }
}
