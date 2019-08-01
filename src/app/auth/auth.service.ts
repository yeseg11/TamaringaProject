import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData, AuthDataLogin} from './auth-data.model';
import {BehaviorSubject, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class AuthService {
    private isAuthenticated = false;
    private isAdminAuthenticated = false;
    private isResearcherAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private adminFlag = false;
    private researcherFlag = false;
    private playlistSource = new BehaviorSubject(null);
    currentPlaylist = this.playlistSource.asObservable();
    public plOnceVote;
    public plFirstLogin;

    // that will actually be a new subject imported from rxjs and i'll use that subject
    // to push the authentication information to the components which are interested.
    // wrap a boolean because we don't really need the token in my other components - only in my interceptor
    private authStatusListener = new Subject<boolean>();
    private adminAuthStatusListener = new Subject<boolean>();
    private researcherAuthStatusListener = new Subject<boolean>();
    private loadingListener = new Subject<boolean>();


    constructor(private http: HttpClient, private router: Router) {
    }

    // get user's token
    getToken() {
        return this.token;
    }

    // we can call this method to find out whether the user is authenticated
    getIsAuth() {
        return this.isAuthenticated;
    }

    // get if admin for admin-auth listener
    getIsAdmin() {
        return this.isAdminAuthenticated;
    }

    // get if researcher for researcher-auth listener
    getIsResearcher() {
        return this.isResearcherAuthenticated;
    }

    // return as observable so that we can't emit new values from other components just listen from other parts of the apps
    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    // used for admin's tab in app's header
    getAdminAuthStatusListener() {
        return this.adminAuthStatusListener.asObservable();
    }

    // used for researcher's tab in app's header
    getResearcherAuthStatusListener() {
        return this.researcherAuthStatusListener.asObservable();
    }

    // used for loading spinner
    getLoadingStatusListener() {
        return this.loadingListener.asObservable();
    }

    /**
     * create user in DB and create/update playlist in DB for the user
     *
     * @PARAM {Number} id: user's id
     * @PARAM {String} fullName: user's full name
     * @PARAM {String} country: user's country
     * @PARAM {Number} age: user's age
     * @PARAM {String} password: user's password
     *
     */
    createUser(fullName: string, id: number, age: number, year: number, password: string, country: string, role: string) {
        const authData: AuthData = {fullName, id, age, year, password, country, role};
        this.http.post(BACKEND_URL + '/user/signup', authData)
            .subscribe(response => {
                // console.log('response from server: ', response);
                this.loadingListener.next(true);
            }, error => {
                // console.log(error);
                // when we get error in login, we provide to login component a false boolean to stop the spinner
                this.loadingListener.next(false);
            });
    }

    /**
     * login into the system, knows to recognize what kind of user
     * and according the user's kind - display the relevant components
     * for example - if user: bring user's playlist from server and display it the users route
     *
     * @PARAM {number} id: user's id
     * @PARAM {string} password: user's password
     *
     * @RESPONSE {token , expiresIn, users data, playlist} as JSON
     */
    login(id: number, password: string) {
        const authDataLogin: AuthDataLogin = {id, password};
        // configure this post request to be aware of "token" that the response include - <{token: string}>
        this.http.post<{
            token: string, expiresIn: number, userDbId: string, userName: string, isVoted: boolean,
            playlist, userId: string, country: string, age: number, entrance: number, items, role: string
        }>
        (BACKEND_URL + '/user/login', authDataLogin)
            .subscribe(response => {
                // console.log(response);

                // we'll actually get back a response object which has token field which is of type string (as we created in the API)
                const token = response.token;
                this.token = token;
                // only if we have a valid token we wants to set isAuthenticated to true and change the auth status
                if (token) {
                    // extract from the response the expire duration
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    // console.log('expires in duration: ', expiresInDuration);

                    localStorage.setItem('id', response.userId);

                    this.isAuthenticated = true;
                    this.isAdminAuthenticated = true;

                    this.authStatusListener.next(true);
                    this.loadingListener.next(true);

                    //  if the user is an admin
                    if (response.role === 'admin') {
                        this.adminFlag = true;
                        localStorage.setItem('admin', String(this.adminFlag));
                        this.isAdminAuthenticated = true;
                        this.adminAuthStatusListener.next(true);
                    }
                    //  if the user is a researcher
                    if (response.role === 'researcher') {
                        localStorage.setItem('researcher', String(this.researcherFlag));
                        this.isResearcherAuthenticated = true;
                        this.researcherAuthStatusListener.next(true);
                        this.researcherFlag = true;
                    }
                    localStorage.setItem('entrance', String(response.entrance));
                    localStorage.setItem('userName', response.userName);
                    localStorage.setItem('isVoted', String(response.isVoted));

                    // console.log('response.entrance', response.entrance);
                    this.plOnceVote = response.items;
                    this.plFirstLogin = response.playlist;

                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate);

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
                // console.log(error);
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

    /**
     * called when user vote a song, send user vote's details to server
     *
     * @PARAM {number} rate: user's vote - between 1 to 5
     * @PARAM {String} userId: user's ID
     * @PARAM {String} ytId: YouTube ID of the song
     *
     */
    addVote(rate: number, userId: number, ytId: string) {
        // console.log(rate, userId, ytId);
        this.http.get(BACKEND_URL + '/user/' + userId + '/youtube/' + ytId + '/rate/' + rate)
            .subscribe(response => {
                // console.log(response);
            });
    }

    // called every action/changes in the DOM of the app, checking for the user's authentication
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

            this.setAuthTimer(expireIn / 1000); // divide by 1000 because getTime() returns th time in ms
            this.authStatusListener.next(true);
            this.adminAuthStatusListener.next(true);

            // TODO
        }
    }

    // clear the token - execute when we call onLogout()
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
        localStorage.removeItem('isVoted');
        localStorage.removeItem('researchId');
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
