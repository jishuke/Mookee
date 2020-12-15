/*
* 性别选择组件
* @slodon
* */
import React, {Component} from 'react';
import {Text,
} from 'react-native';
import RadioModal from 'react-native-radio-master';
var Dimensions = require('Dimensions');
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');

import {I18n} from './../lang/index'



export default class MemberInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            sex_val:'1',
        }
    }

    componentWillMount() {

    }



    render() {
        const seleval = this.props.seleVal;
        return (

            seleval !='' &&(
                <RadioModal
                    selectedValue={this.props.seleVal}
                    onValueChange={(id,item) => {
                        this.props.onhandle(id);
                    }}
                    style={{ flexDirection:'row',
                        flexWrap:'wrap',
                        justifyContent:'flex-start',
                        backgroundColor:'#ffffff',
                        alignItems:'center',
                    }}
                >
                    <Text value="1">{I18n.t('com_MemberSex.man')}</Text>
                    <Text value="0">{I18n.t('com_MemberSex.woman')}</Text>
                </RadioModal>
            )

        )
    }
}
