import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { RoomFullOutput, RoomUpdateInput } from '../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private httpClient: HttpClient) {}

  deleteRoom(roomId: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/rooms/${roomId}`);
  }

  getRoomInfo(roomId: string): Observable<RoomFullOutput> {
    return this.httpClient.get<RoomFullOutput>(
      `${environment.apiUrl}/rooms/${roomId}`
    );
  }

  updateRoomInfo(roomId: string, roomInfo: RoomUpdateInput): Observable<any> {
    const body = roomInfo;
    return this.httpClient.put(`${environment.apiUrl}/rooms/${roomId}`, body);
  }
}
