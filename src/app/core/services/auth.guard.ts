import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  /**
   * Guard call when any url gets changes
   * @param route ActivatedRouteSnapshot
   * @param state RouterStateSnapshot
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem('token');
    if (token) {
      if (helper.isTokenExpired(token)) {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
      if (state.url === '/') {
        this.router.navigate(['/home']);
      }
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
