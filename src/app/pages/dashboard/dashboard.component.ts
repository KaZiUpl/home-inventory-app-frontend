import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserFullOutput } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  profileForm: FormGroup;

  constructor(
    private userService: UserService,
    private snackBarService: MatSnackBar
  ) {
    this.profileForm = new FormGroup({
      login: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe((user: UserFullOutput) => {
      this.profileForm.patchValue({ login: user.login });
    });
  }

  onProfileFormSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    this.userService.changeLogin(this.profileForm.value.login).subscribe(
      (response: any) => {
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
