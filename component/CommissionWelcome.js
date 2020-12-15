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
import {I18n} from './../lang/index'

const {width: deviceWidth,height:deviceHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  container:{
    flex: 1,
    //TODO:判断是否是iPhoneX
    paddingBottom: pxToDp(44),
    backgroundColor: '#131217',

  },
  content_wrap:{
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  header: {
    color: '#ffe39f',
    fontSize: pxToDp(28),
    marginTop: pxToDp(33),
    marginBottom: pxToDp(30)
  },
  list: {
    backgroundColor: '#2c2827',
    borderRadius: pxToDp(10),
    paddingHorizontal: pxToDp(20),
    width: deviceWidth - pxToDp(74*2),
    flexDirection: 'column',
    paddingVertical: pxToDp(34)
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: pxToDp(32),
  },
  item_icon: {
    width: pxToDp(80),
    height: pxToDp(80),
  },
  item_content: {
    paddingLeft: pxToDp(20),
    flexDirection: 'column',
    flex: 1,
  },
  item_content_title: {
    fontSize: pxToDp(22),
    color: '#ffe39f',
  },
  bottom_bar: {
    height: pxToDp(94),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 4,
  },
  bottom_background: {
    height: pxToDp(80),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2f322f',
  },
  bottom_content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bottom_left: {
    width: deviceWidth * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    height: pxToDp(80),
  },
  bottom_left_title: {
    color: '#b39a8f',
    fontSize: pxToDp(26),
  },
  bottom_right: {
    width: deviceWidth * 0.5,
    height: pxToDp(94),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom_right_title: {
    color: '#fff',
    fontSize: pxToDp(28),
  },
});

class CommissionWelcome extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content_wrap}>
          <Text style={styles.header}>{I18n.t('CommissionWelcome.title')}</Text>
          <View style={styles.list}>
            <View style={styles.item}>
              <View style={styles.item_icon}>
                <Image style={styles.item_icon} source={require('../assets/images/commissionWelcome/commission_welcome_1.png')}/>
              </View>
              <View style={styles.item_content}>
                <Text style={styles.item_content_title}>{I18n.t('CommissionWelcome.text1')}</Text>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.item_icon}>
                <Image style={styles.item_icon} source={require('../assets/images/commissionWelcome/commission_welcome_2.png')}/>
              </View>
              <View style={styles.item_content}>
                <Text style={styles.item_content_title}>{I18n.t('CommissionWelcome.text2')}</Text>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.item_icon}>
                <Image style={styles.item_icon} source={require('../assets/images/commissionWelcome/commission_welcome_3.png')}/>
              </View>
              <View style={styles.item_content}>
                <Text style={styles.item_content_title}>{I18n.t('CommissionWelcome.text3')}</Text>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.item_icon}>
                <Image style={styles.item_icon} source={require('../assets/images/commissionWelcome/commission_welcome_4.png')}/>
              </View>
              <View style={styles.item_content}>
                <Text style={styles.item_content_title}>{I18n.t('CommissionWelcome.text4')}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bottom_bar}>
          <View style={styles.bottom_background}/>
          <View style={styles.bottom_content}>
            <TouchableOpacity style={styles.bottom_left} activeOpacity={ 1 } onPress={ () => {this.props.onclickQuitVip()}}>
              <Text style={styles.bottom_left_title}>{I18n.t('CommissionWelcome.b_l')}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={ 1 } onPress={ () => {this.props.onclickJoinVip()}}>
              <ImageBackground style={styles.bottom_right} source={ require ( "../assets/images/commissionWelcome/commission_welcome_r.png" ) } resizeMode="stretch">
                <Text style={styles.bottom_right_title}>{I18n.t('CommissionWelcome.b_r')}</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default CommissionWelcome;
