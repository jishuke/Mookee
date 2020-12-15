import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions
} from 'react-native';
import pxToDp from '../../util/pxToDp';
import PriceUtil from '../../util/PriceUtil';

const deviceWidth = Dimensions.get ('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: deviceWidth,
    flexDirection : 'column' ,
    backgroundColor : '#fff' ,
  },
  container_header: {
    flexDirection : 'row' ,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: pxToDp(30),
    paddingVertical: pxToDp(34),
  },
  container_header_title: {
    fontSize: pxToDp(28),
    color: '#333333',
    fontWeight: 'bold',
  },
  container_content: {
    width: deviceWidth,
    flexDirection : 'row' ,
    flexWrap : 'wrap' ,
  },
  inner: {
    width: (deviceWidth-pxToDp(34)*3)/2,
    flexDirection : 'column' ,
    justifyContent: 'flex-start',
    marginLeft : pxToDp(34) ,
    marginBottom : pxToDp(34) ,
    borderRadius: pxToDp(10),
    borderColor: '#ebebeb',
    borderWidth: pxToDp(2),
    backgroundColor: 'rgba(250,250,250,1)',
    overflow: "hidden"
  },
  img: {
    width: '100%',
    height: (deviceWidth-pxToDp(34)*3)/2 - pxToDp(16),
    marginBottom: pxToDp(12),
    backgroundColor: 'transparent',
  },
  title: {
    color: '#333',
    fontSize: pxToDp(22),
    marginBottom: pxToDp(16),
    paddingHorizontal: pxToDp(11)
  },
  price: {
    color: '#ff0000',
    fontSize: pxToDp(24),
    marginBottom: pxToDp(26),
    paddingHorizontal: pxToDp(11)
  }
});

export default class HomeHotProduct extends Component<Props> {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onclickHomeHotProduct: PropTypes.func,
  };

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.container_header}>
            <Text style={styles.container_header_title}>HOT PRODUCTS</Text>
          </View>
          <View style={styles.container_content}>
            {this.props.data.map((el , index)=>{
              return <TouchableOpacity onPress={()=>{this.props.onclickHomeHotProduct(el)}} activeOpacity={ 1 } key={index}>
                <View style={styles.inner}>
                  <Image
                    defaultSource={require('../../assets/images/default_icon_124.png')}
                    source={{uri:el.goods_image}}
                    resizeMode='cover'
                    style={styles.img}/>
                  <Text
                    style={styles.title}
                    numberOfLines={1}
                  >{el.goods_name}</Text>
                  <Text
                    style={styles.price}
                    numberOfLines={1}
                  >Ks {PriceUtil.formatPrice(el.goods_price)}</Text>
                </View>
              </TouchableOpacity>
            })}
          </View>
        </View>

    );
  }
}


