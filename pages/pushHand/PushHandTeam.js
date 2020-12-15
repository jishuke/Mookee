/**
 * 推手 --- 我的团队
 * */
import React, {Component} from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	StyleSheet,
    ScrollView,
    ImageBackground,
} from "react-native";
import fun from '../../assets/styles/FunctionStyle';
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";
import {getMyTeamInfo} from "./../../api/pushHandApi"
import ViewUtils from "../../util/ViewUtils";
import {I18n} from './../../lang/index'

const SubItem = (props) => {
    console.log(props,'props');
    const {member_nickname,member_avatar,add_time} = props.item
    return (
        <View style={[styles.sub_item, fun.f_row_between, {alignItems: 'center', borderBottomColor: '#E5E5E5', borderBottomWidth: 1}]}>
            <View style={[fun.f_row_center]}>
                {
                    member_avatar && member_avatar != '' ? <Image  source={{uri: member_avatar}} />:<Image style={{width: 60}} source={require('../../assets/images/communityPage/avatar.png')} />
                }
                {/*<Image style={[fun.f_icon84, {borderRadius: pxToDp(42), marginLeft: pxToDp(10), marginRight: pxToDp(10)}]} source={{member_avatar ?  require('../../assets/images/communityPage/avatar.png') : member_avatar }} />*/}
                <Text style={[fun.f_fs28, fun.f_c_24]}>{member_nickname}</Text>
            </View>
            <Text style={[fun.f_fs28, fun.f_c_66]}>{add_time}</Text>
        </View>
    );
}
class Item extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        }
    }
    render() {

        console.log('this.props', this.props);
        return (
            <View style={styles.item}>
                <View style={[fun.f_row_between, {alignItems: 'center'}]}>
                    <View style={[fun.f_row_center]}>
                        <Text style={[fun.f_fs30, fun.f_c_24]}>{this.props.title}</Text>
                        <Text style={[fun.f_fs30, fun.f_c_red, {marginLeft:pxToDp(20)}]}>{this.props.list.people_num}{this.props.list.people_num > 1 ? I18n.t('PushHandTeam.person2') : I18n.t('PushHandTeam.person1')}</Text>
                    </View>
                    <TouchableOpacity style={[fun.f_row_center]} onPress={() => {
                        this.setState({
                            isShow: !this.state.isShow
                        });
                    }}>
                        <Text style={[fun.f_fs24, fun.f_c_66]}>{I18n.t('MyScreen.viewall')}</Text>
                        <Image style={[fun.f_icon32, {marginLeft: pxToDp(20)}]} resizeMode="contain" source={this.state.isShow ? require('../../assets/images/pushHand/arrow_up.png') : require('../../assets/images/pushHand/arrow_down.png')}/>
                    </TouchableOpacity>
                </View>
                {
                    this.state.isShow && (
                        <View style={{paddingTop: pxToDp(20), paddingBottom: pxToDp(20)}}>
                            {
                                this.props.list.people_info && this.props.list.people_info.map((item, index) => {
                                    return (
                                        // <SubItem key={item.member_id} item={item} />
                                        <View key={index} style={[styles.sub_item, fun.f_row_between, {alignItems: 'center', borderBottomColor: '#E5E5E5', borderBottomWidth: 1}]}>
                                            <View style={[fun.f_row_center]}>
                                                {/*头像*/}
                                                {
                                                    item.member_avatar != '' ? <Image style={[fun.f_icon84, {borderRadius: pxToDp(42), marginLeft: pxToDp(10), marginRight: pxToDp(10)}]}  source={{uri: item.member_avatar}} /> : <Image style={[fun.f_icon84, {borderRadius: pxToDp(42), marginLeft: pxToDp(10), marginRight: pxToDp(10)}]}  source={require('../../assets/images/communityPage/avatar.png')} />
                                                }
                                                {/*<Image style={[fun.f_icon84, {borderRadius: pxToDp(42), marginLeft: pxToDp(10), marginRight: pxToDp(10)}]} source={{member_avatar ?  require('../../assets/images/communityPage/avatar.png') : member_avatar }} />*/}
                                                <Text style={[fun.f_fs28, fun.f_c_24]}>{item.member_nickname}</Text>
                                            </View>
                                            <Text style={[fun.f_fs28, fun.f_c_66]}>{item.add_time}</Text>
                                        </View>
                                    );
                                })
                            }
                        </View>
                    )
                }

            </View>
        );
    }
}

export default class PushHandTeam extends Component{
    constructor(props) {
        super(props);
        this.state = {
            info: null
        };
    }
    componentDidMount() {
        this.getOurTeamInfo()
    }
    getOurTeamInfo () {
        getMyTeamInfo({
            member_id : cur_user_info.member_id,
            key : key
        }).then(res => {
            console.log(res)
            if(res.code === 200){
                this.setState({
                    info : res.datas
                })
                // this.info = res.datas
            } else {
                ViewUtils.sldToastTip(res.datas.error)
            }
        })

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
      const {info} = this.state
      return (
          <View style={[fun.f_flex1, fun.f_bg_white]}>
              <NavigationBar
					statusBar={{barStyle: "dark-content"}}
					leftButton={this.leftButton()}
                    title={I18n.t('PushHandTeam.my_team')}
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                <ScrollView>
                    {
                        info &&
                        <View>
                            <ImageBackground resizeMode="cover" style={styles.banner} source={require('../../assets/images/pushHand/team_banner.png')}>
                                <View style={[{width: '100%', height: '100%', paddingRight: pxToDp(40), justifyContent: 'flex-end'},fun.f_row_center]}>
                                    <Text style={[fun.f_fs28, fun.f_c_white]}>{I18n.t('PushHandTeam.total')}：{info.sumpeople}</Text>
                                </View>
                            </ImageBackground>
                            <View style={{paddingLeft: pxToDp(20), paddingRight: pxToDp(20)}}>
                                <Item title={I18n.t('PushHandTeam.vip_member')} list={info.vip} />
                                <Item title={I18n.t('PushHandTeam.member')} list={info.member} />
                                <Item title={I18n.t('PushHandTeam.new_member')} list={info.new} />
                            </View>
                        </View>
                    }

                </ScrollView>
          </View>
      );
    }
}

const styles = StyleSheet.create({
    banner: {
        width: '100%',
        height: pxToDp(160)
    },

    item: {
        paddingTop: pxToDp(20),
        paddingBottom: pxToDp(20)
    },
    sub_item: {
        height: pxToDp(120)
    }
});
