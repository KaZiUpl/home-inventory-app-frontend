import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { from, Subscription } from 'rxjs';

import { HouseService } from 'src/app/services/house.service';
import { HouseSimpleOutput } from '../../../../models/house.model';
import { NewHouseDialogComponent } from '../new-house-dialog/new-house-dialog.component';

@Component({
  selector: 'app-house-list',
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.scss'],
})
export class HouseListComponent implements OnInit {
  houseList: HouseSimpleOutput[];
  private houseListSubscription: Subscription;

  constructor(private houseService: HouseService, private dialog: MatDialog) {
    this.houseListSubscription = houseService
      .getHouseListSubject()
      .subscribe((list: HouseSimpleOutput[]) => {
        this.houseList = list;
      });
  }

  ngOnInit(): void {}

  onNewHouseButtonClicked(): void {
    let dialogRef = this.dialog.open(NewHouseDialogComponent);
  }
}
