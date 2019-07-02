import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-music-list',
    templateUrl: './music-list.component.html',
    styleUrls: ['./music-list.component.css']
})
export class MusicListComponent implements OnInit {

    constructor(public authService: AuthService, private dom: DomSanitizer) {
    }

    public playlist: any;
    map = new Map();
    private id: number;
    private userEntrance: number;
    public VoteTemp: string;
    public items;

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
        this.VoteTemp = localStorage.getItem('isVoted');
        this.id = Number(localStorage.getItem('id'));
        const isUserVoted = (this.VoteTemp == 'true');

        console.log('isVoted:\n', isUserVoted, '\n\n');


        // every time when the user move on to "My Playlist" tab, he get the playlist Object with the new changes.
        this.authService.currentPlaylist.subscribe(playlist => this.playlist = playlist);
        if (!isUserVoted) {
             const playlistObj = this.playlist.records;
             console.log('playlist object:\n', playlistObj, '\n\n');
             for (const pl of playlistObj) {
                 this.map.set((pl.youtube.videoId).toString(), pl.title);
                 // this.recordsVideoId.push(pl.youtube.videoId);
                 // this.recordsTitle.push(pl.title);
             }
         }
        if (isUserVoted) {
            this.items = this.authService.items;
            console.log(this.items);
            console.log(this.items[0].topUser[1].videoId);

            for (const pl of this.items[0].topUser) {
                if (pl.vote === 4 || pl.vote === 5) {
                    console.log('bingo');
                    this.map.set(pl.videoId, pl.title);
                }
            }
            for (const pl of this.items[0].notEar) {
                this.map.set(pl.videoId, pl.title);
            }

        }



        // }
        // else {
        //   this.notEarPL = JSON.parse(localStorage.getItem('notEar'));
        //   console.log(this.notEarPL);
        // }

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
        console.log(this.authService.items);
        this.authService.addVote(rate, userId, ytId);
        // alert('vote add');
    }
}
