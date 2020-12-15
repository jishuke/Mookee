import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {I18n} from './../lang/index'

export default class LoadingWait extends Component {
  render() {
    var loadingText = this.props.loadingText == null ? I18n.t('loading')+'...' : this.props.loadingText;
    return (
	    <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.3)",zIndex:9999}}>
		    <View style={styles.loading}>
			    <ActivityIndicator size='large' color='#FFFFFF'/>
			    <Text style={styles.loadingText}>{loadingText}</Text>
		    </View>
	    </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF'
  }
});
