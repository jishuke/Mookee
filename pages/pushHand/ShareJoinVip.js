/**
 * 推手 --- vip
 * */
import React, {Component} from "react";
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Dimensions,
    Platform,
    Clipboard,
    NativeModules,
    NativeEventEmitter
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import fun from '../../assets/styles/FunctionStyle';
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";
import {I18n, LANGUAGE_CHINESE, LANGUAGE_MIANWEN, LANGUAGE_ENGLISH} from '.././../lang/index';
import RNFS from 'react-native-fs'
import ShareUtil from '../../util/ShareUtil'
import StorageUtil from "../../util/StorageUtil";
import ViewUtil from '../../util/ViewUtils'
import {getQrCode, getPushHandInfo} from "../../api/pushHandApi"
import {PERMISSIONS, request, RESULTS} from "react-native-permissions";

const {BitMapModule} = NativeModules;
const nativeEmitter = new NativeEventEmitter(BitMapModule);

export default class ShareJoinVip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imgHeight: 0,
            imgH: 0,
            language: 0,
            checked: null,
            newImgs_big: [],
            newImgs_small: [],
            showPopView: false,
            memberId: null, //推手id,
            pushCode: '-----', //推广码
            // isFrom: props.navigation.state.params.isFrom,
        };
    }

    componentDidMount() {
        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                this.setState({
                    language: object
                });
            } else {
                this.setState({
                    language: LANGUAGE_CHINESE
                })
            }
        });

        StorageUtil.get('key', (error, object) => {
            if (!error && object) {
                this.loadData(object)
            }
        });
    }

    componentWillUnmount() {
        this.subscription && this.subscription.remove()
    }

    //加载数据
    loadData(userKey) {
        // console.log('用户唯一标识:', userKey)
        //二维码
        this.loadQrCodeInfo(userKey);
    };

    //二维码信息
    loadQrCodeInfo(userKey) {
        getQrCode({key: userKey, type: 1, gid: ''}).then(res => {
            if (res.code === 200) {
                // console.log('二维码信息:', res)
                const qrcodeUrl = res.datas.tgsrc;
                const memberId = res.datas.member_id

                //推手信息
                this.loadPushHandInfo(userKey, memberId, qrcodeUrl)
            }
        }).catch(err => {
            console.log(err)
        });
    }

    //推手信息
    loadPushHandInfo(userKey, memberId, qrcodeUrl) {
        getPushHandInfo({key: userKey, member_id: memberId}).then(res => {
            if (res.code === 200) {
                // console.log('推手信息:', JSON.stringify(res))
                const pushCode = res.datas.push_code
                this.setState({
                    pushCode: pushCode
                })

                //图片二维码合成图片生成
                this.bgImageAddQrCode(qrcodeUrl, pushCode);
            }
        }).catch(err => {
            console.log(err)
        })
    }


    //图片二维码合成图片生成
    bgImageAddQrCode(qrcodeUrl, codeStr) {
        BitMapModule.qrCodeUrl(qrcodeUrl, codeStr);
        this.subscription = nativeEmitter.addListener('QrCodeImageReminder', res => {
            // console.log('给JS端发送事件');
            let imageArr_small = [];
            let imageArr_big = [];
            for (let i = 0; i < 15; i++) {
                let path_small = RNFS.DocumentDirectoryPath + '/newImage_small_' + i + '.png';
                let path_big = RNFS.DocumentDirectoryPath + '/newImage_big_' + i + '.png';
                // console.log('文件路径_小图:', path_small, '文件路径_大图:', path_big);
                imageArr_small.push(path_small)
                imageArr_big.push(path_big)
            }
            this.setState({
                newImgs_big: imageArr_big,
                newImgs_small: imageArr_small
            });
        });
    }

    // 选中分享的图片
    checkPoster(index) {
        this.setState({
            checked: index
        })
    }

    // 左上角返回键按钮
    leftButton() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.goBack();
            }}>
                <Image
                    style={{width: pxToDp(24), height: pxToDp(24), marginLeft: pxToDp(40)}}
                    source={require('../../assets/images/pushHand/goBack.png')}/>
            </TouchableOpacity>
        );
    }

    //复制邀请码
    _copyCode(pushCode) {
        Clipboard.setString(pushCode)
        ViewUtil.sldToastTip(I18n.t('share_join_Vip.text6'))
    }

    //分享链接
    _shareLink() {
        const shareUrl = 'https://md.mookee.net/cwap/downloadPage/index.html'
        Clipboard.setString(shareUrl)
        ViewUtil.sldToastTip(I18n.t('share_join_Vip.text7'))
    }

    // 分享海报
    _sharePost() {
        const {newImgs_big, checked} = this.state;
        if (checked === null) {
            ViewUtil.sldToastTip(I18n.t('share_join_Vip.text5'))
            return
        }

        var imgUri = newImgs_big[checked];
        // console.log('分享本地图片:', imgUri);
        let list = [2, 3, 7];//0:qq,1:新浪, 2:微信, 3:微信朋友圈,4:qq空间, 7:Facebook, 8:推特

        if (Platform.OS === 'android') {
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
                if (result === RESULTS.GRANTED) {
                    ShareUtil.shareboard(null, imgUri, null, null, list, (code, message) => {
                        // console.log('友盟分享:', message);
                        ViewUtil.sldToastTip(message)
                    });
                } else {
                    ViewUtils.sldToastTip(I18n.t('GoodShareScreen.auth_fail'));
                }
            })
        } else {
            ShareUtil.shareboard(null, imgUri, null, null, list, (code, message) => {
                // console.log('友盟分享:', message);
                ViewUtil.sldToastTip(message)
            });
        }
    }

    //  打开关于VIP弹框
    _showPopView() {
        this.setState({
            showPopView: true
        })
    }

    render() {
        const {checked, pushCode, newImgs_small} = this.state;
        const {width} = Dimensions.get('window')
        console.log('推广码:', pushCode)
        return (
            <View style={[fun.f_flex1, fun.f_flex, {backgroundColor: '#000'}]}>
                <LinearGradient
                    style={{flex: 1}}
                    start={{x: 0.0, y: 0.5}} end={{x: 1.0, y: 0.5}}
                    locations={[0, 1]}
                    colors={['#323232', '#000']}
                >
                    <NavigationBar
                        statusBar={{backgroundColor: 'rgba(0,0,0,0)', barStyle: "light-content"}}
                        leftButton={this.leftButton()}
                        title={I18n.t('share_join_Vip.title')}
                        popEnabled={false}
                        title_color={'#E6B28D'}
                        linear={['#323232', '#000']}
                    />
                    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                        {/*邀请码模块*/}
                        <View style={[fun.f_center]}>
                            <ImageBackground
                                style={[styles.invitation, {width: 0.53 * width, height: 0.19 * width}]}
                                source={require('../../assets/images/pushHand/my_inv_code.png')}
                            >
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <View style={{
                                        flex: 1,
                                        marginLeft: 6,
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{color: '#442E20', fontSize: 11, textAlign: 'center'}}
                                              numberOfLines={1}>{I18n.t('share_join_Vip.my_inv_code')}</Text>
                                        <Text style={{color: '#442E20', fontSize: 22, textAlign: 'center'}}
                                              numberOfLines={1}>{pushCode}</Text>
                                    </View>
                                    {/*复制邀请码按钮*/}
                                    <TouchableOpacity
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginLeft: 0,
                                            width: 45,
                                            height: 19,
                                            backgroundColor: '#cf482d',
                                            borderRadius: 8.0
                                        }}
                                        onPress={() => this._copyCode(pushCode)}
                                    >
                                        <Text style={{fontSize: 12, color: 'rgb(231,231,231)'}} numberOfLines={1}>
                                            {I18n.t('share_join_Vip.copy')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        </View>
                        {/*vip邀请方式模块*/}
                        <ImageBackground
                            source={require('../../assets/images/pushHand/share_methods.png')}
                            style={[styles.share_methods, fun.f_marginBottom40, {
                                width: width - 40,
                                height: (width - 40) / 1011 * 692
                            }]}
                        >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 10,
                                height: 32
                            }}>
                                <Text style={{
                                    flex: 1,
                                    color: '#E6B28D',
                                    textAlign: 'left'
                                }}>{`${I18n.t('share_join_Vip.text1')}:`}</Text>
                                <TouchableOpacity
                                    style={{width: 32, height: 32}}
                                    onPress={() => this._showPopView()}
                                >
                                    <Image
                                        style={{alignSelf: 'flex-end', width: 18, height: 18}}
                                        source={require('../../assets/images/pushHand/question.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{paddingHorizontal: 10}}>
                                <Text style={{color: '#E6B28D'}}>{I18n.t('share_join_Vip.content')}</Text>
                            </View>
                        </ImageBackground>

                        {/*分享海报模块*/}
                        <ScrollView
                            style={{
                                marginLeft: 20,
                                marginVertical: 25,
                                marginRight: 0,
                                height: 160 * 1.78
                            }}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={{paddingHorizontal: 20, flexDirection: 'row'}}>
                                {
                                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14].map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                style={{marginHorizontal: 12}}
                                                activeOpacity={1}
                                                onPress={() => this.checkPoster(index)}
                                            >
                                                <Image
                                                    source={newImgs_small.length > 0 ? {uri: 'file://' + newImgs_small[index]} : require('../../assets/images/pushHand/share_posters.png')}
                                                    style={{width: 160, height: '100%'}}
                                                    resizeMode={'contain'}
                                                />
                                                {
                                                    checked === index &&
                                                    <Image
                                                        source={require('../../assets/images/pushHand/check.png')}
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            position: 'absolute',
                                                            right: 10,
                                                            top: 10
                                                        }}
                                                    />
                                                }

                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    </ScrollView>
                </LinearGradient>
                {/*vip分享模块*/}
                <View style={styles.footer}>
                    <ImageBackground
                        style={[fun.f_row_between, {width: '100%', height: 90}]}
                        source={require('../../assets/images/pushHand/share_bottom.png')}
                    >
                        {/*分享链接*/}
                        <TouchableOpacity
                            style={[fun.f_flex1, fun.f_center]}
                            onPress={() => this._shareLink()}
                        >
                            <Image
                                source={require('../../assets/images/pushHand/share_url.png')}
                                style={[styles.share_icon]}
                            />
                            <Text style={{color: '#fff', fontSize: pxToDp(20)}}>{I18n.t('share_join_Vip.text3')}</Text>
                        </TouchableOpacity>
                        {/*分享海报*/}
                        <TouchableOpacity
                            style={[fun.f_flex1, fun.f_center]}
                            onPress={() => this._sharePost()}
                        >
                            <Image
                                source={require('../../assets/images/pushHand/share_poster_icon.png')}
                                style={[styles.share_icon]}
                            />
                            <Text style={{color: '#fff', fontSize: pxToDp(20)}}>{I18n.t('share_join_Vip.text4')}</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
                {/*关于VIP弹框*/}
                {
                    this.state.showPopView ?
                        <PopView onClick={() => this.setState({showPopView: false})}/> : null
                }
            </View>
        );
    }
}

