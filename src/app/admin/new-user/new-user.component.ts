import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  public country: any;


  constructor(public authService: AuthService) {}


  // "form" is the param that we got from the form by the user
  onAddUser(form: NgForm) {
    console.log('client');
    console.log(form.value);
    if (form.invalid) {
      console.log('invalid form');
      return;
    }
    // set the loading spinner to true
    this.isLoading = true;

    // find the year that the user was in his twenties
    const twentiesAge = (new Date()).getFullYear() - form.value.age + 20;

    this.authService.createUser(form.value.fullName, form.value.id, form.value.age, twentiesAge, form.value.password, form.value.country);
    // console.log('server: createUser()');
    // this.isLoading = false;
    form.resetForm();
    // this.snackBar.open('user created', 'close');
  }

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

  openSnackBar() {

  }
}
