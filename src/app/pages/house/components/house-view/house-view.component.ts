import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  RoomFullOutput,
  StorageItemFullOutput,
} from 'src/app/models/room.model';
import { NewStorageItemDialogComponent } from '../new-storage-item-dialog/new-storage-item-dialog.component';

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
  loggedInUser: string = null;
  houseOwner: boolean = false;
  expandedRoom: any | null = null;
  roomsDataSource: MatTableDataSource<any>;
  focusedStorageItem: any | null;
  @ViewChild('quantityInput') quantityInput: ElementRef;
  @ViewChildren('storageTable') storageTables: QueryList<MatTable<any>>;

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
          let userId = this.userService.getLocalUser().id;
          this.houseOwner = houseInfo.owner._id == userId;
          this.loggedInUser = userId;
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

  quantityFocusOn(storageItem): void {
    if (!this.focusedStorageItem) {
      this.focusedStorageItem = storageItem;
    }
  }
  quantityFocusOut(storageItem): void {
    this.focusedStorageItem = null;
  }

  onQuantityChange(room, storageItem: StorageItemFullOutput, event): void {
    this.roomService
      .updateStorageItem(room._id, storageItem._id, {
        description: storageItem.description,
        quantity: event,
        expiration: Date.parse(storageItem.expiration),
      })
      .subscribe(
        (response) => {
          storageItem.quantity = event;
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.error.message, null, {
            duration: 1500,
          });
        }
      );
  }

  onAddStorageItemClicked(room): void {
    let dialogRef = this.dialog.open(NewStorageItemDialogComponent, {
      data: { roomId: room._id },
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        room.storage.push(response);
        this.storageTables.toArray().forEach((each) => each.renderRows());
      }
    });
  }

  onStorageItemDelete(
    room: RoomFullOutput,
    storageItem: StorageItemFullOutput
  ): void {
    let dialogRef = this.dialog.open(AcceptDialogComponent, {
      data: {
        title: 'Storage item delete',
        content:
          'Do you really want to delete this storage item? This operation cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) {
        this.roomService.deleteStorageItem(room._id, storageItem._id).subscribe(
          (response) => {
            //update room storage
            room.storage = room.storage.filter(
              (item) => item._id != storageItem._id
            );
            //update rows on storage tables
            this.storageTables.toArray().forEach((each) => each.renderRows());
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

  onStorageItemMoreInfo(
    room: RoomFullOutput,
    storageItem: StorageItemFullOutput
  ): void {
    console.log('more info clicked', storageItem);
  }
}
