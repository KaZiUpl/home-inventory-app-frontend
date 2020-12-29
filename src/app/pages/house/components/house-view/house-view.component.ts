import { Component, OnInit } from '@angular/core';
import { HouseService } from 'src/app/services/house.service';
import { HouseFullOutput } from 'src/app/models/house.model';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-house-view',
  templateUrl: './house-view.component.html',
  styleUrls: ['./house-view.component.scss'],
})
export class HouseViewComponent implements OnInit {
  house: HouseFullOutput = new HouseFullOutput();

  constructor(
    private houseService: HouseService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.house._id = params['id'];
    });
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.houseService
          .getHouse(this.house._id)
          .subscribe((houseInfo: HouseFullOutput) => {
            this.house = houseInfo;
          });
      }
    });
  }

  ngOnInit(): void {}
}
