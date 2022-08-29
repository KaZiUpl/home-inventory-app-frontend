import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoomSimpleOutput, RoomUpdateInput } from 'src/app/models/room.model';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room-edit-dialog',
  templateUrl: './room-edit-dialog.component.html',
  styleUrls: ['./room-edit-dialog.component.scss'],
})
export class RoomEditDialogComponent implements OnInit {
  editedRoom: RoomSimpleOutput;
  editRoomForm: UntypedFormGroup;

  constructor(
    private dialogRef: MatDialogRef<RoomEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { room: RoomSimpleOutput },
    private roomService: RoomService,
    private snackBar: MatSnackBar
  ) {
    this.editedRoom = data.room;

    this.editRoomForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.editedRoom.name, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      description: new UntypedFormControl(this.editedRoom.description, [
        Validators.maxLength(250),
      ]),
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onAccept(): void {
    if (this.editRoomForm.invalid) {
      return;
    }

    //update room
    let roomInput = new RoomUpdateInput();
    roomInput.name = this.editRoomForm.get('name').value;
    roomInput.description = this.editRoomForm.get('description').value;
    this.roomService.updateRoomInfo(this.editedRoom._id, roomInput).subscribe(
      (response: any) => {
        this.editedRoom.name = roomInput.name;
        this.editedRoom.description = roomInput.description;

        this.dialogRef.close(this.editedRoom);
      },
      (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, null, { duration: 2000 });
      }
    );
  }
}
