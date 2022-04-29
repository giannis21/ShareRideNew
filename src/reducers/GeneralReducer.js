import {
  HIDE_BOTTOM_TAB,
  OPEN_HOC_MODAL,
  SET_SEARCH_POSTID_MODIFIED,
  SET_TERMS,
  SET_TOOLTIP_VISIBLE,
  SET_USERS_TO_RATE,
  USER_LOGOUT,
} from '../actions/types';
import {constVar} from '../utils/constStr';

const intialState = {
  isSearchOpened: false,
  terms: '',
  isHocScreenActive: false,
  isHocMinimize: true,
  usersToRate: [],
  isToolTipVisible: false,
  searchedPostIdToModified: null,
};

export function GeneralReducer(state = intialState, action) {
  switch (action.type) {
    case HIDE_BOTTOM_TAB:
      return {
        ...state,
        isSearchOpened: (state.isSearchOpened = action.payload),
      };
    case SET_TOOLTIP_VISIBLE:
      return {
        ...state,
        isToolTipVisible: (state.isToolTipVisible = action.payload),
      };
    case USER_LOGOUT: {
      return state;
    }
    case SET_TERMS:
      return {
        ...state,
        terms: (state.terms = action.payload),
      };
    case SET_SEARCH_POSTID_MODIFIED:
      return {
        ...state,
        searchedPostIdToModified: (state.searchedPostIdToModified =
          action.payload),
      };
    case OPEN_HOC_MODAL:
      return {
        ...state,
        isHocScreenActive: (state.isHocScreenActive = action.payload),
      };
    case SET_USERS_TO_RATE:
      return {
        ...state,
        usersToRate: (state.usersToRate = action.payload),
      };

    default:
  }

  return state;
}
