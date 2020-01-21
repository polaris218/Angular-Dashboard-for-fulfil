import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ImageViewerComponent } from './dialog/image-viewer/image-viewer.component';
import { LoadGroundTruthImagesComponent } from './dialog/load-ground-truth-images/load-ground-truth-images.component';

@Component({
  selector: 'app-ground-truth-tool',
  templateUrl: './ground-truth-tool.component.html',
  styleUrls: ['./ground-truth-tool.component.scss']
})
export class GroundTruthToolComponent implements OnInit {
  passRadio = 'passFail';
  btnsPass = 1;
  iTypeRadio = 'rgb';
  accessToken: any;
  groundImages: any[] = [];
  groundImagesOnly: any[] = [];
  finalGroungImages: any[] = [];
  isLoading = false;
  grade: any;
  gradeArray: any[] = [];
  remainImages = 0;
  inventoryId: any;
  // Current operator who are going to do regrading of images.
  operator: any;
  // Previous operator who did grading of images.
  operatorId: number;
  btnAllDisable = 1;
  groundTruthGradedId: any;
  pageNumber = 0;
  uncertain = false;
  guideVersion: any;
  gradingType: string;

  constructor(
    public dialog: MatDialog,
    private commonService: CommonService,
    private snackBar: MatSnackBar
  ) {}

  /**
   *  code function on component load
   */
  ngOnInit() {
    this.getAccessToken();
    this.setOperator();
    this.getOperator();
    this.setGuideVersion();
    this.getGuideVersion();
    this.setGradingType();
    this.getGradingType();
    this.loadImages(0);
  }

  /**
   * get operator from localstorege and set to variable.
   */
  getOperator(): void {
    this.operator = window.localStorage.getItem('operator');
  }

  /**
   * set operator to localstorege.
   */
  setOperator(): void {
    if (window.localStorage.getItem('operator') == null) {
      window.localStorage.setItem('operator', '1');
    }
  }

  /**
   * get GradingType from localstorege and set to variable.
   */
  getGradingType(): void {
    this.gradingType = window.localStorage.getItem('gradingType');
  }

