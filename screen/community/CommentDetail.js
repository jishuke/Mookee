/**
 * 种草社区 --评论回复详情页
 * */
import React, {Component} from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	StyleSheet,
    ScrollView,
} from "react-native";
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";
import fun from '../../assets/styles/FunctionStyle'
import {isEmpty} from '../../util/tools'
import { getCommentReplyList, experienceComment } from '../../api/communityApi'

export default class CommentDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            commentInfo: null,
            replyList: null,
            msg: ''
        };
        this.commentId = null; // 上级评论id
        this.postId = null;    // 心得id
        this.memberId = null;  // 回复目标id
        this.page = 1;
        this.size = 10;
    }

    componentDidMount() {
        console.log('this.props.nav--', this.props.navigation.state);
        const nState = this.props.navigation.state;
        if(nState.params) {
            this.commentId = nState.params.commentId;
            this.postId = nState.params.postId;
            this.memberId = nState.params.memberId;
        }
        this._getList();
    }

    _getList() {
        if(!this.commentId) return;
        getCommentReplyList({
            comment_id: this.commentId,
            page: this.page,
            size: this.size
        }).then(res => {
            this.setState({
                commentInfo: res.data.comment,
                replyList: res.data.list
            });
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

    _sendMsg() {
        experienceComment({
            post_id: this.postId,
            comment_id: this.commentId,
            obj_member_id: this.memberId,
            comment: this.state.msg
        }).then(res => {
            console.log('res--', res);
            if(res.datas.error == 0) {
                this.setState({
                    msg: ''
                });
                this._getList();
            }


        })
    }

    submit() {
        console.log('submit--', this.state);
        if(isEmpty(this.state.msg)) {
            return;
        }
        this._sendMsg();
    }

    _renderHeader() {
        const { commentInfo } = this.state;
        if(!commentInfo) {
            return null;
        }
        return (
            <View style={[styles.common_padding, styles.hd]}>
                <View style={[styles.row]}>
                    {/* <Image style={styles.hd_avatar} resizeMode="cover" source={require('../../assets/images/communityPage/avatar.png')} /> */}
                    <Image style={styles.hd_avatar} resizeMode="cover" source={{uri: commentInfo.member.header}} />
                     <Text style={{fontSize: pxToDp(28), color: '#242424', marginLeft: pxToDp(20)}}>{commentInfo.member.member_nickname}</Text>
                </View>
                <View style={styles.hd_bd}>
                    <View style={{ fontSize: pxToDp(28)}}>
                    <Text style={{marginBottom: pxToDp(20), lineHeight: pxToDp(40), color: '#242424'}}>{commentInfo.comment}</Text>
                    </View>
                    <View style={[styles.hd_hand_box, styles.row]}>
                        <TouchableOpacity style={[styles.row]}>
                            <Image style={[styles.icon_32, {marginRight: pxToDp(14)}]} source={require('../../assets/images/communityPage/hand_gray.png')} />
                            <Text style={{fontSize: pxToDp(20), color: '#E5E5E5'}}>赞</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    _renderReplyItem(msg, index) {
        return (
            <View key={index} style={styles.item}>
                <View style={styles.item_hd}>
                    <View style={styles.row}>
                        <Image style={styles.item_avatar} resizeMode="cover" source={{uri: msg.member.header}} />
                        <View>
                            <Text style={{fontSize: pxToDp(28), color: '#242424', marginBottom: pxToDp(4)}}>YY</Text>
                            <Text style={{fontSize: pxToDp(20), color: '#E5E5E5'}}>17:23</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.row}>
                        <Image style={styles.icon_32} source={require('../../assets/images/communityPage/hand_gray.png')} />
                        <Text style={{fontSize: pxToDp(20), color: '#E5E5E5', marginLeft: pxToDp(10)}}>赞</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.item_bd}>
                    <View style={styles.text_box}>
                        <Text style={styles.item_text}>
                            <Text>回复</Text>
                            <Text style={fun.f_c_red}>{msg.obj_member.member_nickname}：</Text>
                            <Text>{msg.comment}</Text>
                        </Text>
                    </View>
                    {/* <View style={styles.text_box}>
                        <Text style={styles.item_text}>冲鸭。。。冲鸭。。。冲鸭。。。冲鸭。。。冲鸭。。。冲鸭。。。冲鸭。。。冲鸭。。。冲鸭。。。冲鸭。。。冲鸭。。。冲鸭。。。</Text>
                    </View> */}
                </View>
            </View>
        )
    }

    render() {
        const { commentInfo, replyList } = this.state;
        return (
            <View style={{
                    flex: 1,
                    backgroundColor: '#F7F7F7',
                }}>
                <NavigationBar
					statusBar={{barStyle: "dark-content"}}
					leftButton={this.leftButton()}
                    title="评论详情"
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                <ScrollView>
                    {
                        this._renderHeader()
                    }
                    <View style={[styles.common_padding, styles.bd]}>
                        {
                            replyList && replyList.map((item, index) => {
                                return this._renderReplyItem(item, index);
                            })
                        }
                    </View>
                </ScrollView>
                <View style={[fun.f_flex, {
                    height: pxToDp(100),
                    paddingLeft: pxToDp(40),
                    paddingRight: pxToDp(40),
                    backgroundColor: '#fff',
                    justifyContent: 'center'
                }]}>
                    <TextInput
                        style={{
                            height: pxToDp(72),
                            paddingLeft: pxToDp(10),
                            paddingRight: pxToDp(10),
                            borderColor: '#f7f7f7',
                            borderWidth: 1,
                            borderRadius: pxToDp(10)
                        }}
                        underlineColorAndroid='transparent'
                        placeholder="来说点什么"
                        placeholderTextColor={'#E5E5E5'}
                        value={this.state.msg}
                        onSubmitEditing = {this.submit.bind(this)}
                        onChangeText={text => this.setState({
                            msg: text
                        })} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    common_padding: {
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20)
    },
    icon_32: {
        width: pxToDp(32),
        height: pxToDp(32)
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    hd: {
        backgroundColor: '#fff',
        paddingTop: pxToDp(40)
    },
    hd_avatar: {
        backgroundColor: '#f7f7f7',
        width: pxToDp(80),
        height: pxToDp(80),
        borderRadius: pxToDp(40)
    },
    hd_bd: {
        paddingLeft: pxToDp(100),

    },
    hd_hand_box: {
        paddingTop: pxToDp(20),
        paddingBottom: pxToDp(20),
        justifyContent: 'flex-end',
    },
    item: {
        paddingTop: pxToDp(40)
    },
    item_hd: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item_avatar: {
        width: pxToDp(60),
        height: pxToDp(60),
        borderRadius: pxToDp(30),
        marginRight: pxToDp(20)
    },
    item_bd: {
        paddingLeft: pxToDp(80),

    },
    item_text: {
        fontSize: pxToDp(24),
        color: '#242424'
    },
    text_box: {
        marginTop: pxToDp(20)
    }
});
