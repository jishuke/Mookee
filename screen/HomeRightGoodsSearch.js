import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import GoodsTypeSearchCompoent from "./components/GoodsTypeSearchComponent";

var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
import {I18n} from './../lang/index'
export default class RightSreach extends Component {

    constructor(props) {
        super(props);
        this.state = {
            minimumPrice: '',
            highestPrice: ''
        }
    }

    typeCallBack() {

    }

    render() {
        return (<View style={{flex: 1, paddingTop: 80}}>
                <Text style={styles.textItem}>{I18n.t('HomeRightGoodsSearch.Pricerange')}</Text>

                <View style={styles.childContainer}>

                    <TextInput style={[styles.inputItem, {marginRight: 6, color: '#E67F11'}]}
                               underlineColorAndroid='transparent' textAlignVertical={'center'}
                               keyboardType='numeric' maxLength={8} textAlign={'center'}
                               placeholder={I18n.t('HomeRightGoodsSearch.Lowestprice')} value={this.state.minimumPrice}
                               onChangeText={(text) => this.setState({minimumPrice: text})}/>

                    <Text style={{backgroundColor: '#181818', width: 12, height: 0.5}}></Text>

                    <TextInput style={[styles.inputItem, {marginLeft: 6, color: '#E67F11'}]}
                               underlineColorAndroid='transparent' textAlignVertical={'center'}
                               keyboardType='numeric' maxLength={8} textAlign={'center'}
                               placeholder={I18n.t('HomeRightGoodsSearch.Highestprice')} value={this.state.highestPrice}
                               onChangeText={(text) => this.setState({highestPrice: text})}/>
                </View>


                <Text style={styles.textItem}>分类</Text>

                <View style={{flex: 1, height: -50}}>
                    <GoodsTypeSearchCompoent typeCallBack={this.typeCallBack.bind(this)} numColumns={3} screenWidth={ScreenWidth * 0.8}/>
                </View>

                <View style={[styles.splitLine]}/>

                <View style={styles.containerButton}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.buttonStyle}
                        onPress={() => {
                            this.setState({
                                minimumPrice: '',
                                highestPrice: ''
                            })
                        }}>
                        <Text textAlign={'center'} style={{fontSize: 16}}>{I18n.t('export default.Empty')}</Text>
                    </TouchableOpacity>

                    <Text style={[{height: 50, width: 1, backgroundColor: '#999999'}]}/>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.buttonStyle, {backgroundColor: '#E67F11'}]}
                        onPress={() => {
                            this.props.closeControlPanel();
                        }}>
                        <Text textAlign={'center'} style={{fontSize: 16, color: '#ffffff'}}>{I18n.t('export default.ok')}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    childContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        marginLeft: 20,
        marginBottom: 40
    }, inputItem: {
        width: 105,
        paddingTop: 3,
        paddingBottom: 3,
        borderWidth: 0.5,
        borderColor: '#181818'
    }, textItem: {
        color: '#181818',
        fontSize: 16,
        marginLeft: 20

    }, containerButton: {
        height: 50,
        flexDirection: 'row'
    }, buttonStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }, splitLine: {
        height: 0.5,
        backgroundColor: '#999999'
    }
})
