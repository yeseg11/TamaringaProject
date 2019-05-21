import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html',
  styleUrls: ['./music-list.component.css']
})
export class MusicListComponent implements OnInit {

  constructor(public authService: AuthService, private dom: DomSanitizer) { }
  rated: string;
  ratings: string[] = ['5', '4', '3', '2', '1'];
  private records: string[] = [];

  // output
  // input
  // emit

  getRecordsFromService() {
    this.records = this.authService.getRecords();
    console.log(this.records);
  }

  sanitize(link) {
    const youtubeLink = 'https://www.youtube.com/embed/' + link;
    return this.dom.bypassSecurityTrustResourceUrl(youtubeLink);
  }
  ngOnInit() {
  }

}
