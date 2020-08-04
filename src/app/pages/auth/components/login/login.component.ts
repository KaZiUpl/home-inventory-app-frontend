import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  loginForm: FormGroup;

  constructor(private userService: UserService, private router: Router) {
    this.loginForm = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onLoginFormSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.userService
      .login(this.loginForm.value.login, this.loginForm.value.password, false)
      .subscribe(
        (user: TokenOutput) => {
          this.userService.setLocalUser(user, false);
          this.router.navigate(['dashboard']);
        },
        (error: HttpErrorResponse) => console.log(error)
      );
  }
}
