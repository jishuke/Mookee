import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  View, Dimensions, TouchableOpacity,
} from 'react-native';
import pxToDp from '../../util/pxToDp';
import Swiper from 'react-native-swiper';

const deviceWidth = Dimensions.get ('window').width;

export default class HomeBannerView extends Component<Props> {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onclickBanner: PropTypes.func,
    onBannerIndexChanged: PropTypes.func,
    onBannerScrollPercent: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      data:[],
    };
  }

  componentDidMount (){
    console.warn('ww:banner:componentDidMount', this.props.data);
    this.setState((state, props) => ({
      data:props.data,
    }));
  }

  render() {
    const {data} = this.state;
    console.warn('ww:banner:data', data);
    return (
      <View style={styles.banner_container}>
        <View style={styles.banner_bg}/>
        <View style={styles.banner_bg2}/>
        {data.length > 0&&
          <Swiper
          showsPagination={false}
          horizontal={true}
          autoplay={true}
          loop={true}
          autoplayTimeout={10}
          onIndexChanged={(index)=>{
          this.props.onBannerIndexChanged(index);
          }}
          >
            { data.map((el , index)=>
              <View style={styles.banner_wrap}>
                <TouchableOpacity onPress={()=>{this.props.onclickBanner(el)}} key={{index}} style={styles.banner_inner} activeOpacity={ 1 }>
                  <View style={styles.banner_img_container}>
                    <Image resizeMode="contain" style={styles.banner_img} source={{uri: el.img}}/>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </Swiper>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  banner_container:{
    width: deviceWidth,
    height: pxToDp(240),
  },
  banner_bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: deviceWidth,
    height: pxToDp(120),
    backgroundColor: 'transparent',
  },
  banner_bg2: {
    position: 'absolute',
    top: pxToDp(120),
    left: 0,
    width: deviceWidth,
    height: pxToDp(240 - 120),
    backgroundColor: '#ffffff',
  },
  banner_wrap: {
    // flex:1,
    // justifyContent: 'center',
  },
  banner_inner: {
    paddingHorizontal: pxToDp(30),
    backgroundColor: 'transparent',
  },
  banner_img_container: {
    width: deviceWidth - pxToDp(30)*2,
    height: (deviceWidth - pxToDp(30)*2) * (208.0/620.0),
    borderRadius: pxToDp(8),
    overflow: 'hidden',
  },
  banner_img: {
    width: deviceWidth - pxToDp(30)*2,
    height: (deviceWidth - pxToDp(30)*2) * (208.0/620.0),
  },
});
