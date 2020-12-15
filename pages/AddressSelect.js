import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text,Button} from 'react-native';
import Popup from '../component/Popup';
import Toast from '../component/Toast';
import Address from '../component/Address';
import {I18n} from './../lang/index'
class AddressSelect extends Component {
    static navigationOptions = {
        title:  I18n.t('AddressList.text6'),
    };
    constructor(props) {
        super(props);
    }
    open() {
        var address = [];
        Popup.show({
            title:  I18n.t('AddNewAddress.select'),
            popupHeight:300,
            content: (
                <Address length={3} activeColor="#FF8000" change={(res) => {
                    address = res;
                }}></Address>
            )
        }, (res) => {
                console.log(address);
                if (address.length < 3 ) {
                    Toast.add( I18n.t('AddNewAddress.select'));
                } else {
                    Popup.hide();
                }
        });
    }
    render() {
        return (
            <ScrollView style={styles.pageStyle}>
                <Text style={{ fontSize: 30 }}>addressSelect</Text>
                <Button title= {I18n.t('AddressList.text7')} onPress={this.open.bind(this)} />
            </ScrollView>
        );
    }
}
export default AddressSelect;
const styles = StyleSheet.create({
    pageStyle: {
        backgroundColor: '#f5f5f5',
    },
});
