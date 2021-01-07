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
  AnimationEvent,
} from '@angular/animations';

import { AcceptDialogComponent } from '../../../../components/accept-dialog/accept-dialog.component';
import { NewRoomDialogComponent } from '../new-room-dialog/new-room-dialog.component';
import { UserService } from '../../../../services/user.service';
import { RoomService } from '../../../../services/room.service';
import { MatTableDataSource } from '@angular/material/table';

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
  expandedRoom: any | null = null;
  roomsDataSource: MatTableDataSource<any>;

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

          this.roomsDataSource = new MatTableDataSource<any>(houseInfo.rooms);

          let queryRoom = houseInfo.rooms.filter(
            (room) =>
              room._id == this.activatedRoute.snapshot.queryParamMap.get('room')
          );
          if (queryRoom.length > 0) {
            this.expandedRoom = queryRoom[0];
          }
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
            this.router.navigate(['../']);
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
      if (newRoom != undefined) {
        console.log(newRoom);

        this.house.rooms.push(newRoom);
        this.roomsDataSource.data = this.house.rooms;
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
          this.roomsDataSource.data = this.house.rooms;

          //if deleted room was expanded
          if (this.expandedRoom && this.expandedRoom._id == roomId) {
            this.expandedRoom = null;
            this.router.navigate([], {
              relativeTo: this.activatedRoute,
              queryParams: { room: null },
              queryParamsHandling: 'merge',
            });
          }
        });
      }
    });
  }

  onRoomEditClicked(roomId: string): void {
    console.log('room edit clicked');
  }

  isExpired(storageItem: any): boolean {
    let today = new Date();

    return today > new Date(storageItem.expiration);
  }

  // TODO: add implementation
  isNearlyExpired(storageItem: any): boolean {
    // get UTC timestmap
    let todayTimstamp = Date.now();
    let expirationTimestamp = Date.parse(storageItem.expiration);

    let diffTimeSeconds = Math.floor(
      (expirationTimestamp - todayTimstamp) / 1000
    );

    let diffTimeDays = Math.floor(diffTimeSeconds / (60 * 60 * 24));

    return diffTimeDays <= 7 && diffTimeDays > 0;
  }

  roomExpanded(event: AnimationEvent): void {
    if (event.fromState != 'void' && event.toState != 'void') {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          room: this.expandedRoom ? this.expandedRoom._id : null,
        },
        queryParamsHandling: 'merge',
      });
    }

    // if (event.fromState == 'collapsed' && event.toState != 'void') {
    //   this.router.navigate([], {
    //     relativeTo: this.activatedRoute,
    //     queryParams: {
    //       room: room._id,
    //     },
    //     queryParamsHandling: 'merge',
    //   });
    // } else if (event.fromState == 'expanded') {
    //   // expanded => collapsed
    //   this.router.navigate([], {
    //     relativeTo: this.activatedRoute,
    //     queryParams: {
    //       room: null,
    //     },
    //     queryParamsHandling: 'merge',
    //   });
    // }
  }
}
