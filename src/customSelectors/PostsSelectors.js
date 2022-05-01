import {createSelector} from 'reselect';

const postReducer = state => state.postReducer;

export const postExistsInFav = postid =>
  createSelector(postReducer, reducer => {
    return reducer.favoritePosts.find(obj => obj.post.postid === postid);
  });

export const getFavoritesPosts = () =>
  createSelector(postReducer, reducer => {
    return reducer.favoritePosts;
  });
