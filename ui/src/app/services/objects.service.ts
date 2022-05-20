import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { runQuery, runQueryFinished } from 'src/app/redux/shared.actions';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ObjectsService {
    constructor(private http: HttpClient, private matSnackBar: MatSnackBar, private store: Store<any>) { }

    query<T>(path: string, payload: any): Observable<T[]> {
        this.store.dispatch(runQuery());
        return this.http
            .post<T[]>(environment.apiUri + 'query/' + path, payload)
            .pipe(
                tap(() => this.store.dispatch(runQueryFinished())),
                catchError((error: HttpErrorResponse) => {
                    const message = error.error instanceof ErrorEvent ? error.error.message : `Backend returned code ${error.status}, ` +
                        `body was: ${error.error}`;
                    this.matSnackBar.open('Error: ' + message, 'OK', {
                        verticalPosition: 'bottom',
                        duration: 5000,
                        panelClass: ['snackbar-fail']
                    });
                    console.log(message);
                    this.store.dispatch(runQueryFinished());
                    return of([]);
                })
            );
    }
}
