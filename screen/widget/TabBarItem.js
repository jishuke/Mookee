
import React, { Component } from 'react'
import {Image, View, Text, StyleSheet, DeviceEventEmitter, Platform, Dimensions} from 'react-native'
import { I18n } from '../../lang'
import pxToDp from "../../util/pxToDp";

type Props = {
    tintColor: any,
    normalImage:any,
    normalImageEn:any,
    selectedImage:any,
    selectedImageEn:any,
    focused:boolean,
    titleKey: String,
};

class TabBarItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            refresh: false
        }
    }

    componentDidMount(){
        this.lister = DeviceEventEmitter.addListener('languageSettings', () => {
            this.setState({refresh:!this.state.refresh})
        })
    };

    componentWillUnmount(){
        this.lister.remove();
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={{display: 'none'}}>{this.state.refresh}</Text>
                <Image
                  source={this.props.focused
                    ? this.props.selectedImage
                    : this.props.normalImage}
                  style={styles.icon}
                />
                <Text style={this.props.focused?styles.selectedText:styles.normalText}>
                    {I18n.t(this.props.titleKey)}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896) ? 34 : 0,
    },
    icon: {
        width: pxToDp(108),
        height: pxToDp(60)
    },
    normalText: {
        fontSize: pxToDp(18),
        color: '#000000'
    },
    selectedText: {
        color: '#ec7945',
        fontSize: pxToDp(18)
    },
});

export default TabBarItem
