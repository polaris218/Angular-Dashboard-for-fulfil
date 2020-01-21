import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './../../../core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public submitted = false;
  public isLoading = false;
  public loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private snackBar: MatSnackBar,
    public router: Router,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {}

  /**
   *  code function on component load
   */
  ngOnInit() {
    // reset login status
    this.commonService.logout();
  }

  /**
   * on login click
   * @param event event
   */
  onSubmit(event) {
    this.submitted = true;
    if (!this.loginForm.valid) {
      return;
    }
    event.preventDefault();
    const { username, password } = this.loginForm.value;
    this.isLoading = true;
    this.commonService.login(username, password).subscribe(
      (res: any) => {
        this.isLoading = false;
        localStorage.setItem('token', res.token);
        this.openSnackBar('Login successful', 'Close');
        this.router.navigate(['/home']);
      },
      err => {
        this.isLoading = false;
        this.openSnackBar('Username or password may be incorrect !', 'Close');
      }
    );
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

  get f() {
    return this.loginForm.controls;
  }
}
