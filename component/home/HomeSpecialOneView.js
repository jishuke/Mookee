import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  View, Dimensions, TouchableOpacity,
} from 'react-native';
import pxToDp from '../../util/pxToDp';

const deviceWidth = Dimensions.get ('window').width;

export default class HomeSpecialOneView extends Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onclickSpecialOne: PropTypes.func,
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.data.map((val,index)=>
          <TouchableOpacity key={index} onPress={()=>{this.props.onclickSpecialOne(val)}} activeOpacity={ 1 }>
            <Image
              resizeMode="contain"
              style={{width: deviceWidth- pxToDp(30)*2,
                height: (deviceWidth- pxToDp(30)*2) * (val.height/val.width)}}
              defaultSource={require('../../assets/images/default_icon_400.png')}
              source={{uri: val.img}}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width: deviceWidth,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: pxToDp(30),
    paddingBottom: pxToDp(20),
    backgroundColor: '#ffffff'
  },
  img: {
    width: deviceWidth- pxToDp(30)*2,
    height: (deviceWidth- pxToDp(30)*2) * (544.0/686.0),
  },
});
