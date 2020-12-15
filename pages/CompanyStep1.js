/*
* 入驻申请-个人/企业
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import styles from './stylejs/companyReg'
import {I18n} from './../lang/index'

export default class CompanyStep1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: I18n.t('CompanyEdit.title'),
            flag: false,
	        reapply:props.navigation.state.params!=undefined&&typeof ( props.navigation.state.params.reapply ) != 'undefined' ? props.navigation.state.params.reapply : 0,
        }
    }

    componentDidMount() {
    }

    /*
    * apply_t 入驻类型  0为个人入驻  1为企业入驻
    * reapply 是否再次申请 0为该账号初次申请，1为再次申请
    * */
    render() {
        const {title, flag,reapply} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            {/*{ViewUtils.setSldAndroidStatusBar(true,'#fff','default',true,true)}*/}
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>

                <TouchableOpacity
                    style={styles.item}
                    activeOpacity={1}
                    onPress={()=>{
                        this.props.navigation.navigate('CompanyStep11',{apply_t: 0,reapply:reapply,step:'nostep'})
                    }}
                >
                    <Image
                        style={styles.step_img}
                        source={require('../assets/images/sld_icon12.png')}
                        resizeMode={'contain'}
                    />
                    <View style={styles.step_title}>
                        <Text style={styles.step_title_name}>{I18n.t('SelTypeIsSupply.text1')}</Text>
                        <Text style={styles.step_title_tip}>{I18n.t('SelTypeIsSupply.text2')}</Text>
                    </View>

                    <Image
                        style={styles.more}
                        source={require('../assets/images/sld_jiantou.png')}
                        resizeMode={'contain'}
                    />

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.item}
                    activeOpacity={1}
                    onPress={()=>{
                        this.props.navigation.navigate('CompanyStep11',{apply_t: 1,reapply:reapply,step:'nostep'})
                    }}
                >
                    <Image
                        style={styles.step_img}
                        source={require('../assets/images/enterprise_join.png')}
                        resizeMode={'contain'}
                    />
                    <View style={styles.step_title}>
                        <Text style={styles.step_title_name}>{I18n.t('SelTypeIsSupply.text3')}</Text>
                        <Text style={styles.step_title_tip}>{I18n.t('SelTypeIsSupply.text4')}</Text>
                    </View>

                    <Image
                        style={styles.more}
                        source={require('../assets/images/sld_jiantou.png')}
                        resizeMode={'contain'}
                    />

                </TouchableOpacity>


            </View>
        )
    }
}
