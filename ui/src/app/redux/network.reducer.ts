import { Action, createReducer, createSelector, on } from "@ngrx/store";
import { execCommand, execCommandFailed, execCommandSuccess, runQuery, runQueryFinished } from "src/app/redux/shared.actions";

export interface NetworkState {
    isBusy: boolean;
}

export const intitialNetworkState: NetworkState = {
    isBusy: false,
};

const reducer = createReducer(intitialNetworkState,
    on(execCommand, (state: NetworkState, action): NetworkState => {
        return {
            ...state,
            isBusy: true
        };
    }),
    on(execCommandSuccess, (state: NetworkState, action): NetworkState => {
        return {
            ...state,
            isBusy: false
        };
    }),
    on(execCommandFailed, (state: NetworkState, action): NetworkState => {
        return {
            ...state,
            isBusy: false
        };
    }),
    on(runQuery, (state: NetworkState, action): NetworkState => {
        return {
            ...state,
            isBusy: true
        };
    }),
    on(runQueryFinished, (state: NetworkState, action): NetworkState => {
        return {
            ...state,
            isBusy: false
        };
    }),
);

export const selectNetwork = createSelector((state: any): NetworkState => state.network, (s): NetworkState => s);
export const selectIsBusy = createSelector((state: any): NetworkState => state.network, (s): boolean => s.isBusy);

export function networkReducer(state: NetworkState, action: Action) {
    return reducer(state, action);
}
