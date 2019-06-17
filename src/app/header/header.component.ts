import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {AuthService} from '../auth/auth.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    userIsAuthenticated = false;
    adminAuthenticated = false;
    researcherAuthenticated = false;
    private authListenerSubs: Subscription;
    private adminAuthListenerSubs: Subscription;
    private researcherAuthListenerSubs: Subscription;

    constructor(private authService: AuthService) {
    }

    // set up the subscription of AuthStatusListener
    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.adminAuthenticated = this.authService.getIsAdmin();
        this.researcherAuthenticated = this.authService.getIsResearcher();

        this.authListenerSubs = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                // once the user logged in with right credentials the boolean condition will change - reflect on what the user will see
                this.userIsAuthenticated = isAuthenticated;
            });

        this.adminAuthListenerSubs = this.authService
            .getAdminAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.adminAuthenticated = isAuthenticated;
            });

        this.researcherAuthListenerSubs = this.authService
          .getResearcherAuthStatusListener()
          .subscribe(isAuthenticated => {
            this.researcherAuthenticated = isAuthenticated;
          });
    }

    // Should clear the token and inform all interested parts on the page about changed authentication status.
    // implemented in auth service
    onLogout() {
        this.authService.logout();
    }

    // unsubscribe if the component gets destroyed
    ngOnDestroy() {
        this.authListenerSubs.unsubscribe();
    }
}
