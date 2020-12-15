/*
* 封装的列表组件(带分页)
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    StyleSheet, TouchableOpacity, FlatList
} from "react-native";
import ViewUtils from "../util/ViewUtils";
import pxToDp from "../util/pxToDp";

export default class SldFlatList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            horizontal: props.horizontal ? props.horizontal : false,
            numColumns: props.numColumns ? props.numColumns : 1,
        }
    }

    componentDidMount() {

    }

    //头部组件
	header = () => {
        if(this.props.ListHeaderComponent){
           return this.props.ListHeaderComponent()
        }else{
        	    return null;
        }
    }

    render() {
        const {data, refresh_state, show_gotop } = this.props;
        const {horizontal,numColumns} = this.state;
        return (
            <View style={{flex: 1}}>
                <FlatList
                    horizontal={horizontal}
                    numColumns={numColumns}
                    ref={'flatlist'}
                    onRefresh={() => this.props.refresh()}
                    ListHeaderComponent={()=>this.header()}
                    refreshing={refresh_state}
                    keyExtractor={(item, index) => this.props.keyExtractor(item, index)}
                    onEndReachedThreshold={0.3}
                    onScroll={(event) => this.props.handleScroll(event)}
                    onEndReached={() => this.props.getNewData()}
                    ItemSeparatorComponent={() => this.props.separatorComponent()}
                    data={data}
                    renderItem={({item}) => this.props.renderCell(item)}
                />
                {show_gotop && (
                    <TouchableOpacity
                        activeOpacity={1} onPress={() => {
                        this.refs.flatlist.scrollToIndex({animated: true, index: 0});
                    }}
                        style={styles.gotop_btn}>
                        {ViewUtils.getSldImg(114, 114, require('../assets/images/sld_gotop.png'))}
                    </TouchableOpacity>
                )}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    gotop_btn: {
        position: 'absolute',
        zIndex: 2,
        right: pxToDp(40),
        bottom: pxToDp(60)
    },
});
