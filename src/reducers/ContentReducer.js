import {

    SET_CONTENT,

} from '../actions/types';

const currentContent = require('../assets/content/contentGR.json');
const intialState = {
    content: currentContent,
};

export function ContentReducer(state = intialState, action) {
    switch (action.type) {
        case SET_CONTENT:
            return {
                ...state,
                content: (state.content = action.payload),
            };
        default:
    }

    return state;
}
