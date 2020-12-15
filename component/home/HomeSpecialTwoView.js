import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  Text,
  View, Dimensions, TouchableOpacity,
} from 'react-native';
import pxToDp from '../../util/pxToDp';

const deviceWidth = Dimensions.get ('window').width;

export default class HomeSpecialTwoView extends Component<Props> {
  //TODO: test
  static defaultProps = {
    data: [
      {
        height: 124,
        img: "http://cdn.mookee.net/data/upload/mobile/special/s1582613683/s1582613683_06359576839467303.png",
        title: "",
        url: "316",
        url_type: "category",
        width: 192,
      },
      {
        height: 124,
        img: "http://cdn.mookee.net/data/upload/mobile/special/s1582613689/s1582613689_06359576897883916.png",
        title: "",
        url: "166",
        url_type: "category",
        width: 192,
      },
      {
        height: 124,
        img: "http://cdn.mookee.net/data/upload/mobile/special/s1582613665/s1582613665_06359576650634186.png",
        title: "",
        url: "227",
        url_type: "category",
        width: 192,
      },
      {
        height: 124,
        img: "http://cdn.mookee.net/data/upload/mobile/special/s1582613668/s1582613668_06359576686303510.png",
        title: "",
        url: "87",
        url_type: "category",
        width: 192,
      },
    ]


  };

  static propTypes = {
    data: PropTypes.array.isRequired,
    onclickSpecialTwo: PropTypes.func,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.inner_header}>
            <Text style={styles.inner_header_title}>Special Preferential</Text>
          </View>
          <View style={styles.inner_content}>
            {this.props.data.map((el, index)=>
              <TouchableOpacity onPress={()=>{this.props.onclickSpecialTwo(el)}} activeOpacity={ 1 } key={index}>
                <Image defaultSource={require('../../assets/images/default_icon_124.png')} source={{uri:el.img}} resizeMode='cover' style={styles.item}/>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width: deviceWidth,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: pxToDp(30),
  },
  inner: {
    backgroundColor: '#FF6D6D',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderRadius: pxToDp(8),
    width: deviceWidth - pxToDp(30)*2,
    paddingBottom: pxToDp(32),
  },
  inner_header: {
    flexDirection : 'row' ,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: pxToDp(24),
    paddingTop: pxToDp(29),
    paddingBottom: pxToDp(16),
  },
  inner_header_title: {
    fontSize: pxToDp(28),
    color: '#ffffff',
    fontWeight: 'bold'
  },
  inner_content: {
    flexDirection : 'row' ,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  item: {
    width: (deviceWidth - pxToDp(30)*2 - pxToDp(20)*3)/2,
    height: (deviceWidth - pxToDp(30)*2 - pxToDp(20)*3)/2 * (205.0/317.0),
    marginLeft: pxToDp(20),
    marginBottom: pxToDp(20),
  },
});
