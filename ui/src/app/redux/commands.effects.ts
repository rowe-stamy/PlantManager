import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { emptyAction, execCommand, execCommandFailed, execCommandSuccess } from 'src/app/redux/shared.actions';
import { CommandsService } from '../services/commands.service';

@Injectable()
export class CommandEffects {
    constructor(
        private actions$: Actions,
        private matSnackBar: MatSnackBar,
        private service: CommandsService
    ) { }

    execCommand$ = createEffect(() => this.actions$.pipe(
        ofType(execCommand.type),
        mergeMap((action: any) => this.service.exec(action.payload, action.name).pipe(
            switchMap((response: any) => {
                const commands = [];
                if (action.successCallback) {
                    commands.push(action.successCallback(response));
                }

                if (action.successMessage) {
                    commands.push(execCommandSuccess({ message: action.successMessage }));
                } else {
                    commands.push(execCommandSuccess({ message: null }));
                }
                return commands.length === 0 ? [emptyAction()] : commands;
            }),
            catchError((error => {
                if (action.errorCallback) {
                    action.errorCallback(error);
                }
                return of(execCommandFailed({ error }));
            }))))
    ));

    onCommandSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(execCommandSuccess.type),
        map((action: any) => action.message),
        tap(message => {
            if (message == null || message === '') {
                return;
            }
            return this.matSnackBar.open(message, '', {
                verticalPosition: 'bottom',
                duration: 2000,
                panelClass: ['snackbar-success']
            });
        })
    ), { dispatch: false });

    onCommandFailed$ = createEffect(() => this.actions$.pipe(
        ofType(execCommandFailed.type),
        map((action: any) => action.error),
        tap((error: any) => {
            console.log(error);
            const message = error instanceof HttpErrorResponse
                ? error.error
                : error instanceof ProgressEvent ? 'could not connect to server, please try again later' : error;
            return this.matSnackBar.open('Error: ' + message, 'OK', {
                verticalPosition: 'bottom',
                duration: 5000,
                panelClass: ['snackbar-fail']
            });
        })
    ), { dispatch: false });
}
