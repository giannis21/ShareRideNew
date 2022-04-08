import { createSelector } from 'reselect';

const generalReducer = (state) => state.generalReducer;

export const getIsHocScreenActive = createSelector(
    generalReducer,
    (reducer) => reducer.isHocScreenActive
);


export const getIsHocScreenMinimize = createSelector(
    generalReducer,
    (reducer) => reducer.isHocMinimize
);


export const getUsersToRate = createSelector(
    generalReducer,
    (reducer) => reducer?.usersToRate?.usersToReview
);

export const isEmailContainedInUsersRates = (email) =>
    createSelector(generalReducer, (reducer) => {
        return reducer.usersToRate?.usersToReview?.find((obj) => obj.email === email) !== undefined
    });

export const isReviewToEdit = (email) =>
    createSelector(generalReducer, (reducer) => {
        let user = reducer.usersToRate?.usersToReview?.find((obj) => obj.email === email)
        return user?.toEdit
    });