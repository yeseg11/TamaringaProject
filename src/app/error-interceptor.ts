import {HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ErrorComponent} from './error/error.component';


// class that responsible for handling the HTTP errors
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
         /** handle actually gives us back the response observable stream and we
         can just hook into that stream and listen to events and we can use
         the pipe to add Catch error as the name suggests is an operator
         that allows us to handle errors emitted in this stream
         **/

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                // set the defualt message to be unknown message
                let errorMessage = 'An Unknown message occurred!';
                if (error.error.message) { // override the error message if we get real message
                    errorMessage = error.error.message;
                }
                // console.log(error);
                // alert(error.error.error.message);
                this.dialog.open(ErrorComponent, {data: {message: errorMessage }});
                return throwError(error);
            })
        );
    }
}
