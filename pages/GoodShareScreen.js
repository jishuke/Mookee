import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    StyleSheet,
    TextInput,
    Clipboard,
    Platform,
    CameraRoll
} from 'react-native';
import {I18n, LANGUAGE_CHINESE, LANGUAGE_MIANWEN, setLanguage} from "../lang";
import SldHeader from '../component/SldHeader';
import GlobalStyles from "../assets/styles/GlobalStyles";
import ViewUtils from "../util/ViewUtils";
import LinearGradient from "react-native-linear-gradient";
import LogUtil from "../util/LogUtil";
import ShareUtil from '../util/ShareUtil'
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import StorageUtil from "../util/StorageUtil";
import ViewShot from "react-native-view-shot";
import { getQrCode } from "../api/pushHandApi"

var language = 1;

export default class GoodShareScreen extends Component {

    constructor(props) {
        super(props);

        var title = props.navigation.state.params.title;
        let price = props.navigation.state.params.price;
        let market_price = props.navigation.state.params.market_price;
        let code = props.navigation.state.params.pushCode;
        let gid = props.navigation.state.params.gid;
        let key = props.navigation.state.params.key;

        if (title.length > 20) {
            title = title.substring(0, 20) + "...";
        }

        this.state = {
            key,
            gid,
            title: I18n.t('GoodShareScreen.title'),
            good_title: title,
            good_price: price,
            good_market_price: market_price,
            good_invite_code: code,
            good_img: props.navigation.state.params.img,
            qrcodeUrl: '',
            member_id: '',
            poster: '',
            language: 1,
            share_content: I18n.t("GoodShareScreen.text1") + title + I18n.t("GoodShareScreen.text2") + price + I18n.t("GoodShareScreen.text3") + code,
        }
    }

