import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from './../../core';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CsvErrorlogComponent } from './dialog/csv-errorlog/csv-errorlog.component';
import { DownloadFeedsComponent } from './dialog/download-feeds/download-feeds.component';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {
  isProd = environment.production;
  @ViewChild('fileInput') fileInput: ElementRef;
  submitted = false;
  isLoading = true;

  uploadForm = new FormGroup({
    env: new FormControl('', Validators.required),
    table: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    key: new FormControl(
      this.isProd ? '' : '889a68d7-c7e8-4625-9ed3-d49a6e356209',
      Validators.required
    ),
    file: new FormControl('', Validators.required)
  });

  constructor(
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  /**
   *  code function on component load
   */
  ngOnInit() {
    this.isLoading = false;
  }

  /**
   * On upload
   */
  onUpload() {
    this.fileInput.nativeElement.click();
  }

  get f() {
    return this.uploadForm.controls;
  }

  /**
   * Validate the data and post to server
   * @param event event
   */
  onSubmit(event) {
    this.submitted = true;

    if (!this.uploadForm.valid) {
      return;
    }

    event.preventDefault();

    this.isLoading = true;
    this.commonService.postFeeds(this.uploadForm.value).subscribe(
      (res: any) => {
        this.openSnackBar('File uploaded successfully !');
        this.onCancel();
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
        if (res.errors) {
          this.dialog.open(CsvErrorlogComponent, {
            maxWidth: window.innerWidth - 20,
            maxHeight: window.innerHeight - 20,
            data: { errorList: res.errors }
          });
        }
      },
      err => {
        this.openSnackBar('Opps ! something is wrong , please try again');
        console.error(err);
        this.isLoading = false;
      }
    );
  }

  /**
   * Downloaded feed open
   */
  downloadOpen() {
    this.dialog.open(DownloadFeedsComponent, {
      maxWidth: window.innerWidth - 20,
      maxHeight: window.innerHeight - 20
    });
  }

  /**
   * On cancel submit
   */
  onCancel() {
    this.submitted = false;
    this.fileInput.nativeElement.value = '';
    this.uploadForm.reset();
  }

  /**
   * On file change
   * @param event event
   */
  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.uploadForm.patchValue({
        file
      });

      // need to run CD since file load runs outside of zone
      this.cd.markForCheck();
    }
  }

  /**
   * Open the snackbar
   * @param message message
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Okay', {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 3000,
      panelClass: 'snackBar'
    });
  }
}
