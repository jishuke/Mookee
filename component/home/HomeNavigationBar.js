import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import pxToDp from '../../util/pxToDp';
import {IOS_SAFE_TOP_HEIGHT} from '../../util/DeviceUtil'
import {I18n} from "../../lang";

const deviceWidth = Dimensions.get ('window').width;

export default class HomeNavigationBar extends Component {

  render() {
      const { onLayout, onclickNavSearch, onclickNavScan, onclickNavMessage } = this.props
      return (
          <View
              style={[styles.container, {backgroundColor: this.props.topColor}]}
              onLayout = {(event) => onLayout && onLayout(event)}
          >
              <View style={styles.container_top}>
                  {/*logo*/}
                  <Image style={styles.logo} source={require('../../assets/images/home/home_nav_logo.png')} resizeMode='contain'/>
                  {/*搜索框*/}
                  <TouchableOpacity
                      style={styles.nav_search}
                      activeOpacity={ 1 }
                      onPress={()=>{onclickNavSearch && onclickNavSearch()}}
                  >
                      <Image style={styles.search_icon} source={require('../../assets/images/home/home_nav_sousuo.png')} resizeMode='contain'/>
                      <Text style={styles.search_text}>{I18n.t('HomeScreenNew.searchforgoods')}</Text>
                  </TouchableOpacity>
                  {/*扫一扫*/}
                  <TouchableOpacity
                      activeOpacity={ 1 }
                      style={styles.right_wrap_inner}
                      onPress={()=>{onclickNavScan && onclickNavScan()}}
                  >
                      <Image style={styles.scan} source={require('../../assets/images/home/home_nav_saoma.png')} resizeMode='contain'/>
                  </TouchableOpacity>
                  {/* 客服 */}
                  <TouchableOpacity
                      style={styles.right_wrap_inner}
                      activeOpacity={ 1 }
                      onPress={()=>{onclickNavMessage && onclickNavMessage()}}
                  >
                      <Image style={styles.message} source={require('../../assets/images/home/home_nav_xinxi.png')} resizeMode='contain'/>
                  </TouchableOpacity>
              </View>
          </View>
      );
  }
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        width: deviceWidth,
        backgroundColor: '#fff',
        paddingTop: pxToDp(IOS_SAFE_TOP_HEIGHT)
    },
    container_top: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 60,
    },
    logo: {
        height: pxToDp(86),
        width: pxToDp(64),
    },
    nav_search: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 10,
        height: 30,
        backgroundColor: '#fff',
        borderRadius: 15.0
    },
    right_wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: pxToDp(66),
    },
    right_wrap_inner: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    right_wrap_text: {
        color: '#fff',
        fontSize: pxToDp(20),
    },
    scan: {
        marginTop: pxToDp(8),
        height: pxToDp(32),
        width: pxToDp(33),
    },
    message: {
        height: pxToDp(40),
        width: pxToDp(34),
    },
    container_bottom:{
        width: '100%',
        paddingHorizontal: pxToDp(30),
        paddingBottom: pxToDp(26),
    },
    search_icon: {
        width: pxToDp(34),
        height: pxToDp(33),
        marginLeft: pxToDp(23),
    },
    search_text: {
        fontSize: pxToDp(28),
        color: '#999999',
        marginLeft: pxToDp(34)
    },
});
