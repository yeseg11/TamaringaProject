import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {

  constructor(public authService: AuthService) {}

  // "form" is the param that we got from the form by the user
  onAddUser(form: NgForm) {
    console.log('client');
    console.log(form.value);
    if (form.invalid) {
      console.log('invalid form');
      return;
    }
    // this.authService.createUser(form.value.fullName, form.value.id, form.value.password, form.value.country);
    this.authService.createUser(form.value.fullName, form.value.id, form.value.password, form.value.country);
    console.log('after server response');
    // form.resetForm();
  }
  // model:any = {}
  //
  // ngOnInit() {
  //
  // }


}
