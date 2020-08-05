import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { TokenOutput } from '../models/token.model';
import { UserOutput } from '../models/user.model';

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
    } else {
      return JSON.parse(window.sessionStorage.getItem('user'));
    }
  }

  removeLocalUser(): any {
    if (window.sessionStorage.getItem('user') !== null) {
      window.sessionStorage.removeItem('user');
    } else {
      window.localStorage.removeItem('user');
    }
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
      environment.apiUrl + 'users/auth',
      body
    );
  }

  refreshToken(): Observable<TokenOutput> {
    const user = this.getLocalUser();
    const body = {
      token: user.refresh_token,
    };

    return this.httpClient.post<TokenOutput>(
      environment.apiUrl + 'users/auth/refresh',
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

  getUserInfo(): Observable<UserOutput> {
    const user = this.getLocalUser();
    return this.httpClient.get<UserOutput>(
      environment.apiUrl + 'users/' + user.id
    );
  }

  getAccessToken(): string {
    const user = this.getLocalUser();
    if (user === null) {
      return '';
    }

    return user.access_token;
  }

  changeLogin(login: string): Observable<any> {
    const body = {
      login: login,
    };
    return this.httpClient.put(environment.apiUrl + 'users/login', body);
  }
}