    componentDidMount() {
        const { key, gid } = this.state

        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                this.setState({
                    language: object
                });
            } else {
                this.setState({
                    language: LANGUAGE_CHINESE
                });
            }
        });

        getQrCode({key, type: 2, gid}).then(res => {
            if (res.code === 200) {
                console.log('二维码信息:', res)
                this.setState({
                    qrcodeUrl: res.datas.tgsrc,
                    memberId: res.datas.member_id
                })
            }
        }).catch(err => {
            console.log(err)
        });
    }

    copyText(text) {
        Clipboard.setString(text);
        ViewUtils.sldToastTip(I18n.t('GoodShareScreen.copy_success'));
    }

    _copyContent() {
        let {share_content} = this.state;
        this.copyText(share_content)
    }

    //分享链接
    _shareLink() {
        const { gid, good_invite_code } = this.state
        const shareUrl = `https://md.mookee.net/cwap/cwap_product_detail.html?gid=${gid}&refe_code=${good_invite_code}`
        this.copyText(shareUrl);
    }

    // 分享海报
    _sharePost() {
        if (this.state.poster) {
            console.log('分享商品海报:', this.state.poster)
            let list = [2, 3, 7];//0:qq,1:新浪, 2:微信, 3:微信朋友圈,4:qq空间, 7:Facebook, 8:推特
            if (Platform.OS === 'android') {
                request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
                    if (result === RESULTS.GRANTED) {
                        ShareUtil.shareboard("Mookee", this.state.poster, "", "", list, (code, message) => {
                            console.warn('友盟分享:', message, 'code:', code);
                            if ((Platform.OS === 'ios' && code === 200) || (Platform.OS === 'android' && code === 0)) {
                                ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text15'));
                            } else {
                                ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text17'));
                            }
                        });
                    } else {
                        ViewUtils.sldToastTip(I18n.t('GoodShareScreen.auth_fail'));
                    }
                })
            } else {
                ShareUtil.shareboard("Mookee", this.state.poster, "", "", list, (code, message) => {
                    console.warn('友盟分享:', message, 'code:', code);
                    if ((Platform.OS === 'ios' && code === 200) || (Platform.OS === 'android' && code === 0)) {
                        ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text15'));
                    } else {
                        ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text17'));
                    }
                });
            }
        }

        // this._downloadImage().then(res => {

        // let list = [2, 3, 7];//0:qq,1:新浪, 2:微信, 3:微信朋友圈,4:qq空间, 7:Facebook, 8:推特
        // ShareUtil.shareboard(null, res, null, null, list, (code, message) => {
        //     console.warn('友盟分享:', message, 'code:', code);
        //     if ((Platform.OS === 'ios' && code === 200) || (Platform.OS === 'android' && code === 0)) {
        //         ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text15'));
        //     } else {
        //         ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text17'));
        //     }
        // });
        // });
    }

    //下载图片
    _checkPermission() {
        if (Platform.OS === 'android') {
            check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
                .then(result => {
                    switch (result) {
                        case RESULTS.UNAVAILABLE:
                            this._requestPermission();
                            break;
                        case RESULTS.DENIED:
                            this._requestPermission();
                            break;
                        case RESULTS.GRANTED:
                            console.log('The permission is granted');
                            this._downloadImage();
                            break;
                    }
                });
        } else {
            //ios
            this._downloadImage();
        }
    }

    _requestPermission() {
        if (Platform.OS === 'android') {
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
                if (result === RESULTS.GRANTED) {
                    this._downloadImage();
                } else {
                    ViewUtils.sldToastTip(I18n.t('GoodShareScreen.auth_fail'));
                }
            });
        }
    }

    _downloadImage() {
        this.refs.viewShot.capture()
            .then(uri => {
                let promise = CameraRoll.saveToCameraRoll(uri);
                promise.then(function (result) {
                    console.log('图片保存:', result)
                    ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text14'));
                }).catch(function (error) {
                    LogUtil.log('good_share_error: ', error);
                    ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text13'));
                });
            })
    }


    _formatTitle(title) {
        if (language === 2) {
            if (title.length > 14) {
                return title.substring(0, 14);
            } else {
                return title;
            }
        } else {
            if (title.length > 25) {
                return title.substring(0, 25);
            } else {
                return title;
            }
        }
    }

    //生成图片
    onImageLoad = () => {
        this.refs.viewShot.capture().then(uri => {
            console.log("do something with ", uri);
            this.setState({poster: uri})
        })
    };

    render() {
        const {title, share_content, good_img, good_price, good_market_price, good_title, good_invite_code, qrcodeUrl, member_id, language} = this.state;

        return (
            <View style={styles.container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>
                <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems: 'center'}}>
                    <View style={styles.content_container}>
                        <TextInput
                            style={styles.content_input}
                            underlineColorAndroid='transparent'
                            multiline={true}
                            value={share_content}
                            onChangeText={text => {
                                this.setState({
                                    share_content: text,
                                })
                            }}
                        />
                        <TouchableOpacity onPress={() => this._copyContent()}>
                            <LinearGradient colors={['#FFE9DB', '#FBD3B8', '#FFE9DB']} start={{x: 0, y: 0}}
                                            end={{x: 1, y: 0}} style={styles.btn_container}>
                                <Text style={styles.text_share}>
                                    {I18n.t("GoodShareScreen.copy")}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    {/*分享图片*/}
                    <ViewShot style={styles.image_container} ref='viewShot' options={{ format: "png", quality: 1 }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 10,
                            height: 40,
                            backgroundColor: '#fff'
                        }}>
                            <Image
                                style={{width: 30, height: 30, borderRadius: 3.0}}
                                resizeMode={'cover'}
                                source={require('../assets/images/logo_launcher.png')}
                            />
                            <Text style={{marginLeft: 5, fontSize: language === LANGUAGE_MIANWEN ? 11 : 22, color: '#BC2F16'}}>{I18n.t('GoodShareScreen.text4')}</Text>
                        </View>
                        <Image
                            style={styles.image_share}
                            resizeMode={'cover'}
                            source={good_img ? {uri: good_img} : require('../assets/images/default_icon_400.png')}
                        />
                        <View style={{flex: 1, paddingLeft:10, backgroundColor: '#fff'}}>
                            <View style={{flex: 1, width: 216}}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{fontSize: 15, color: '#BC2F16'}}>Ks {good_price}</Text>
                                    <Text style={{marginLeft: 10, fontSize: 15, color: '#999',  textDecorationLine: 'line-through'}}>Ks {good_market_price}</Text>
                                </View>
                                <Text style={{marginBottom: 5, fontSize: 12, color: '#333'}} numberOfLines={1}>{this._formatTitle(good_title)}</Text>
                            </View>
                        </View>
                        <View style={{
                            position: 'absolute',
                            alignItems: 'center',
                            right: 10,
                            bottom: 10,
                            width: 80,
                            height: 95,
                            backgroundColor: '#fff',
                            borderRadius: 5.0,
                        }}>
                            {/*二维码*/}
                            <Image
                                style={{marginTop:5, width: 60, height: 60}}
                                resizeMode={'cover'}
                                source={qrcodeUrl ? {uri: qrcodeUrl} : require('../assets/images/default_icon_124.png')} onLoad={this.onImageLoad}
                            />
                            {/*邀请码*/}
                            <Text style={styles.invite_code}>{I18n.t('GoodShareScreen.code')} {good_invite_code}</Text>
                        </View>
                    </ViewShot>
                </ScrollView>
                <View style={styles.bottom_container}>
                    {/*分享链接*/}
                    <TouchableOpacity
                        style={styles.bottom_item}
                        onPress={() => this._shareLink()}
                    >
                        <Image
                            source={require('../assets/images/pushHand/share_url.png')}
                            style={[styles.bottom_share_icon]}
                            resizeMode={'contain'}
                        />
                        <Text style={styles.bottom_share_text}>{I18n.t("GoodShareScreen.link")}</Text>
                    </TouchableOpacity>
                    {/*下载图片*/}
                    <TouchableOpacity
                        style={styles.bottom_item}
                        onPress={() => this._checkPermission()}
                    >
                        <Image
                            source={require('../assets/images/pushHand/share_download.png')}
                            style={[styles.bottom_share_icon]}
                            resizeMode={'contain'}
                        />
                        <Text style={styles.bottom_share_text}>{I18n.t("GoodShareScreen.download")}</Text>
                    </TouchableOpacity>
                    {/*分享海报*/}
                    <TouchableOpacity
                        style={styles.bottom_item}
                        onPress={() => this._sharePost()}
                    >
                        <Image
                            source={require('../assets/images/pushHand/share_poster_icon.png')}
                            style={[styles.bottom_share_icon]}
                            resizeMode={'contain'}
                        />
                        <Text style={styles.bottom_share_text}>{I18n.t("GoodShareScreen.share")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FEFEFE',
        flex: 1,
    },
    content_container: {
        padding: 10,
        borderRadius: 10,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: 20,
    },
    text_share: {
        fontWeight: 'bold',
        color: '#442E20',
    },
    btn_container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 25,
    },
    content_input: {
        backgroundColor: '#F7F7F7',
        borderRadius: 5,
        marginBottom: 10,
        fontSize: 14,
        color: '#999999',
        lineHeight: 22,
        padding: 15,
    },
    image_container: {
        width: 330,
        height: 412,
        borderRadius: 10.0,
        marginBottom: 20,
        elevation: 3,
        backgroundColor: '#fff'
    },
    image_share: {
        width: 330,
        height: 330,
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    bottom_container: {
        height: 112,
        paddingTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    bottom_item: {
        flex: 1,
        alignItems: 'center',
    },
    bottom_share_icon: {
        height: 45,
        width: 45,
        marginBottom: 4
    },
    bottom_share_text: {
        color: '#333333',
        fontSize: 12,
    },
    img_text: {
        fontSize: 20,
        color: '#4A3029',
        fontWeight: 'bold',
        marginStart: 10,
    },
    view_price: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    view_title: {
        fontSize: 15,
        color: '#fff',
    },
    price_num1: {
        color: '#BC2F16',
        fontSize: 22,
    },
    price_num2: {
        color: '#fff',
        fontSize: 18,
        marginStart: 18,
        textDecorationLine: 'line-through'
    },
    img_bottom_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 6,
        paddingVertical: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 5.0
    },
    img_top_title: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    invite_code: {
        color: '#666',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: Platform.OS === 'android' ? 15 : null
    },
    qr_view: {
        alignItems: 'center',
    }
});
