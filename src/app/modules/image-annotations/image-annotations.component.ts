import { LoadImageAnnotationImagesComponent } from './dialog/load-image-annotation-images/load-image-annotation-images.component';
import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import {
  changeDraw,
  deleteSelection,
  doRedoAct,
  doUndoAct,
  existingSelection,
  hideSelection,
  hideSingleSelection,
  removeBox,
  resetVar,
  selection,
  selectSelection,
  setLabelToArea,
  showSelection,
  undoDefects
} from '../../../assets/js/areaSelection';
import { CommonService } from '../../core';

@Component({
  selector: 'app-image-annotations',
  templateUrl: './image-annotations.component.html',
  styleUrls: ['./image-annotations.component.css']
})
export class ImageAnnotationsComponent implements OnInit {
  isLoading = false;
  defectList: any[] = [];
  defects: any[] = [];
  selectedArea: any[] = [];
  finalArray: any[] = [];
  selectedSku: any;
  selectedPId: any;
  selectedVersion: any;
  disabled = true;
  accessToken: any;
  hideBtnText = 'Hide All';
  hideAllArea = 0;
  imageUrl = '';
  imageArray: any[] = [];
  imageListArray: any[] = [];
  imageIndex = 0;
  nextDisable = 1;
  infoProductText = '';
  infoStartDateText = '';
  infoEndDateText = '';
  warnMessage = '';
  labelWarnText = '';
  imageBtns = '1';
  editedBoxesId: any[] = [];
  editMode = 0;
  isInputFocused = false;
  fillLabeler = '';
  labeler = new FormControl();
  @ViewChild('myImage') myImage: ElementRef;
  @ViewChild('myImageDiv') myImageDiv: ElementRef;
  imgWidth: any;
  imgHeight: any;
  opImg = 0;
  part: any;
  autoSaveChk = new FormControl();
  fillAutoSaveChk = false;
  modeText = '';
  colorsArray = [
    '#F60000',
    '#FF1493',
    '#FF8C00',
    '#3783FF',
    '#4815AA',
    '#A52A2A',
    '#4DE94C',
    '#808000',
    '#66CDAA',
    '#8FBC8F',
    '#20B2AA',
    '#5F9EA0',
    '#87CEFA',
    '#1E90FF',
    '#0000CD',
    '#191970',
    '#2F4F4F',
    '#778899',
    '#FFC0CB',
    '#D2691E',
    '#3CB371'
  ];
  selectedImageDetails = {
    inventoryId: ''
  };

  constructor(
    public dialog: MatDialog,
    private commonService: CommonService,
    public datepipe: DatePipe,
    private snackBar: MatSnackBar
  ) {}

  /**
   * On Focus
   */
  onFocus() {
    this.isInputFocused = true;
  }
  /**
   * On Blur
   */
  onBlur() {
    window.localStorage.setItem('labeler', this.labeler.value);
    this.isInputFocused = false;
  }

  /**
   * Does undo functionality
   */
  doUndoActivity() {
    doUndoAct();
  }

  /**
   * Does redo functionality
   */
  doRedoActivity() {
    doRedoAct();
  }

