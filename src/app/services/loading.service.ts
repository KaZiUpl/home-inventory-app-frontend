import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading: boolean = false;
  loadingStatus: Subject<boolean> = new Subject();

  constructor() {}

  get loading() {
    return this._loading;
  }

  set loading(status: boolean) {
    console.log('loading set', status);

    this._loading = status;
    this.loadingStatus.next(status);
  }

  startLoading() {
    this.loading = true;
  }

  stopLoading() {
    this.loading = false;
  }
}
