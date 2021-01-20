import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';
import { StorageItemFullOutput } from 'src/app/models/storage-item.model';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-edit-storage-item-dialog',
  templateUrl: './edit-storage-item-dialog.component.html',
  styleUrls: ['./edit-storage-item-dialog.component.scss'],
})
export class EditStorageItemDialogComponent implements OnInit {
  storageItemForm: FormGroup;
  storageItem: StorageItemFullOutput;

  constructor(
    private dialogRef: MatDialogRef<EditStorageItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: { storageItem: StorageItemFullOutput },
    private roomService: RoomService,
    private snackBar: MatSnackBar
  ) {
    this.storageItem = data.storageItem;
    console.log(this.storageItem);

    this.storageItemForm = new FormGroup({
      quantity: new FormControl(this.storageItem.quantity, [
        Validators.required,
        Validators.min(1),
      ]),
      expiration: new FormControl(
        {
          value: this.storageItem.expiration
            ? this.storageItem.expiration
            : null,
          disabled: true,
        },
        []
      ),
      description: new FormControl(this.storageItem.description, [
        Validators.maxLength(250),
      ]),
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

  onAccept(): void {
    if (this.storageItemForm.invalid) return;

    this.roomService
      .updateStorageItem(this.data.storageItem.room._id, this.storageItem._id, {
        quantity: this.storageItemForm.get('quantity').value,
        description: this.storageItemForm.get('description').value,
        expiration: Date.parse(this.storageItemForm.get('expiration').value),
      })
      .subscribe(
        (response) => {
          this.storageItem.quantity = this.storageItemForm.get(
            'quantity'
          ).value;
          this.storageItem.description = this.storageItemForm.get(
            'description'
          ).value;
          this.storageItem.expiration = this.storageItemForm.get('expiration')
            .value
            ? new Date(
                this.storageItemForm.get('expiration').value
              ).toISOString()
            : null;

          this.dialogRef.close(this.storageItem);
        },
        (error: HttpErrorResponse) => {
          this.snackBar.open(error.error.message, null, { duration: 2000 });
        }
      );
  }
}
