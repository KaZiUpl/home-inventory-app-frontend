import { Component, OnInit } from '@angular/core';
import { HouseService } from 'src/app/services/house.service';
import { HouseSimpleOutput } from '../../../../models/house.model';

@Component({
  selector: 'app-house-list',
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.scss'],
})
export class HouseListComponent implements OnInit {
  houseList: HouseSimpleOutput[];

  constructor(private houseService: HouseService) {
    houseService.getHouseList().subscribe((response: HouseSimpleOutput[]) => {
      this.houseList = response;
    });
  }

  ngOnInit(): void {}
}
