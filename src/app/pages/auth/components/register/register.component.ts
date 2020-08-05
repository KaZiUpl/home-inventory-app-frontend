import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { TokenOutput } from 'src/app/models/token.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBarService: MatSnackBar
  ) {
    this.registerForm = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onRegisterFormSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.userService
      .register(
        this.registerForm.value.login,
        this.registerForm.value.email,
        this.registerForm.value.password
      )
      .subscribe(
        (response) => {
          this.userService
            .login(
              this.registerForm.value.login,
              this.registerForm.value.password,
              true
            )
            .subscribe(
              (data: TokenOutput) => {
                this.userService.setLocalUser(data, false);
                this.router.navigate(['dashboard']);
              },
              (error: HttpErrorResponse) => {
                this.router.navigate(['/auth']);
              }
            );
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.error.message, null, {
            duration: 3000,
          });
        }
      );
  }
}
