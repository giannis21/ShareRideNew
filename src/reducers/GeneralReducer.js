import {
  HIDE_BOTTOM_TAB,
  OPEN_HOC_MODAL,
  SET_ACTIVE_NOTIFICATION,
  SET_FCM_TOKEN,
  SET_NOTIFICATION_OBJECT,
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
  hasActiveNotification: false,
  notificationObject: null,
  fcmToken: null,
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
    case SET_ACTIVE_NOTIFICATION:
      return {
        ...state,
        hasActiveNotification: (state.hasActiveNotification = action.payload),
      };
    case SET_NOTIFICATION_OBJECT:
      return {
        ...state,
        notificationObject: (state.notificationObject = action.payload),
      };
    case SET_FCM_TOKEN:
      return {
        ...state,
        fcmToken: (state.fcmToken = action.payload),
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
