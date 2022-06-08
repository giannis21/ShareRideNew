import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { PostReducer } from './reducers/PostReducer';
import { AuthReducer } from './reducers/AuthReducer';
import { FiltersReducer } from './reducers/FiltersReducer';
import { RequestsReducer } from './reducers/RequestsReducer';
import { SearchReducer } from './reducers/SearchReducer';
import { GeneralReducer } from './reducers/GeneralReducer';
import { ContentReducer } from './reducers/ContentReducer';

export default AppReducers = combineReducers({
    authReducer: AuthReducer,
    postReducer: PostReducer,
    filtersReducer: FiltersReducer,
    requestsReducer: RequestsReducer,
    searchReducer: SearchReducer,
    generalReducer: GeneralReducer,
    contentReducer: ContentReducer
})
