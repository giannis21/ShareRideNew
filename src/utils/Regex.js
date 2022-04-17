export const regex = {
  phoneNumber: /^[6]{1}[9]{1}[0-9]{8}$/,
  instagram: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
  facebook: /https?\:\/\/(?:www\.)?facebook\.com\/(\d+|[A-Za-z0-9\.]+)\/?/,
  email:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const DATA_USER_TYPE = {
  LINE_COLOR: 'LINE_COLOR',
  TITLE_COLOR: 'TITLE_COLOR',
  TITLE: 'TITLE',
};
