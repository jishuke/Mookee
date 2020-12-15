import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  Text,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
  SectionList
} from 'react-native';
import pxToDp from '../../util/pxToDp';
import {I18n, LANGUAGE_CHINESE} from "../../lang";
import NavigationBar from "../../component/NavigationBar";
import RequestData from "../../RequestData";
import ViewUtils from "../../util/ViewUtils";
import StorageUtil from "../../util/StorageUtil";
import {getUserPushHandInfo} from "../../api/pushHandApi"

const deviceWidth = Dimensions.get ('window').width;

class AcademyListHeaderView extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <View style={styles.header_wrap}>
        <Text style={styles.header_text}>{this.props.title}</Text>
      </View>
    );
  }
}

class AcademyListFooterView extends Component {
  render() {
    return (
      <View style={styles.footer_wrap}>
      </View>
    );
  }
}

class AcademyListItemView extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onclickItem: PropTypes.func,
  };

  render() {
    return (
      <TouchableOpacity onPress={()=>{this.props.onclickItem(this.props.data)}} style={styles.item_container} activeOpacity={ 1 }>
        <Image style={styles.item_img} source={ {uri: this.props.data.img_url==null?'':this.props.data.img_url} } defaultSource={ require ( "../../assets/images/default_icon_400.png" ) } resizeMode="cover"/>
        <Text numberOfLines={ 3 } style={styles.item_text}>{this.props.data.vip_article_title}</Text>
      </TouchableOpacity>
    );
  }
}

class AcademyListJoinVipView extends Component {
  static propTypes = {
    onclickJoinVip: PropTypes.func,
  };

  render() {
    return (
      <View style={styles.top_container}>
        <TouchableOpacity onPress={()=>{this.props.onclickJoinVip()}} activeOpacity={ 1 }>
          <Image style={styles.top_container_img} source={ require ( "../../assets/images/default_icon_400.png" ) } resizeMode="contain"/>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class AcademyListScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pushInfo:{
      },
      language: 0,
    }
  }

