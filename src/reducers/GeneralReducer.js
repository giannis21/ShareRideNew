import { HIDE_BOTTOM_TAB, OPEN_HOC_MODAL, SET_TERMS, SET_USERS_TO_RATE } from '../actions/types';
import { constVar } from '../utils/constStr';


const intialState = {
    isSearchOpened: false,
    terms: '',
    isHocScreenActive: false,
    isHocMinimize: true,
    usersToRate: []
};

export function GeneralReducer(state = intialState, action) {

    switch (action.type) {

        case HIDE_BOTTOM_TAB:
            return {
                ...state,
                isSearchOpened: state.isSearchOpened = action.payload
            };
        case SET_TERMS:
            return {
                ...state,
                terms: state.terms = action.payload
            };
        case OPEN_HOC_MODAL:
            return {
                ...state,
                isHocScreenActive: state.isHocScreenActive = action.payload
            };
        case SET_USERS_TO_RATE:
            return {
                ...state,
                usersToRate: state.usersToRate = action.payload
            };

        default:
    }

    return state;

}
