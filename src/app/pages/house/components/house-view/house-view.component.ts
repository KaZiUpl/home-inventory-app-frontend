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
import { MatTableDataSource } from '@angular/material/table';
import { RoomSimpleOutput } from 'src/app/models/room.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { RoomEditDialogComponent } from '../room-edit-dialog/room-edit-dialog.component';
import { AddCollaboratorComponent } from '../add-collaborator/add-collaborator.component';
import { RemoveCollaboratorComponent } from '../remove-collaborator/remove-collaborator.component';

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
  roomsDataSource: MatTableDataSource<RoomSimpleOutput> = new MatTableDataSource<RoomSimpleOutput>();
  @ViewChild('quantityInput') quantityInput: ElementRef;

  constructor(
    private userService: UserService,
    private houseService: HouseService,
    private roomService: RoomService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBarService: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) {
    this.activatedRoute.params.subscribe((routeParams) => {
      this.house._id = this.activatedRoute.snapshot.paramMap.get('id');
      this.houseService.getHouse(this.house._id).subscribe(
        (houseInfo: HouseFullOutput) => {
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
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.error.message, null, {
            duration: 3000,
          });
          this.router.navigate(['/houses']);
        }
      );
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

  onRoomEditClicked(room: RoomSimpleOutput): void {
    const dialogRef = this.dialog.open(RoomEditDialogComponent, {
      data: { room: room },
    });
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

  onAddCollaborator(): void {
    let dialogRef = this.dialog.open(AddCollaboratorComponent, {
      data: { house: this.house },
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response == true) {
        this.houseService.getHouseCollaboratorsList(this.house._id).subscribe(
          (collaboratorList) => {
            this.house.collaborators = collaboratorList;
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

  onCollaboratorRemove(collaborator: any, collabChip: any): void {
    const dialogRef = this.dialog.open(RemoveCollaboratorComponent, {
      data: {
        collaborator: collaborator,
      },
    });

    dialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) {
        this.houseService
          .removeCollaborator(this.house._id, collaborator._id)
          .subscribe(
            (response) => {
              //update house collaborators list
              this.house.collaborators = this.house.collaborators.filter(
                (collab) => collab._id != collaborator._id
              );
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
}
