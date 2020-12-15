/*
* 入驻申请-零售/批发
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';
import StorageUtil from "../util/StorageUtil";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import styles from './stylejs/companyReg'

export default class CompanyStep11 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '入驻申请',
            flag: false,
	        apply_t: (props.navigation.state.params!=undefined&&props.navigation.state.params.apply_t!=undefined)?props.navigation.state.params.apply_t:'',
	        reapply: props.navigation.state.params!=undefined&&props.navigation.state.params.reapply!=undefined?props.navigation.state.params.reapply:0,
	        step: props.navigation.state.params!=undefined&&props.navigation.state.params.step!=undefined?props.navigation.state.params.step:'',
        }
    }

    componentDidMount() {
        const {apply_t,} = this.state;
        let apply_info = {
            apply_t:apply_t,
        };
        StorageUtil.get('apply_info', (error, object) => {
            console.info(888);
            console.info(object);
            if (!error && object) {
                let tmp_data = JSON.parse(object);
                console.info(88);
                console.info(apply_t);
                console.info(tmp_data.apply_t);
                if(apply_t!=tmp_data.apply_t){
                    StorageUtil.delete('company_reg2');
                    StorageUtil.delete('company_reg3');
                    StorageUtil.delete('company_reg4');
                    StorageUtil.set('apply_info', JSON.stringify(apply_info));//将申请类型存缓存
                }
            }else{
                StorageUtil.set('apply_info', JSON.stringify(apply_info));//将申请类型存缓存
            }
        });

    }

    render() {
        const {title, apply_t,reapply,step} = this.state;
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
                        this.props.navigation.navigate('CompanyStep2',{apply_t: apply_t,is_supplier:0,reapply:reapply})
                    }}
                >
                    <Image
                        style={styles.step_img}
                        source={require('../assets/images/person_join.png')}
                        resizeMode={'contain'}
                    />
                    <View style={styles.step_title}>
                        <Text style={styles.step_title_name}>入驻零售商</Text>
                        <Text style={styles.step_title_tip}>售卖的商品将展示在商城供消费者购买</Text>
                    </View>

                    <Image
                        style={styles.more}
                        source={require('../assets/images/sld_jiantou.png')}
                        resizeMode={'contain'}
                    />

                </TouchableOpacity>

                {!ViewUtils.isEmptyObject(module_set)&&module_set.supplier==1&&
                    <TouchableOpacity
                        style={styles.item}
                        activeOpacity={1}
                        onPress={()=>{
                            this.props.navigation.navigate('CompanyStep2',{apply_t: apply_t,is_supplier:1,reapply:reapply})
                        }}
                    >
                        <Image
                            style={styles.step_img}
                            source={require('../assets/images/supplier_join.png')}
                            resizeMode={'contain'}
                        />
                        <View style={styles.step_title}>
                            <Text style={styles.step_title_name}>入驻批发商</Text>
                            <Text style={styles.step_title_tip}>售卖的商品将展示在批发市场供店铺、消费者购买</Text>
                        </View>

                        <Image
                            style={styles.more}
                            source={require('../assets/images/sld_jiantou.png')}
                            resizeMode={'contain'}
                        />

                    </TouchableOpacity>
                }

            </View>
        )
    }
}
