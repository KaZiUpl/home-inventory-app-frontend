import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-remove-collaborator',
  templateUrl: './remove-collaborator.component.html',
  styleUrls: ['./remove-collaborator.component.scss'],
})
export class RemoveCollaboratorComponent implements OnInit {
  collaborator: any;

  constructor(
    public dialogRef: MatDialogRef<RemoveCollaboratorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { collaborator: { _id: string; login: string } }
  ) {
    this.collaborator = data.collaborator;
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

  onCancelDialog(): void {
    this.dialogRef.close(false);
  }

  onAcceptDialog(): void {
    this.dialogRef.close(true);
  }
}
