import React, {Component} from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	StyleSheet,
} from "react-native";
import pxToDp from "../../util/pxToDp";

export default class LikesItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            info: props.info,
            key: props.key
        };
    }

    render() {
        const { info } = this.state;
        console.log('info::', info);
        if(!info) return null;
        return (
            <View key={this.state.key} style={styles.container}>
                <View style={styles.hd}>
                    <View style={styles.hd_left}>
                        <Image resizeMode="cover" style={styles.avatar} source={{uri: info.member.header}} />
                        <Text style={styles.user_name}>{info.member.member_nickname}</Text>
                    </View>
                    {
                        this.props.type && this.props.type == 'comment' && <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('CommentDetail', {
                                postId: info.post_id,
                                memberId: info.member_id,
                                commentId: info.comment_id
                            });
                        }} style={styles.answer_btn}>
                            <Text style={styles.ans_text}>回复</Text>
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.text_box}>
                    <Text style={styles.text_info}>{info.comment || info.post.content}</Text>
                </View>
                {
                    info.goods && <TouchableOpacity style={styles.goods}>
                        <Image style={styles.goods_cover} source={{uri: info.goods.goods_image_url}} />
                        <View style={{flex: 1}}>
                            <Text style={styles.goods_name}>{info.goods.goods_name}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: pxToDp(40)
    },
    hd: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: pxToDp(20)
    },
    hd_left: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar:{
        backgroundColor: '#f7f7f7',
        width: pxToDp(60),
        height: pxToDp(60),
        borderRadius: pxToDp(30),
        marginRight: pxToDp(10)
    },
    user_name: {
        fontSize: pxToDp(28),
        color: '#242424',
        fontWeight: 'bold'
    },
    ans_text: {
        fontSize: pxToDp(20),
        lineHeight: pxToDp(40),
        color: '#242424'
    },
    answer_btn: {
        height: pxToDp(40),
        borderColor: '#E5E5E5',
        borderWidth: pxToDp(1),
        borderRadius: pxToDp(20),
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20)
    },
    text_box: {
        paddingBottom: pxToDp(20),
    },
    text_info: {
        fontSize: pxToDp(24),
        lineHeight: pxToDp(36),
        color: '#666'
    },
    goods: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'row',
        padding: pxToDp(20)
    },
    goods_cover: {
        flexShrink: 0,
        width: pxToDp(120),
        height: pxToDp(80),
        marginRight: pxToDp(26)
    },
    goods_name: {
        fontSize: pxToDp(24),
        lineHeight: pxToDp(32),
    }
});
