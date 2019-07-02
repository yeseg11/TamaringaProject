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
    private recordsFromService;
    private titleOfRecord: string;

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
        // this.authService.currentPlaylist.subscribe(playlist => this.playlist = playlist);
        if (!isUserVoted) {
            // this.items = this.authService.plFirstLogin;
            // console.log('playlist items:\n', this.items.authService.plFirstLogin, '\n\n');
            this.recordsFromService = this.authService.plFirstLogin.records;
            const recordsArrObj = this.recordsFromService;

            const playarr = []; // Q1: what is that?
            let i: number;
            let j = 0;
            let flag1 = true;
            let flag2 = true;
            const s = 10;
            for (i = 0; i < s; i++) {
                flag2 = true;
                while (flag2) {
                    flag1 = true;
                    const k = Math.floor((Math.random() * Object.keys(recordsArrObj).length));
                    // console.log(k);
                    for (j = 0; j < i; j++) {
                        if (playarr[j] === k) {
                            console.log('+');
                            flag1 = false;
                        }
                    }
                    if (flag1) {
                        playarr[i] = k;
                        flag2 = false;
                    }
                }
            }
            console.log('playarr.length\n', playarr.length, '\n\n');
            for (i = 0; i < playarr.length; i++) {
                const place = playarr[i];
                /** map the records into 10 random records */
                const item = recordsArrObj[place];
                /** each item holds the playlist details */
                    // console.log(item);
                const mbId = (item && item.mbId) ? item.mbId : '';
                const videoId = (item && item.youtube && item.youtube.videoId) ? item.youtube.videoId : '';
                // console.log(videoId);
                const title = (item && item.title) ? item.title : '';
                const artist = (item && item.artist && item.artist[0] && item.artist[0].name) ? item.artist[0].name : '';
                // console.log('item\n', item, '\n\n');
                // console.log('mbid\n', mbId, '\n\n');
                // console.log('videoId\n', videoId, '\n\n');
                // console.log('title\n', title, '\n\n');
                // console.log('artist\n', artist, '\n\n');

                this.titleOfRecord = artist + ' - ' + title;
                this.map.set(videoId, this.titleOfRecord);
            }

            console.log('playarr\n', playarr, '\n\n');
            console.log('this.map\n', this.map, '\n\n');


            // console.log('playlist object:\n', recordsArrObj, '\n\n');
            // for (const rec of recordsArrObj) {
            //     this.titleOfRecord = rec.artist[0].name + ' - ' + rec.title;
            //     this.map.set((rec.youtube.videoId).toString(), this.titleOfRecord);
            // }
        }
        if (isUserVoted) {
            this.recordsFromService = this.authService.plOnceVote[0];
            // console.log(this.recordsFromService);
            const recordsObj = this.recordsFromService; // data.items[0]
            const topUserRecordsObj = recordsObj.topUser; // data.items[0].topUser
            const notEarUserRecordsObj = recordsObj.notEar;
            const recommendedUserRecordsObj = recordsObj.recSongs;
            // console.log(topUserRecordsObj);
            // console.log(notEarUserRecordsObj);
            // console.log(recommendedUserRecordsObj);

            let UserSize = 4;
            // for (const usersVote of topUserRecordsObj) {
            //
            //     if (!(usersVote.vote === 4) && !(usersVote.vote === 5)) {
            //         UserSize ++;
            //     }
            // }
            let recSize = 4;
            let notEarSize = 2;

            // console.log(topUser.length);
            if (topUserRecordsObj.length < UserSize) {
                notEarSize += UserSize - topUserRecordsObj.length;
                UserSize = topUserRecordsObj.length;
            }


            if (!recordsObj.recSongs) {
                // console.log("h1");
                recSize = 0;
                notEarSize += 4;
            } else if (recommendedUserRecordsObj.length < recSize) {
                // console.log(recommendedUserRecordsObj);
                recSize = recommendedUserRecordsObj.length;
            }
            if (!notEarUserRecordsObj) {
                notEarSize = 0;
                UserSize += 2;
            } else if (notEarUserRecordsObj.length < notEarSize) {
                notEarSize = notEarUserRecordsObj.length;
                UserSize += 10 - (UserSize + recSize + notEarSize);
            }

            const topUser = []; // top of all users
            // console.log('UserSize before:\n ', UserSize);
            // console.log('topUser before :\n', topUser);
            // console.log('topUserRecordsObj before:\n', topUserRecordsObj);

            // get the top of the user songs
            for (let i = 0; i < UserSize; i++) {
                // if ((topUserRecordsObj[i].vote === 4) || topUserRecordsObj[i].vote === 5) {
                console.log('top:\n', topUserRecordsObj[i]);
                topUser.push(topUserRecordsObj[i]);
                // } // else { UserSize ++; }
            }
            // console.log('UserSize after:\n ', UserSize);
            // console.log('topUser after :\n', topUser);
            // console.log('topUserRecordsObj after:\n', topUserRecordsObj);

            // find the best songs from the recommended user and check double songs
            for (let i = 0; i < recSize; i++) {
                const item = recommendedUserRecordsObj[i];
                // console.log(item);
                // console.log(item.index);
                // if (item) {
                //     const ind = parseInt(item.index, 10);
                // }

                // console.log(ind);

                let flag = false;
                // console.log(topUser.length);
                for (let j = 0; j < topUser.length; j++) {
                    if (topUser[j].index == item.index) {
                        // console.log('1');
                        // var item = data.items[0].recSongs[i];
                        // console.log(item);
                        // console.log("index: "+ topUser[j].index + " ind: "+ind);
                        flag = true;
                        recSize++;
                    }
                }
                if (!flag) {
                    const item1 = recommendedUserRecordsObj[i];
                    console.log('recommended:\n', item1);
                    topUser.push(item1);
                }
            }
            // add the Not Ear songs in playlist of the user .
            for (let i = 0; i < notEarSize; i++) {
                const item = notEarUserRecordsObj[i];
                // console.log(item);
                const ind = item.index;
                let flag = false;
                for (let j = 0; j < topUser.length; j++) {
                    if (topUser[j].index == ind) {
                        // const item = recommendedUserRecordsObj[i];
                        // console.log(item);
                        // console.log("index: "+ topUser[j].index + " ind: "+ind);
                        flag = true;
                        recSize++;
                    }
                }
                if (!flag) {
                    const item1 = notEarUserRecordsObj[i];
                    console.log('not ear:\n', item1);
                    topUser.push(item1);
                }
                // console.log(topUser);
                for (const tu of topUser) {
                    const item1 = tu;

                    // console.log(item1);

                    const mbId = (item1 && item1.mbId) ? item1.mbId : '';
                    const videoId = (item1 && item1.videoId) ? item1.videoId : '';
                    // console.log(videoId);
                    const title = (item1 && item1.title) ? item1.title : '';
                    const artist = (item1 && item1.artist) ? item1.artist : '';

                    this.titleOfRecord = artist + ' - ' + title;
                    this.map.set(videoId, this.titleOfRecord);
                }
            }


            // ================
            // for (const rec of this.recordsFromService[0].topUser) {
            //     if (rec.vote === 4 || rec.vote === 5) {
            //         console.log('bingo', rec);
            //         this.titleOfRecord = rec.artist + ' - ' + rec.title;
            //         this.map.set(rec.videoId, this.titleOfRecord);
            //     }
            // }
            // for (const rec of this.recordsFromService[0].notEar) {
            //     this.titleOfRecord = rec.artist + ' - ' + rec.title;
            //     this.map.set(rec.videoId, this.titleOfRecord);
            // }
        }
    }

    onAddRating(rate: number, userId: number, ytId: string) {
        console.log('rate: ', rate, ' id: ', userId, ' youtube id: ', ytId);
        console.log(this.authService.plOnceVote);
        this.authService.addVote(rate, userId, ytId);
        console.log('vote has succeeded');
    }
}
