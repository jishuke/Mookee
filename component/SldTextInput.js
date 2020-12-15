import React, {Component} from 'react';
import {Platform, TextInput} from 'react-native';

//解决IOS中无法输入中文的问题
class SldTextInput extends Component {
	shouldComponentUpdate(nextProps){

		return Platform.OS !== 'ios' || (this.props.value === nextProps.value &&
			(nextProps.defaultValue == undefined || nextProps.defaultValue == '' )) ||
			(this.props.defaultValue === nextProps.defaultValue &&  (nextProps.value == undefined || nextProps.value == '' ));

	}

	render() {
		return <TextInput {...this.props} />;
	}
};

export default SldTextInput;

