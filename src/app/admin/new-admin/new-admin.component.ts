import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-new-admin',
  templateUrl: './new-admin.component.html',
  styleUrls: ['./new-admin.component.css']
})
export class NewAdminComponent implements OnInit {

  constructor() {

  }

  ngOnInit(): void {
  }
}
  // isLoading = false;
  // private authStatusSub: Subscription;
  // public country: any;

  // constructor(public authService: AuthService) { }

  // // "form" is the param that we got from the form by the user
  // onAddAdmin(form: NgForm) {
  //   console.log('admin');
  //   console.log(form.value);
  //   if (form.invalid) {
  //     console.log('invalid form');
  //     return;
  //   }
  //   // set the loading spinner to true
  //   this.isLoading = true;
  //
  //   // find the year that the user was in his twenties
  //   this.authService.createAdmin(form.value.fullName, form.value.id, null, null, form.value.password, '0');
  //   console.log('server: createAdmin()');
  //   // this.isLoading = false;
  //   form.resetForm();
  // }
  //
  // ngOnInit(): void {
  //   this.authStatusSub = this.authService.getLoadingStatusListener().subscribe(
  //     authStatus => { // when authStatus switches to false then we set the loading spinner to false.
  //       this.isLoading = false;
  //     }
  //   );
  // }
  //
  // ngOnDestroy(): void {
  //   this.authStatusSub.unsubscribe();
  // }

// }
