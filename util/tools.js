import Toast from '@remobile/react-native-toast';
export const isEmpty = (str) => {
    return str === null || str === '' || str === undefined;
}

export const $Message = (msg) => {
    Toast.showShortCenter(msg);
}