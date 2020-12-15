import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    View
} from 'react-native';
import pxToDp from "../../util/pxToDp";
import {experienceLike} from '../../api/communityApi'
import {$Message} from '../../util/tools'
import {I18n} from "../../lang";

export default class CommunityItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            numLines: 2,
            item: props.listItem,
            isMuti: false,
        }
    }

    /**
	 * 点赞
	 */
	_like(postId) {
		experienceLike({
			key,
			post_id: postId
		}).then(res => {
			if(res.datas.error == 0) {
                $Message('点赞成功！');
                const item = this.state.item;
                item.good_num = Number(item.good_num) + 1;
                this.setState({
                    item,
                });
            }
            if(res.datas.error == 2040101) {
                $Message('您已点赞过了！');
            }
		})
    }

    render() {
        const item = this.state.item;
        console.log('item---', item);
        const imgs = (item && item.image) || [];
        if(!item) return null;
        return (
            <View style={styles.container}>
                <View style={styles.hd}>
                    <Image style={styles.head_img} source={{uri: item.member.header}} defaultSource={require("../../assets/images/sld_default_avator.png")}/>
                    <Text style={styles.title}>{item.member.member_nickname}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    console.log('item-----click----', item);
                    this.props.navigation.navigate('CommunityDetail', {
                        postId: item.id
                    });
                }}>
                    <Text
                        style={styles.text}
                        numberOfLines = {2}
                    >{item && item.content}</Text>
                </TouchableOpacity>
                {
                   imgs.length > 0 &&
                        (
                            <TouchableOpacity onPress={() => {
                                console.log('item-----click----', item);
                                this.props.navigation.navigate('CommunityDetail', {
                                    postId: item.id
                                });
                            }}>
                            <View style={styles.imgs}>
                                {
                                    imgs.map((img, index) => {
                                        const length = imgs.length;
                                        if(length == 1) {
                                            return <Image key={index} style={[styles.imgs_type, styles.imgs_type1]} source={{uri: img.image_url}} defaultSource={require('../../assets/images/default_icon_400.png')}/>;
                                        } else if(length == 2) {
                                            return <Image key={index} style={[styles.imgs_type, styles.imgs_type2]} source={{uri: img.image_url}} defaultSource={require('../../assets/images/default_icon_400.png')}/>;
                                        } else {
                                            return <Image key={index} style={[styles.imgs_type, styles.imgs_type3]} source={{uri: img.image_url}} defaultSource={require('../../assets/images/default_icon_400.png')}/>;
                                        }

                                    })
                                }
                            </View>
                            </TouchableOpacity>
                        )
                }
                <View style={styles.footer}>
                    <Text style={styles.ft_left}>{item && item.read_num}{I18n.t('CommunityDetail.yd')}</Text>
                    <View style={styles.footer_right}>
                        <TouchableOpacity style={styles.icon_box} onPress={() => {
                            this._like(item.id);
                        }}>
                            <Image style={styles.ft_icon} source={require('../../assets/images/communityPage/hand_red.png')} />
                            <Text style={styles.icon_text}>{item && item.good_num}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {

                            this.props.navigation.navigate('CommunityDetail', {
                                postId: item.id
                            });
                        }} style={[styles.icon_box, styles.mlt40]}>
                            <Image style={styles.ft_icon} source={require('../../assets/images/communityPage/msg.png')} />
                            <Text style={styles.icon_text}>{item && item.comment_num}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: pxToDp(44),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        paddingBottom: pxToDp(40),
        backgroundColor: "#fff",
    },
    hd: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: pxToDp(34)
    },
    head_img: {
        width: pxToDp(84),
        height: pxToDp(84),
        borderRadius: pxToDp(42),
        backgroundColor: '#f7f7f7',
        flexShrink: 1
    },
    title: {
        fontSize: pxToDp(28),
        color: '#242424',
        fontWeight: 'bold',
        marginLeft: pxToDp(10)
    },
    text: {
        fontSize: pxToDp(28),
        color: '#242424'
    },
    imgs: {
        marginTop: pxToDp(40),

        marginLeft: pxToDp(-5),
        marginRight: pxToDp(-5),
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imgs_type: {
        marginBottom: pxToDp(10),
        backgroundColor: '#e0e0e0',
        marginLeft: pxToDp(5),
        marginRight: pxToDp(5)
    },
    imgs_type1: {
        width: pxToDp(670),
        height: pxToDp(300),
    },
    imgs_type2: {
        width: pxToDp(326),
        height: pxToDp(326),
    },
    imgs_type3: {
        width: pxToDp(216),
        height: pxToDp(216),
    },
    footer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: pxToDp(30),
    },
    ft_left:{
        fontSize: pxToDp(24),
        color: '#E5E5E5'
    },
    footer_right: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon_box: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon_text: {
        fontSize: pxToDp(24),
        marginLeft: pxToDp(10),
        color: '#242424'
    },
    ft_icon: {
        width: pxToDp(32),
        height: pxToDp(32)
    },
    mlt40: {
        marginLeft: pxToDp(40)
    }
});
