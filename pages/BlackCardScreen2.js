import React, {Component} from 'react';

import {View, Text, Image, Dimensions, TouchableWithoutFeedback, StyleSheet, FlatList,TouchableOpacity} from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import {I18n} from './../lang/index'
const mydata = [
    {
        label: I18n.t('BlackCardScreen.purchasing'),
        icon: require("./blackicon/1.png")
    },
    {
        label: I18n.t('BlackCardScreen.BlackCard'),
        icon: require("./blackicon/2.png")
    },
    {
        label: I18n.t('BlackCardScreen.priority'),
        icon: require("./blackicon/3.png")
    },
    {
        label: I18n.t('BlackCardScreen.hifi'),
        icon: require("./blackicon/4.png")
    },
    {
        label: I18n.t('BlackCardScreen.Birthdaygiftbag'),
        icon: require("./blackicon/5.png")
    },
    {
        label: I18n.t('BlackCardScreen.text2'),
        icon: require("./blackicon/6.png")
    },
    {
        label: I18n.t('BlackCardScreen.Membersday'),
        icon: require("./blackicon/7.png")
    },
    {
        label: I18n.t('BlackCardScreen.integral'),
        icon: require("./blackicon/8.png")
    },
    {
        label: I18n.t('BlackCardScreen.rebate'),
        icon: require("./blackicon/9.png")
    },
    {
        label: I18n.t('BlackCardScreen.VIPspecialline'),
        icon: require("./blackicon/10.png")
    },
    {
        label: I18n.t('BlackCardScreen.Lightningrefund'),
        icon: require("./blackicon/11.png")
    },
    {
        label: I18n.t('BlackCardScreen.Affinitycard'),
        icon: require("./blackicon/12.png")
    },

];

export default class BlackCardScreen2 extends Component {

    //点击立即购入
    _pressbuy() {
        // alert("点击立即续费")

    }

    _pressItem(item,index) {
        // alert('点击了' + item.icon);
    }

    _renderItem(item,index) {
        return (
            <TouchableWithoutFeedback  onPress={()=>this._pressItem(item,index)}>
                <View style={styles.smallItem}>
                    <Image source={item.icon} style={styles.smallIcon}/>
                    <Text style={styles.smallLabel}>{item.label}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        return (
            <View>
                <Image source={require('./black.jpg')} style={{width: screenWidth, height: screenHeight}}/>
                <FlatList
                    style={{
                        position: 'absolute',
                        left: 30,
                        top: 120,
                    }}
                    data={mydata}
                    renderItem={({item,index}) => this._renderItem(item,index)}
                    keyExtractor={item => item.label}
                    numColumns={3}
                />
                <Text style={{color:'#fff2c5',fontSize:12,position:'absolute',left:(screenWidth/2-45),top:450}}>{I18n.t('BlackCardScreen2.validity')}</Text>
                <View style={{
                    position: 'absolute',
                    left: 25,
                    bottom: 40,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#9f9166',
                        height: 50,
                        width: screenWidth - 50,
                        borderRadius: 50,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color: 'white', fontSize: 18, marginLeft: 20}}>{I18n.t('BlackCardScreen2.Fromthedue')}</Text>
                            <Text style={{fontSize: 18, marginLeft: 6,marginRight:6}}>30</Text>
                            <Text style={{color: 'white', fontSize: 18}}>{I18n.t('PTOrderDetail.sky')}</Text>
                        </View>

                        <TouchableWithoutFeedback onPress={this._pressbuy}>
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: '#ffe7a5',
                                height: 50,
                                width: (screenWidth - 50)/ 2,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{fontSize: 18, marginRight: 10}}>{I18n.t('BlackCardScreen2.renewal')}</Text>
                                <Image source={require('./arrow_right.png')} style={{width: 10, height: 15}}/>

                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        this.props.navigation.navigate('BlackProtocol');
                    }}>
                    <Text style={styles.agreement}>{I18n.t('BlackCardScreen.useragreement')}</Text>
                    </TouchableOpacity>
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({

        agreement: {
            color: '#7b7b7b',
            fontSize: 11,
            marginTop: 14
        },
        smallItem: {
            justifyContent: 'center',
            alignItems: 'center',
            width: (screenWidth - 60) / 3,
            marginBottom: 25,

        },
        smallLabel: {
            fontSize: 10,
            color: '#fff2c5',
            marginTop: 10
        },
        smallIcon: {
            width: 25,
            height: 25

        },
    }
);
