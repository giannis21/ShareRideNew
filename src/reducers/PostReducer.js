import { ADD_ACTIVE_POST, ADD_END_DATE, ADD_END_POINT, ADD_MIDDLE_STOP, ADD_RETURN_END_DATE, ADD_RETURN_START_DATE, ADD_SEARCH_END_POINT, ADD_SEARCH_START_POINT, ADD_START_DATE, ADD_START_POINT, CLEAR_ALL, CLEAR_SEARCH_VALUES, DELETE_ACTIVE_USER, IS_SEARCH_OPEN, LOGIN_USER, LOGOUT, REMOVE_DATES, REMOVE_MIDDLE_STOP, REMOVE_MIDDLE_STOPS, SET_FAVORITE_POSTS, SET_POST_SCREEN_VALUES, SET_RADIO_SELECTED, SET_RADIO_SELECTED_FILTERS, SIGNUP_CHECK } from '../actions/types';
import { constVar } from '../utils/constStr';


const intialState = {

    email: "",
    date: "",

    startplace: "",
    startcoord: "",
    endplace: "",
    endcoord: "",

    searchStartplace: "",
    searchStartcoord: "",
    searchEndplace: "",
    searchEndcoord: "",

    numseats: 1,
    costperseat: 0,
    comment: "",

    radioSelected: 0,
    startdate: constVar.initialDate,
    enddate: constVar.endDate,

    returnStartDate: constVar.returnStartDate,
    returnEndDate: constVar.returnEndDate,
    activePost: {},
    moreplaces: [],
    favoritePosts: [],
    isSearchOpened: true
};

export function PostReducer(state = intialState, action) {
    switch (action.type) {
        case ADD_MIDDLE_STOP: {

            return {
                ...state,
                moreplaces: [...state.moreplaces, action.payload]
            };
        }
        case IS_SEARCH_OPEN: {
            return {
                ...state,
                isSearchOpened: action.payload
            };
        }
        case CLEAR_ALL: {

            return {
                ...state,
                moreplaces: [],
                startdate: constVar.initialDate,
                enddate: constVar.endDate,

                returnStartDate: constVar.returnStartDate,
                returnEndDate: constVar.returnEndDate,
                startplace: '',
                endplace: ''
            };
        }
        case SET_POST_SCREEN_VALUES: {
            let newPlaces = action.payload.moreplaces
            return {
                ...state,
                moreplaces: state.moreplaces = [...Array.from(JSON.parse(newPlaces))],
                startplace: state.startplace = action.payload.startplace,
                endplace: state.endplace = action.payload.endplace,
                startcoord: state.startcoord = action.payload.startcoord,
                endcoord: state.endcoord = action.payload.endcoord,
                startdate: constVar.initialDate,
                enddate: constVar.endDate,
                returnStartDate: constVar.returnStartDate,
                returnEndDate: constVar.returnEndDate,
            };
        }
        case SET_FAVORITE_POSTS: {
            return {
                ...state,
                favoritePosts: action.payload
            };
        }
        case CLEAR_SEARCH_VALUES: {

            return {
                ...state,
                searchStartplace: "",
                searchStartcoord: "",
                searchEndplace: "",
                searchEndcoord: "",
            };
        }
        case REMOVE_MIDDLE_STOPS: {

            return {
                ...state,
                moreplaces: []
            };
        }
        case REMOVE_DATES: {

            return {
                ...state,
                startdate: constVar.initialDate,
                enddate: constVar.endDate,

                returnStartDate: constVar.returnStartDate,
                returnEndDate: constVar.returnEndDate,
            };
        }
        case REMOVE_MIDDLE_STOP: {
            let moreplacesNew;
            //let currentArray = [...Array.from(JSON.parse(state?.moreplaces))]
            if (state.moreplaces.find((obj) => obj.placecoords === action.payload)) {
                moreplacesNew = state.moreplaces.filter((obj) => obj.placecoords !== action.payload)
            }

            return {
                ...state,
                moreplaces: moreplacesNew
            };
        }

        case ADD_START_POINT:

            return {
                ...state,
                startplace: state.startplace = action.payload[0],
                startcoord: state.startcoord = action.payload[1]

            };
        case ADD_END_POINT:
            return {
                ...state,
                endplace: state.endplace = action.payload[0],
                endcoord: state.endcoord = action.payload[1]
            };
        case ADD_SEARCH_START_POINT:

            return {
                ...state,
                searchStartplace: state.searchStartplace = action.payload[0],
                searchStartcoord: state.searchStartcoord = action.payload[1]

            };
        case ADD_SEARCH_END_POINT:

            return {
                ...state,
                searchEndplace: state.searchEndplace = action.payload[0],
                searchEndcoord: state.searchEndcoord = action.payload[1]

            };
        case ADD_START_DATE:

            return {
                ...state,
                startdate: state.startdate = action.payload
            };
        case ADD_END_DATE:
            return {
                ...state,
                enddate: state.enddate = action.payload
            };

        case ADD_RETURN_START_DATE:

            return {
                ...state,
                returnStartDate: state.returnStartDate = action.payload
            };

        case ADD_RETURN_END_DATE:
            return {
                ...state,
                returnEndDate: state.returnEndDate = action.payload
            };
        case SET_RADIO_SELECTED:
            return {
                ...state,
                radioSelected: state.radioSelected = action.payload
            };
        case SET_RADIO_SELECTED_FILTERS:
            return {
                ...state,
                radioSelectedFilters: state.radioSelectedFilters = action.payload
            };
        case ADD_ACTIVE_POST:
            return {
                ...state,
                activePost: state.activePost = action.payload
            };
        case DELETE_ACTIVE_USER: {
            const { activePost } = state
            let users = activePost.users.filter((obj) => obj.piid !== action.payload)
            activePost.users = users
            return {
                ...state,
                activePost: state.activePost = activePost
            };
        }
        default:
    }

    return state;

}
