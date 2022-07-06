import { setValue, getValue, keyNames, filterKeys } from '../utils/Storage';
import ImagePicker from 'react-native-image-crop-picker';
import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';

const months = [
  {
    index: '01',
    month: 'Ιαν',
  },
  {
    index: '02',
    month: 'Φεβ',
  },
  {
    index: '03',
    month: 'Μαρτ',
  },
  {
    index: '04',
    month: 'Απρ',
  },
  {
    index: '05',
    month: 'Μαι',
  },
  {
    index: '06',
    month: 'Ιουν',
  },
  {
    index: '07',
    month: 'Ιουλ',
  },
  {
    index: '08',
    month: 'Αυγ',
  },
  {
    index: '09',
    month: 'Σεπ',
  },
  {
    index: '10',
    month: 'Οκτ',
  },
  {
    index: '11',
    month: 'Νοε',
  },
  {
    index: '12',
    month: 'Δεκ',
  },
];

export const showToast = (message, success = true) => {
  Toast.show({
    type: 'customToast',
    props: { success: success },
    text1: message
  });
}

export const getGenreFromDb = (showMe) => {

  switch (showMe) {
    case "undefined": return content.all
    case "men": return content.men
    default: return content.women
  }
}

export const getHeaderConfig = async token => {
  let language = await getValue(keyNames.currentLanguage)
  let newToken = token;
  if (!token) {
    newToken = await getValue(keyNames.token);
  }

  let config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + newToken,
      'language': language
    },
  };
  return config;
};

const getToken = async () => {
  return await getValue(keyNames.token);
};
export const getDate = timestamp => {
  let year = timestamp.split(' ')[0].split('-');
  let month = months.find(item => item.index === year[1]).month;

  return year[2] + ' ' + month + ' ' + year[0];
};

export const onLaunchGallery = block => {
  ImagePicker.openPicker({
    compressImageMaxWidth: 200,
    compressImageMaxHeight: 200,
    width: 200,
    height: 200,
    writeTempFile: false,
    cropping: true,
    includeBase64: true,
    cropperChooseText: 'Επιβεβαίωση',
    cropperCancelText: 'Άκυρο',
    avoidEmptySpaceAroundImage: false,
    cropperCircleOverlay: true,
  })
    .then(image => {
      block(image);
    })
    .catch(err => {
      block('error');
    });
};

export const onLaunchCamera = block => {
  ImagePicker.openCamera({
    compressImageMaxWidth: 200,
    compressImageMaxHeight: 200,
    width: 200,
    height: 200,
    writeTempFile: false,
    cropping: true,
    includeBase64: true,
    cropperCircleOverlay: true,
    useFrontCamera: true,
    cropperChooseText: 'Conferma',
    cropperCancelText: 'Annulla',
    mediaType: 'photo',
  })
    .then(image => {
      block(image);
    })
    .catch(err => {
      console.log(err);
    });
};
export async function sendEmail(to, subject, body, options = {}) {
  const { cc, bcc } = options;

  let url = `mailto:${to}`;

  // Create email link query
  const query = qs.stringify({
    subject: subject,
    body: body,
    cc: cc,
    bcc: bcc,
  });

  if (query.length) {
    url += `?${query}`;
  }

  // check if we can use this link
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
  }

  return Linking.openURL(url);
}

export const carBrands = [
  { label: 'ΟΛΑ', value: 'ΟΛΑ' },
  { label: 'OPEL', value: 'OPEL' },
  { label: 'CITROËN', value: 'CITROËN' },
  { label: 'HYUNDAI', value: 'HYUNDAI' },
  { label: 'AUDI', value: 'AUDI' },

  { label: 'HONDA', value: 'HONDA' },
  { label: 'BMW', value: 'BMW' },
  { label: 'NISSAN', value: 'NISSAN' },
  { label: 'FIAT', value: 'FIAT' },
  { label: 'FORD', value: 'FORD' },

  { label: 'SMART', value: 'SMART' },
  { label: 'MERCEDES-BENZ', value: 'MERCEDES-BENZ' },
  { label: 'RENAULT', value: 'RENAULT' },
  { label: 'MAZDA', value: 'MAZDA' },
  { label: 'MITSUBISHI', value: 'MITSUBISHI' },
  { label: 'ALFA ROMEO', value: 'ALFA ROMEO' },
  { label: 'SEAT', value: 'SEAT' },
  { label: 'SUZUKI', value: 'SUZUKI' },
  { label: 'ΑΛΛΟ', value: 'ΑΛΛΟ' },
];

export const newCarBrands = [
  'OPEL',
  'CITROËN',
  'HYUNDAI',
  'AUDI',
  'HONDA',
  'BMW',
  'NISSAN',
  'FIAT',
  'FORD',
  'SMART',
  'MERCEDES-BENZ',
  'RENAULT',
  'MAZDA',
  'MITSUBISHI',
  'ALFA ROMEO',
  'SEAT',
  'SUZUKI',

];

export function range(start, end) {
  return [...Array(end + 1).keys()].filter(
    value => end >= value && start <= value,
  );
}