  componentDidMount() {
    this._prepareData();

    this.didfocus = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this._prepareData();
      }
    );
  };

  componentWillUnmount() {
    // this.listener.remove();
    this.didfocus && this.didfocus.remove();
  }

  //获取数据
  _prepareData(){
    StorageUtil.get('language', (error, object)=>{
      console.warn('ww:AcademyListScreen:lang', error, object);
      if(!error && object){
        this.setState({
          language: object
        }, ()=>{
          this._fetchUserInfo();
        });
        this._fetchAcademyData(object);
      }else {
        this.setState({
          language: LANGUAGE_CHINESE
        }, ()=>{
          this._fetchUserInfo();
        });
        this._fetchAcademyData(LANGUAGE_CHINESE);
      }
    });
  }
  _fetchUserInfo(){
    if(key){
      getUserPushHandInfo({
        key:key
      }).then(res=>{
        console.warn(res,'ww:getUserPushHandInfo');
        if(res.code === 200){
          let pushHandInfo = {getInfo:true,...res.datas.member_info};
          this.setState({
            pushInfo : pushHandInfo
          })
        }else {
        }
      });
    }
  };

  _fetchAcademyData(lang){
    let url = AppSldUrl + '/index.php?app=vip_article&mod=GetVipArticleList';
    RequestData.postSldData(url, {
      type: lang
    }).then(res =>{
      console.warn('ww:AcademyListScreen:_fetchData', res);
      if(res.code === 200){
        let data = this._handleData(res.datas);
        console.warn('ww:AcademyListScreen:data', data);

        this.setState({
          data:data
        })
      }
    }).catch(err =>{
      ViewUtils.sldErrorToastTip(error);
    })
  };

  //封装数据
  _handleData(data){
    let results = [];
    // results.push({ header: {type:1, title: ""}, data: [], footer:{show:false}});
    if (data.length>0){
      data.map((item, index)=>{
        if (item.info.length > 0){
          let model = {
            header: {type:2, title: item.type_name},
            data: item.info,
            footer:{show:true}
          };
          results.push(model);
        }
      })
    }
    return results;
  }

  //点击事件
  _onclickItem(data){
    console.warn('ww:AcademyList', data);
    this.props.navigation.navigate('AcademyDetailScreen', {itemId:data.vip_article_id, itemTitle: data.vip_article_title, language:this.state.language});
  };
  _onclickJoinVip(){
    this.props.navigation.navigate('JoinVip', {isFrom:1});
  };

  //渲染组件
  _renderItem(item, index, section){
    // console.warn('ww:item, index, section', item, index, section);
    if (section.header.type === 1){
      return (
        <View/>
      )
    } else {
      return (
        <AcademyListItemView
          onclickItem={this._onclickItem.bind(this)}
          data={item}
        />
      )
    }
  };
  _renderHeader(data, pushInfo){
    console.warn('ww:pushInfo', pushInfo, key);

    if (data.type === 1){
      if (key ==''|| pushInfo.push_info === ''){
        return(
          <AcademyListJoinVipView
            onclickJoinVip={this._onclickJoinVip.bind(this)}
          />
        )
      } else{
        return (
          <View/>
        )
      }
    } else{
      return (
        <AcademyListHeaderView
          title={data.title}
        />
      )
    }
  };
  _renderFooter(data){
    if (data.show){
      return (
        <AcademyListFooterView/>
      )
    } else{
      return (<View/>)
    }
  }

  render() {
    const {data, pushInfo, language}=this.state;
    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{barStyle: "dark-content"}}
          title={I18n.t('AcademyListScreen.title')}
          popEnabled={false}
          style={{backgroundColor: "#fff"}}
        />
        <ScrollView>
          <Image source={language === 1 ? require('../../assets/images/academy/academy_banner_zh.png') : (language === 2 ? require('../../assets/images/academy/academy_banner_eng.png') : require('../../assets/images/academy/academy_banner_myn.png'))} style={styles.banner_header} resizeMode={'cover'}/>
          <SectionList
              stickySectionHeadersEnabled={false}
              renderItem={({ item, index, section }) => this._renderItem(item, index, section)}
              renderSectionHeader={({ section: { header } }) => this._renderHeader(header, pushInfo)}
              sections={data}
              // renderSectionFooter={({ section: { footer } })=>this._renderFooter(footer)}
              keyExtractor={(item, index) => item + index}
          />
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width: deviceWidth,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1,
    position: 'relative',
    backgroundColor: '#fbfbfb',
  },
  top_container: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#ccc',
    borderBottomWidth: pxToDp(1),
    borderTopWidth: pxToDp(1),
    borderTopColor: '#ccc',
  },
  top_container_img: {
    width: deviceWidth,
    height: pxToDp(128),
  },
  item_container: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomColor: '#e5e5e5',
    height: pxToDp(220),
    borderBottomWidth: pxToDp(1),
    paddingHorizontal: pxToDp(30)
  },
  item_img: {
    width: pxToDp(320),
    height: pxToDp(180),
    marginTop: pxToDp(20),
  },
  item_text: {
    paddingLeft: pxToDp(30),
    paddingTop: pxToDp(32),
    fontSize: pxToDp(32),
    flex: 1,
    fontWeight: 'bold',
    color: '#442E20',
  },
  banner_header: {
    width: deviceWidth,
    height: pxToDp(256),
  },
  header_wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingStart: pxToDp(31),
    height: pxToDp(84),
    borderBottomWidth: pxToDp(1),
    borderBottomColor: '#E5E5E5',
    marginTop: pxToDp(21),
    backgroundColor: '#ffffff',
  },
  header_text: {
    fontSize: pxToDp(32),
    color: '#442E20',
    fontWeight: 'bold',
  },
  footer_wrap: {
    width: '100%',
    height: pxToDp(20),
    backgroundColor: '#fbfbfb'
  },
});
