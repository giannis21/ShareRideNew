import { DELETE_FAVORITE_ROUTE, GET_FAVORITE_ROUTES, TRIGGER_DATABASE } from '../actions/types';
import { constVar } from '../utils/constStr';


const intialState = {
    favoriteRoutes: [],
    triggerDatabase: false
};

export function SearchReducer(state = intialState, action) {

    switch (action.type) {

        case GET_FAVORITE_ROUTES:
            return {
                ...state,
                favoriteRoutes: state.favoriteRoutes = action.payload
            };
        case DELETE_FAVORITE_ROUTE:
            return {
                ...state,
                favoriteRoutes: state.favoriteRoutes.filter((obj) => obj.compoundKey !== action.payload)
            };
        case TRIGGER_DATABASE:
            return {
                ...state,
                triggerDatabase: state.triggerDatabase = !state.triggerDatabase
            };
        default:
    }

    return state;

}
