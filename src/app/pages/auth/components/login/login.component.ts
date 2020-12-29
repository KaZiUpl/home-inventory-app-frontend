import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from 'src/app/services/user.service';
import { TokenOutput } from 'src/app/models/token.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hidePassword: boolean = true;
  loginForm: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBarService: MatSnackBar
  ) {
    this.loginForm = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      remember: new FormControl(null, []),
    });
  }

  ngOnInit(): void {}

  onLoginFormSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.userService
      .login(
        this.loginForm.value.login,
        this.loginForm.value.password,
        this.loginForm.value.remember
      )
      .subscribe(
        (user: TokenOutput) => {
          this.userService.setLocalUser(user, this.loginForm.value.remember);
          this.router.navigate(['dashboard']);
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.error.message, null, {
            duration: 3000,
          });
        }
      );
  }
}