//关于VIP弹框
const PopView = (props) => {
    const {width} = Dimensions.get('window');
    const {onClick} = props;
    return (
        <View style={styles.popView}>
            <View style={{
                width: width * 0.8,
                height: width * 1.3,
                backgroundColor: '#1E1E1E',
                borderRadius: 5.0
            }}>
                <Text style={{marginHorizontal: 40, marginTop: 14, color: '#E6B28D', fontSize: 18, textAlign: 'center'}}
                      numberOfLines={1}>{I18n.t('share_join_Vip.text2')}</Text>
                <View style={styles.line}/>
                <ScrollView style={{flex: 1, paddingHorizontal: 10, paddingVertical: 10}}>
                    <Text style={{fontSize: 13, color: '#E6B28D'}}>{I18n.t('share_join_Vip.about')}</Text>
                </ScrollView>
                {/*退出按钮*/}
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => onClick()}
                >
                    <Image style={{width: 24, height: 24}} source={require('../../assets/images/pushHand/vip_back.png')}
                           resizeMode={'contain'}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    invitation: {
        backgroundColor: 'yellow',
        marginVertical: pxToDp(42),
        paddingVertical: pxToDp(34),
        paddingHorizontal: pxToDp(56),
        borderRadius: pxToDp(8)
    },
    copy: {
        width: 45,
        height: 19,
        borderRadius: 7,
    },
    share_methods: {
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderRadius: 8,
        marginLeft: 20
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    share_icon: {
        height: 45,
        width: 45,
        marginBottom: 4
    },
    popView: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    backBtn: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 15,
        right: 15,
        width: 24,
        height: 24
    },
    line: {
        marginHorizontal: 0,
        marginTop: 14,
        height: 1,
        backgroundColor: '#E6B28D'
    },
});
