import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-new-researcher',
  templateUrl: './new-researcher.component.html',
  styleUrls: ['./new-researcher.component.css']
})
export class NewResearcherComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  // public country: any;

  constructor(public authService: AuthService) { }

  // "form" is the param that we got from the form by the user
  onAddResearcher(form: NgForm) {
    console.log('researcher');
    console.log(form.value);
    if (form.invalid) {
      console.log('invalid form');
      return;
    }
    // set the loading spinner to true
    this.isLoading = true;

    // find the year that the user was in his twenties
    this.authService.createUser(form.value.fullName, form.value.id, 0, 0, form.value.password, 'researcher');
    console.log('server: createResearcher()');
    // this.isLoading = false;
    form.resetForm();
  }

  ngOnInit(): void {
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
