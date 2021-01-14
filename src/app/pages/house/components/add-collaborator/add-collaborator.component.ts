import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';
import { HouseFullOutput } from 'src/app/models/house.model';
import { HouseService } from 'src/app/services/house.service';

@Component({
  selector: 'app-add-collaborator',
  templateUrl: './add-collaborator.component.html',
  styleUrls: ['./add-collaborator.component.scss'],
})
export class AddCollaboratorComponent implements OnInit {
  collaboratorForm = new FormGroup({
    login: new FormControl(null, [Validators.required]),
  });
  house: HouseFullOutput;

  constructor(
    private dialogRef: MatDialogRef<AddCollaboratorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { house: HouseFullOutput },
    private snackBarService: MatSnackBar,
    private houseService: HouseService
  ) {
    this.house = data.house;
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

  onAccept(): void {
    if (this.collaboratorForm.invalid) {
      return;
    }

    this.houseService
      .addCollaborator(this.house._id, this.collaboratorForm.get('login').value)
      .subscribe(
        (response) => {
          this.dialogRef.close(true);
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.error.message, null, {
            duration: 2000,
          });
        }
      );
  }
}
