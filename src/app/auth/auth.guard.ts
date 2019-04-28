import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

/* if we are not logged in - for that, we can use so called route guards, a feature provided by Angular.
Angular add some interfaces that our classes can implement which forces the classes to add certain methods
which the @angular/router can execute before it loads a route to check whether it should proceed or do something else */

// add this annotation to inject the auth service into this service
@Injectable()
export class AuthGuard implements CanActivate {
   constructor(private authService: AuthService,
               private router: Router) {}

  // receives 2 arguments: the route we are trying to load and the getState which is a snapshot of the entire router state
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    // isAuth holds the information whether the user authenticated or not. updated when we login/logout
    const isAuth = this.authService.getIsAuth();
    // if we are not authenticated then navigate away
    if (!isAuth) {
      this.router.navigate(['/']);
    }
    return isAuth; // return
  }
}
