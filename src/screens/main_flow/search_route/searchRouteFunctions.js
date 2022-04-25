import {constVar} from '../../../utils/constStr';
import {filterKeys, getValue} from '../../../utils/Storage';

export const getGender = async () => {
  let gender = await getValue(filterKeys.showMe);

  if (gender) {
    switch (gender) {
      case 'όλους':
        return null;
      case 'άνδρες':
        return 'male';
      default:
        return 'female';
    }
  }

  return null;
};
export const getCar = async () => {
  let carMark = await getValue(filterKeys.carMark);

  if (carMark) {
    if (carMark === 'ΟΛΑ') return null;
    else return carMark;
  }
  return null;
};
export const getStartAge = async () => {
  let ageRange = await getValue(filterKeys.ageRange);
  if (ageRange) {
    return ageRange.split('-')[0];
  }
  return null;
};

export const getEndAge = async () => {
  let ageRange = await getValue(filterKeys.ageRange);
  if (ageRange) {
    return ageRange.split('-')[1];
  }
  return null;
};

export const hasReturnDate = async () => {
  let returnStartDate = await getValue(filterKeys.returnStartDate);
  if (returnStartDate && returnStartDate !== constVar.returnStartDate) {
    return true;
  }
  return null;
};

export const getPetAllowed = async () => {
  let petAllowed = await getValue(filterKeys.allowPet);
  if (petAllowed && petAllowed === 'true') {
    return true;
  }
  if (petAllowed && petAllowed === 'false') {
    return false;
  }

  return null;
};
export const getReturnStartDate = async () => {
  let returnStartDate = await getValue(filterKeys.returnStartDate);
  if (returnStartDate && returnStartDate !== constVar.returnStartDate) {
    return moment(returnStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }
  return null;
};
export const getReturnEndDate = async () => {
  let returnEndDate = await getValue(filterKeys.returnEndDate);
  if (returnEndDate && returnEndDate !== constVar.returnEndDate) {
    return moment(returnEndDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }
  return null;
};
export const getStartDate = async () => {
  let startDate = await getValue(filterKeys.startDate);
  if (startDate && startDate !== constVar.initialDate) {
    return moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }
  return null;
};

export const getEndDate = async () => {
  let endDate = await getValue(filterKeys.endDate);
  if (endDate && endDate !== constVar.endDate) {
    return moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }
  return null;
};
