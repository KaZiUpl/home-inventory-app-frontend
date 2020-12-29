import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-new-house-dialog',
  templateUrl: './new-house-dialog.component.html',
  styleUrls: ['./new-house-dialog.component.scss'],
})
export class NewHouseDialogComponent implements OnInit {
  houseForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<NewHouseDialogComponent>) {
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
    console.log('house added');
    this.dialogRef.close();
  }
}
