import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenOutput } from 'src/app/models/token.model';
import { UserFullOutput } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: TokenOutput;

  constructor(
    private userService: UserService,
    private snackBarService: MatSnackBar
  ) {
    this.user = this.userService.getLocalUser();
    this.profileForm = new FormGroup({
      login: new FormControl(this.user.login, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onProfileFormSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    this.userService.updateUserInfo(this.profileForm.value.login).subscribe(
      (response: any) => {
        this.user.login = this.profileForm.value.login;
        this.snackBarService.open(response.message, null, { duration: 1500 });
      },
      (error: HttpErrorResponse) => {
        this.snackBarService.open(error.error.message, null, {
          duration: 2000,
        });
      }
    );
  }
}
