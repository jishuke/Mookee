/**
 * 自定义NavigationBar
 * @by slodon
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Platform,
    StatusBar,
    Text,
    View,Dimensions
} from 'react-native'
import GlobalStyles from "../assets/styles/GlobalStyles";
const {width,height,scale} = Dimensions.get('window');
if(width==375&&height==812){
    ios_type = scale==3?44:60
}else if(width==414&&height==896){
    ios_type = 60
}
const NAV_BAR_HEIGHT_IOS = ios_type==''?35:ios_type;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = Platform.OS=='ios'?(ios_type==''?35:ios_type):0;

export default class NavigationBar extends Component {
    static defaultProps = {
        statusBar: {
            barStyle: 'light-content',
            hidden: false,
        },
    }
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            hide: false,
            title_color:this.props.title_color?this.props.title_color:'#333',
        };
        //protype修改
        let style = this.props.style;
        let title = this.props.title;
        let titleView = this.props.titleView;
        let titleLayoutStyle = this.props.titleLayoutStyle;
        let hide = this.props.hide;
        let statusBar = this.props.statusBar;
        let rightButton = this.props.rightButton;
        let leftButton = this.props.leftButton;

    }



    getButtonElement(data) {
        return (
            <View style={styles.navBarButton}>
                {data? data : null}
            </View>
        );
    }

    render() {
        const {title_color} = this.state;
        let statusBar = !this.props.statusBar.hidden ?
            <View style={styles.statusBar}>
                <StatusBar {...this.props.statusBar} translucent={true} hidden={false} />
            </View>: null;

        let titleView = this.props.titleView ? this.props.titleView :
            <Text ellipsizeMode="head" numberOfLines={1} style={[styles.title,GlobalStyles.sld_global_font,{color:title_color}]}>{this.props.title}</Text>;

        let content = this.props.hide ? null :
            <View style={styles.navBar}>
                {
                    this.getButtonElement(this.props.leftButton)
                }
                <View style={[styles.navBarTitleContainer,this.props.titleLayoutStyle]}>
                    {titleView}
                </View>
                {this.getButtonElement(this.props.rightButton)}
            </View>;
        return (
            <View style={[this.props.style, {paddingTop: StatusBar.currentHeight}]}>
                {statusBar}
                {content}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    },
    navBarTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 40,
        top: 0,
        right: 40,
        bottom: 0,
    },
    title: {
        fontSize: 18,
        color: '#333',
    },
    navBarButton: {
        alignItems: 'center',
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT:0,
    },
})
