/*
* 编辑地址页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';

import {I18n} from './../lang/index'
export default class EditAddress extends Component {

    constructor(props) {

        super(props);
        this.state = {
            address_id:0
        }
    }

    componentWillMount() {
        let params = this.props.navigation.state;
        if(params.params != 'undefined'){
            this.setState({
                address_id:params.params.address_id,
            });
        }
    }

	handleMessage = (datajson) => {
		ViewUtils.goDetailPageNew(this.props.navigation,datajson);
	}


    render() {
        const {address_id} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            <SldHeader title={I18n.t('AddressList.text3')} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>
            </View>
        )
    }
}
