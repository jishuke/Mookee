import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
   WebView, Platform,
} from 'react-native';
import pxToDp from '../../util/pxToDp';
import {I18n} from "../../lang";
import NavigationBar from "../../component/NavigationBar";
import RequestData from "../../RequestData";
import ViewUtils from "../../util/ViewUtils";
import SldVideoPlay from "../../component/SldVideoPlay";

const deviceWidth = Dimensions.get ('window').width;
const deviceHeight = Dimensions.get ('window').height;
const  BaseScript =`
    (function () {
      var height = null;
      function changeHeight() {
        if (document.body.scrollHeight!== height) {
          height = document.body.scrollHeight;
          if (window.postMessage) {
              window.postMessage(JSON.stringify({
              type: 'setHeight',
              height: height,
            }))
          }
        }
      }
      setInterval(changeHeight, 100);
    } ())`;

const this_=this;

export default class AcademyDetailScreen extends Component<Props> {
  constructor(props) {
    super(props);

    console.warn('ww:AcademyDetailScreen', props);

    this.state = {
      articleId : typeof (props.navigation.state.params.itemId) != 'undefined'?props.navigation.state.params.itemId:'',
      // articleTitle : typeof (props.navigation.state.params.itemTitle) != 'undefined'?props.navigation.state.params.itemTitle:'',
      articleTitle : I18n.t('AcademyListScreen.video'),
      language : typeof (props.navigation.state.params.language) != 'undefined'?props.navigation.state.params.language:0,
      data: {},
      webViewHeight: 0,
      heightWeb: 300,
    };

  }

  //获取数据
  _fetchData(articleId, type){
    let url = AppSldUrl + '/index.php?app=vip_article&mod=GetVipArticleInfo';
    RequestData.postSldData(url, {
      vip_article_id: articleId,
      type: type
    }).then(res =>{
      console.warn('ww:AcademyDetailScreen:_fetchData', res);
      if(res.code === 200){
        this.setState({data:res.datas})
      }
    }).catch(err =>{
      ViewUtils.sldErrorToastTip(error);
    })
  }

  componentDidMount() {
    this._fetchData(this.state.articleId, this.state.language);
  }

  //渲染组件
  leftButton() {
    return (
      <TouchableOpacity onPress={() => {
        this.props.navigation.goBack();
      }}>
        <Image style={{ width: pxToDp(36), height: pxToDp(36), marginLeft: pxToDp(40) }} source={require('../../assets/images/goback.png')} />
      </TouchableOpacity>
    );
  }

/*  _onMessage (e) {
    let valToInt= parseInt(e.nativeEvent.data);
    let defWebViewHeight=this.pxToDp(valToInt);
    if(defWebViewHeight !== this.state.defWebViewHeight) this.setState({defWebViewHeight});
    console.log('height'+this.state.defWebViewHeight)
  }*/

  /**
   * web端发送过来的交互消息
   */
  onMessage (event) {
   // alert("---"+JSON.parse(event.nativeEvent.data));
   // alert("---"+JSON.stringify(event.nativeEvent.data.replace(/[\\]/g,'')));
    try {
      const action = JSON.parse(event.nativeEvent.data.replace(/[\\]/g,''));
      if (action.type == 'setHeight' && action.height > 0) {
        this.setState({ heightWeb: action.height });
      }
    } catch (error) {
      // pass
    }
  }

    webViewLoaded = () => {
        this.refs.webview.injectJavaScript(`
            const height = document.body.scrollHeight;
            window.postMessage(height);
        `);
    }

  render() {
    let {data}=this.state;
    console.warn('ww:ads:data', data);
    // const _h = this.state.webViewHeight == 0 ? 1 : this.state.webViewHeight;
    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{barStyle: "dark-content"}}
          leftButton={this.leftButton()}
          title={this.state.articleTitle}
          popEnabled={false}
          style={{backgroundColor: "#fff"}}
        />
        <ScrollView style={{flex:1}}>
          <View style={styles.video_wrap}>
            {(data.video_url!==undefined && data.video_url!=null)&&
              <SldVideoPlay
              ref={ "SldVideoPlay" }
              videoUrl={ data.video_url}
              videoCover={(data.img_url===undefined || data.img_url===null)?'':data.img_url }
              navigation={ this.props.navigation }
              volume={1.0}
              />
            }

          </View>
          <View style={styles.info_wrap}>
              <Text numberOfLines={2} style={styles.header_text}>
                  {!data.vip_article_title ? '' : data.vip_article_title}
              </Text>
              {
                Platform.OS === 'ios' ?
                    <View pointerEvents={'none'}>
                        <WebView
                            ref={'webview'}
                            source={{ html : !data.vip_article_info? '' : data.vip_article_info, baseUrl : '' }}
                            style={{height: this.state.heightWeb, marginTop: 5, backgroundColor:'#FFC0CB'}}
                            scrollEnabled={false}
                            automaticallyAdjustContentInsets={true}
                            contentInset={{top:0,left:0}}
                            scalesPageToFit={Platform.OS === 'ios'}
                            showsVerticalScrollIndicator={ false }
                            javaScriptEnabled={ true }
                            domStorageEnabled={ true }
                            onLoadEnd={this.webViewLoaded}
                        />
                    </View>
                    :
                    <WebView
                        injectedJavaScript={BaseScript}
                        source={{ html : !data.vip_article_info? '' : data.vip_article_info, baseUrl : '' }}
                        style={{ width: deviceWidth-30, height: this.state.heightWeb}}
                        automaticallyAdjustContentInsets={true}
                        showsVerticalScrollIndicator={ false }
                        javaScriptEnabled={ true }
                        onMessage={this.onMessage.bind(this)}
                    />
              }
          </View>
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
    backgroundColor: '#fbfbfb'
  },
  video_wrap: {
    width: deviceWidth,
    height: deviceWidth,
    backgroundColor: '#fff'
  },
  info_wrap: {
    paddingHorizontal: pxToDp(30),
    marginTop: pxToDp(10),
    backgroundColor: '#fff',
  },
  header_text: {
    fontSize: pxToDp(32),
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 30,
  },
  content_wrap: {
    width: deviceWidth,
    height: deviceHeight - pxToDp(300) - pxToDp(80)
  },
  content_text: {
    flex: 1,
  },
});
