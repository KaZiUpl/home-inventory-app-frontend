import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import {
  filter,
  take,
  switchMap,
  mergeMap,
  catchError,
  tap,
} from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { TokenOutput } from '../models/token.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  userService: UserService;
  refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );
  isRefreshing: boolean = false;

  constructor(private injector: Injector, private router: Router) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.userService) {
      this.userService = this.injector.get(UserService);
    }
    const user = this.userService.getLocalUser();

    // user is not logged in or is trying to refresh token
    if (
      user === null ||
      req.url.includes('auth/refresh') ||
      req.url.includes('users/logout')
    ) {
      return next.handle(req);
    }

    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((result) => result !== null),
        take(1),
        switchMap(() => next.handle(this.addAuthHeaders(req)))
      );
    }

    const expires = Date.parse(user.expires);

    if (expires < Date.now()) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.userService.refreshToken().pipe(
        mergeMap((data: TokenOutput) => {
          this.userService.setLocalUser(data, null);

          this.isRefreshing = false;
          this.refreshTokenSubject.next(data.access_token);

          return next.handle(this.addAuthHeaders(req));
        }),
        catchError((error) => {
          this.userService.removeLocalUser();
          this.isRefreshing = false;

          this.router.navigate(['auth']);

          return throwError(error);
        })
      );
    }
    return next.handle(this.addAuthHeaders(req));
  }

  addAuthHeaders(req: HttpRequest<any>) {
    return req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + this.userService.getAccessToken()
      ),
    });
  }
}
