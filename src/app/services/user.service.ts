import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenOutput } from '../models/token.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  setLocalUser(userData: TokenOutput, remember: boolean): any {
    if (remember) {
      window.localStorage.setItem('user', JSON.stringify(userData));
    } else {
      window.sessionStorage.setItem('user', JSON.stringify(userData));
    }
  }

  getLocalUser(): TokenOutput {
    if (window.sessionStorage.getItem('user') === null) {
      return JSON.parse(window.localStorage.getItem('user'));
    } else return JSON.parse(window.sessionStorage.getItem('user'));
  }

  register(login: string, email: string, password: string): Observable<any> {
    const body = {
      login: login,
      email: email,
      password: password,
    };
    return this.httpClient.post(environment.apiUrl + 'users', body);
  }

  login(
    login: string,
    password: string,
    remember: boolean
  ): Observable<TokenOutput> {
    const body = {
      login: login,
      password: password,
    };
    return this.httpClient.post<TokenOutput>(
      environment.apiUrl + 'users/token',
      body
    );
  }

  refreshToken(): Observable<TokenOutput> {
    const user = this.getLocalUser();
    const body = {
      token: user.refresh_token,
    };

    return this.httpClient.post<TokenOutput>(
      environment.apiUrl + 'users/token/refresh',
      body
    );
  }

  logout(): Observable<any> {
    const user = this.getLocalUser();
    const body = {
      token: user.refresh_token,
    };

    return this.httpClient.post(environment.apiUrl + 'users/logout', body);
  }
}
