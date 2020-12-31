import { Component, OnInit } from '@angular/core';
import { HouseService } from 'src/app/services/house.service';
import { HouseFullOutput } from 'src/app/models/house.model';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { AcceptDialogComponent } from '../../../../components/accept-dialog/accept-dialog.component';
import { NewRoomDialogComponent } from '../new-room-dialog/new-room-dialog.component';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-house-view',
  templateUrl: './house-view.component.html',
  styleUrls: ['./house-view.component.scss'],
})
export class HouseViewComponent implements OnInit {
  house: HouseFullOutput = new HouseFullOutput();
  houseOwner: boolean = false;

  constructor(
    private userService: UserService,
    private houseService: HouseService,
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
}
