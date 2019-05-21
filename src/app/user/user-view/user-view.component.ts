import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  constructor(public authService: AuthService, private dom: DomSanitizer) {}

  // favoriteSeason: string;
  // seasons: string[] = ['5', '4', '3', '2', '1'];
  // private records: string[] = [];

  // output
  // input
  // emit

  // recordsVideoID = ['6U_5KhaH6IM', 'FodJJJzQk4I', 'q3-5A-i-rZ8', 'tbU3zdAgiX8', 'fb3zSgxMuug', '_N0ER4A73QE'];
  //
  // getRecordsFromService() {
  //   this.records = this.authService.getRecords();
  //   console.log(this.records);
  // }
  //
  // sanitize(link) {
  //   const youtubeLink = 'https://www.youtube.com/embed/' + link;
  //   return this.dom.bypassSecurityTrustResourceUrl(youtubeLink);
  // }

  ngOnInit() {
  }
}
