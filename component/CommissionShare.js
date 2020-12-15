import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import pxToDp from '../util/pxToDp';
import {I18n, LANGUAGE_CHINESE, LANGUAGE_MIANWEN} from './../lang/index'
import PriceUtil from '../util/PriceUtil'
import StorageUtil from "../util/StorageUtil";

const {width: deviceWidth} = Dimensions.get('window');

class CommissionShare extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            language: 0,
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
    }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main_wrap}>
            <Image style={styles.main_bg} source={require( "../assets/images/cm_bg.png")} resizeMode="contain"/>
            <View style={{flex: 1, marginLeft: 70, marginRight: 60, justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{fontSize: this.state.language === LANGUAGE_MIANWEN ? 12 : 14, color: '#E6B28D', textAlign: 'center'}}>

                        {this.props.isVIP ? this.state.language === LANGUAGE_CHINESE ? I18n.t('CommissionShare.text4') : I18n.t('CommissionShare.text5') : I18n.t('CommissionShare.text1')}
                    </Text>
                </View>
                {
                  this.state.language === LANGUAGE_CHINESE ?
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', marginBottom: 6}}>
                          <Text style={{fontSize: 12, color: '#E6B28D'}} numberOfLines={2}>
                              {this.props.isVIP ? I18n.t('CommissionShare.text5') : I18n.t('CommissionShare.text2')}
                              <Text style={{fontSize: 12, color: '#ec1125'}}>
                                  {`ks${PriceUtil.formatPrice(this.props.pushPrice)}`}
                              </Text>
                          </Text>
                      </View>
                      :
                      <View style={{flex: this.state.language === LANGUAGE_MIANWEN ? 2 : 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', marginBottom: 6}}>
                          <Text style={{fontSize: this.state.language === LANGUAGE_MIANWEN ? 10 : 12, color: '#E6B28D'}}>
                              {
                                this.props.isVIP ? I18n.t('CommissionShare.text6') : I18n.t('CommissionShare.text2')
                              }
                              <Text style={{fontSize: 12, color: '#ec1125'}}>
                                  {`ks${PriceUtil.formatPrice(this.props.pushPrice)}`}
                              </Text>
                              <Text style={{fontSize: this.state.language === LANGUAGE_MIANWEN ? 10 : 12, color: '#E6B28D'}}>
                                  {this.props.isVIP ? I18n.t('CommissionShare.text7') : I18n.t('CommissionShare.text3')}
                              </Text>
                          </Text>
                      </View>
                }
            </View>
        </View>
        <View style={styles.button_wrap}>
            <ImageBackground
                style={styles.button_inner}
                source={require('../assets/images/pushHand/GO_text.png')}
            >
                <TouchableOpacity
                    activeOpacity={1.0}
                    style={styles.button_inner}
                    onPress={() => this.props.onclickEarn()}
                >
                    <Text style={styles.button_text}>
                        {this.props.isVIP ? this.state.language === LANGUAGE_CHINESE ? I18n.t('CommissionShare.text6') : I18n.t('CommissionShare.text8') : this.state.language === LANGUAGE_CHINESE ? I18n.t('CommissionShare.text3') : I18n.t('CommissionShare.text4')}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        display: 'flex',
        // justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        height: pxToDp(180),
        backgroundColor: '#fff',
        paddingBottom: pxToDp(20)
    },
    main_wrap: {
        borderRadius: pxToDp(64),
        backgroundColor: '#323433',
        height: pxToDp(128),
        width: deviceWidth - 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: pxToDp(20),
    },
    main_bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: 60,
    },
    text_wrap: {
        width: pxToDp(400),
        color: '#E6B28D',
        fontSize: pxToDp(26),
        textAlign: 'center',
    },
    button_wrap: {
        height: pxToDp(160),
        position: 'absolute',
        top: 0,
        right: pxToDp(20),
        zIndex: 1,//TODO:test
        width: pxToDp(160),
        borderRadius: pxToDp(80),
        backgroundColor: '#323433',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_inner: {
        height: pxToDp(120),
        width: pxToDp(120),
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_text: {
        fontSize: 8,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
});

export default CommissionShare;
