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

  onAddUser(form: NgForm) {
    console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.id, form.value.password);
    // form.resetForm();
  }

  // toast() {
  //   alert("משתמש נוצר בהצלחה");
  // }

  //
  // model:any = {}
  //
  // ngOnInit() {
  //
  // }

  // onSubmit() {
  //   alert(JSON.stringify(this.model))
  // }

}
