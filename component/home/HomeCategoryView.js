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

export default class HomeCategoryView extends Component<Props> {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onclickHomeCategory: PropTypes.func,
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.data.map((el, index)=>
          <TouchableOpacity onPress={()=>{this.props.onclickHomeCategory(el)}} activeOpacity={ 1 } key={index} style={[styles.item, (index +1)%5===0?{marginRight: pxToDp(0)}:{marginRight: pxToDp(52)}]}>
            <Image
              resizeMode="center"
              style={styles.item_img}
              defaultSource={require('../../assets/images/default_icon_124.png')}
              source={{uri: el.img}}
            />
            <Text numberOfLines={2} style={styles.item_title}>{el.name}</Text>
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
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: pxToDp(30),
    paddingVertical: pxToDp(20),
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Math.floor((deviceWidth - pxToDp(30)*2 - pxToDp(52)*4)/5),
    marginBottom: pxToDp(22),
  },
  item_img: {
    width: '100%',
    height: Math.floor((deviceWidth - pxToDp(30)*2 - pxToDp(52)*4)/5),
    borderRadius: (deviceWidth - pxToDp(30)*2 - pxToDp(52)*4)/5/2,
    backgroundColor: '#F8F8F8',
    marginBottom: pxToDp(12),
  },
  item_title: {
    fontSize: pxToDp(22),
    color: '#121212',
    textAlign: 'center',
  },
});
