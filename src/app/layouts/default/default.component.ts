import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';
import { HouseService } from 'src/app/services/house.service';
import { HouseSimpleOutput } from 'src/app/models/house.model';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  public houseList: HouseSimpleOutput[];
  private houseListSubscription: Subscription;

  constructor(
    private userService: UserService,
    private houseService: HouseService,
    private router: Router
  ) {
    // //get house list
    // houseService.getHouseList().subscribe((houseList: HouseSimpleOutput[]) => {
    //   this.houseList = houseList;
    // });
  }

  ngOnInit(): void {
    this.houseListSubscription = this.houseService
      .getHouseListSubject()
      .subscribe((houseList: HouseSimpleOutput[]) => {
        this.houseList = houseList;
      });
  }

  addNewItem(): void {
    console.log('add new item clicked');
  }

  logout(): void {
    this.userService.logout().subscribe(
      (response: any) => {
        this.userService.removeLocalUser();
        this.router.navigate(['auth']);
      },
      (error: HttpErrorResponse) => console.log(error)
    );
  }
}
