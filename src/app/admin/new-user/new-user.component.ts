import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}


  // "form" is the param that we got from the form by the user
  onAddUser(form: NgForm) {
    console.log('client');
    console.log(form.value);
    if (form.invalid) {
      console.log('invalid form');
      return;
    }
    // ====================================================

    // find the year that the user was in his twenties
    const twentiesAge = (new Date()).getFullYear() - form.value.age + 20;

    // set the spinner loading to true
    // this.isLoading = true; not working
    this.authService.createUser(form.value.fullName, form.value.id, form.value.age, twentiesAge, form.value.password, form.value.country);
    console.log('server: createUser()');
    // form.resetForm();
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
        authStatus => { // when authStatus switches to false then we set the loading spinner to false.
          this.isLoading = false;
        }
    );
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
