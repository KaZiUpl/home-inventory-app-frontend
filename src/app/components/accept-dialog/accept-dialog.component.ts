import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AcceptDialogData } from '../../models/accept-dialog-data.model';

@Component({
  selector: 'app-accept-dialog',
  templateUrl: './accept-dialog.component.html',
  styleUrls: ['./accept-dialog.component.scss']
})
export class AcceptDialogComponent implements OnInit {
  dialogData: AcceptDialogData = new AcceptDialogData();

  constructor(public dialogRef: MatDialogRef<AcceptDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: AcceptDialogData) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.dialogRef
      .keydownEvents()
      .pipe(filter((value) => value.key == 'Escape'))
      .subscribe((result) => {
        this.onCancelDialog();
      });

    this.dialogRef.backdropClick().subscribe((result) => {
      this.onCancelDialog();
    });
  }


  onCancelDialog():void {
    this.dialogRef.close(false);
  }

  onAcceptDialog():void {
    this.dialogRef.close(true);
  }
}
