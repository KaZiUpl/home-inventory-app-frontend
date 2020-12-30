import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { HouseService } from '../../../../services/house.service';
@Component({
  selector: 'app-new-house-dialog',
  templateUrl: './new-house-dialog.component.html',
  styleUrls: ['./new-house-dialog.component.scss'],
})
export class NewHouseDialogComponent implements OnInit {
  houseForm: FormGroup;

  constructor(
    private houseService: HouseService,
    public dialogRef: MatDialogRef<NewHouseDialogComponent>,
    private snackBarService: MatSnackBar
  ) {
    this.houseForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
    });
  }

  ngOnInit(): void {
    this.dialogRef
      .keydownEvents()
      .pipe(filter((value) => value.key == 'Escape'))
      .subscribe((result) => {
        this.onCancel();
      });

    this.dialogRef.backdropClick().subscribe((result) => {
      this.onCancel();
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.houseForm.invalid) {
      return;
    }

    this.houseService
      .createNewHouse(
        this.houseForm.value.name,
        this.houseForm.value.description
      )
      .subscribe(
        (response: any) => {
          this.snackBarService.open(response.message, null, { duration: 1500 });
          this.dialogRef.close();
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.error.message, null, {
            duration: 2000,
          });
        }
      );
  }
}
