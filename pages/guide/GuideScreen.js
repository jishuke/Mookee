import React, { Component } from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import pxToDp from "../../util/pxToDp";
import {isIPhoneX, isIPhoneXR} from "../../util/DeviceUtil";
import {LANGUAGE_CHINESE, LANGUAGE_MIANWEN, LANGUAGE_ENGLISH} from '.././../lang/index'

const CAROUSEL_IMAGES={
  chn:{
    image1:{
      n: require('../../assets/images/guide/g_chn_n_1.jpg'),
      x: require('../../assets/images/guide/g_chn_x_1.jpg'),
      xr: require('../../assets/images/guide/g_chn_xr_1.jpg'),
    },
    image2:{
      n: require('../../assets/images/guide/g_chn_n_2.jpg'),
      x: require('../../assets/images/guide/g_chn_x_2.jpg'),
      xr: require('../../assets/images/guide/g_chn_xr_2.jpg'),
    },
    image3:{
      n: require('../../assets/images/guide/g_chn_n_3.jpg'),
      x: require('../../assets/images/guide/g_chn_x_3.jpg'),
      xr: require('../../assets/images/guide/g_chn_xr_3.jpg'),
    },
    image4:{
      n: require('../../assets/images/guide/g_chn_n_4.jpg'),
      x: require('../../assets/images/guide/g_chn_x_4.jpg'),
      xr: require('../../assets/images/guide/g_chn_xr_4.jpg'),
    },
  },
  eng:{
    image1:{
      n: require('../../assets/images/guide/g_eng_n_1.jpg'),
      x: require('../../assets/images/guide/g_eng_x_1.jpg'),
      xr: require('../../assets/images/guide/g_eng_xr_1.jpg'),
    },
    image2:{
      n: require('../../assets/images/guide/g_eng_n_2.jpg'),
      x: require('../../assets/images/guide/g_eng_x_2.jpg'),
      xr: require('../../assets/images/guide/g_eng_xr_2.jpg'),
    },
    image3:{
      n: require('../../assets/images/guide/g_eng_n_3.jpg'),
      x: require('../../assets/images/guide/g_eng_x_3.jpg'),
      xr: require('../../assets/images/guide/g_eng_xr_3.jpg'),
    },
    image4:{
      n: require('../../assets/images/guide/g_eng_n_4.jpg'),
      x: require('../../assets/images/guide/g_eng_x_4.jpg'),
      xr: require('../../assets/images/guide/g_eng_xr_4.jpg'),
    },
  },
  myn:{
    image1:{
      n: require('../../assets/images/guide/g_myn_n_1.jpg'),
      x: require('../../assets/images/guide/g_myn_x_1.jpg'),
      xr: require('../../assets/images/guide/g_myn_xr_1.jpg'),
    },
    image2:{
      n: require('../../assets/images/guide/g_myn_n_2.jpg'),
      x: require('../../assets/images/guide/g_myn_x_2.jpg'),
      xr: require('../../assets/images/guide/g_myn_xr_2.jpg'),
    },
    image3:{
      n: require('../../assets/images/guide/g_myn_n_3.jpg'),
      x: require('../../assets/images/guide/g_myn_x_3.jpg'),
      xr: require('../../assets/images/guide/g_myn_xr_3.jpg'),
    },
    image4:{
      n: require('../../assets/images/guide/g_myn_n_4.jpg'),
      x: require('../../assets/images/guide/g_myn_x_4.jpg'),
      xr: require('../../assets/images/guide/g_myn_xr_4.jpg'),
    },
  },
};

class GuideScreenCarousel extends Component {

  render() {
    return(
      <View style={{paddingTop: Platform.OS==='ios' ? 0 : StatusBar.currentHeight}}>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
        >
          <View>
            <Image resizeMode="stretch" style={styles.carosel_img} source={this.props.language ===LANGUAGE_CHINESE?(isIPhoneX()?CAROUSEL_IMAGES.chn.image1.x:(isIPhoneXR()?CAROUSEL_IMAGES.chn.image1.xr:CAROUSEL_IMAGES.chn.image1.n)):(this.props.language ===LANGUAGE_ENGLISH?(isIPhoneX()?CAROUSEL_IMAGES.eng.image1.x:(isIPhoneXR()?CAROUSEL_IMAGES.eng.image1.xr:CAROUSEL_IMAGES.eng.image1.n)):(isIPhoneX()?CAROUSEL_IMAGES.myn.image1.x:(isIPhoneXR()?CAROUSEL_IMAGES.myn.image1.xr:CAROUSEL_IMAGES.myn.image1.n)))}/>
          </View>
          <View>
            <Image resizeMode="stretch" style={styles.carosel_img} source={this.props.language ===LANGUAGE_CHINESE?(isIPhoneX()?CAROUSEL_IMAGES.chn.image2.x:(isIPhoneXR()?CAROUSEL_IMAGES.chn.image2.xr:CAROUSEL_IMAGES.chn.image2.n)):(this.props.language ===LANGUAGE_ENGLISH?(isIPhoneX()?CAROUSEL_IMAGES.eng.image2.x:(isIPhoneXR()?CAROUSEL_IMAGES.eng.image2.xr:CAROUSEL_IMAGES.eng.image2.n)):(isIPhoneX()?CAROUSEL_IMAGES.myn.image2.x:(isIPhoneXR()?CAROUSEL_IMAGES.myn.image2.xr:CAROUSEL_IMAGES.myn.image2.n)))}/>
          </View>
          <View>
            <Image resizeMode="stretch" style={styles.carosel_img} source={this.props.language ===LANGUAGE_CHINESE?(isIPhoneX()?CAROUSEL_IMAGES.chn.image3.x:(isIPhoneXR()?CAROUSEL_IMAGES.chn.image3.xr:CAROUSEL_IMAGES.chn.image3.n)):(this.props.language ===LANGUAGE_ENGLISH?(isIPhoneX()?CAROUSEL_IMAGES.eng.image3.x:(isIPhoneXR()?CAROUSEL_IMAGES.eng.image3.xr:CAROUSEL_IMAGES.eng.image3.n)):(isIPhoneX()?CAROUSEL_IMAGES.myn.image3.x:(isIPhoneXR()?CAROUSEL_IMAGES.myn.image3.xr:CAROUSEL_IMAGES.myn.image3.n)))}/>
          </View>
          <View>
            <TouchableWithoutFeedback onPress={()=>(this.props.onclickStart(this.props.language))}>
              <Image resizeMode="stretch" style={styles.carosel_img} source={this.props.language ===LANGUAGE_CHINESE?(isIPhoneX()?CAROUSEL_IMAGES.chn.image4.x:(isIPhoneXR()?CAROUSEL_IMAGES.chn.image4.xr:CAROUSEL_IMAGES.chn.image4.n)):(this.props.language ===LANGUAGE_ENGLISH?(isIPhoneX()?CAROUSEL_IMAGES.eng.image4.x:(isIPhoneXR()?CAROUSEL_IMAGES.eng.image4.xr:CAROUSEL_IMAGES.eng.image4.n)):(isIPhoneX()?CAROUSEL_IMAGES.myn.image4.x:(isIPhoneXR()?CAROUSEL_IMAGES.myn.image4.xr:CAROUSEL_IMAGES.myn.image4.n)))}/>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </View>
    )
  }
}

