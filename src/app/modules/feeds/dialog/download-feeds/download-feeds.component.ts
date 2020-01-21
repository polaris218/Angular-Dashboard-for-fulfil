import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs as importedSaveAs } from 'file-saver';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CommonService } from './../../../../core';

@Component({
  selector: 'app-download-feeds',
  templateUrl: './download-feeds.component.html',
  styleUrls: ['./download-feeds.component.css']
})
export class DownloadFeedsComponent implements OnInit {
  isLoading = false;
  submitted = false;
  isProd = environment.production;
  downloadForm = new FormGroup({
    env: new FormControl('', Validators.required),
    table: new FormControl('', Validators.required),
    key: new FormControl(
      this.isProd ? '' : '889a68d7-c7e8-4625-9ed3-d49a6e356209',
      Validators.required
    )
  });

  constructor(
    public dialogRef: MatDialogRef<DownloadFeedsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService
  ) {}

  /**
   *  code function on component load
   */
  ngOnInit() {}

  get f() {
    return this.downloadForm.controls;
  }

  /**
   * Close dialogue
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * download feeds
   * @param event event
   */
  onSubmit(event) {
    this.submitted = true;

    if (!this.downloadForm.valid) {
      return;
    }

    event.preventDefault();

    this.isLoading = true;
    this.commonService.downloadFeeds(this.downloadForm.value).subscribe(
      (res: any) => {
        importedSaveAs(
          res,
          `${this.downloadForm.value.table}_${new Date().getTime()}.csv`
        );
        this.close();
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      },
      err => {
        console.error(err);
        this.isLoading = false;
      }
    );
  }
}
