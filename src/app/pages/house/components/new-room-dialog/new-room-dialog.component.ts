import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { HouseService } from '../../../../services/house.service';

@Component({
  selector: 'app-new-room-dialog',
  templateUrl: './new-room-dialog.component.html',
  styleUrls: ['./new-room-dialog.component.scss'],
})
export class NewRoomDialogComponent implements OnInit {
  roomForm: UntypedFormGroup;
  houseId: string;

  constructor(
    private houseService: HouseService,
    public dialogRef: MatDialogRef<NewRoomDialogComponent>,
    private snackBarService: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: { houseId: string }
  ) {
    this.roomForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      description: new UntypedFormControl(null, [Validators.maxLength(250)]),
    });
    this.houseId = data.houseId;
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
    if (this.roomForm.invalid) {
      return;
    }

    this.houseService
      .createNewRoom(this.houseId, {
        name: this.roomForm.value.name,
        description: this.roomForm.value.description,
      })
      .subscribe(
        (response: any) => {
          this.snackBarService.open(response.message, null, {
            duration: 1500,
          });
          this.dialogRef.close({
            _id: response.id,
            name: this.roomForm.value.name,
            description: this.roomForm.value.description,
            storage: [],
          });
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.error.message, null, {
            duration: 2000,
          });
        }
      );
  }
}
