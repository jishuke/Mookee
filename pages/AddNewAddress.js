/*
* 新增地址页面
* @slodon
* */

import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    StyleSheet,
    TextInput,
    DeviceEventEmitter,
    Keyboard,
    Platform, Dimensions, BackHandler
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import pxToDp from "../util/pxToDp";
import RPicker from 'react-native-picker';
import CountEmitter from "../util/CountEmitter";
import SldTextInput from '../component/SldTextInput'
import LoadingWait from "../component/LoadingWait";
import {I18n, LANGUAGE_CHINESE, LANGUAGE_ENGLISH, LANGUAGE_MIANWEN} from './../lang/index'
import StorageUtil from "../util/StorageUtil";
export default class AddNewAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.navigation.state.params != undefined ? I18n.t('AddressList.text3') : I18n.t('AddNewAddress.Added'),
            source: props.navigation.state.params ? props.navigation.state.params.source : '',
            true_name: '',
            mem_phone: '',
            address: '',
            initAddrInfo: [],
            addrInfo: [],
            province: '',
            city: '',
            area: '',
            area_info: '',
            is_default: 0,
            address_id: '',
            isLoading:false,
            language: 1,
            selectAddress:'',
            proviceArray: [],
            cityArray: [], //市
            areaArray: [],  // 区
            provinceId: '',
            cityId: '',
            areaId: '',
        }
    }

    componentDidMount() {
        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                this.setState({
                    language: object
                });
            } else {
                this.setState({
                    language: LANGUAGE_CHINESE
                });
            }
        });

        if (this.props.navigation.state.params != undefined&&this.props.navigation.state.params.id != undefined) {
            let id = this.props.navigation.state.params.id;
            this.setState({
                address_id: id
            })
            this.getAddressInfo(id);
        }
        this.getAddress();

       // var _this = this;
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    }

    componentWillUnmount() {
        Keyboard.dismiss();
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)

        }
    }

    // 点击安卓返回键(物理) 弹框消失
    onBackButtonPressAndroid = () => {
        RPicker.hide();
        return false
    };

    // 编辑 ，获取地址详情
    getAddressInfo(id) {
        RequestData.postSldData(AppSldUrl + '/index.php?app=address&mod=address_info', {
            key,
            address_id: id
        }).then(res => {
            let info = res.datas.address_info;
            this.setState({
                true_name: info.true_name,
                address: info.address,
                areaId: info.area_id,
                area_info: info.area_info.replace('/',' ').replace('/',' '),
                cityId: info.city_id,
                is_default: info.is_default,
                mem_phone: info.mob_phone,
            });
            if(info.area_info.split('/').length>2){
                this.setState({
                    province: info.area_info.split('/')[0],
                    city: info.area_info.split('/')[1],
                    area: info.area_info.split('/')[2],
                });
            }
        }).catch(error => {
            ViewUtils.sldErrorToastTip(error);
        })
    }

    // 获取全部地址
    getAddress() {
        // console.log("=="+areaData.datas);
        this.setState({isLoading: true})
        RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=area_list').then(res => {
            this.setState({isLoading: false})
            console.log('地址111：', res)
            if (res.code === 200) {
                this.setState({
                    addrInfo: res.datas
                });
                this.addrInit(res.datas);
                this.getProvices(res.datas);
            }
        }).catch(error => {
            ViewUtils.sldErrorToastTip(error);
            this.setState({isLoading: false})
        })
    }

     // 获取省,市,县份数组
    getProvices(addr){
        let {addrInfo,province,city} = this.state;
        if(!addrInfo.length){
            return
        }
        let p = [];
        let len = addr.length;
        if(len>0){
            for(let i=0;i<len;i++){
                p.push(addr[i]['area_name']);
            }
        }
        console.log("=======province"+p);
        // 编辑时 可以不选父级 直接选子级
        let leng=addrInfo.length;
        if(leng>0){
            for(let i=0;i<leng;i++){
                if(province==addrInfo[i]['area_name']){
                    this.setState({provinceId:addrInfo[i]['area_id']});
                    console.log("=======city"+addrInfo[i].city);
                    this.getCity(addrInfo[i].city);
                    for(let j=0;j<addrInfo[i].city.length;j++){
                        if(city==addrInfo[i].city[j]['area_name']){
                            // 获取区数组
                            console.log("=======area"+addrInfo[i].city[j].city);
                            this.getArea(addrInfo[i].city[j].city);
                        }
                    }
                }
            }
        }
        console.log("data province"+p);
        this.setState({proviceArray:p})
    }

    getCity(addr){
        let c = [];
        let len = addr.length;
        if(len>0){
            for(let i=0;i<len;i++){
                c.push(addr[i]['area_name']);
            }
        }
        console.log("data city"+c);
        this.setState({cityArray:c});
    }

    getArea(addr){
        let a = [];
        let len = addr.length;
        if(len>0){
            for(let i=0;i<len;i++){
                a.push(addr[i]['area_name']);
            }
        }
        console.log("data area"+a);
        this.setState({areaArray:a});
    }

    addrInit(addr) {
        let p = [];
        let len = addr.length;
        for (let i = 0; i < len; i++) {
            let city = [];
            for (let j = 0; j < addr[i]['city'].length; j++) {
                let area = [];
                for (let k = 0; k < addr[i]['city'][j]['city'].length; k++) {
                    area.push(addr[i]['city'][j]['city'][k]['area_name'])
                }
                let data_area = {};
                data_area[addr[i]['city'][j]['area_name']] = area;
                city.push(data_area);
            }
            let data = {};
            data[addr[i]['area_name']] = city;
            p.push(data)
        }
        this.setState({
            initAddrInfo: p,
        })
        console.log(this.state.initAddrInfo)
    }

    showProvice = () => {
        Keyboard.dismiss();
        let {initAddrInfo, addrInfo, language} = this.state;
        if (!initAddrInfo.length || !addrInfo.length) {
            return
        }
        RPicker.init({
            pickerData: this.state.proviceArray,
            pickerConfirmBtnText: I18n.t('ok'),
            pickerCancelBtnText:I18n.t('cancel'),
            pickerTitleText: I18n.t('AddNewAddress.select'),
            pickerRowHeight: pxToDp(26),
            pickerTextEllipsisLen:20,
            pickerBg: [255, 255, 255, 1],
            wheelFlex:[1],
            pickerFontSize: 14,
            onPickerConfirm: data => {
                console.log("data=="+data);
                console.log("data==0"+addrInfo[0]['area_name']);
                console.log("data==init"+initAddrInfo);
                this.setState({province:data});
                let len=addrInfo.length;
                if(len>0){
                    for(let i=0;i<len;i++){
                        if(data==addrInfo[i]['area_name']){
                            this.setState({provinceId:addrInfo[i]['area_id']});
                            console.log("data==provinceId"+addrInfo[i]['area_id']);
                            this.getCity(addrInfo[i].city);
                        }
                    }
                }
            },
            onPickerCancel: data => {
            }
        });
        RPicker.show();
    };

    showCity = () => {
        console.log("cityArray"+this.state.cityArray.length);
        let {cityArray,addrInfo,province} = this.state;
        if (!cityArray.length || !addrInfo.length) {
            return
        }
        console.log("cityArray=="+cityArray.length);
        RPicker.init({
            pickerData: cityArray,
            pickerConfirmBtnText: I18n.t('ok'),
            pickerCancelBtnText:I18n.t('cancel'),
            pickerTitleText: I18n.t('AddNewAddress.select'),
            pickerBg: [255, 255, 255, 1],
            pickerRowHeight: pxToDp(26),
            pickerTextEllipsisLen:20,
            wheelFlex:[1],
            pickerFontSize: 14,
            onPickerConfirm: data => {
             console.log("city===="+data);
             console.log("city====province"+province);
             console.log("city====province state"+this.state.province);
                this.setState({city:data});
                let len=addrInfo.length;
                if(len>0){
                    for(let i=0;i<len;i++){
                        if(province==addrInfo[i]['area_name']){
                            if(addrInfo[i].city.length){
                                this.getCity(addrInfo[i].city);
                                for(let j=0;j<addrInfo[i].city.length;j++){
                                    if(data==addrInfo[i].city[j]['area_name']){
                                        // 获取区数组
                                         console.log("city=== areaarray---"+cityArray[i].city);
                                        this.getArea(addrInfo[i].city[j].city);
                                        this.setState({cityId:addrInfo[i].city[j]['area_id']});
                                    }
                                }

                            }
                        }

                    }
                }
            },
            onPickerCancel: data => {
            }
        });
        RPicker.show();
    };

    showArea = () => {
        Keyboard.dismiss();
        let {areaArray,addrInfo,province,city,provinceId, cityId} = this.state;
        if (!areaArray.length || !addrInfo.length) {
            return
        }
        RPicker.init({
            pickerData: this.state.areaArray,
            pickerConfirmBtnText: I18n.t('ok'),
            pickerCancelBtnText:I18n.t('cancel'),
            pickerTitleText: I18n.t('AddNewAddress.select'),
            pickerBg: [255, 255, 255, 1],
            pickerRowHeight: pxToDp(26),
            pickerTextEllipsisLen:20,
            wheelFlex:[1],
            pickerFontSize: 14,
            onPickerConfirm: data => {
                console.log("area===="+data);
                this.setState({area:data});
                let len=addrInfo.length;
                if(len>0) {
                    for (let i = 0; i < len; i++) {
                        if (province == addrInfo[i]['area_name']) {
                            if (addrInfo[i].city.length) {
                                for (let j = 0; j < addrInfo[i].city.length; j++) {
                                    if (city == addrInfo[i].city[j]['area_name']) {
                                        for(let m=0;m<addrInfo[i].city[j].city.length;m++){
                                            if(data==addrInfo[i].city[j].city[m]['area_name']){
                                                // 获取区id
                                                this.setState({areaId: addrInfo[i].city[j].city[m]['area_id']});
                                                console.log("area_id"+addrInfo[i].city[j].city[m]['area_id']);
                                                let area_id=addrInfo[i].city[j].city[m]['area_id'];
                                                console.log("provinceId"+provinceId);
                                                console.log("cityId"+cityId);
                                                this.setState({provinceId, cityId, area_id, area_info: province+'/'+city+'/'+data})
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            onPickerCancel: data => {
            }
        });
        RPicker.show();
    };

/*    showArea = () => {
        Keyboard.dismiss()
        let {initAddrInfo, addrInfo, language} = this.state;
        if (!initAddrInfo.length || !addrInfo.length) {
            return
        }

        RPicker.init({
            pickerData: initAddrInfo,
            pickerConfirmBtnText: I18n.t('ok'),
            pickerCancelBtnText:I18n.t('cancel'),
            pickerTitleText: I18n.t('AddNewAddress.select'),
            pickerBg: [255, 255, 255, 1],
            wheelFlex:[1,1,1],
            pickerFontSize: language === LANGUAGE_CHINESE ? 12 : 7,
            onPickerConfirm: data => {
                let province, city, area;
                for (let i = 0; i < addrInfo.length; i++) {
                    if (addrInfo[i]['area_name'] == data[0]) {
                        province = addrInfo[i].area_id;
                        let cityinfo = addrInfo[i].city;
                        for (let j = 0; j < cityinfo.length; j++) {
                            if (cityinfo[j]['area_name'] == data[1]) {
                                city = cityinfo[j].area_id;
                                let earainfo = cityinfo[j].city;
                                for (let k = 0; k < earainfo.length; k++) {
                                    if (earainfo[k]['area_name'] == data[2]) {
                                        area = earainfo[k].area_id;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
                this.setState({
                    province, city, area, area_info: data.join(' ')
                })
            },
            onPickerCancel: data => {
            }
        });
        RPicker.show();
    }*/

    change = (e) => {
        this.setState({
            is_default: (e == true ? 1 : 0)
        })
    }

    // 保存
    submit() {
        Keyboard.dismiss()
        const {true_name, mem_phone, address, area_info, cityId, areaId, is_default, address_id, source} = this.state;
        if (!true_name || !mem_phone || !address || !area_info) {
            return;
        }
        // if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(mem_phone))) {
        //     ViewUtils.sldToastTip(I18n.t('ForgetPwd.text2'));
        //     return;
        // }
       let data = {
            key: key,
            true_name: true_name,
            mob_phone: mem_phone,
            city_id: cityId,
            area_id: areaId,
            address: address,
            area_info: area_info,
            is_default: is_default
        }

        if (address_id != '') {
            data.address_id = address_id
        }
        let url = address_id != '' ? AppSldUrl + '/index.php?app=address&mod=address_edit' : AppSldUrl + '/index.php?app=address&mod=address_add';
        RequestData.postSldData(url, data).then(res => {
            console.log('保存地址:', res, '路径:', source);
            if (res.code == 200) {
                if (address_id != '') {
                    ViewUtils.sldToastTip(I18n.t('AddNewAddress.text2'));
                } else {
                    ViewUtils.sldToastTip(I18n.t('AddNewAddress.text3'));
                }
                CountEmitter.emit('address');
                if(source == 'confirm'){
                    console.log('新增地址:', res)
	                DeviceEventEmitter.emit('updateAddAddress', {defAddressId: is_default && res.datas.address_id});
                }
                if(source == 'updateSeleAddressList'){
	                DeviceEventEmitter.emit('updateSeleAddressList', {defAddressId: is_default && res.datas.address_id});
                }

                RPicker.hide();
                this.props.navigation.pop()
            }
        }).catch(error => {
            ViewUtils.sldErrorToastTip(error);
        })
    }

    render() {
        const {title, true_name, mem_phone, address} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => {
                               RPicker.hide();
                               ViewUtils.sldHeaderLeftEvent(this.props.navigation)}
                           }/>
                <View style={GlobalStyles.line}/>
                {this.state.isLoading && <LoadingWait loadingText={I18n.t('loading')} cancel={() => {
                }}/>}
                <View style={styles.form}>
                    <View style={styles.form_item}>
                        <Text style={styles.txt}>{I18n.t('AddNewAddress.recipients')}</Text>
                        <SldTextInput
                            style={styles.input}
                            value={true_name}
                            underlineColorAndroid={'transparent'}
                            keyboardType='default'
                            onChangeText={text => {
                                this.setState({
                                    true_name: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.form_item}>
                        <Text style={styles.txt}>{I18n.t('AddNewAddress.phone')}</Text>
                        <TextInput
                            style={styles.input}
                            maxLength={11}
                            keyboardType={'numeric'}
                            value={mem_phone}
                            underlineColorAndroid={'transparent'}
                            onChangeText={text => {
                                this.setState({
                                    mem_phone: text
                                })
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => this.showProvice()}>
                        <View style={styles.form_item}>
                            <Text style={styles.txt}>{I18n.t('AddNewAddress.text5')}</Text>
                            <Text
                                style={[styles.input, {color: (this.state.province == '' ? '#666' : '#333')}]}
                                value={this.state.province}
                            >{this.state.province == '' ? I18n.t('AddNewAddress.select') : this.state.province}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.showCity()}>
                        <View style={styles.form_item}>
                            <Text style={styles.txt}>{I18n.t('AddNewAddress.text6')}</Text>
                            <Text
                                style={[styles.input, {color: (this.state.city == '' ? '#666' : '#333')}]}
                                value={this.state.city}
                            >{this.state.city == '' ? I18n.t('AddNewAddress.select') : this.state.city}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.showArea()}>
                        <View style={styles.form_item}>
                            <Text style={styles.txt}>{I18n.t('AddNewAddress.text7')}</Text>
                            <Text
                                style={[styles.input, {color: (this.state.area == '' ? '#666' : '#333')}]}
                                value={this.state.area}
                            >{this.state.area == '' ? I18n.t('AddNewAddress.select') : this.state.area}</Text>
                        </View>
                    </TouchableOpacity>


            {/*        <Picker
                        selectedValue={this.state.selectAddress}
                        onValueChange={address => this.setState({selectAddress:address})}
                        mode="dialog"
                        style={{color:'#f00',justifyContent:'center',height:50,width:width-120,marginLeft:100}}
                        itemStyle={{color:'#e6454a', fontSize:19, height:30 }}
                    >
                    {this.state.initAddrInfo.map((item) => (
                        <Picker.Item key={item} value={item} label={item}
                        />
                    ))}
                    </Picker>*/}

                    <View style={styles.form_item}>
                        <Text style={styles.txt}>{I18n.t('AddNewAddress.minute')}</Text>
                        <SldTextInput
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            value={address}
                            keyboardType='default'
                            returnKeyType='done'
                            onChangeText={text => {
                                this.setState({
                                    address: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.form_item}>
                        <Text style={styles.txt}>{I18n.t('AddNewAddress.default')}</Text>
                        <Switch
                            value={this.state.is_default == 0 ? false : true}
                            onValueChange={e => this.change(e)}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => this.submit()}
                >
                    <View
                        style={[styles.btn,
                            {backgroundColor: ((true_name && mem_phone && address && this.state.area_info) ? '#F23030' : '#E9E9E9')}
                        ]}>
                        <Text style={{
                            fontSize: pxToDp(26),
                            color: ((true_name && mem_phone && address && this.state.area_info) ? '#fff' : '#9C9C9C')
                        }}>{I18n.t('AddNewAddress.save')}</Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    form: {
        marginTop: pxToDp(20),
        backgroundColor: '#fff',
    },
    form_item: {
        height: pxToDp(90),
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: pxToDp(1),
        borderTopColor: '#E9E9E9',
        borderStyle: 'solid',
        paddingHorizontal: pxToDp(30),
    },
    input: {
        flex: 1,
    },
    btn: {
        height: pxToDp(70),
        marginTop: pxToDp(46),
        marginHorizontal: pxToDp(20),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(4),
    },
    txt: {
        width: pxToDp(150),
        color: '#333333',
        fontSize: pxToDp(26)
    }
})
