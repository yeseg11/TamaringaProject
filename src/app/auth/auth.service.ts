import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData, AuthDataLogin} from './auth-data.model';
import {Subject, BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class AuthService {
    private isAuthenticated = false;
    private isAdminAuthenticated = false;
    private isResearcherAuthenticated = false;
    private test = '5ccfd97a8991c605c8e32f7d';
    private records: string[] = [];
    private token: string;
    private tokenTimer: any;
    private adminFlag = false;
    private researcherFlag = false;
    private playlistSource = new BehaviorSubject(null);
    currentPlaylist = this.playlistSource.asObservable();
    public items;

    // that will actually be a new subject imported from rxjs and i'll use that subject
    // to push the authentication information to the components which are interested.
    // wrap a boolean because i don't really need the token in my other components - only in my interceptor
    private authStatusListener = new Subject<boolean>();
    private adminAuthStatusListener = new Subject<boolean>();
    private researcherAuthStatusListener = new Subject<boolean>();
    private loadingListener = new Subject<boolean>();

    // private loadingListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {
    }

    getToken() {
        return this.token;
    }

    // we can call this method to find out whether the user is authenticated
    getIsAuth() {
        return this.isAuthenticated;
    }

    getIsAdmin() {
        return this.isAdminAuthenticated;
    }

    getIsResearcher() {
        return this.isResearcherAuthenticated;
    }

    getRecords() {
        return this.records;
    }

    getAuthStatusListener() {
        // return as observable so that we can't emit new values from other components just listen from other parts of the apps
        return this.authStatusListener.asObservable();
    }

    getAdminAuthStatusListener() {
        return this.adminAuthStatusListener.asObservable();
    }

    getResearcherAuthStatusListener() {
        return this.researcherAuthStatusListener.asObservable();
    }

    getLoadingStatusListener() {
        return this.loadingListener.asObservable();
    }


    createUser(fullName: string, id: number, age: number, year: number, password: string, country: string) {
        const authData: AuthData = {fullName, id, age, year, password, country};
        this.http.post(BACKEND_URL + '/user/signup', authData)
            .subscribe(response => {
                console.log('response from server: ');
                console.log(response);
                this.loadingListener.next(true);
            }, error => {
                console.log(error);
                // when we get error in login, we provide to login component a false boolean to stop the spinner
                this.loadingListener.next(false);
            });
    }

    login(id: number, password: string) {
        const authDataLogin: AuthDataLogin = {id, password};
        // configure this post request to be aware of "token" that the response include - <{token: string}>
        this.http.post<{
            token: string, expiresIn: number, userDbId: string, userName: string, isVoted: boolean,
            playlist, userId: string, country: string, age: number, entrance: number, items
        }>
        (BACKEND_URL + '/user/login', authDataLogin)
            .subscribe(response => {
                console.log(response);

                // we'll actually get back a response object which has token field which is of type string (as we created in the API)
                const token = response.token;
                this.token = token;
                // only if we have a valid token we wants to set isAuthenticated to true and change the auth status
                if (token) {
                    // extract from the response the expire duration
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    // console.log(response);
                    console.log('expires in duration: ', expiresInDuration);

                    localStorage.setItem('id', response.userId);

                    this.isAuthenticated = true;
                    this.isAdminAuthenticated = true;

                    this.authStatusListener.next(true);
                    this.loadingListener.next(true);

                    if (response.userDbId === this.test) {
                        this.adminFlag = true;
                        localStorage.setItem('admin', String(this.adminFlag));
                        this.isAdminAuthenticated = true;
                        this.adminAuthStatusListener.next(true);
                    }
                    //  IF RESEARCHER !!!!!
                    console.log('country ', response.country);
                    if (response.country === 'researcher') {
                        localStorage.setItem('researcher', String(this.researcherFlag));
                        this.isResearcherAuthenticated = true;
                        this.researcherAuthStatusListener.next(true);
                        this.researcherFlag = true;
                        console.log('researcher logged in');
                    }
                    localStorage.setItem('entrance', String(response.entrance));
                    localStorage.setItem('userName', response.userName);
                    localStorage.setItem('isVoted', String(response.isVoted));

                    console.log('response.entrance', response.entrance);
                    // if (response.entrance === 0) {
                    this.updatePlaylist(response.playlist);
                    this.items = response.items;
                    console.log(this.items);

                    // } else {
                    // localStorage.setItem('notEar', JSON.stringify(response.items[0].notEar));
                    // }

                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate);
                    console.log('expiration date: ', expirationDate);

                    if (this.adminFlag) {
                        this.router.navigate(['/admin']);
                    } else if (this.researcherFlag) {
                        this.router.navigate(['/researcher']);
                    } else {
                        // reach out to my router to navigate back to the home page
                        this.router.navigate(['/user']);
                    }
                }
            }, error => {
                console.log(error);
                // when we get error in login, we provide to login component a false boolean to stop the spinner
                this.authStatusListener.next(false);
                this.loadingListener.next(false);
            });
    }

    // update the playlist Object, called once when user logged in, music-list is listening on any change in playlist
    updatePlaylist(playlist: any) {
        // const arrPlaylist = playlist;
        // // dismantle the records Object into string array of videoId
        // for (const rec of arrPlaylist) {
        //     this.records.push(rec.youtube.videoId);
        // }
        this.playlistSource.next(playlist);
    }

    addVote(rate: number, userId: number, ytId: string) {
        // console.log(rate, userId, ytId);
        this.http.get(BACKEND_URL + '/user/' + userId + '/youtube/' + ytId + '/rate/' + rate)
            .subscribe(response => {
                console.log(response);
            });

    }

    autoUserAuth() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        // we want to retrieve the difference
        const expireIn = authInformation.expirationDate.getTime() - now.getTime();
        // the expire time is in the future - it's means that is ok
        if (expireIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;

            const admin = localStorage.getItem('admin');
            if (admin) {
                this.isAdminAuthenticated = true;
            }

            console.log(this.adminFlag);

            this.setAuthTimer(expireIn / 1000); // divide by 1000 because getTime() returns th time in ms
            this.authStatusListener.next(true);
            this.adminAuthStatusListener.next(true);
        }
    }

    // clear the token - ecxecute when we call onLogout()
    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.isAdminAuthenticated = false;
        this.isAdminAuthenticated = false;
        this.researcherFlag = false;
        this.adminFlag = false;
        // pass that information to anyone who is interested
        this.authStatusListener.next(false); // false because the user in now not authenticated anymore
        this.adminAuthStatusListener.next(false);
        this.researcherAuthStatusListener.next(false);
        this.clearAuthData();
        clearTimeout(this.tokenTimer);
        // reach out to my router to navigate back to the home page
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        console.log('setting time ' + duration);
        // Auto logout after 1h
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    // private method that called only from this service that responsible on saving the token in the local storage
    private saveAuthData(token: string, expirationDate: Date) {
        // stores the data to local storage
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());

    }

    // clear the local storage
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('admin');
        localStorage.removeItem('userName');
        localStorage.removeItem('id');
        localStorage.removeItem('researcher');
        localStorage.removeItem('entrance');
    }

    // get my data from the local storage
    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');

        if (!token || !expirationDate) {
            return;
        }
        return {
            token,
            expirationDate: new Date(expirationDate)
        };
    }
}
