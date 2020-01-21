import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   * Add parameter to existing request.
   * @param request HttpRequest<any>
   * @param next HttpHandler
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const token = localStorage.getItem('token');
    if (token && request.url.indexOf(environment.API_URL) !== -1) {
      request = request.clone({
        setHeaders: {
          token: `${token}`
        }
      });
    }
    return next.handle(request);
  }
}
