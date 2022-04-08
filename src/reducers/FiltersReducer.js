import { ADD_DATES_FILTERS, ADD_END_DATE_FILTERS, ADD_RETURN_END_DATE_FILTERS, ADD_RETURN_START_DATE_FILTERS, ADD_START_DATE_FILTERS, REMOVE_DATES_FILTERS, SET_RADIO_SELECTED_FILTERS } from '../actions/types';
import { constVar } from '../utils/constStr';


const intialState = {

    radioSelected: 0,
    startdate: constVar.initialDate,
    enddate: constVar.endDate,

    returnStartDate: constVar.returnStartDate,
    returnEndDate: constVar.returnEndDate,

};

export function FiltersReducer(state = intialState, action) {

    switch (action.type) {

        case SET_RADIO_SELECTED_FILTERS:
            return {
                ...state,
                radioSelected: state.radioSelected = action.payload
            };
        case REMOVE_DATES_FILTERS: {

            return {
                ...state,
                startdate: constVar.initialDate,
                enddate: constVar.endDate,

                returnStartDate: constVar.returnStartDate,
                returnEndDate: constVar.returnEndDate,
            };
        }
        case ADD_START_DATE_FILTERS:

            return {
                ...state,
                startdate: state.startdate = action.payload
            };
        case ADD_END_DATE_FILTERS:
            return {
                ...state,
                enddate: state.enddate = action.payload
            };

        case ADD_RETURN_START_DATE_FILTERS:

            return {
                ...state,
                returnStartDate: state.returnStartDate = action.payload
            };

        case ADD_RETURN_END_DATE_FILTERS:
            return {
                ...state,
                returnEndDate: state.returnEndDate = action.payload
            };
        case ADD_DATES_FILTERS:
            return {
                ...state,
                startdate: state.startdate = action.payload[0],
                enddate: state.enddate = action.payload[1],
                returnStartDate: state.returnStartDate = action.payload[2],
                returnEndDate: state.returnEndDate = action.payload[3]
            }
        default:
    }

    return state;

}
