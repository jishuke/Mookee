import React, { Component } from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import pxToDp from "../../util/pxToDp";
import {setLanguage, LANGUAGE_CHINESE, LANGUAGE_MIANWEN, LANGUAGE_ENGLISH, I18n} from '.././../lang/index'
import GlobalStyles from "../../assets/styles/GlobalStyles";
import SldHeader from "../../component/SldHeader";
import ViewUtils from "../../util/ViewUtils";
import StorageUtil from "../../util/StorageUtil";
import RequestData from "../../RequestData";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  wrap: {
    marginBottom: pxToDp(20),
    paddingHorizontal: pxToDp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: pxToDp(30),
    backgroundColor: '#fff'
  },
  name: {
    color: '#333',
    fontSize: pxToDp(26)
  }
});

export default class LanguageSettings extends Component {
  constructor(props){

    super(props);
    this.state = {
      language: 0
    }
  }

  componentWillMount() {
    StorageUtil.get('language', (error, object)=>{
      if(!error && object){
        this.setState({
          language: object
        });
      }else {
        this.setState({
          language: LANGUAGE_CHINESE
        });
      }
    });
  }

  _changeLanguage(language){
    this.setState({
      language:language
    }, ()=>{
      setLanguage(language);
      global.language = language;
      DeviceEventEmitter.emit('languageSettings');
      StorageUtil.set('language', language, ()=>{
        let url = AppSldUrl + `/index.php?app=language&mod=index&lang_type=${language}`;
        RequestData.getSldData(url).then(res => {
          this.props.navigation.pop();
          if (res.state === 200) {

          } else {
            //alert(res.msg)
          }
        })
      });
    });
  };

  render() {
    const {language} = this.state;
    return (
      <View style={ GlobalStyles.sld_container }>
        <SldHeader title={ I18n.t('LanguageSettings.title') } left_icon={ require('../../assets/images/goback.png') }
                   left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
        <View style={ GlobalStyles.line }/>
        <TouchableOpacity
          style={ styles.wrap }
          activeOpacity={1}
          onPress={ () => {
            this._changeLanguage(LANGUAGE_CHINESE);
          } }
        >
          <View>
            <Text style={ styles.name }>简体中文</Text>
          </View>
          {language === LANGUAGE_CHINESE &&
            <Image source={ require('../../assets/images/sele_address_icon.png') }
                   style={ {width: pxToDp(26), height: pxToDp(26)} }/>
          }
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={ styles.wrap }
          onPress={ () => {
            this._changeLanguage(LANGUAGE_ENGLISH);
          } }
        >
          <View>
            <Text style={ styles.name }>English</Text>
          </View>
          {language === LANGUAGE_ENGLISH &&
            <Image source={ require('../../assets/images/sele_address_icon.png') }
                   style={ {width: pxToDp(26), height: pxToDp(26)} }/>
          }
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={ styles.wrap }
          onPress={ () => {
            this._changeLanguage(LANGUAGE_MIANWEN);
          } }
        >
          <View>
            <Text style={ styles.name }>မြန်မာဘာသာ</Text>
          </View>
          {language === LANGUAGE_MIANWEN &&
            <Image source={ require('../../assets/images/sele_address_icon.png') }
                   style={ {width: pxToDp(26), height: pxToDp(26)} }/>
          }
        </TouchableOpacity>
      </View>
    );
  }
}
