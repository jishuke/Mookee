import {_get, _post} from './request';

//猜你喜欢商品分类
export const guessLikeCatgory = (data) => {
    const url = '/index.php?app=index&mod=getCategoryList';
    return _get(url, data);
}

//猜你喜欢全部商品列表
export const guessLikeAllCatgorylList = (data) => {
    const url = '/index.php?app=index&mod=getRelatedBrowseGoodsList';
    return _get(url, data);
}

//猜你喜欢分类商品列表
export const guessLikeCatgoryList = (data) => {
    const url = '/index.php?app=index&mod=getGuessLikeCategoryGoods';
    return _get(url, data);
}

//消息轮播
export const getshuffingmessage = (data) => {
    const url = '/index.php?app=index&mod=getshuffingmessage';
    return _get(url, data);
}

//版本更新
export const getVersion = (data) => {
    const url = '/index.php?app=index&mod=getAppVersion';
    return _get(url, data);
}
