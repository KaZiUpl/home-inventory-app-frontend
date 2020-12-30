import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  roomForm: FormGroup;
  houseId: string;

  constructor(
    private houseService: HouseService,
    public dialogRef: MatDialogRef<NewRoomDialogComponent>,
    private snackBarService: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: { houseId: string }
  ) {
    this.roomForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
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

    console.log('send create room request');
  }
}
