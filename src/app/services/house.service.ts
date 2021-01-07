import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {
  HouseSimpleOutput,
  HouseFullOutput,
  HouseUpdateInput,
} from '../models/house.model';
import { RoomSimpleOutput, RoomInput } from '../models/room.model';
import { UserSimpleOutput } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  houseListSubject: BehaviorSubject<HouseSimpleOutput[]> = new BehaviorSubject<
    HouseSimpleOutput[]
  >(new Array<HouseSimpleOutput>());

  houseList: HouseSimpleOutput[] = new Array<HouseSimpleOutput>();

  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {
    //set initial value of subject
    this.httpClient
      .get<HouseSimpleOutput[]>(`${environment.apiUrl}/houses`)
      .subscribe((list: HouseSimpleOutput[]) => {
        this.houseList = list;
        this.houseListSubject.next(this.houseList);
      });
  }

  createNewHouse(name: string, description: string): Observable<any> {
    const body = {
      name: name,
      description: description,
    };
    return this.httpClient.post(`${environment.apiUrl}/houses`, body).pipe(
      tap((res) => {
        let userInfo = this.userService.getLocalUser();
        //add created house to the list
        this.houseList.push({
          _id: res.id,
          name: body.name,
          description: body.description,
          owner: { _id: userInfo.id, login: userInfo.login },
          rooms: [],
          collaborators: [],
        });
        // add new house list to the subject
        this.houseListSubject.next(this.houseList);
      })
    );
  }

  createNewRoom(houseId: string, roomData: RoomInput): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/houses/${houseId}/rooms`,
      roomData
    );
  }

  deleteHouse(houseId: string): Observable<any> {
    return this.httpClient
      .delete(`${environment.apiUrl}/houses/${houseId}`)
      .pipe(
        tap((res) => {
          this.houseList = this.houseList.filter(
            (house) => house._id != houseId
          );

          this.houseListSubject.next(this.houseList);
        })
      );
  }

  getHouseList(): Observable<HouseSimpleOutput[]> {
    return this.httpClient.get<HouseSimpleOutput[]>(
      `${environment.apiUrl}/houses`
    );
  }

  getHouseListSubject(): BehaviorSubject<HouseSimpleOutput[]> {
    return this.houseListSubject;
  }

  getHouse(houseId: string): Observable<HouseFullOutput> {
    return this.httpClient.get<HouseFullOutput>(
      `${environment.apiUrl}/houses/${houseId}`
    );
  }

  getHouseRoomsList(houseId: string): Observable<RoomSimpleOutput> {
    return this.httpClient.get<RoomSimpleOutput>(
      `${environment.apiUrl}/houses/${houseId}/rooms`
    );
  }

  getHouseCollaboratorsList(houseId: string): Observable<UserSimpleOutput[]> {
    return this.httpClient.get<UserSimpleOutput[]>(
      `${environment.apiUrl}/houses/${houseId}/collaborators`
    );
  }

  putHouseInfo(houseId: string, newData: HouseUpdateInput): Observable<any> {
    return this.httpClient
      .put(`${environment.apiUrl}/houses/${houseId}`, newData)
      .pipe(
        tap((res) => {
          this.houseList.forEach((house) => {
            if (house._id == houseId) {
              house.name = newData.name;
              house.description = newData.description;
            }
          });
        })
      );
  }

  addCollaborator(houseId: string, name: string): Observable<any> {
    const body = {
      name: name,
    };
    return this.httpClient.post(
      `${environment.apiUrl}/houses/${houseId}/collaborators`,
      body
    );
  }

  removeCollaborator(houseId: string, collaboratorId: string): Observable<any> {
    return this.httpClient.delete(
      `${environment.apiUrl}/houses/${houseId}/collaborators/${collaboratorId}`
    );
  }
}
