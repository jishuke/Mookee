/**
 * 种草社区 ---- 发布心得
 * */
import React, {Component} from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	StyleSheet,
    ScrollView,
    KeyboardAvoidingView, TextInput
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";
import { createExperience } from '../../api/communityApi'
import fun from '../../assets/styles/FunctionStyle'
import { isEmpty, $Message } from '../../util/tools'
import PriceUtil from '../../util/PriceUtil'
import {I18n} from "../../lang";

export default class Release extends Component{
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            imgs: [],
            goods: null,
            didBlurSubscription: null,
        };
    }

    componentDidMount() {
        const _this = this;
        this.state.didBlurSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
              console.log('didFocus', payload);
              const nState = this.props.navigation.state;
              const goods = nState.params && nState.params.goods
              console.log('goods::', goods);
              if(goods) {
                  _this.setState({
                      goods,
                  })
              }
            }
          );
    }
    componentWillUnmount() {
        this.state.didBlurSubscription && this.state.didBlurSubscription.remove();
    }
    // 上传图片
	uploadImg = ( name ) => {
		ImagePicker.openPicker ( {
            compressImageMaxWidth: pxToDp(600),
            compressImageQuality: 0.5
			// width : pxToDp ( 200 ) ,
			// height : pxToDp ( 200 ) ,
			// cropping : true
		} ).then ( image => {
			let path = image.path;
			let filename = path.substring ( path.lastIndexOf ( '/' ) + 1 , path.length );
			if ( !key ) {
				this.props.navigation.navigate ( 'Login' );
			} else {
				let formData = new FormData ();
				let file = {
					uri : image.path ,
					type : 'multipart/form-data' ,
					name : filename ,
					'size' : image.size ,
					tmp_name : image.filename
				};
				// formData.append ( 'upimg' , file );
				// formData.append ( 'name' , 'upimg' );
				// formData.append ( 'key' , key );
                // let url = AppSldUrl + '/index.php?app=enterin&mod=uploadPic';

                formData.append ( 'file' , file );
				formData.append ( 'name' , 'file' );
				formData.append ( 'key' , key );
				let url = AppSldUrl + '/index.php?app=sns_album&mod=file_upload';
				fetch ( url , {
					method : 'POST' ,
					mode : 'cors' ,
					credentials : 'include' ,
					headers : {} ,
					body : formData
				} )
					.then ( response => response.json () )
					.then ( result => {
                        console.log('uploadImage--', result);
                        if(!result.datas.error) {
                                let list = this.state.imgs;
                            list.push(result.datas);
                            this.setState({
                                imgs: list
                            });
                        }
					} )
					.catch ( error => {
						//上传出错
					})
			}
		} ).catch ( err => {
		} );
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
            <TouchableOpacity onPress={this.release.bind(this)}>
                <Text style={{fontSize: pxToDp(30), color: '#DE2C22', marginRight: pxToDp(40)}}>{I18n.t('Release.nav_b')}</Text>
            </TouchableOpacity>
        );
    }

    checkValue() {
        if(isEmpty(this.state.title)) {
            $Message(I18n.t('Release.qsrbt'));
            return false;
        }
        if(isEmpty(this.state.content)) {
            $Message(I18n.t('Release.qfxzs'));
            return false;
        }
        return true;
    }

    release() {
        if(this.checkValue()) {
            this._create();
        };
    }

    _create() {

        const imgs = [];
        const list = this.state.imgs;
        if(list.length > 0) {
            for(let i = 0; i < list.length; i++) {
                imgs.push(list[i].file_id);
            }
        }
        console.warn('ww:', this.state.goods);

        createExperience({
            key,
            image_id: imgs.join(','),
            title: this.state.title,
            content: this.state.content,
            goods_id: this.state.goods?this.state.goods.gid:''
        }).then(res => {
            // DeviceEventEmitter.emit('updateCommunity', {});
		    this.props.navigation.pop();
        })
    }

    _renderUpImgs() {
        console.log('_renderUpIm')
        if(this.state.imgs && this.state.imgs.length > 0) {
            return <View style={[fun.f_flex, fun.f_row, fun.f_wrap, { marginLeft: pxToDp(-15), marginRight: pxToDp(-15)}]} >
                {
                    this.state.imgs.map((item, index) => {
                        return <View style={{paddingLeft: pxToDp(15), paddingRight: pxToDp(15), marginBottom: pxToDp(20)}} key={index}>
                            <Image resizeMode="cover" style={{width: pxToDp(200), height: pxToDp(200)}} source={{uri: item && item.file_url}} />
                        </View>
                    })
                }
            </View>
        } else {
            return null;
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
					statusBar={{barStyle: "dark-content"}}
					leftButton={this.leftButton()}
					rightButton={this.rightButton()}
                    title={I18n.t('Release.title')}
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                <ScrollView>
                    <View style={styles.content}>
                        {
                            this._renderUpImgs()
                        }
                        <TouchableOpacity onPress={this.uploadImg} style={styles.up_btn}>
                            <Image style={styles.img} source={require('../../assets/images/communityPage/img.png')} />
                            <Text>+{I18n.t('Release.tp')}</Text>
                        </TouchableOpacity>
                        <View style={[styles.title_box, styles.bt_line, styles.flex_between]}>
                            <TextInput
                                style={[styles.ipt, styles.ipt_title]}
                                underlineColorAndroid='transparent'
                                placeholder={I18n.t('Release.tjbt')}
                                placeholderTextColor={'#E5E5E5'}
                                onChangeText={text => this.setState({
                                    title: text
                                })}
                                value={this.state.title}
                            />
                            <Text style={{fontSize: pxToDp(28), color: '#E5E5E5'}}>20</Text>
                        </View>
                        <View style={[styles.desc_box, styles.bt_line]}>
                            <KeyboardAvoidingView>
                            <TextInput
                                style={[styles.ipt, styles.desc]}
                                multiline = {true}
                                underlineColorAndroid='transparent'
                                placeholder={I18n.t('Release.desc')}
                                placeholderTextColor={'#E5E5E5'}
                                onChangeText={text => this.setState({
                                    content: text
                                })}
                                value={this.state.content}
                            />
                            </KeyboardAvoidingView>
                        </View>

                        <View style={[styles.g_goods, styles.flex_between]}>
                            <Text style={{fontSize: pxToDp(28), color: '#242424'}}>
                                <Text>{I18n.t('Release.xgsp')}</Text>
                                {/* <Text style={{ color: '#E5E5E5' }}>（0/5）</Text> */}
                            </Text>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('AddRelatedGoods')
                            }} style={styles.flex_row}>
                                <Text style={{ fontSize: pxToDp(24), color: '#E5E5E5'}}>{I18n.t('Release.add')}</Text>
                                <Image resizeMode="contain" style={styles.arrow} source={require('../../assets/images/communityPage/arrow_right_gray.png')} />
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.goods && (
                                 <View style={styles.item_left}>
                                    <Image source={{uri: this.state.goods.goods_image_url}} style={styles.goods_cover} />
                                    <View style={styles.goods_info}>
                                        <Text style={styles.goods_name} numberOfLines={1} ellipsizeMode="tail">{this.state.goods.goods_name}</Text>
                                        <Text style={{fontSize: pxToDp(20), color: '#DE2C22'}}>ks{PriceUtil.formatPrice(this.state.goods.show_price)}</Text>
                                    </View>
                                </View>
                            )
                        }
                    </View>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex_row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    flex_between: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
    },
    up_btn: {
        marginTop: pxToDp(40),
        height: pxToDp(200),
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        width: pxToDp(96),
        height: pxToDp(80),
        marginBottom: pxToDp(20)
    },
    bt_line: {
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
    },
    title_box:{
        paddingTop: pxToDp(50),
        paddingBottom: pxToDp(40)
    },
    ipt: {
        color: '#666',
        flex: 1,
        padding: 0,
        fontSize: pxToDp(32),
    },
    ipt_title: {
        height: pxToDp(80),
        marginRight: pxToDp(30)
    },
    desc_box: {
        paddingTop: pxToDp(40),
        paddingBottom: pxToDp(40),
    },
    desc: {
        lineHeight: pxToDp(48),
        height: pxToDp(192),
        textAlignVertical: 'top'
    },
    g_goods: {
        paddingTop: pxToDp(48),
        paddingBottom: pxToDp(40)
    },
    arrow: {
        width: pxToDp(20),
        height: pxToDp(20),
        marginLeft: pxToDp(20)
    },

    item_left: {
        width: pxToDp(670),
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'row',
        padding: pxToDp(20),
        borderRadius: pxToDp(8)
    },
    goods_cover: {
        width: pxToDp(120),
        height: pxToDp(80),
        marginRight: pxToDp(26),
        flexShrink: 0,
    },
    goods_info: {
        flex: 1
    },
    goods_name: {
        fontSize: pxToDp(24),
        marginBottom: pxToDp(12),
        color: '#242424'
    },
});
