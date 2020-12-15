/**
 * 种草社区 --详情页
 * */
import React, {Component} from "react";
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    ScrollView, TextInput, Dimensions
} from "react-native";
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";
import {$Message} from '../../util/tools'

import { experienceDetail, experienceComment, getExperienceCommentList, experienceLike, commentLike } from '../../api/communityApi'
import PriceUtil from '../../util/PriceUtil'
import {I18n} from "../../lang";

export default class CommunityDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            info: null
        };
        this.isLike = false;
        this.postId = null;
        this.page = 1;
        this.size = 10;
    }

    componentDidMount() {
        console.log('props--', this.props.navigation.state);
        const nState = this.props.navigation.state;
        if(nState.params && nState.params.postId) {
            this.postId = nState.params.postId;
        }
        this._getDetail();
        this._getCommentList();
    }

    /**
     * 评论点赞
    */
    _commentLike(comment_id) {
        commentLike({
            comment_id,
        })
    }

    /**
	 * 点赞
	 */
	_like() {
        if(!this.postId) return;
        if(this.isLike) {
            $Message('您已点赞过了！');
        }
		experienceLike({
			key,
			post_id: this.postId
		}).then(res => {
			if(res.datas.error == 0) {
                $Message('点赞成功！');
                this.isLike = true;
                const item = this.state.info;
                item.good_num = Number(item.good_num) + 1;
                this.setState({
                    item,
                });
                // DeviceEventEmitter.emit('updateCommunity', {});
            }
            if(res.datas.error == 2040101) {
                $Message('您已点赞过了！');
            }
		})
    }

    /**
     * 获取评论列表
     * */
    _getCommentList() {
        if(!this.postId) return;
        getExperienceCommentList({
            key,
            page: this.page,
            size: this.size,
            post_id: this.postId
        }).then(res => {
            this.setState({
                commentList: res.data.list
            });
        })
    }

    /**
     * 获得心得详情
     * */
    _getDetail() {
        console.log('psotId::', this.postId);
        if(!this.postId) return;
        experienceDetail({
            post_id: this.postId,
            key,
        }).then(res => {
            this.setState({
                info: res.datas
            });
        })
    }

    /**
     * 发表评论
     * */
    _sendMsg() {

        experienceComment({
            // key,
            post_id: this.postId,
            comment: this.state.msg
        }).then(res => {
            if(res.datas.error == 0) {
                $Message('发送成功！')
                this.setState({
                    msg: ''
                })
                this._getCommentList();
            }
        })
    }

    leftButton() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.goBack();
            }}>
                <Image style={{ width: pxToDp(36), height: pxToDp(36), marginLeft: pxToDp(40) }} source={require('../../assets/images/goback.png')} />
            </TouchableOpacity>
        );
    }
    rightButton() {
        return (
            <TouchableOpacity>
                <Image style={{width: pxToDp(36), height: pxToDp(36), marginRight: pxToDp(40)}} resizeMode="contain" source={require('../../assets/images/communityPage/share.png')} />
            </TouchableOpacity>
        );
    }

    _renderHeader() {
        const { info } = this.state;
        console.warn('ww:renderheader--', info);
        return (
            <View>
                <View style={styles.hd}>
                    {/* <Image style={styles.hd_icon} source={require('../../assets/images/communityPage/avatar.png')} /> */}
                    <Image style={styles.hd_icon} defaultSource={require("../../assets/images/sld_default_avator.png")} source={{uri: info.member.header}} />
                    <Text style={{fontSize: pxToDp(28), fontWeight: 'bold', color: '#242424'}}>{info.member.member_nickname}</Text>
                </View>
                <Image resizeMode="cover" style={styles.detail_img} source={{uri: info.goods && info.goods.goods_image_url}} />
                <View style={{paddingLeft: pxToDp(20), paddingRight: pxToDp(20)}}>
                    <View>
                        <Text style={[styles.title, styles.title_box]} numberOfLines={1}>{info.title}</Text>
                    </View>
                    <View style={styles.text_box}>
                        <Text style={{fontSize: pxToDp(28), color: '#242424'}}>{info.content}</Text>
                    </View>
                    <View style={[styles.row, styles.hand_box]}>
                        <Text>{info.read_num}{I18n.t('CommunityDetail.yd')}</Text>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={this._like.bind(this)} style={styles.row}>
                                <Image style={[styles.icon_32, {marginRight: pxToDp(5)}]} resizeMode="contain" source={require('../../assets/images/communityPage/hand_red.png')} />
                                <Text>{info.good_num}</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={[styles.row, {marginLeft: pxToDp(20)}]}>
                                <Image style={[styles.icon_32, {marginRight: pxToDp(5)}]} resizeMode="contain" source={require('../../assets/images/communityPage/msg.png')} />
                                <Text>{info.comment_num}</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                    <View style={[styles.goods_box, styles.row]}>
                        <Image resizeMode="cover" style={styles.goods_cover} source={{uri: info.goods && info.goods.goods_image_url}} />
                        <View style={{ flex: 1}}>
                            <Text style={{ fontSize: pxToDp(24), color: '#242424', marginBottom: pxToDp(12)}} numberOfLines={1}>{info.goods && info.goods.goods_name}</Text>
                            <Text style={{ fontSize: pxToDp(20), color: '#DE2C22'}}>ks{PriceUtil.formatPrice(info.goods && info.goods.goods_price)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    _renderAnswerItem(answer, index) {
        return (
            <View key={index} style={styles.answer_item}>
                <Text style={[styles.red, {fontSize: pxToDp(24),flexShrink: 0}]}>{answer.member.member_nickname}：</Text>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: pxToDp(24), color: '#333333'}}>{answer.comment}</Text>
                </View>
            </View>
        )
    }

    _renderReply(msg) {
        console.log('_renderReply------', msg);
        console.log('_renderReply---2-is--', (msg.child && msg.child != '' && msg.child.list.length > 0 ? true : false));
        // return null;
        const isShow = msg.child && msg.child != '' && msg.child.list.length > 0 ? true : false;
        return (
            <View style={styles.msg_body}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('CommentDetail', {
                        commentId: msg.id,
                        postId: msg.post_id,
                        memberId: msg.member_id
                    });
                }}>
                    <Text style={[styles.msg_text, styles.msg]}>{msg.comment}</Text>
                </TouchableOpacity>
                {
                    isShow && (
                        <View style={styles.msg_answer_box}>
                            {
                                msg.child.list && msg.child.list.map((answer, index) => {
                                    return this._renderAnswerItem(answer, index);
                                })
                            }
                            {
                                msg.child.pagination && msg.child.pagination.total > 0 && <TouchableOpacity onPress={() => {
                                    this.props.navigation.navigate('CommentDetail', {
                                        commentId: msg.id,
                                        postId: msg.post_id,
                                        memberId: msg.member_id
                                    });
                                }} style={styles.row}>
                                    <Text style={[styles.red, {fontSize: pxToDp(24), marginRight: pxToDp(10)}]}>共{msg.child.pagination.total}条回复</Text>
                                    <Image style={{ width: pxToDp(20), height: pxToDp(20)}} resizeMode="contain" source={require('../../assets/images/communityPage/arrow_right_red.png')} />
                                </TouchableOpacity>
                            }
                        </View>
                    )
                }
                {
                    // msg.child && msg.child != '' && (
                    //     <View style={styles.msg_answer_box}>
                    //         {
                    //             msg.child.list && msg.child.list.map((answer, index) => {
                    //                 return this._renderAnswerItem(answer, index);
                    //             })
                    //         }
                    //         <View style={styles.answer_item}>
                    //             <Text style={[styles.red, {fontSize: pxToDp(24),flexShrink: 0}]}>雪雪：</Text>
                    //             <View style={{flex: 1}}>
                    //                 <Text style={{fontSize: pxToDp(24), color: '#333333'}}>大卖大卖。求宠。大卖大卖。求宠。大卖大卖。求宠。大卖大卖。求宠。</Text>
                    //             </View>
                    //         </View>
                    //         <TouchableOpacity onPress={() => {
                    //             this.props.navigation.navigate('CommentDetail', {
                    //                 commentId: msg.id,
                    //                 postId: msg.post_id,
                    //                 memberId: msg.member_id
                    //             });
                    //         }} style={styles.row}>
                    //             <Text style={[styles.red, {fontSize: pxToDp(24), marginRight: pxToDp(10)}]}>共{msg.child.list.length}条回复</Text>
                    //             <Image style={{ width: pxToDp(20), height: pxToDp(20)}} resizeMode="contain" source={require('../../assets/images/communityPage/arrow_right_red.png')} />
                    //         </TouchableOpacity>
                    //     </View>
                    // )
                }
            </View>
        );
    }

    _renderCommentItem(msg, index) {
        return (
            <View key={index} style={styles.msg_item}>
                <View style={[styles.row, styles.msg_hd]}>
                    <View style={styles.row}>
                        <Image style={styles.avatar} resizeMode="cover" source={{uri: msg.member.header}} />
                        <Text style={{ fontSize: pxToDp(28), color: '#242424'}}>{msg.member.member_nickname}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        this._commentLike()
                    }} style={styles.row}>
                        <Image style={styles.icon_32} resizeMode="contain" source={require('../../assets/images/communityPage/hand_gray.png')} />
                        <Text style={{fontSize: pxToDp(20), color: '#E5E5E5', marginLeft: pxToDp(10)}}>赞</Text>
                    </TouchableOpacity>
                </View>
                {
                    this._renderReply(msg)
                }

            </View>
        )
    }

    _renderCommentList() {
        const {commentList} = this.state;
        if(!commentList || commentList.length == 0) {
            return (
                <View style={{paddingLeft: pxToDp(20), paddingRight: pxToDp(20)}}>
                    <View style={[styles.row, styles.no_data]}>
                        <Text style={{fontSize: pxToDp(20), color: '#E5E5E5'}}>{I18n.t('CommunityDetail.zwpl')}</Text>
                    </View>
                </View>
            )
        }
        return (
            <View style={{paddingLeft: pxToDp(20), paddingRight: pxToDp(20)}}>
                <View style={styles.comment_box}>
                    <View style={styles.msg_box}>
                        {
                            commentList.map((item, index) => {
                                return this._renderCommentItem(item, index)
                            })
                        }

                    </View>

                </View>
            </View>
        )
    }
    render() {
        const { info } = this.state;
        console.log('info:::', info);
        return (
            <View style={styles.container}>
                <NavigationBar
					statusBar={{barStyle: "dark-content"}}
					leftButton={this.leftButton()}
					rightButton={this.rightButton()}
                    title={I18n.t('CommunityDetail.title')}
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                {this.state.info && <ScrollView>
                    {
                        this._renderHeader()
                    }
                    <View style={{paddingLeft: pxToDp(20), paddingRight: pxToDp(20)}}>
                        <View style={[styles.row, styles.comment_hd]}>
                            <Image style={styles.icon_32} resizeMode="contain" source={require('../../assets/images/communityPage/msg.png')} />
                            <Text style={[styles.title, {marginLeft: pxToDp(20)}]}>{I18n.t('CommunityDetail.qbpl')}</Text>
                        </View>
                        {
                            this._renderCommentList()
                        }
                    </View>
                    <View style={styles.fill_ipt_box}></View>
                </ScrollView>
                }
                {
                    this.state.info && <View style={[styles.ipt_box, styles.row]}>
                        {/* <KeyboardAvoidingViewbehavior behavior="padding"> */}
                            <TextInput
                                style={styles.ipt}
                                underlineColorAndroid='transparent'
                                placeholder="来说点什么"
                                placeholderTextColor={'#E5E5E5'}
                                onChangeText={text => this.setState({
                                    msg: text
                                })}
                                value={this.state.msg}
                            />
                        {/* </KeyboardAvoidingViewbehavior > */}
                        <View style={[styles.row, {paddingRight: pxToDp(30)}]}>
                            <TouchableOpacity onPress={() => {
                               this._sendMsg()
                            }} style={styles.icon_item}>
                                <Image style={styles.icon_send} resizeMode="contain" source={require('../../assets/images/communityPage/community_send.png')} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={[styles.icon_item, { marginLeft: pxToDp(34)}]}>
                                <Image style={styles.icon_32} resizeMode="contain" source={require('../../assets/images/communityPage/msg.png')} />
                                <Text style={styles.icon_text}>74</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff'
    },
    hd: {
        height: pxToDp(120),
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    hd_icon: {
        width: pxToDp(80),
        height: pxToDp(80),
        marginRight: pxToDp(20),
        borderRadius: pxToDp(40)
    },
    detail_img: {
        height: pxToDp(494)
    },
    title_box: {
        paddingTop: pxToDp(40),
        paddingBottom: pxToDp(40)
    },
    title: {
        fontSize: pxToDp(28),
        color: '#242424',
        fontWeight: 'bold'
    },
    text_box: {
        paddingBottom: pxToDp(40)
    },
    hand_box: {
        justifyContent: 'space-between',
        paddingBottom: pxToDp(40)
    },
    goods_box: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        marginBottom: pxToDp(20),
        padding: pxToDp(20)
    },
    goods_cover: {
        width: pxToDp(120),
        height: pxToDp(80),
        flexShrink: 0,
        marginRight: pxToDp(26)
    },
    icon_32: {
        width: pxToDp(32),
        height: pxToDp(32),
    },
    icon_send: {
        width: pxToDp(44),
        height: pxToDp(44),
    },
    comment_hd: {
        height: pxToDp(70),
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
    },
    no_data: {
        justifyContent: 'center',
        height: pxToDp(200)
    },
    comment_box: {
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20)
    },
    msg_box: {
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),
        paddingTop: pxToDp(40),
        paddingBottom: pxToDp(14)
    },
    msg_item: {
        marginBottom: pxToDp(20)
    },
    msg_hd: {
        justifyContent: 'space-between'
    },
    avatar: {
        width: pxToDp(60),
        height: pxToDp(60),
        backgroundColor: '#f7f7f7',
        borderRadius: pxToDp(30),
        marginRight: pxToDp(10)
    },
    msg_body: {
        paddingLeft: pxToDp(70)
    },
    msg_answer_box: {
        backgroundColor: '#f7f7f7',
        padding: pxToDp(20),
        marginTop: pxToDp(20)
    },
    msg_text: {
        fontSize: pxToDp(24),
        color: '#242424'
    },
    msg: {
        flex: 1
    },
    answer_item: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: pxToDp(10)
    },
    ipt_box: {
        width: '100%',
        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: 100,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),
        height: pxToDp(100),
        backgroundColor: '#fff'
    },
    fill_ipt_box: {
        height: pxToDp(100)
    },
    ipt: {
        width: Dimensions.get('window').width - pxToDp(150),
        height: pxToDp(72),
        // backgroundColor: 'rgba(0, 0, 0, 0.03)',
        backgroundColor: '#f7f7f7',
        fontSize: pxToDp(24),
        // lineHeight: pxToDp(72),
        color: '#242424',
        paddingLeft: pxToDp(10),
        paddingRight: pxToDp(10)
    },
    icon_item: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon_text: {
        fontSize: pxToDp(20),
        color: '#242424',
        marginTop: pxToDp(10)
    },
    red: {
        color: '#DE2C22'
    }
});
