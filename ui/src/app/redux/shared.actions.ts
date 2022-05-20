import { createAction, props } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

export const execCommand = createAction('[Shared] execCommand', props<{
    name: string;
    payload: any;
    successCallback?: (result: any) => TypedAction<string>;
    errorCallback?: (response: any) => void;
    successMessage?: string;
}>());
export const execCommandSuccess = createAction('[Shared] execCommand Success', props<{ message: string }>());
export const emptyAction = createAction('[Shared] emptyAction');
export const execCommandFailed = createAction('[Shared] execCommand Failed', props<{ error: string }>());

export const runQuery = createAction('[Shared] runQuery');
export const runQueryFinished = createAction('[Shared] runQueryFinished');

export const plantUpdated = createAction('[Shared] plantUpdated', props<{ plantId: string }>());
export const extractionRecorded = createAction('[Shared] extractionRecorded', props<{ extractionId: string }>());