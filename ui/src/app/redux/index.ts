import {
    ActionReducerMap,
    MetaReducer
} from '@ngrx/store';
import { reducersMap } from 'src/app/redux/root.state';
import { environment } from '../../environments/environment';


export const reducers: ActionReducerMap<any> = reducersMap;
export const metaReducers: MetaReducer<any>[] = !environment.production ? [] : [];
