import React, {Component} from 'react';
import {
    StyleSheet,
    FlatList,
    TouchableOpacity,
    View,
    Text
} from 'react-native';

var data = ['上衣', 'da衣', 'c衣', 'b衣', '3衣', '上但是粉丝衣', '12衣', '3衣', '4衣', '洗澡', 'n衣', 'm衣'];

export default class Type extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numColumns: props.numColumns,
            screenWidth: this.props.screenWidth / props.numColumns,//计算item的宽度
            itemWidth: 5 * (8 - props.numColumns)//计算item中Text的宽度
        }
    }

    _keyExtractor = (item, index) => item;//根据服务端实际修改key


    _separator = (item) => {
        return <View style={{flex: 1, height: 10}}></View>
    }

    itemOnclick(item, index) {
        this.props.typeCallBack();
    }

    renderItem = ({item}) => (
        <TouchableOpacity activeOpacity={1} style={[styles.itemView, {width: this.state.screenWidth}]}
                          onPress={(item, index) => this.itemOnclick(item, index)}>
            <View style={styles.childContainer}>
                <Text style={[styles.itemText, {width: this.state.screenWidth - this.state.itemWidth}]}
                      lineHeight={1}>{item.valueOf().length > 4 ? item.valueOf().substr(0, 3) + '...' : item.valueOf()}</Text>
            </View>
        </TouchableOpacity>
    )

    render() {
        return (<View style={{paddingBottom: 10}}>
            <FlatList data={data}
                      renderItem={this.renderItem}
                      numColumns={this.state.numColumns}
                      keyExtractor={this._keyExtractor}
                      style={{marginTop: 20}}
                      ItemSeparatorComponent={this._separator}
            />
        </View>)
    }

}

const styles = StyleSheet.create({
    childContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemText: {
        fontSize: 12,
        borderWidth: 0.5,
        padding: 5,
        borderColor: '#181818',
        borderRadius: 2,
        textAlign: 'center',
    },
    itemView: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2
    }
})