import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData, AuthDataLogin} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
    private isAuthenticated = false;
    private isAdminAuthenticated = false;
    private test = '5ccfd97a8991c605c8e32f7d';
    private records: string[] = [];
    private token: string;
    private tokenTimer: any;
    // that will actually be a new subject imported from rxjs and i'll use that subject
    // to push the authentication information to the components which are interested.
    // wrap a boolean because i don't really need the token in my other components - only in my interceptor
    private authStatusListener = new Subject<boolean>();
    private adminAuthStatusListener = new Subject<boolean>();

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


    createUser(fullName: string, id: number, age: number, year: number, password: string, country: string) {
        const authData: AuthData = {fullName, id, age, year, password, country};
        this.http.post('http://localhost:3000/api/user/signup', authData)
            .subscribe(response => {
                console.log('response from server: ');
                console.log(response);
            } , error => {
                console.log(error);
                // when we get error in login, we provide to login component a false boolean to stop the spinner
                this.authStatusListener.next(false);
            });
    }

    login(id: number, password: string) {
        const authDataLogin: AuthDataLogin = {id, password};
        // configure this post request to be aware of "token" that the response include - <{token: string}>
        this.http.post<{ token: string, expiresIn: number, userID: string, records }>
        ('http://localhost:3000/api/user/login', authDataLogin)
            .subscribe(response => {
                // console.log(response);

                const recRes = response.records;
                // dismantle the records Object into string array of videoId
                for (const rec of recRes) {
                    this.records.push(rec.youtube.videoId);
                }
                // console.log(this.records);

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

                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);

                    if (response.userID === this.test) {
                        this.isAdminAuthenticated = true;
                        this.adminAuthStatusListener.next(true);
                    }

                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate);
                    console.log('expiration date: ', expirationDate);

                    // reach out to my router to navigate back to the home page
                    this.router.navigate(['/user']);
                }
            } , error => {
                console.log(error);
                // when we get error in login, we provide to login component a false boolean to stop the spinner
                this.authStatusListener.next(false);
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
            this.setAuthTimer(expireIn / 1000); // divide by 1000 because getTime() returns th time in ms
            this.authStatusListener.next(true);
            this.adminAuthStatusListener.next(true);
        }
    }

    // clear the token - ecxecute when we call onLogout()
    logout() {
        this.token = null;
        this.isAuthenticated = false;
        // pass that information to anyone who is interested
        this.authStatusListener.next(false); // false becuase the user in now not authenticated anymore
        this.adminAuthStatusListener.next(false); // false becuase the user in now not authenticated anymore
        this.clearAuthDta();
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

    // private method that called only from this service that responsabile on saving the token in the local storage
    private saveAuthData(token: string, expirationDate: Date) {
        // stores the data to local storage
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());

    }

    // clear the local storage
    private clearAuthDta() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
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
