/**
 * 种草社区 --评论
 * */
import React, {Component} from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
    FlatList
} from "react-native";
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";
import LikesItem from './LikesItem';
import fun from '../../assets/styles/FunctionStyle'
import { getMyExperienceCommentList } from '../../api/communityApi'

export default class Likes extends Component{
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
        this.page = 1;
        this.size = 10;
    }

    componentDidMount() {
        this._getList();
    }

    _getList() {
        getMyExperienceCommentList({
            page: this.page,
            size: this.size
        }).then(res => {
            console.log('res---', res);
            this.setState({
                list: res.data.list
            });
        });
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
            <View style={[fun.f_flex1]}>
                <NavigationBar
					statusBar={{barStyle: "dark-content"}}
					leftButton={this.leftButton()}
                    title="评论"
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                <FlatList
                    data={this.state.list}
                    ListEmptyComponent = {() => {
                        return (
                            <View style={[fun.f_center, {
                                height: pxToDp(200),
                                backgroundColor: '#fff'
                            }]}>
                                <Text style={[fun.f_fs24, fun.f_c_90]}>暂无数据</Text>
                            </View>
                        );
                    }}
                    renderItem = {({item, index, separators}) => {
                        return <LikesItem type="comment" navigation={this.props.navigation} info={item} key={index} />;
                    }}
                    ItemSeparatorComponent = {() => {
                        return (
                            <View style={{
                                height: pxToDp(10),
                                backgroundColor: '#f7f7f7'
                            }}></View>
                        )
                    }}
                 />
                {/* <ScrollView>
                    <LikesItem />
                </ScrollView> */}
            </View>
        );
    }

}
