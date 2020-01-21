import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CreatePermissionGroupComponent } from './dialog/create-permission-group/create-permission-group.component';
import { CommonService } from 'src/app/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-manage-user-permissions',
  templateUrl: './manage-user-permissions.component.html',
  styleUrls: ['./manage-user-permissions.component.css']
})
export class ManageUserPermissionsComponent implements OnInit {
  isLoading = false;
  users: any [] = [];
  permissionGroups: any [] = [];
  permissionGId = new FormControl();
  constructor(
    public dialog: MatDialog,
    public commonService: CommonService,
    public snackBar: MatSnackBar
  ) { }

  /**
   * Load on component load
   */
  ngOnInit() {
    this.getPermissionGroups();
    this.loadUsersAndPermission();
  }

  /**
   * Get All permission groups
   */
  getPermissionGroups() {
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
   * Load users and permissions group
   */
  loadUsersAndPermission() {
    this.commonService.getUsers().subscribe(
      data => {
        this.users.push(data);
        this.users = this.users[0];
      },
      error => {
        this.isLoading = false;
        this.createErrorLog(error.message);
      }
    );
  }

  /**
   * updateGroup
   * @param event event
   * @param userId userId
   */
  updateGroup(event, userId) {
    this.isLoading = true;
    this.commonService.updateGroup(event.value, userId).subscribe(
      data => {
        this.isLoading = false;
        this.openSnackBar(`${data}`, 'Close');
      },
      error => {
        this.isLoading = false;
        this.createErrorLog(error.message);
      }
    );
  }

  /**
   * LoadGroupDialog
   */
  loadGroupDialog(): void {
    const dialogRef = this.dialog.open(CreatePermissionGroupComponent, {
      width: '550px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPermissionGroups();
    });
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

}
