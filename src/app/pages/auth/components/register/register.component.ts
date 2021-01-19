import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  NgForm,
  FormGroupDirective,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { TokenOutput } from 'src/app/models/token.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';

class CrossFieldErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return (
      (control.dirty && form.hasError('passwordsNotEqual')) ||
      (form.submitted && control.invalid) ||
      (control.touched && control.hasError('required'))
    );
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  hidePassword: boolean = true;
  registerForm: FormGroup;

  crossFieldErrorMatcher = new CrossFieldErrorStateMatcher();

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBarService: MatSnackBar
  ) {
    this.registerForm = new FormGroup(
      {
        login: new FormControl(null, [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9]+$'),
          Validators.minLength(5),
          Validators.maxLength(20),
        ]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{1,}$'
          ),
        ]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      [this.passwordsNotEqual]
    );
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

  passwordsNotEqual(signUpForm: FormGroup) {
    const condition =
      signUpForm.get('password').value !==
      signUpForm.get('confirmPassword').value;

    return condition ? { passwordsNotEqual: true } : null;
  }
}