//语言选择
class GuideScreenSettings extends Component {

  render() {
    let { language, selectLanguage, onclickConfirm } = this.props
    return(
      <View>
        <View style={styles.logo_wrap}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/guide_logo.png')}
          />
        </View>
        <View style={styles.language_wrap}>
          <TouchableOpacity activeOpacity={ 1 } onPress={()=>{selectLanguage(LANGUAGE_CHINESE)}} style={styles.language_button}>
            <Text/>
            <Text style={styles.language_button_text}>简体中文</Text>
            <Image style={styles.language_button_dot} source={language === LANGUAGE_CHINESE ? require('../../assets/images/guide_selected.png') : require('../../assets/images/guide_select.png')}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={ 1 } onPress={()=>{selectLanguage(LANGUAGE_ENGLISH)}} style={styles.language_button}>
            <Text/>
            <Text style={styles.language_button_text}>English</Text>
            <Image style={styles.language_button_dot} source={language === LANGUAGE_ENGLISH ? require('../../assets/images/guide_selected.png') : require('../../assets/images/guide_select.png')}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={ 1 } onPress={()=>{selectLanguage(LANGUAGE_MIANWEN)}} style={styles.language_button}>
            <Text/>
            <Text style={styles.language_button_text}>မြန်မာဘာသာ</Text>
            <Image style={styles.language_button_dot} source={language === LANGUAGE_MIANWEN ? require('../../assets/images/guide_selected.png') : require('../../assets/images/guide_select.png')}/>
          </TouchableOpacity>
        </View>
        <View style={styles.confirm_wrap}>
          <TouchableOpacity
            activeOpacity={ 1 }
            onPress={() => onclickConfirm()}
          >
            <Image style={styles.confirm_button} source={require('../../assets/images/guide_rs.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default class GuideScreen extends Component {
  constructor(props){

    super(props);
    this.state = {
      language:LANGUAGE_CHINESE,
      isShowCarousel: false,
      isShowSettings: true
    }
  }

  _selectLanguage(lang){
    this.setState({language:lang});
  };

  _onclickConfirm(){
    //缓存当前语言设置
    this.setState({
      isShowSettings: false,
      isShowCarousel: true,
    })
  };

  _onclickStart(language){
    this.props.onclickGuideScreenStart(language);
  };

  render() {
    const {language, isShowCarousel, isShowSettings} = this.state;
    return (
      <View style={styles.container}>
        {
          isShowCarousel &&
          <GuideScreenCarousel
              language={language}
              onclickStart={this._onclickStart.bind(this)}
          />
        }
        {
          isShowSettings &&
          <GuideScreenSettings
              language={language}
              selectLanguage={this._selectLanguage.bind(this)}
              onclickConfirm={this._onclickConfirm.bind(this)}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logo_wrap: {
        marginTop: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 80,
        height: 80
    },
    language_wrap: {
        marginTop: 73,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    language_button: {
        marginTop: pxToDp(60),
        width: Dimensions.get('window').width - pxToDp(112)*2,
        height: pxToDp(132),
        borderWidth: 2,
        borderColor: '#999999',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    language_button_text: {
        color: '#333',
        fontSize: pxToDp(34)
    },
    language_button_dot: {
        marginRight: pxToDp(30),
        width: pxToDp(24),
        height: pxToDp(24),
    },
    confirm_wrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: pxToDp(100),
    },
    confirm_button: {
        width: pxToDp(104),
        height: pxToDp(104),
    },
    carosel_img: {
        width: Dimensions.get('window').width,
        height: Platform.OS === 'ios' ? Dimensions.get('window').height : Dimensions.get('screen').height - StatusBar.currentHeight,
    },
});
