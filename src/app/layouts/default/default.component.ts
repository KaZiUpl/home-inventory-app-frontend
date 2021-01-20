import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';
import { HouseService } from 'src/app/services/house.service';
import { HouseSimpleOutput } from 'src/app/models/house.model';
import { TokenOutput } from 'src/app/models/token.model';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit, OnDestroy {
  loggedInUser: TokenOutput;
  houseList: HouseSimpleOutput[];
  private houseListSubscription: Subscription;

  constructor(
    private userService: UserService,
    private houseService: HouseService,
    private router: Router
  ) {
    this.loggedInUser = userService.getLocalUser();

    //set initial value for house list subject and house list in a service
    this.houseService
      .getHouseList()
      .subscribe((houses: HouseSimpleOutput[]) => {
        this.houseService.setHouseListSubject(houses);
      });
  }

  ngOnInit(): void {
    this.houseListSubscription = this.houseService
      .getHouseListSubject()
      .subscribe((houseList: HouseSimpleOutput[]) => {
        this.houseList = houseList;
      });
  }

  ngOnDestroy(): void {
    this.houseListSubscription.unsubscribe();
  }

  logout(): void {
    this.userService.logout().subscribe((response: any) => {
      this.userService.removeLocalUser();
      this.houseService.setHouseListSubject(null);
      this.router.navigate(['auth']);
    });
  }
}
