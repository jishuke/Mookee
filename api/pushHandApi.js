import {_get, _post} from './request';
//创建推手订单
export const createPushHandOrder = (data) => {
    const url = '/index.php?app=buy&mod=buyhand';
    return _post(url, data);
}
//获取推手价格
export const getPushHandPrice = (data) => {
    const url = '/index.php?app=buy&mod=buyhandmoney&key='+data.key;
    return _post(url);
}
//支付推手订单
export const payPushHandOrder = (data) => {
    const url = '/index.php?app=pay&mod=pay_new_app_pushhand'
    return _post(url,data);
}
//获取可用余额
export const getBalanceOfTheUser = (data) => {
    const url = '/index.php?app=usercenter&mod=getMyAvailable'
    return _get(url,data);
}
//团队信息
export const getMyTeamInfo = (data) => {
    const url = '/index.php?app=pushhandapp&mod=myteam'
    return _post(url,data);
}

//得到会员信息
export const getUserPushHandInfo = (data) => {
    const url = '/index.php?app=usercenter&mod=memberInfo'
    return _post(url,data);
}

//我的奖励
export const getMyaward = (data) => {
    const url = '/index.php?app=pushhandapp&mod=myaward'
    return _post(url,data);
}


//vip 商品 分类
export const getGoodType = (data) => {
    const url = '/index.php?app=pushhandapp&mod=getfirstclass'
    return _get(url,data);
}
//vip 商品 列表
export const getGoodList = (data) => {
    const url = '/index.php?app=pushhandapp&mod=getgoods'
    return _get(url,data)
}



//fb
export const shareFB = (data) => {
    const url = '/index.php?app=login_facebook&mod=facebook_login'
    return _get(url,data)
}

//累计收益
export const accruedIncome = (data) => {
    const url = '/index.php?app=pushhandapp&mod=allmoneydetail'
    return _post(url,data)
}
//收益明细
export const returnsDetailed = (data) => {
    const url = '/index.php?app=pushhandapp&mod=moneydetail'
    return _post(url,data)
}

//kbz支付
export const kbzPay = (data) => {
    const url = '/index.php?app=pay&mod=pay_kbz_app'
    return _post(url,data)
}

//vip/商品分享二维码
export const getQrCode = (data) => {
    const url = '/index.php?app=usercenter&mod=tuiguang_qrcode'
    return _post(url, data)
}

//推手信息
export const getPushHandInfo = (data) => {
    const url = '/index.php?app=pushhandapp&mod=pushinfo'
    return _post(url, data)
}

//验证邀请码是否正确
export const verifyInviteCode = (params) => {
    const url = '/index.php?app=pushhandapp&mod=catpushcode'
    return _post(url, params)
}

//vip商品列表
export const getVIPInfo = () => {
    const url = '/index.php?app=vip_article&mod=getVipGoods'
    return _post(url)
}

//vip优惠券
export const getVIPCoupon = () => {
    const url = '/index.php?app=vip_article&mod=getVipRedList'
    return _post(url)
}

//vip价格
export const getVIPPrice = (params) => {
    const url = '/index.php?app=buy&mod=buyhandmoney'
    return _post(url, params)
}

//vip商品详情
export const getVIPProductDetail = (params) => {
    const url = '/index.php?app=goods&mod=goods_detail'
    return _get(url, params)
}

//vip充值
export const rechargeVIP = (params) => {
    const url = '/index.php?app=buy&mod=buyhand'
    return _post(url, params)
}

//vip余额支付
export const vipBalancePayment = (params) => {
    const url = '/index.php?app=pay&mod=pay_new_app_pushhand'
    return _post(url, params)
}





