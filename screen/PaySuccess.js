import React, { Component } from 'react';
import {
  Text,
  View,
  Image, Dimensions, StyleSheet, TouchableOpacity,
} from 'react-native';
import pxToDp from '../util/pxToDp';
import {I18n} from './../lang/index'

let ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pxToDp(30),
  },
  title: {
    fontSize: pxToDp(36),
    color: '#000',
    fontWeight: 'bold',
    marginBottom: pxToDp(30),
  },
  desc: {
    fontSize: pxToDp(22),
    color: '#999',
    marginBottom: pxToDp(53),
    textAlign: 'center'
  },
  icon:{
    width: pxToDp(162),
    height: pxToDp(162),
    marginBottom: pxToDp(67),
  },
  button_inner_o: {
    borderRadius: pxToDp(10),
    height: pxToDp(104),
    width: ScreenWidth -pxToDp(112),
    textAlign: 'center',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#ff7300',
    marginBottom: pxToDp(30),
  },
  button_text_o: {
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: pxToDp(26),

  },
  button_inner_g: {
    borderRadius: pxToDp(10),
    height: pxToDp(104),
    width: ScreenWidth -pxToDp(112),
    textAlign: 'center',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#f2f2f2',
    marginBottom: pxToDp(30),
  },
  button_text_g: {
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: pxToDp(26),
  },
  bottom_wrap: {
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom:pxToDp(20)
  },
  bottom_t:{
    color: '#999',
    fontSize: pxToDp(20),
    textAlign: 'center'
  },
});

class PaySuccess extends Component<Props> {

  constructor(props){
    super(props);
    this.state = {
      viewType: props.navigation.state.params.viewType,//1是买商品, 2是充值和加入VIP
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={ require('../assets/images/pay_s.png') }
               style={styles.icon} />
        <Text style={styles.title}>{I18n.t('PaySuccess.text1')}</Text>
        {this.state.viewType===1 &&
          <Text style={styles.desc}>{I18n.t('PaySuccess.text2')}</Text>
        }

        <TouchableOpacity onPress={()=>{
          this.props.navigation.popToTop();
        }} activeOpacity={ 1 } style={styles.button_inner_o}>
          <Text style={styles.button_text_o}>{I18n.t('PaySuccess.text3')}</Text>
        </TouchableOpacity>

        {this.state.viewType===1 &&
          <TouchableOpacity onPress={()=>{
            this.props.navigation.replace('OrderList');
          }} activeOpacity={ 1 } style={styles.button_inner_g}>
            <Text style={styles.button_text_g}>{I18n.t('PaySuccess.text4')}</Text>
          </TouchableOpacity>
        }

        <View style={styles.bottom_wrap}>
          <Text style={styles.bottom_t}>Copyright © 2020 MOOKEE</Text>
        </View>
      </View>
    );
  }
}

export default PaySuccess;
