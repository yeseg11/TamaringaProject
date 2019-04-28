import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  // set up the subscription of AuthStatusListener
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      // once the user loged in with right credantials the boolean condition will change - reflect on what the user will see
      this.userIsAuthenticated = isAuthenticated;
    });
  }
  // Should clear the token and inform all interested parts on the page about changed athentication status.
  // implemented in auth service
  onLogout() {
    this.authService.logout();
  }
  // unsubscribe if the component gets destroyed
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
