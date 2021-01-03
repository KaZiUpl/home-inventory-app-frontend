import { Component, OnInit } from '@angular/core';
import { HouseService } from 'src/app/services/house.service';
import { HouseFullOutput } from 'src/app/models/house.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { AcceptDialogComponent } from '../../../../components/accept-dialog/accept-dialog.component';
import { NewRoomDialogComponent } from '../new-room-dialog/new-room-dialog.component';
import { UserService } from '../../../../services/user.service';
import { RoomService } from '../../../../services/room.service';

@Component({
  selector: 'app-house-view',
  templateUrl: './house-view.component.html',
  styleUrls: ['./house-view.component.scss'],
  animations: [
    trigger('roomDetailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class HouseViewComponent implements OnInit {
  house: HouseFullOutput = new HouseFullOutput();
  houseOwner: boolean = false;
  expandedRoom: any | null;

  constructor(
    private userService: UserService,
    private houseService: HouseService,
    private roomService: RoomService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBarService: MatSnackBar
  ) {
    this.activatedRoute.params.subscribe((routeParams) => {
      this.house._id = this.activatedRoute.snapshot.paramMap.get('id');
      this.houseService
        .getHouse(this.house._id)
        .subscribe((houseInfo: HouseFullOutput) => {
          this.houseOwner =
            houseInfo.owner._id == this.userService.getLocalUser().id;
          this.house = houseInfo;
        });
    });
  }

  ngOnInit(): void {}

  onDeleteHouseClicked(): void {
    let dialogRef = this.dialog.open(AcceptDialogComponent, {
      data: {
        title: 'Delete house ' + this.house.name + '?',
        content:
          'Do you want to delete this house? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) {
        // delete house
        this.houseService.deleteHouse(this.house._id).subscribe(
          (response: any) => {
            this.snackBarService.open(response.message, null, {
              duration: 1500,
            });
          },
          (error: HttpErrorResponse) => {
            this.snackBarService.open(error.error.message, null, {
              duration: 2000,
            });
          }
        );
      }
    });
  }

  onNewRoomClicked(): void {
    let dialogRef = this.dialog.open(NewRoomDialogComponent, {
      data: { houseId: this.house._id },
    });

    dialogRef.afterClosed().subscribe((newRoom) => {
      if (newRoom) {
        this.house.rooms.push(newRoom);
      }
    });
  }

  onRoomDeleteClicked(roomId: string): void {
    let dialogRef = this.dialog.open(AcceptDialogComponent, {
      data: {
        title: 'Delete a room?',
        content:
          'Do you want to delete this room? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) {
        this.roomService.deleteRoom(roomId).subscribe((response) => {
          // update local array after delete
          this.house.rooms = this.house.rooms.filter(
            (room) => room._id !== roomId
          );
        });
      }
    });
  }

  onRoomEditClicked(roomId: string): void {
    console.log('room edit clicked');
  }
}
