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
  public records: string[] = [];

  public playlist: any;
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
    // every time when the user move on to "My Playlist" tab, he get the playlist Object with the new changes.
    this.authService.currentPlaylist.subscribe(playlist => this.playlist = playlist);
    console.log(this.playlist);
  }
}
