import RequestData from "../RequestData";
import { Platform } from 'react-native';

export const _get = (url, data) => {
    let _url = AppSldUrl + url;
    _url = _url + '&client=' + Platform.OS;
    console.log('_get_data::', data);
    for(i in data) {
            _url = _url + '&' + i + '=' + data[i];
    }
    return RequestData.getSldData(_url)
}
export const _post = (url, data) => {
    let _url = AppSldUrl + url;
    return RequestData.postSldData(_url, data);
};