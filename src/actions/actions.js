import {
  ADD_ACTIVE_POST,
  CLEAR_ALL,
  CLEAR_SEARCH_VALUES,
  GET_FAVORITE_ROUTES,
  HIDE_BOTTOM_TAB,
  OPEN_HOC_MODAL,
  REMOVE_DATES,
  REMOVE_DATES_FILTERS,
  REMOVE_MIDDLE_STOP,
  SET_ACTIVE_NOTIFICATION,
  SET_CONTENT,
  SET_FCM_TOKEN,
  SET_NOTIFICATION_OBJECT,
  SET_RADIO_SELECTED,
  SET_TOOLTIP_VISIBLE,
} from './types';

export const removeMiddleStop = payload => ({
  type: REMOVE_MIDDLE_STOP,
  payload,
});

export const hideBottomTab = payload => ({
  type: HIDE_BOTTOM_TAB,
  payload,
});

export const clearAll = () => ({
  type: CLEAR_ALL,
  payload: {},
});

export const setRadioSelected = payload => ({
  type: SET_RADIO_SELECTED,
  payload,
});

export const setActivePost = payload => ({
  type: ADD_ACTIVE_POST,
  payload,
});

export const setFavoriteRoutes = payload => ({
  type: GET_FAVORITE_ROUTES,
  payload,
});

export const clearSearchValues = () => ({
  type: CLEAR_SEARCH_VALUES,
  payload: {},
});

export const setToolTipVisible = payload => ({
  type: SET_TOOLTIP_VISIBLE,
  payload,
});

export const setActiveNotification = payload => ({
  type: SET_ACTIVE_NOTIFICATION,
  payload,
});

export const openHoc = () => ({
  type: OPEN_HOC_MODAL,
  payload: true,
});

export const closeHoc = () => ({
  type: OPEN_HOC_MODAL,
  payload: false,
});

export const setFcmToken = payload => ({
  type: SET_FCM_TOKEN,
  payload,
});

export const setNotificationObject = payload => ({
  type: SET_NOTIFICATION_OBJECT,
  payload,
});

export const removeDateFilters = () => ({
  type: REMOVE_DATES_FILTERS,
  payload: {},
});

export const removeDates = () => ({
  type: REMOVE_DATES,
  payload: {},
});

export const setLanguage = (payload) => ({
  type: SET_CONTENT,
  payload,
});
