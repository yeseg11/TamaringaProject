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
  public recordsVideoId: string[] = [];
  public plays: string[] = [];
  public recordsTitle: string[] = [];
  public playlist: any;
  map = new Map();
  private id: number;
  private userEntrance: number;

  // output
  // input
  // emit




  // getRecordsFromService() {
  //   this.records = this.authService.getRecords();
  //   console.log(this.records);
  // }

  sanitize(link) {
    const youtubeLink = 'https://www.youtube.com/embed/' + link;
    return this.dom.bypassSecurityTrustResourceUrl(youtubeLink);
  }

  ngOnInit() {
    this.userEntrance = Number(localStorage.getItem('entrance'));
    this.id = Number(localStorage.getItem('id'));
    console.log(this.id);

    // every time when the user move on to "My Playlist" tab, he get the playlist Object with the new changes.
    this.authService.currentPlaylist.subscribe(playlist => this.playlist = playlist);

    const playlistObj = this.playlist.records;

    for (const pl of playlistObj) {
       this.map.set((pl.youtube.videoId).toString(), pl.title);
      // this.recordsVideoId.push(pl.youtube.videoId);
      // this.recordsTitle.push(pl.title);
    }
    // console.log(this.map);

    // console.log(this.recordsVideoId);
    // console.log(this.recordsTitle);
    //
    // console.log(this.playlist);
    // console.log(this.playlist.name);
    // console.log(this.playlist.records);
    // console.log(this.playlist.records[5].youtube);
    // console.log(this.playlist.records[5].youtube.videoId);

  }

  onAddRating(rate: number, userId: number, ytId: string) {
    console.log('rate: ', rate, ' id: ', userId, ' youtube id: ', ytId);
    this.authService.addVote(rate, userId, ytId);
    alert('vote add');
  }
}
