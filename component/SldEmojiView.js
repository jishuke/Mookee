import React, {Component} from 'react';
import {Dimensions, Image, StyleSheet, View,TouchableOpacity} from 'react-native';
import pxToDp from "../util/pxToDp";
import Smiley from "../util/Smiley";

const {width} = Dimensions.get('window');

export default class SldEmojiView extends Component {

  click_event_page = (val) => {
	  this.props.click_event(val);
  }

  render() {
    return (
      <View
        style={styles.viewPager}
        >
        <View style={styles.pageStyle}><Page click_event = {(val)=>this.click_event_page(val)} index={0}/></View>
        <View style={styles.pageStyle}><Page click_event = {(val)=>this.click_event_page(val)} index={1}/></View>
        <View style={styles.pageStyle}><Page click_event = {(val)=>this.click_event_page(val)} index={2}/></View>
      </View>
    );
  }
}

class Page extends Component {
	sendEmoji = (val) => {
	  this.props.click_event(val);
  }

  render() {
    var page = [];
    for (var j = 0; j < 3; j++) {
      var row = [];
      for (var i = 0; i < 8; i++) {
        if (i == 7 && j == 2) {
          row.push(
            <TouchableOpacity
	            activeOpacity={ 1 } onPress={ () => {alert('del')} }
              key={i}
                  style={styles.touchStyle}>
              <Image resizeMode={'contain'} source={require('../assets/upload/emoji/emo_del.png')} style={styles.emojiDelIcon}/>
            </TouchableOpacity>
          );
        } else {
          let val = j * 8 + i + this.props.index * 23;
          row.push(
            <TouchableOpacity
	            activeOpacity={ 1 } onPress={ () => {this.sendEmoji(val)} }
              key={i}
                  style={styles.touchStyle}>
              <Image source={Smiley.data[j * 8 + i + this.props.index * 23]} style={styles.emojiIcon}/>
            </TouchableOpacity>
          );
        }
      }
      page.push(
        <View key={"row" + j} style={styles.pageView}>
          {row}
        </View>
      );
    }
    return (
      <View>{page}</View>
    );
  }
}

const styles = StyleSheet.create({
  viewPager: {
    height: pxToDp(400),
    backgroundColor: '#F4F4F4',
    flexDirection:'row',
    justifyContent:'flex-start',

  },
  pageStyle: {
    width: width,
  },
  emojiIcon: {
    width: pxToDp(50),
    height: pxToDp(50),
  },
  emojiDelIcon: {
    width: pxToDp(45),
    height: pxToDp(35),
  },
  pageView:{
	  flexDirection: 'row', height: pxToDp(300) / 3,width:width,paddingTop:pxToDp(50)
  },
  touchStyle:{flex: 1, justifyContent: 'center', alignItems: 'center', },
});
