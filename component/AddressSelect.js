import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    Platform,
    UIManager,
    Text
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import SelectCityTabBar from './SelectCityTabBar'
const AREA_JSON = [
    {
        "value": "110000000000",
        "children": [
            {
                "value": "110100000000",
                "children": [
                    {
                        "value": "110101000000",
                        "label": "东城区"
                    },
                    {
                        "value": "110102000000",
                        "label": "西城区"
                    },
                    {
                        "value": "110105000000",
                        "label": "朝阳区"
                    },
                    {
                        "value": "110106000000",
                        "label": "丰台区"
                    },
                    {
                        "value": "110107000000",
                        "label": "石景山区"
                    },
                    {
                        "value": "110108000000",
                        "label": "海淀区"
                    },
                    {
                        "value": "110109000000",
                        "label": "门头沟区"
                    },
                    {
                        "value": "110111000000",
                        "label": "房山区"
                    },
                    {
                        "value": "110112000000",
                        "label": "通州区"
                    },
                    {
                        "value": "110113000000",
                        "label": "顺义区"
                    },
                    {
                        "value": "110114000000",
                        "label": "昌平区"
                    },
                    {
                        "value": "110115000000",
                        "label": "大兴区"
                    },
                    {
                        "value": "110116000000",
                        "label": "怀柔区"
                    },
                    {
                        "value": "110117000000",
                        "label": "平谷区"
                    },
                    {
                        "value": "110118000000",
                        "label": "密云区"
                    },
                    {
                        "value": "110119000000",
                        "label": "延庆区"
                    }
                ],
                "label": "北京市"
            }
        ],
        "label": "北京市"
    }
]
const { height, width } = Dimensions.get('window');

export default class AddressSelect extends Component {

    static defaultProps = {
        commitFun: function (value) {
            console.log(value);
        },
        dissmissFun: function () {

        },
        lastAddress: null,
    };

    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }
        const { lastAddress } = props;
        let selectAddress = this.initAddress(lastAddress);
        this.state = {
            selectAddress
        }
    }

    initAddress(lastAddress) {
        let selectAddress = [
            {
                value: null,
                label: null,
                children: AREA_JSON,
            }, {
                value: null,
                label: null,
                children: null,
            }, {
                value: null,
                label: null,
                children: null,
            }];
        let array = null;

        function fun(array, value) {
            for (let item of array) {
                if (item.value + '' === value + '') {
                    return item;
                }
            }
        }
        try {
            selectAddress = selectAddress.map((item, index) => {
                let result = fun(array ? array : AREA_JSON, lastAddress[index].value);
                if (result.children) {
                    array = result.children;
                }
                return result;
            });
        } catch (e) {
            console.log('-----e-', e);
        }
        return selectAddress
    }


    /**
     * 列表行
     * @param item
     * @param i
     * @returns {XML}
     */
    renderListItem(item, i) {
        let itemStyle = styles.itemStyle;
        let textStyle = styles.itemText;
        let { selectAddress } = this.state;
        if (item.label === selectAddress[i].label) {
            itemStyle = [itemStyle];
            textStyle = [textStyle, { color: 'red' }]
        }
        return (
            <TouchableOpacity
                style={itemStyle}
                key={i + item.label}
                onPress={() => {
                    this.pressItem(item, i)
                }}
            >
                <Text style={textStyle}>{item.label}</Text>
            </TouchableOpacity>
        )
    }

    /**
     * 点击列表事件
     * @param item 选中数据
     * @param i 选中行数
     */
    pressItem(item, i) {
        let { selectAddress } = this.state;
        const initObj = {
            value: null,
            label: null,
            children: null,
        }
        let tempIndex = 0;
        if (i === 0) {
            selectAddress[0] = item;
            selectAddress[1] = initObj;
            selectAddress[2] = initObj;
            tempIndex = 1
        } else if (i === 1) {
            selectAddress[1] = item;
            selectAddress[2] = initObj;
            tempIndex = 2
        } else {
            selectAddress[2].value = item.value;
            selectAddress[2].label = item.label;
            tempIndex = 2
            let address = [
                {
                    label: selectAddress[0].label,
                    value: selectAddress[0].value
                },
                {
                    label: selectAddress[1].label,
                    value: selectAddress[1].value
                },
                {
                    label: selectAddress[2].label,
                    value: selectAddress[2].value
                }
            ]
            this.props.commitFun && this.props.commitFun(address);
            this.props.dissmissFun && this.props.dissmissFun();
            return null;

        }
        this.setState({ selectAddress });
        InteractionManager.runAfterInteractions(() => {
            this.tabView.goToPage(tempIndex)
        })

    }

    render() {
        const { selectAddress } = this.state;
        return (
            <View style={styles.container}>
                <View style={{ width: width, height: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                    <Text>所在地区</Text>
                </View>
                <ScrollableTabView
                    ref={(tabView) => {
                        this.tabView = tabView;
                    }}
                    renderTabBar={() => <SelectCityTabBar />}
                >
                    {selectAddress.map((obj, i) => {
                        let array = (i === 0) ? AREA_JSON : selectAddress[i - 1].children;
                        if (array) {
                            return (
                                <ScrollView
                                    key={i}
                                    tabLabel={obj.label || '请选择'}
                                    style={styles.scrollStyleList}
                                >
                                    {array && array.map((obj2, j) => {
                                        return this.renderListItem(obj2, i)
                                    })}
                                </ScrollView>
                            )
                        }
                    })}
                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: height * 0.6,
        backgroundColor: '#F5FCFF',
    },
    scrollStyleList: {
        width: width,
        marginBottom: Constant.sizeMarginDefault,
        marginTop: Constant.sizeMarginDefault,
    },
    itemStyle: {
        marginTop: 5,
        width: width,
        height: 35,
        marginLeft: Constant.sizeMarginDefault,
        justifyContent: 'center'
    },
    itemText: {
        fontSize: 15,
        color: '#333333'
    },
})
