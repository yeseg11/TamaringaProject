import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusSub: Subscription;

    constructor(public authService: AuthService) {}
    // we know we get the form object which is of type ngForm
    onLogin(form: NgForm) {
        console.log(form.value);
        if (form.invalid) {
            return;
        }
        // set the loading spinner to true
        this.isLoading = true;
        this.authService.login(form.value.id, form.value.password);
        // console.log('server: login()');
    }

    // listening to auth service to know if we want to let the admin continue with trying add users
    ngOnInit() {
        this.authStatusSub = this.authService.getLoadingStatusListener().subscribe(
            authStatus => { // when authStatus switches to false then we set the loading spinner to false.
                this.isLoading = false;
            }
        );
    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
}
