import React, {Component} from 'react';
import {
    TouchableOpacity,
    Text
} from 'react-native';
import AddressSelect from '../component/AddressSelect'
import {I18n} from './../lang/index'
export default class extends React.Component {

    render() {
        return (
            <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center'}} onPress={() => this.openAddressSelect()}>
                <Text >{I18n.t('AddressList.text8')}</Text>
            </TouchableOpacity>
        );

    }

    openAddressSelect() {

        Widget.Popup.show( // 这边使用自己封装的modal嵌套地址选择器
            <AddressSelect
                commitFun={(area) => this.onSelectArea(area)}
                dissmissFun={() => Widget.Popup.hide()}
            />,
            {
                animationType: 'slide-up', backgroundColor: '#00000000', onMaskClose: () => {
                    Widget.Popup.hide()
                }
            })
    }

    onSelectArea = (area) => {
        console.log(area)
    }
};
