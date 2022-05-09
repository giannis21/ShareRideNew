import {
  ADD_ACTIVE_POST,
  CLEAR_ALL,
  HIDE_BOTTOM_TAB,
  REMOVE_MIDDLE_STOP,
  SET_RADIO_SELECTED,
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
