/**
 * 种草社区 --管理
 * */
import React, {Component} from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	StyleSheet,
} from "react-native";
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";

export default class Manage extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    leftButton() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.goBack();
            }}>
                <Image style={{ width: pxToDp(36), height: pxToDp(36), marginLeft: pxToDp(40) }} source={require('../../assets/images/goback.png')} />
            </TouchableOpacity>
        );
    }
    render() {
        return (
            <View>
                <NavigationBar
					statusBar={{barStyle: "dark-content"}}
					leftButton={this.leftButton()}
                    title="管理"
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                <View>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('Likes');
                    }} style={[styles.row, styles.bt_line]}>
                        <View style={styles.row_left}>
                            <Image resizeMode="contain" style={styles.icon} source={require('../../assets/images/communityPage/hand_icon.png')} />
                            <Text style={styles.text}>点赞</Text>
                        </View>
                        <Image resizeMode="contain" style={styles.arrow} source={require('../../assets/images/communityPage/arrow_icon.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('Comment');
                    }} style={styles.row}>
                        <View style={styles.row_left}>
                            <Image resizeMode="contain" style={styles.icon} source={require('../../assets/images/communityPage/hand_icon.png')} />
                            <Text style={styles.text}>评论</Text>
                        </View>
                        <Image resizeMode="contain" style={styles.arrow} source={require('../../assets/images/communityPage/arrow_icon.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        paddingTop: pxToDp(20),
        paddingBottom: pxToDp(20)
    },
    row_left: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        width: pxToDp(68),
        height: pxToDp(68)
    },
    arrow: {
        width: pxToDp(30),
        height: pxToDp(30)
    },
    bt_line: {
        borderBottomWidth: pxToDp(1),
        borderBottomColor: '#eee'
    },
    text: {
        fontSize: pxToDp(30),
        marginLeft: pxToDp(20),
        color: '#242424'
    }
});
