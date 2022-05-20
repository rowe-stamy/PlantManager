import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommandsService {
    constructor(private http: HttpClient) { }

    exec(cmd: any, commandName: string): Observable<any> {
        return this.http
            .post<any>(environment.apiUri + 'commands/' + commandName, cmd)
            .pipe(catchError((error: HttpErrorResponse) => {
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.error('An error occurred:', error.error.message);
                    return throwError(error.error.message);
                }
                // The backend returned an unsuccessful response code.
                // The response body may contain clues as to what went wrong,
                console.error(
                    `Backend returned code ${error.status}, ` +
                    `body was: ${error.error}`);
                return throwError(error.error);
            }));
    }
}
