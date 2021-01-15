import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationEvent,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { from, Subscription } from 'rxjs';

import { HouseService } from 'src/app/services/house.service';
import { UserService } from 'src/app/services/user.service';
import { HouseSimpleOutput } from '../../../../models/house.model';
import { NewHouseDialogComponent } from '../new-house-dialog/new-house-dialog.component';

@Component({
  selector: 'app-house-list',
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.scss'],
  animations: [
    trigger('houseExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class HouseListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  houseList: HouseSimpleOutput[];
  userHouses: HouseSimpleOutput[];
  housesDataSource: MatTableDataSource<HouseSimpleOutput> = new MatTableDataSource<HouseSimpleOutput>();
  private houseListSubscription: Subscription;
  displayOption: string = 'all';
  expandedHouse: HouseSimpleOutput | null;

  constructor(
    private houseService: HouseService,
    private userService: UserService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    let loggedInUser = userService.getLocalUser();
    this.houseListSubscription = houseService
      .getHouseListSubject()
      .subscribe((list: HouseSimpleOutput[]) => {
        this.houseList = list;
        this.userHouses = list.filter(
          (house) => house.owner._id == loggedInUser.id
        );

        this.housesDataSource.data = this.houseList;
        this.housesDataSource.paginator = this.paginator;
      });
  }

  ngOnInit(): void {}

  onNewHouseButtonClicked(): void {
    let dialogRef = this.dialog.open(NewHouseDialogComponent);
  }

  onDisplayChange(): void {
    if (this.displayOption == 'all') {
      this.housesDataSource.data = this.houseList;
    } else if ((this.displayOption = 'user')) {
      this.housesDataSource.data = this.userHouses;
    } else {
      this.housesDataSource.data = this.houseList;
    }
  }
}