  /**
   * set GradingType to localstorege.
   */
  setGradingType(): void {
    if (window.localStorage.getItem('gradingType') == null) {
      window.localStorage.setItem('gradingType', 'Ungraded');
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
   * Open Load image dialog
   */
  loadImageDialog(): void {
    // tslint:disable-next-line
    const dialogRef = this.dialog.open(LoadGroundTruthImagesComponent, {
      width: '400px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.eventType === 'buttonClick') {
        this.getAccessToken();
        this.loadImages();
      }
    });
  }

  /**
   * Change grade
   */
  changePRadio() {
    if (this.passRadio === 'passFail') {
      this.btnsPass = 1;
    } else {
      this.btnsPass = 0;
    }
  }
  /**
   * Get AccessToken
   */
  getAccessToken() {
    this.btnAllDisable = 1;
    this.isLoading = true;
    this.commonService.getAccessToken().subscribe(
      data => {
        const token = [];
        token.push(data);
        this.accessToken = token[0].access_token;
      },
      error => {
        this.createErrorLog(error.message);
      }
    );
  }

  /**
   * Load image base on pagenumber. For ungraded it is always zero and for graded it gets changed.
   * @param pageNumber pageNumber
   */
  loadImages(pageNumber: number = 0) {
    this.getOperator();
    this.getGradingType();
    this.groundImagesOnly = [];
    this.finalGroungImages = [];
    this.groundImages = [];
    this.uncertain = false;
    const pId = window.localStorage.getItem('groundpId');
    const startTime = window.localStorage.getItem('groundStartTime');
    const endTime = window.localStorage.getItem('groundEndTime');
    const randomize = window.localStorage.getItem('randomize');
    this.commonService
      .loadGroundImages(
        pId,
        startTime,
        endTime,
        this.gradingType,
        pageNumber,
        this.operator,
        randomize
      )
      .subscribe(
        data => {
          this.groundImages.push(data);
          this.remainImages = this.groundImages[0][0].remainImages;
          this.inventoryId = this.groundImages[0][0].inventory_id;
          this.groundImagesOnly = this.groundImages[0][0].images;
          if (this.groundImagesOnly.length === 0) {
            this.groundTruthGradedId = '';
            this.grade = '';
            this.uncertain = false;
            this.operatorId = 0;
            this.openSnackBar(
              `No ${
                this.gradingType ? this.gradingType : 'Ungraded'
              } images found!`,
              'Close'
            );
          }
          for (let i = 0; i < this.groundImagesOnly.length; i++) {
            const imageUrl =
              'https://storage.googleapis.com/' +
              `${this.groundImagesOnly[i].base_cloud_url}/` +
              `${this.groundImagesOnly[i].filename}?access_token=${this.accessToken}`;
            this.finalGroungImages.push({
              image: imageUrl,
              image_type: this.groundImagesOnly[i].image_type
            });
            if (i + 1 === this.groundImagesOnly.length) {
              this.groundTruthGradedId = this.groundImagesOnly[i].grId;
              this.grade = this.groundImagesOnly[i].grade;
              this.uncertain = this.groundImagesOnly[i].uncertain;
              this.operatorId = this.groundImagesOnly[i].operatorId;
              if (this.grade && this.gradingType === 'Graded') {
                this.passRadio = 'abc';
                if (
                  this.grade.toLowerCase() === 'pass' ||
                  this.grade.toLowerCase() === 'fail'
                ) {
                  this.passRadio = 'passFail';
                }
                this.changePRadio();
              }
            }
          }
          this.btnAllDisable = 0;
          this.isLoading = false;
        },
        error => {
          this.createErrorLog(error.message);
          this.isLoading = false;
        }
      );
  }

  /**
   * set grade and insert or update data in to db.
   * @param grade grade
   */
  setGrade(grade: string) {
    this.grade = grade;
    this.insertOrUpdateGrade();
  }

  /**
   * Insert or update data in to db.
   */
  insertOrUpdateGrade() {
    this.isLoading = true;
    this.gradeArray = [];
    let finalDate = '';
    let date = '';
    let month = '';
    const datetime = new Date();
    const dd = datetime.getDate();
    const mm = datetime.getMonth() + 1;
    const yyyy = datetime.getFullYear();
    if (dd < 10) {
      date = '0' + dd;
    }
    if (mm < 10) {
      month = '0' + mm;
    }
    const time = `${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`;
    finalDate = `${yyyy}-${mm}-${dd} ${time}`;
    this.getGuideVersion();
    this.gradeArray.push({
      operator_id: this.operator,
      inventory_id: this.inventoryId,
      time_graded: finalDate,
      grade: this.grade,
      method: 'image',
      guide_version: this.guideVersion,
      grId: this.groundTruthGradedId,
      uncertain: this.uncertain
    });
    let pageNum = 0;
    if (this.gradingType.toLowerCase() === 'graded') {
      pageNum = (this.pageNumber += 1);
    } else {
      pageNum = 0;
    }
    this.commonService.insertGroundTruth(this.gradeArray).subscribe(
        (data: any) => {
          this.commonService
            .insertOperatorGrade(
              data.id,
              this.operator,
              this.operatorId ? +this.operatorId : 0,
              this.inventoryId
            )
            .subscribe(response => {
              this.openSnackBar('Grade Set Successfully', 'Close');
              this.isLoading = false;
              this.getAccessToken();
              this.loadImages(pageNum);
              this.btnAllDisable = 1;
            });
        },
        error => {
          this.createErrorLog(error.message);
          this.openSnackBar('Grade Set Failed', 'Close');
          this.isLoading = false;
        }
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
   * Open the snackbar
   * @param message message
   * @param action action
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }

  /**
   * open Image Viewer
   * @param imageURL imageURL
   */
  openImageViewer(imageURL: string) {
    this.dialog.open(ImageViewerComponent, {
      data: {
        images: [imageURL]
      },
      height: '800px',
      panelClass: 'no-padding-dialog'
    });
  }
}
