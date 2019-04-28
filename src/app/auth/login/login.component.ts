import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;

  // we know we get the form object which is of type ngForm.

  // onLogin(form: NgForm) {
  //   // you can console log form value for example to output the values entered by the user.
  //   console.log(form.value);
  // }



  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    console.log(form.value);
    if (form.invalid) {
      return;
    }
    // set the spinner loading to true
    this.isLoading = true;
    this.authService.login(form.value.id, form.value.password);
    console.log('server: login()');

  }

}
