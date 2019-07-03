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

    map = new Map();
    private id: number;
    private userEntrance: number;
    public VoteTemp: string;
    private recordsFromService;
    private titleOfRecord: string;

    /**
     * validate the YouTube Url
     * ensure that the data conforms to what you expect before submission
     *
     * @PARAM {String} link: YouTube videoId
     */
    sanitize(link) {
        const youtubeLink = 'https://www.youtube.com/embed/' + link;
        return this.dom.bypassSecurityTrustResourceUrl(youtubeLink);
    }

    ngOnInit() {
        this.userEntrance = Number(localStorage.getItem('entrance'));
        this.VoteTemp = localStorage.getItem('isVoted');
        this.id = Number(localStorage.getItem('id'));
        const isUserVoted = (this.VoteTemp == 'true');

        // console.log('isVoted:\n', isUserVoted, '\n\n');

        // every time when the user move on to "My Playlist" tab, he get the playlist Object with the new changes.

        // while the user not voted yet, display playlist
        // for user with no recommendation from other users
        if (!isUserVoted) {
            // this.items = this.authService.plFirstLogin;
            // console.log('playlist items:\n', this.items.authService.plFirstLogin, '\n\n');
            this.recordsFromService = this.authService.plFirstLogin.records;
            const recordsArrObj = this.recordsFromService;
            console.log('recordsArrObj: ', recordsArrObj);
            console.log(this.map);
            for (let r = 0; r < 10; r++) {
                const randRecord = recordsArrObj[Math.floor(Math.random() * recordsArrObj.length)];
                console.log(randRecord);

                const videoId = randRecord.youtube.videoId;
                const artist = randRecord.artist[0].name;
                const title = randRecord.title;

                this.titleOfRecord = artist + ' - ' + title;
                this.map.set(videoId, this.titleOfRecord);
                console.log(this.map);
            }
        }
        // after first user's vote, display complex playlist with his top songs, recommendation from other users.
        // display up to 3 top user songs, up to 3 recommendation from
        // other users and the rest display songs that the user not voted yet
        if (isUserVoted) {
            this.recordsFromService = this.authService.plOnceVote[0];
            console.log(this.recordsFromService);
            const recordsObj = this.recordsFromService;
            const topUserRecordsObj = recordsObj.topUser;
            const notEarUserRecordsObj = recordsObj.notEar;
            const recommendedUserRecordsObj = recordsObj.recSongs;

            let size = 10;
            let userTopMax = 3;
            let userRecMax = 3;
            const playlistToDisplay = [];
            console.log(topUserRecordsObj);
            const topUserSize = topUserRecordsObj.length;

            // add up to 3 songs that user vote 4/5 into user's playlist
            for (let i = 0; i < topUserSize; i++) {
                if (userTopMax !== 0) {
                    if ((topUserRecordsObj[i].vote === 4) || (topUserRecordsObj[i].vote === 5)) {
                        playlistToDisplay.push(topUserRecordsObj[i]);
                        size -= 1;
                        userTopMax -= 1;
                    }
                }
            }
            // add up to 3 songs that recommended by other users into user's playlist
            if (recommendedUserRecordsObj) {
                if (userRecMax !== 0) {
                    for (const usersRec of recommendedUserRecordsObj) {
                        playlistToDisplay.push(usersRec);
                        size -= 1;
                        userRecMax -= 1;
                    }
                }
            }
            // add the rest songs that the users not voted yet into user's playlist
            for (let r = 0; r < size; r++) {
                const randRecord = notEarUserRecordsObj[Math.floor(Math.random() * notEarUserRecordsObj.length)];
                playlistToDisplay.push(randRecord);
            }
            for (const record of playlistToDisplay) {

                const videoId = record.videoId;
                const artist = record.artist;
                const title = record.title;

                this.titleOfRecord = artist + ' - ' + title;
                this.map.set(videoId, this.titleOfRecord);
                console.log(this.map);
            }
        }
    }

    /**
     * when user vote for a song, this method called with the user's vote details and pass the params to addVote
     *
     * @PARAM {number} rate: user's vote - between 1 to 5
     * @PARAM {String} userId: user's ID
     * @PARAM {String} ytId: YouTube ID of the song
     *
     */
    onAddRating(rate: number, userId: number, ytId: string) {
        console.log('rate: ', rate, ' id: ', userId, ' youtube id: ', ytId);
        console.log(this.authService.plOnceVote);
        this.authService.addVote(rate, userId, ytId);
        console.log('vote has succeeded');
    }
}
