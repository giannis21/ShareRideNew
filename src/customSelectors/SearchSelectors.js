import {createSelector} from 'reselect';

const searchReducer = state => state.searchReducer;

export const getFavoriteRoutes = () =>
  createSelector(searchReducer, reducer => {
    return reducer?.favoriteRoutes;
  });
