import axios from 'axios';
import instance from '../network/api';
import {useDispatch} from 'react-redux';
import * as types from '../actions/types';
import {getHeaderConfig} from '../utils/Functions';
import {getValue, setValue, keyNames} from '../utils/Storage';
import {constVar} from '../utils/constStr';
import {configureStore} from '../configureStore';
import RNFetchBlob from 'rn-fetch-blob';
import {BASE_URL} from '../constants/Constants';
import {store} from '../../App';
export const createToken = async ({
  email,
  password,
  successCallBack,
  errorCallback,
}) => {
  const send = {
    data: {
      email: email,
      pass: password,
    },
  };

  await instance
    .post(`/createtoken`, send)
    .then(res => {
      let token = res.data.accessToken;

      if (res.data?.otp) {
        errorCallback(
          res.data.message ?? constVar.sthWentWrong,
          res.data?.otp,
          res.data.email,
        );
        return;
      }

      login({
        send: send,
        token: token,
        successCallBack: successCallBack,
        errorCallback: errorCallback,
      });
    })
    .catch(function (error) {
      console.log('error.response.data ', error.response.data);
      errorCallback(error.response.data.message ?? constVar.sthWentWrong);
    });
};

const login = async ({send, token, successCallBack, errorCallback}) => {
  setValue(keyNames.token, token);
  let config = await getHeaderConfig(token);

  await instance
    .post(`/login`, send, config)
    .then(res => {
      successCallBack(res.data.message, getUser(res.data, send.data.pass));
      storeInfoLocally(res.data, send.data.pass);
    })
    .catch(function (error) {
      console.log('error.response.data ', error.response.data);
      errorCallback(error.response.data.message ?? constVar.sthWentWrong);
    });
};

export const forgotPass = async ({email, successCallBack, errorCallback}) => {
  let config = getHeaderConfig();
  const send = {
    data: {
      email: email,
    },
  };

  await instance
    .post(`/passotp`, send, config)
    .then(res => {
      successCallBack(res.data.otp, email, res.data.message);
    })
    .catch(function (error) {
      console.log(error.response.data);
      errorCallback(error.response.data.message ?? constVar.sthWentWrong);
    });
};
//getPostsUser,getInterestedPerUser
export const restorePassword = async ({
  email,
  password,
  successCallBack,
  errorCallback,
}) => {
  let config = await getHeaderConfig();

  const send = {
    data: {
      email: email,
      pass: password,
    },
  };

  await instance
    .post(`/updateUserPass`, send, config)
    .then(res => {
      successCallBack(res.data.message);
    })
    .catch(function (error) {
      console.log('user updated not', error.response.data);
      errorCallback(error.response.data.message ?? constVar.sthWentWrong);
    });
};

export const uploadImage = async (
  email,
  singleFile,
  successCallBack,
  errorCallback,
) => {
  let config = await getHeaderConfig();
  config.headers = {...config.headers, 'Content-Type': 'multipart/form-data'};

  var data = new FormData();
  data.append('upload', {
    uri: singleFile,
    name: email + '.jpeg',
    type: 'image/*',
  });

  await instance
    .post(`/upload`, data, config)
    .then(res => {
      successCallBack();
    })
    .catch(function (error) {
      console.log('error ', error);
      errorCallback(error.response.data.message ?? constVar.sthWentWrong);
    });
};

export const registerUser = async (
  data,
  imageBase64,
  successCallBack,
  errorCallback,
) => {
  let config = await getHeaderConfig();

  const send = {
    data: {
      email: data.email,
      password: data.password,
      mobile: data.phone,
      fullname: data.fullName,
      gender: data.checked,
      car: data.carBrand,
      cardate: data.carDate,
      age: data.age,
      photo: imageBase64,
    },
  };
  await instance
    .post(`/register`, send, config)
    .then(res => {
      successCallBack(res.data.body.message, res.data.body.otp);
    })
    .catch(function (error) {
      errorCallback(error.response.data.message ?? constVar.sthWentWrong);
    });
};

const storeInfoLocally = async (res, password) => {
  try {
    const d = new Date();
    setValue(keyNames.lastLoginDate, d.getTime().toString());
    setValue(keyNames.age, res.user.age);
    setValue(keyNames.car, res.user.car);
    setValue(keyNames.carDate, res.user.cardate);
    setValue(keyNames.email, res.user.email);
    setValue(keyNames.facebook, res.user.facebook ?? '-');
    setValue(keyNames.fullName, res.user.fullname);
    setValue(keyNames.gender, res.user.gender ?? '-');
    setValue(keyNames.instagram, res.user.instagram ?? '-');
    setValue(keyNames.phone, res.user.mobile.toString());
    setValue(keyNames.password, password);
    const fs = RNFetchBlob.fs;
    let imagePath = null;

    //image save
    await RNFetchBlob.config({fileCache: true})
      .fetch('GET', BASE_URL + res.user.photo)
      // .then(async resp => {
      //   const path = `${RNFetchBlob.fs.dirs.DocumentDir}/images/${res.user.email}.png`;
      //   RNFetchBlob.fs.writeFile(path, resp.data, 'base64').then(() => {

      //     resp.readFile('base64').then(base64 => {
      //       console.log('base64', base64);
      //       store.dispatch({type: types.SET_PROFILE_PHOTO, payload: base64});
      //     });
      //   });
      // })
      // .catch(err => {
      //   console.log(err);
      // });

      // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component

        return resp.readFile('base64');
      })
      .then(base64Data => {
        const path = `${RNFetchBlob.fs.dirs.DocumentDir}/images/${res.user.email}.png`;
        RNFetchBlob.fs.writeFile(path, base64Data, 'base64').then(() => {
          store.dispatch({type: types.SET_PROFILE_PHOTO, payload: base64Data});
        });
        return fs.unlink(imagePath);
      });
  } catch (err) {
    console.log(err);
  }
};

const getUser = (res, password) => {
  let user;
  try {
    const d = new Date();
    user = {
      lastLoginDate: d.getTime().toString(),
      age: res.user.age,
      car: res.user.car,
      carDate: res.user.cardate,
      email: res.user.email,
      facebook: res.user.facebook ?? '-',
      fullName: res.user.fullname,
      gender: res.user.gender ?? '-',
      instagram: res.user.instagram ?? '-',
      phone: res.user.mobile.toString(),
      password: password,
      token: '',
      average: res.user.average ?? '0',
      count: res.user.count ?? '0',
    };
    //  configureStore.dispatch({ type: types.LOGIN_USER, payload: user })
  } catch (err) {
    console.log('err', err);
  }
  return user;
};

export const getUserFromStorage = async () => {
  let user = {
    lastLoginDate: await getValue(keyNames.lastLoginDate),
    age: await getValue(keyNames.age),
    car: await getValue(keyNames.car),
    carDate: await getValue(keyNames.carDate),
    email: await getValue(keyNames.email),
    facebook: await getValue(keyNames.facebook),
    fullName: await getValue(keyNames.fullName),
    gender: await getValue(keyNames.gender),
    instagram: await getValue(keyNames.instagram),
    phone: await getValue(keyNames.phone),
    password: await getValue(keyNames.password),
    token: '',
  };

  return user;
};
