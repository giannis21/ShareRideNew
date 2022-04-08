export const regex = {
    phoneNumber: /^[6]{1}[9]{1}[0-9]{8}$/,
    instagram: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
    facebook: /https?\:\/\/(?:www\.)?facebook\.com\/(\d+|[A-Za-z0-9\.]+)\/?/
}

export const DATA_USER_TYPE = {
    LINE_COLOR: 'LINE_COLOR',
    TITLE_COLOR: 'TITLE_COLOR',
    TITLE: 'TITLE'
};