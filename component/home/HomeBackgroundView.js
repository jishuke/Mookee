import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View, Dimensions,
  Animated
} from 'react-native';

const deviceWidth = Dimensions.get ('window').width;
const deviceHeight = Dimensions.get ('window').height;

export default class HomeBackgroundView extends Component<Props> {
  static propTypes = {
    initColor: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    console.warn('ww:props', props);

    this.state = {
      prevColor: props.initColor,
      curColor: props.initColor,
      fadeAnim: new Animated.Value(0),  // 透明度初始值设为0
    }
  }

  render() {
    let color = this.state.fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.prevColor, this.state.curColor]
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.curColorWrap, {backgroundColor: color}]}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width: deviceWidth,
  },
  curColorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
//  zIndex: 1,
    height: deviceHeight
  },
});
