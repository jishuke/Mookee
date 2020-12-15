import {_get, _post} from './request';
import { Platform } from 'react-native';
/**
 * *****************
 * method get
 * ******************
 * */

/**
 * 我的心得点赞列表
 * @param
 * {
 *  key
 *  size
 *  page
 * }
 * */
export const getExperienceLikeList = (data) => {
    const url = '/index.php?app=post&mod=my_post_good_list&key=' + key;
    return _get(url, data);
}
/**
 * 我的心得评论列表
 * @param
 * {
 *  key
 *  size
 *  page
 * }
 * */
export const getMyExperienceCommentList = (data) => {
    const url = '/index.php?app=post&mod=my_post_comment_list&key=' + key;
    return _get(url, data);
}

/**
 * 获取心得列表
 * @param
 * {
 *   key
 *   size
 *   page
 *   type 获取类型：1全部数据  2我自己发表的数据
 * }
 * */
export const getExperienceList = (data) => {
    const url = '/index.php?app=post&mod=get_list';
    return _get(url, data);
}
/**
 * 获取关联商品列表
 * @param
 * {
 *   key
 *   size
 *   page
 * }
 * */
export const getLinkGoodsList = (data) => {
    const url = '/index.php?app=post&mod=get_goods_list';
    return _get(url, data);
}

/**
 * 心得详情
 * post_id        心得id
 * key
 * client
 * */
export const experienceDetail = (data) => {
    const url = '/index.php?app=post&mod=post_info&key=' + key;
    return _get(url, data);
}

/**
 * 心得评论列表
 * post_id
 * size
 * page
 * key
 * client
 * */
export const getExperienceCommentList = (data) => {
    const url = '/index.php?app=post&mod=post_comment_list&key=' + key;
    return _get(url, data);
}

/**
 * *****************
 * method post
 * **************
 * */

/**
 * 取消评论点赞
 * @param {*} data
 * {
 *  key      required   用户密钥
 *  client   required   用户端
 *  post_id  required
 * }
 */
export const cancelLike = (data) => {
    const url ='/index.php?app=post&mod=cancel_comment_good&key=' + key + '&client=' + Platform.OS;
    // data.client = Platform.OS;
    return _post(url, data);
}

/**
 * 评论点赞
 * @param {*} data
 * {
 *  key
 *  client
 *  comment_id
 * }
 * */
export const commentLike = (data) => {
    const url ='/index.php?app=post&mod=comment_good&key' + key + '&client=' + Platform.OS;
    // data.client = Platform.OS;
    return _post(url, data);
}

/**
 * 取消心得点赞
 * post_id
 * key
 * client
 * */
export const cancelExperienceLike = (data) => {
    const url = '/index.php?app=post&mod=cancel_good&key=' + key + '&client=' + Platform.OS;
    // data.client = Platform.OS;
    return _post(url, data);
}

/**
 * 心得点赞
 * post_id
 * key
 * client
 * */
export const experienceLike = (data) => {
    const url = '/index.php?app=post&mod=good&key=' + key + '&client=' + Platform.OS;
    // data.client = Platform.OS;
    return _post(url, data);
}

/**
 * 评论回复列表
 * comment_id
 * size
 * page
 * key
 * client
 * */
export const getCommentReplyList = (data) => {
    const url = '/index.php?app=post&mod=comment_reply_list&key=' + key + '&client=' + Platform.OS;
    // data.client = Platform.OS;
    return _post(url, data);
}

/**
 * 心得评论列表
 * post_id
 * size
 * page
 * key
 * client
 * */
// export const getExperienceCommentList = (data) => {
//     const url = '/index.php?app=post&mod=post_comment_list&key=' + key;
//     data.client = Platform.OS;
//     return _post(url, data);
// }

/**
 * 心得评论
 * comment        评论内容
 * post_id        心得id
 * comment_id     上级评论id
 * obj_member_id  回复目标id
 * key
 * client
 * */
export const experienceComment = (data) => {
    const url = '/index.php?app=post&mod=comment&key=' + key + '&client=' + Platform.OS;
    // data.client = Platform.OS;
    return _post(url, data);
}

// /**
//  * 心得详情
//  * post_id        心得id
//  * key
//  * client
//  * */
// export const experienceDetail = (data) => {
//     const url = '/index.php?app=post&mod=post_info&key=' + key;
//     data.client = Platform.OS;
//     return _post(url, data);
// }

/**
 * 发表心得
 * image_id  图片id  多个用英文逗号分隔
 * title     标题
 * content   内容
 * goods_id  关联商品id
 * key
 * client
 * */
export const createExperience = (data) => {
    const url = '/index.php?app=post&mod=create&key=' + key + '&client=' + Platform.OS;
    // data.client = Platform.OS;
    return _post(url, data);
}

/**
 * 三方注册
 **/
export const registerForThirdPart = (params) => {
    const url = '/index.php?app=login&mod=registerForThirdPart'
    return _post(url, params);
}

/**
 * 三方登录绑定已有账号
 **/
export const bindAccount = (params) => {
    const url = '/index.php?app=login&mod=autoRegisterForThirdPart'
    return _post(url, params);
}

/**
 * 验证登录密码
 **/
export const verifylLoginPsd = (params) => {
    const url = '/index.php?app=usercenter&mod=passwordVerify'
    return _post(url, params);
}

/**
 * 设置支付密码
 **/
export const payPassword = (params) => {
    const url = '/index.php?app=usercenter&mod=modifyPayPassword'
    return _post(url, params);
}
