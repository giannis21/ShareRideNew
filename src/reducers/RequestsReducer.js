import { DELETE_REQUEST, GET_REQUESTS } from '../actions/types';
import { constVar } from '../utils/constStr';


const intialState = {
    requests: []
};

export function RequestsReducer(state = intialState, action) {

    switch (action.type) {

        case GET_REQUESTS:
            return {
                ...state,
                requests: state.requests = action.payload
            };
        case DELETE_REQUEST:
            return {
                ...state,
                requests: state.requests.filter((obj) => obj.postSearchId !== action.payload)
            };
        default:
    }

    return state;

}
