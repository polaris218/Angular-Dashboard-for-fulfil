import { Component, OnInit, ViewChild } from '@angular/core';
import { Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatSelectionList } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from '../../../../core';

@Component({
  selector: 'app-create-permission-group',
  templateUrl: './create-permission-group.component.html',
  styleUrls: ['./create-permission-group.component.css']
})
export class CreatePermissionGroupComponent implements OnInit {
  iTypeRadio = 'new';
  isLoading = false;
  groupName = new FormControl();
  permissionGroups: any [] = [];
  selectedGroupId = 3;
  allRoutes: any [] = [];
  selectRoute = new FormControl();
  @ViewChild(MatSelectionList) routes: MatSelectionList;
  constructor(
    public dialogRef: MatDialogRef<CreatePermissionGroupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public router: Router,
    private commonService: CommonService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * call function on component load
   */
  ngOnInit() {
    this.getPermissionGroups();
    this.getAllRoutes();
  }

  /**
   * Get All Routes
   */
  getAllRoutes() {
    this.allRoutes = [];
    this.isLoading = true;
    this.commonService.getAllRoutes().subscribe(
      data => {
        this.allRoutes.push(data);
        this.allRoutes = this.allRoutes[0];
        this.isLoading = false;
      },
      error => {
        this.createErrorLog(error.message);
        this.isLoading = false;
      }
    );
  }

  /**
   * Get All permission groups
   */
  getPermissionGroups() {
    this.isLoading = true;
    this.permissionGroups = [];
    this.isLoading = true;
    this.commonService.getPermissionGroups().subscribe(
      data => {
        this.permissionGroups.push(data);
        this.permissionGroups = this.permissionGroups[0];
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.createErrorLog(error.message);
      }
    );
  }

  /**
   * Radio button changed
   */
  radioChange() {
    if (this.iTypeRadio === 'existing') {
      this.getSelectedRoutes();
    }
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
   * save group or permission
   */
  onSavePermission() {
    if (this.iTypeRadio === 'new') {
      if (this.groupName.value == null || this.groupName.value === '') {
        this.openSnackBar('Please Enter Group Name', 'Close');
      } else {
        this.isLoading = true;
        this.commonService.insertNewGroup(this.groupName.value).subscribe(
          data => {
            const result = [];
            result.push(data);
            this.selectedGroupId = result[0].id;
            this.openSnackBar('New Group Created', 'Close');
            this.isLoading = false;
            this.iTypeRadio = 'existing';
            this.groupName.setValue('');
            this.getPermissionGroups();
            this.getSelectedRoutes();
          },
          error => {
            this.isLoading = false;
            this.createErrorLog(error.message);
          }
        );
      }
    } else {
      this.isLoading = true;
      this.commonService.deleteGroup(this.selectedGroupId).subscribe(
        data => {
        },
        error => {
          this.createErrorLog(error.message);
        }
      );
      for (const item of this.selectRoute.value) {
        this.commonService.insetGroupRoute(item, this.selectedGroupId).subscribe(
          data => {
            this.isLoading = false;
            this.openSnackBar('Permission Set Successfully', 'Close');
          },
          error => {
            this.isLoading = false;
            this.openSnackBar('Permission Set Failed', 'Close');
            this.createErrorLog(error.message);
          }
        );
      }
      this.dialogRef.close();
    }
  }

  /**
   * Get permitted routes of particular group
   */
  getSelectedRoutes() {
    this.commonService.getPermittedRoutes(this.selectedGroupId).subscribe(
      data => {
        const routes = [];
        routes.push(data);
        const routeArr = [];
        for (const item of routes[0]) {
          routeArr.push(item.route_Id);
        }
        this.selectRoute.setValue(routeArr);
      },
      error => {
        this.isLoading = false;
        this.createErrorLog(error.message);
      }
    );
  }

  /**
   * Group change event
   * @param event event
   */
  changeGroup(event) {
    this.selectedGroupId = event.value;
    this.getSelectedRoutes();
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
