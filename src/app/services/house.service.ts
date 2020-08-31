import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import {
  HouseSimpleOutput,
  HouseFullOutput,
  HouseInput,
} from '../models/house.model';
import { RoomSimpleOutput } from '../models/room.model';
import { UserSimpleOutput } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  constructor(private httpClient: HttpClient) {}

  createNewHouse(name: string, description: string): Observable<any> {
    const body = {
      name: name,
      description: description,
    };
    return this.httpClient.post(`${environment.apiUrl}/houses`, body);
  }

  deleteHouse(houseId: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/houses/${houseId}`);
  }

  getHouseList(): Observable<HouseSimpleOutput[]> {
    return this.httpClient.get<HouseSimpleOutput[]>(
      `${environment.apiUrl}/houses`
    );
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

  putHouseInfo(houseId: string, newData: HouseInput): Observable<any> {
    return this.httpClient.put(
      `${environment.apiUrl}/houses/${houseId}`,
      newData
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
