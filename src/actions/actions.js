import {
  ADD_ACTIVE_POST,
  CLEAR_ALL,
  CLEAR_SEARCH_VALUES,
  GET_FAVORITE_ROUTES,
  HIDE_BOTTOM_TAB,
  REMOVE_DATES,
  REMOVE_DATES_FILTERS,
  REMOVE_MIDDLE_STOP,
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

export const removeDateFilters = () => ({
  type: REMOVE_DATES_FILTERS,
  payload: {},
});

export const removeDates = () => ({
  type: REMOVE_DATES,
  payload: {},
});

// export const removeDateFilters = () => ({
//   type: REMOVE_DATES_FILTERS,
//   payload: {},
// });
