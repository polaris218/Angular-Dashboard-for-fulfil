import { Component, ViewChild, ElementRef } from '@angular/core';
import { saveAs as importedSaveAs } from 'file-saver';
import { CommonService } from '../../core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reorder',
  templateUrl: './reorder.component.html',
  styleUrls: ['./reorder.component.css']
})
export class ReorderComponent {
  isLoading = false;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Download customer order sheet
   */
  public downloadOrderSheet() {
    const body = {
      env: 'prod',
      table: 'deliveries'
    };
    this.commonService.downloadFeeds(body).subscribe(res => {
      importedSaveAs(res, `ordersheet_${new Date().getTime()}.csv`);
    });
  }

  /**
   * Download inventory csv sheet
   */
  public downloadInventoryReport() {
    this.commonService.getReorderReportCSV().subscribe(res => {
      importedSaveAs(res, `InventoryReport_${new Date().getTime()}.csv`);
    });
  }

  /**
   * Upload click trigger by upload order sheet button
   */
  public uploadOrderSheet() {
    this.fileInput.nativeElement.click();
  }

  /**
   * On file change
   * @param event event
   */
  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.commonService
        .postFeeds({
          env: 'prod',
          type: 'append',
          table: 'deliveries',
          file
        })
        .subscribe(
          (res: any) => {
            this.openSnackBar('File uploaded successfully !');
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
          },
          err => {
            this.openSnackBar('Opps ! something is wrong , please try again');
            console.error(err);
            this.isLoading = false;
          }
        );
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