  // tslint:disable-next-line: completed-docs
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    const key = event.keyCode;
    if (!this.isInputFocused) {
      this.checkKeyCondition1(key);
      this.checkKeyCondition2(key);
      this.checkKeyCondition3(key);
      this.checkKeyCondition4(key);
    }
  }

  /**
   * Check Key Condition1
   * @param key key
   */
  checkKeyCondition1(key) {
    if (key === 68 /* d keycode */) {
      this.nextImage();
    } else if (key === 72 /* h keycode */) {
      this.hideAll();
    } else if (key === 87 /* w keycode */) {
      this.changeDrawMode();
    } else if (key === 65 && this.imageIndex !== 0 /* a keycode */) {
      this.previousImage();
    } else if (key === 97 || key === 49 /* 1 keycode */) {
      this.sendKeyCode(0);
    }
  }

  /**
   * Check Key Condition2
   * @param key key
   */
  checkKeyCondition2(key) {
    if (key === 98 || key === 50 /* 2 keycode */) {
      this.sendKeyCode(1);
    } else if (key === 99 || key === 51 /* 3 keycode */) {
      this.sendKeyCode(2);
    } else if (key === 100 || key === 52 /* 4 keycode */) {
      this.sendKeyCode(3);
    } else if (key === 101 || key === 53 /* 5 keycode */) {
      this.sendKeyCode(4);
    }
  }

  /**
   * Check Key Condition3
   * @param key key
   */
  checkKeyCondition3(key) {
    if (key === 102 || key === 54 /* 6 keycode */) {
      this.sendKeyCode(5);
    } else if (key === 103 || key === 55 /* 7 keycode */) {
      this.sendKeyCode(6);
    } else if (key === 104 || key === 56 /* 8 keycode */) {
      this.sendKeyCode(7);
    }
  }

  /**
   * Check Key Condition4
   * @param key key
   */
  checkKeyCondition4(key) {
    if (key === 105 || key === 57 /* 9 keycode */) {
      this.sendKeyCode(8);
    } else if (key === 96 || key === 48 /* 0 keycode */) {
      this.setDefect('No defect', '#2BB673');
    } else if (key === 110 || key === 46 /* Delete or Del keycode */) {
      const id = window.localStorage.getItem('curBoxId');
      window.localStorage.setItem('curBoxId', 'null');
      if (id !== 'null') {
        removeBox(id);
      }
    }
  }

  /**
   * Send Key Code
   * @param keyPressed keyPressed
   */
  sendKeyCode(keyPressed) {
    if (this.defectList[keyPressed] !== undefined) {
      this.setDefect(
        this.defectList[keyPressed].label_name,
        this.colorsArray[keyPressed]
      );
    }
  }

  /**
   * call function on component load
   */
  ngOnInit() {
    if (window.localStorage.getItem('labeler') == null) {
      window.localStorage.setItem('labeler', 'Labeler');
    }
    if (window.localStorage.getItem('drawMode') == null) {
      window.localStorage.setItem('drawMode', 'Draw Mode');
    }
    if (window.localStorage.getItem('autoSave') == null) {
      window.localStorage.setItem('autoSave', 'false');
    }
    this.fillLabeler = window.localStorage.getItem('labeler');
    if (window.localStorage.getItem('dialogVersion') == null) {
      window.localStorage.setItem('dialogVersion', '1');
    }
    this.fillAutoSaveChk = JSON.parse(window.localStorage.getItem('autoSave'));
    this.selectedVersion = window.localStorage.getItem('dialogVersion');
    this.modeText = window.localStorage.getItem('drawMode');
    selection();
    this.loadLabels();
    this.loadImages();
    // tslint:disable-next-line: no-eval
    eval('window.ImageannotationsComponent = this');
    this.checkValidate();
    if (window.localStorage.getItem('imageIndex') === 'null') {
      window.localStorage.setItem('imageIndex', '0');
    }
    this.imageIndex = +window.localStorage.getItem('imageIndex');
  }

  /**
   * Change DrawMode
   */
  changeDrawMode() {
    if (this.modeText === 'Draw Mode') {
      this.modeText = 'Edit Mode';
      window.localStorage.setItem('drawMode', this.modeText);
    } else {
      this.modeText = 'Draw Mode';
      window.localStorage.setItem('drawMode', this.modeText);
    }
    changeDraw();
  }

  /**
   * Select Selection
   * @param id id
   */
  selectSelection(id) {
    selectSelection(id);
  }

  /**
   * Check Validate
   */
  checkValidate() {
    if (
      window.localStorage.getItem('selectedPId') === 'null' ||
      window.localStorage.getItem('selectedPId') == null
    ) {
      this.warnMessage =
        'Please click on Load Images button to load product image';
    } else {
      this.warnMessage = '';
    }
  }

  /**
   * Load Labels
   */
  loadLabels() {
    this.selectedSku = window.localStorage.getItem('selectedSku');
    this.selectedPId = window.localStorage.getItem('selectedPId');
    if (this.selectedPId != null) {
      this.getAnnotationLabels();
    }
  }

  /**
   * Load Images
   */
  loadImages() {
    this.infoProductText = window.localStorage.getItem('selectedPName');
    this.infoStartDateText = '';
    this.infoEndDateText = '';
    const strtDate = window.localStorage.getItem('startDate');
    const enDate = window.localStorage.getItem('endDate');
    if (strtDate !== null && strtDate !== 'null') {
      const newDate = new Date(window.localStorage.getItem('startDate'));
      const latestDate = this.datepipe.transform(newDate, 'MM-dd-yyyy');
      this.infoStartDateText = latestDate;
    }
    if (enDate !== null && enDate !== 'null') {
      const newDate = new Date(window.localStorage.getItem('endDate'));
      const latestDate = this.datepipe.transform(newDate, 'MM-dd-yyyy');
      this.infoEndDateText = latestDate;
    }
    if (window.localStorage.getItem('imageArray') !== null) {
      this.imageArray = [];
      this.selectedPId = window.localStorage.getItem('selectedPId');
      setTimeout(() => {
        this.imageArray.push(
          JSON.parse(window.localStorage.getItem('imageArray'))
        );
        this.imageArray = this.imageArray[0];
        if (this.imageArray.length === 0) {
          this.warnMessage =
            'No image found for this product. Please select another product';
          this.imageBtns = '1';
          deleteSelection();
        } else {
          this.imageBtns = '0';
        }
        this.setImageUrl();
      }, 500);
      this.isLoading = false;
    }
  }

  /**
   * Remove Labeling
   * @param id id
   */
  removeLabeling(id) {
    this.removeDefect(id);
    this.remDefFinal(id);
  }

  /**
   * rem DefFinal
   * @param id id
   */
  remDefFinal(id) {
    const objIndex = this.defects.findIndex(obj => obj.id === id);
    this.defects.splice(objIndex, 1);
  }

  /**
   * Discard Image
   */
  discardImage() {
    deleteSelection();
  }

  /**
   * Hide All
   */
  hideAll() {
    if (this.hideAllArea === 0) {
      hideSelection();
      this.hideBtnText = 'Show All';
      this.hideAllArea = 1;
    } else {
      showSelection();
      this.hideBtnText = 'Hide All';
      this.hideAllArea = 0;
    }
  }

  /**
   * Hide Single
   */
  hideSingle() {
    const id = window.localStorage.getItem('curBoxId');
    hideSingleSelection(id);
    this.hideBtnText = 'Show All';
    this.hideAllArea = 1;
  }

  /**
   * Get Annotation Labels
   */
  getAnnotationLabels() {
    this.defectList = [];
    const groupId = window.localStorage.getItem('groupId');
    const versionNumber = window.localStorage.getItem('dialogVersion');
    this.commonService.getAnnotationLabels(groupId, versionNumber).subscribe(
      data => {
        this.defectList.push(data);
        this.defectList = this.defectList[0];
        window.localStorage.setItem(
          'defectList',
          JSON.stringify(this.defectList)
        );
        if (this.defectList.length === 0) {
          this.labelWarnText = 'No labels found';
        } else {
          this.labelWarnText = '';
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
   * LoadImageDialog
   */
  loadImageDialog(): void {
    this.isInputFocused = true;
    const dialogRef = this.dialog.open(LoadImageAnnotationImagesComponent, {
      width: '400px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isLoading = true;
      this.isInputFocused = false;
      setTimeout(() => {
        this.selectedVersion = window.localStorage.getItem('dialogVersion');
        this.loadImages();
        this.loadLabels();
        this.checkValidate();
        window.localStorage.setItem('imageUrl', '');
        window.localStorage.setItem('imageIndex', '0');
      }, 1000);
    });
  }

  /**
   * Next Image
   */
  nextImage() {
    this.opImg = 0;
    window.localStorage.setItem('autoSave', this.autoSaveChk.value);
    this.imageIndex = this.imageIndex + 1;
    window.localStorage.setItem('imageIndex', `${this.imageIndex}`);
    if (this.autoSaveChk.value === true) {
      this.saveImage();
    } else {
      deleteSelection();
      this.setImageUrl();
      this.isLoading = true;
      this.defects = [];
      resetVar();
    }
  }

  /**
   * Previous Image
   */
  previousImage() {
    this.opImg = 0;
    window.localStorage.setItem('autoSave', this.autoSaveChk.value);
    this.imageIndex = this.imageIndex - 1;
    window.localStorage.setItem('imageIndex', `${this.imageIndex}`);
    if (this.autoSaveChk.value === true) {
      this.saveImage();
    } else {
      deleteSelection();
      this.setImageUrl();
      this.isLoading = true;
      this.defects = [];
      resetVar();
    }
  }

  /**
   * Set Bounding Boxes
   */
  setBoundingBoxes() {
    this.editMode = 1;
    this.editedBoxesId = [];
    const vers = window.localStorage.getItem('dialogVersion');
    this.commonService
      .getBoundingBoxes(this.imageArray[this.imageIndex].id, vers)
      .subscribe(
        data => {
          const boxesData = [];
          const boxAreaArray = [];
          const editDefects = [];
          deleteSelection();
          boxesData.push(data);
          if (boxesData[0].length !== 0) {
            window.localStorage.setItem('editMode', '1');
          } else {
            window.localStorage.setItem('editMode', '0');
          }
          for (let i = 0; i < boxesData[0].length; i++) {
            const height = boxesData[0][i].y2 - boxesData[0][i].y1;
            const width = boxesData[0][i].x2 - boxesData[0][i].x1;
            this.opImg = 1;
            window.localStorage.setItem('labeler', boxesData[0][0].labeler);
            this.fillLabeler = window.localStorage.getItem('labeler');
            if (boxesData[0][i].x1 !== '-1') {
              boxAreaArray.push({
                x: boxesData[0][i].x1 / this.part,
                y: boxesData[0][i].y1 / this.part,
                width: width / this.part,
                height: height / this.part,
                defect: boxesData[0][i].label
              });
            }
            editDefects.push({
              id: `${i}`,
              defect: boxesData[0][i].label
            });
            this.editedBoxesId.push({
              id: boxesData[0][i].id
            });
          }
          window.localStorage.setItem(
            'boxAreaArray',
            JSON.stringify(boxAreaArray)
          );
          if (
            editDefects.length === 1 &&
            editDefects[0].defect === 'No defect'
          ) {
            this.defects = editDefects;
          }
          window.localStorage.setItem(
            'editModeLabels',
            JSON.stringify(editDefects)
          );
          existingSelection();
          if (this.defects.length === 0) {
            this.setDefect('No defect', '#2BB673');
          }
        },
        error => {
          this.createErrorLog(error.message);
        }
      );
  }

  /**
   * Set Image
   * @param index index
   */
  setImage(index) {
    window.localStorage.setItem('imageIndex', index);
    this.setImageUrl();
    this.opImg = 0;
  }

  /**
   * Set Image Url
   */
  setImageUrl() {
    if (window.localStorage.getItem('defectName') == null) {
      setTimeout(() => {
        window.localStorage.setItem(
          'defectName',
          this.defectList[0].label_name
        );
        window.localStorage.setItem('defectColor', '#F60000');
      }, 500);
    }
    if (this.imageArray.length === this.imageIndex) {
      this.nextDisable = 1;
    } else {
      this.nextDisable = 0;
    }
    this.imageIndex = +window.localStorage.getItem('imageIndex');
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.imageArray.length; i++) {
      const imageUrl =
        `https://storage.googleapis.com/${this.imageArray[this.imageIndex].base_cloud_url}` +
        `/${this.imageArray[this.imageIndex].filename}`;
      window.localStorage.setItem('imageUrl', imageUrl);
      window.localStorage.setItem(
        'imageId',
        this.imageArray[this.imageIndex].id
      );
    }
    this.getAccessToken();
  }
  /**
   * Get Access Token
   */
  getAccessToken() {
    this.imgWidth = '';
    this.imgHeight = '';
    this.commonService.getAccessToken().subscribe(
      data => {
        const token = [];
        token.push(data);
        this.accessToken = token[0].access_token;
        const img = window.localStorage.getItem('imageUrl');
        if (img === '') {
          this.imageUrl = '';
        } else {
          this.imageUrl = `${img}?access_token=${this.accessToken}`;
        }
        setTimeout(() => {
          if (this.imageArray.length !== 0) {
            selection();
            this.part =
              (this.myImage.nativeElement.offsetWidth + 40) /
              this.myImageDiv.nativeElement.offsetWidth;
            this.imgWidth = `${this.myImage.nativeElement.offsetWidth /
              this.part}px`;
            this.imgHeight = `${this.myImage.nativeElement.offsetHeight /
              this.part}px`;

            this.setBoundingBoxes();
            this.isLoading = false;
            this.opImg = 1;
          }
        }, 2000);
        this.imageListArray = [];
        this.imageArray.forEach((image: any) => {
          const imgUrl =
            `https://storage.googleapis.com/${image.base_cloud_url}/` +
            `${image.filename}?access_token=${this.accessToken}`;
          if (this.imageUrl === imgUrl) {
            this.selectedImageDetails.inventoryId = image.inventory_id;
          }
          this.imageListArray.push({
            name: image.filename,
            url: imgUrl,
            inventoryId: image.inventory_id
          });
        });
      },
      error => {
        this.createErrorLog(error.message);
      }
    );
  }

  /**
   * Set Defect
   * @param defect defect
   * @param color color
   */
  setDefect(defect, color) {
    if (this.selectedPId == null || this.imageArray.length === 0) {
      this.openSnackBar('Please load image first', 'Close');
    } else {
      if (defect === 'No defect' && this.defects.length === 0) {
        const id = window.localStorage.getItem('curBoxId');
        const server = this.defects.find(x => x.id === id);
        const objIndex = this.defects.findIndex(obj => obj.id === id);
        if (server !== undefined) {
          this.defects[objIndex].defect = defect;
        } else {
          this.defects.push({
            id,
            defect,
            color: '#2BB673'
          });
        }
      }
      window.localStorage.setItem('defectName', defect);
      window.localStorage.setItem('defectColor', color);
      if (window.localStorage.getItem('picked') === '1') {
        const id = +window.localStorage.getItem('curBoxId');
        setLabelToArea(defect, color);
        this.setSelLabelList(defect, id, color);
      }
    }
  }

  /**
   * Is Act
   * @param label label
   */
  isAct(label) {
    const labelName = window.localStorage.getItem('defectName');
    if (label === labelName) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Set Sel LabelList
   * @param defs defs
   * @param id id
   * @param defectColor defectColor
   */
  setSelLabelList(defs, id, defectColor) {
    if (this.defects.length !== 0) {
      if (this.defects[0].defect === 'No defect') {
        this.defects = [];
      }
    }
    const server = this.defects.find(x => x.id === id);
    const objIndex = this.defects.findIndex(obj => obj.id === id);
    if (server !== undefined) {
      this.defects[objIndex].defect = defs;
      this.defects[objIndex].color = defectColor;
      undoDefects(this.defects);
    } else {
      this.defects.push({
        id,
        defect: defs,
        color: defectColor
      });
    }
  }

  /**
   * RemoveDefect
   * @param id id
   */
  removeDefect(id) {
    removeBox(id);
  }
  /**
   * SaveImage
   */
  saveImage() {
    this.isLoading = true;
    if (this.editMode === 0) {
    } else {
      for (const item of this.editedBoxesId) {
        this.commonService
          .deleteExistingBoxes(item.id)
          .subscribe(
            data => {
              this.isLoading = false;
            },
            error => {
              this.isLoading = false;
              this.createErrorLog(error.message);
            }
          );
      }
    }

    setTimeout(() => {
      this.finalArray = [];
      this.selectedArea = JSON.parse(
        window.localStorage.getItem('selectedArea')
      );
      if (this.defects.length === 0) {
        this.openSnackBar(
          'Please select atleast 1 defect for the image',
          'Close'
        );
        this.isLoading = false;
      } else {
        if (this.defects[0].defect === 'No defect') {
          const imageId = window.localStorage.getItem('imageId');
          const selectedVersion = window.localStorage.getItem('dialogVersion');
          let finalDate = '';
          let date = '';
          let month = '';
          const datetime = new Date();
          const dd = datetime.getDate();
          const mm = datetime.getMonth() + 1;
          const yyyy = datetime.getFullYear();
          if (dd < 10) {
            date = `0${dd}`;
          }
          if (mm < 10) {
            month = `0${mm}`;
          }
          const time = `${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`;

          finalDate = `${yyyy}-${mm}-${dd} ${time}`;
          const labeler = window.localStorage.getItem('labeler');
          this.finalArray.push({
            image_id: imageId,
            label: this.defects[0].defect,
            x1: -1,
            y1: -1,
            x2: -1,
            y2: -1,
            version: selectedVersion,
            date_created: finalDate,
            source: 'source',
            labeler,
            job_id: 1
          });
        } else {
          const selectedVersion = window.localStorage.getItem('dialogVersion');
          for (let i = 0; i < this.selectedArea.length; i++) {
            let defect = '';
            if (this.defects[i] === undefined) {
              defect = 'null';
            } else {
              defect = this.defects[i].defect;
            }
            const labeler = window.localStorage.getItem('labeler');
            this.finalArray.push({
              image_id: this.selectedArea[i].image_id,
              label: defect,
              x1: this.selectedArea[i].x1 * this.part,
              y1: this.selectedArea[i].y1 * this.part,
              x2: this.selectedArea[i].x2 * this.part,
              y2: this.selectedArea[i].y2 * this.part,
              version: selectedVersion,
              date_created: this.selectedArea[i].date_created,
              source: this.selectedArea[i].source,
              labeler,
              job_id: this.selectedArea[i].job_id
            });
          }
        }
        for (let i = 0; i < this.finalArray.length; i++) {
          this.commonService.saveBoundingBoxes(this.finalArray[i]).subscribe(
            data => {
              this.openSnackBar('Label Set Successfully', 'Close');
              const len = this.selectedArea.length;
              if (i + 1 === this.selectedArea.length) {
                this.setImageUrl();
              } else if (i === 0 && len === this.selectedArea.length) {
                if (this.defects[0].defect === 'No defect') {
                  this.setImageUrl();
                }
              }
              this.defects = [];
              deleteSelection();
              this.isLoading = false;
              resetVar();
            },
            error => {
              this.openSnackBar('Label Set Failed', 'Close');
              this.isLoading = false;
              resetVar();
              this.createErrorLog(error.message);
            }
          );
        }
      }
    }, 500);
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
