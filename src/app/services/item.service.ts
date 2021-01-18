import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import {
  ItemSimpleOutput,
  ItemFullOutput,
  ItemInput,
} from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private httpClient: HttpClient) {}

  createItem(item: ItemInput): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/items`, item);
  }

  getItemList(query?: {
    name?: string;
    ean?: string;
  }): Observable<ItemSimpleOutput[]> {
    for (let key in query) {
      query[key] = encodeURIComponent(query[key]);
    }

    return this.httpClient.get<ItemSimpleOutput[]>(
      `${environment.apiUrl}/items`,
      { params: query }
    );
  }

  getItem(id: string): Observable<ItemFullOutput> {
    return this.httpClient.get<ItemFullOutput>(
      `${environment.apiUrl}/items/${id}`
    );
  }

  putItem(id: string, item: ItemInput): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/items/${id}`, item);
  }

  deleteItem(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/items/${id}`);
  }

  uploadItemPhoto(itemId: string, image: FormData): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/items/${itemId}/photo`,
      image
    );
  }
}
