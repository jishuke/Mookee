
import React,{Component} from 'react';

import { View, StyleSheet, Text, StatusBar, ScrollView,ListView ,TouchableWithoutFeedback} from "react-native";
import Button from "../component/Button";
import CouponCardView from "../component/CouponCardView";

var Dimensions = require("Dimensions");
var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

/**
 * 
 * 优惠券列表
 * @export
 * @class MineCoupanListPage
 * @extends {Component}
 */
export default class MineCoupanListPage extends Component {

    static navigationOptions = ({ navigation }) => ({ title: "优惠券" });

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = { selectIndex: 0, dataSource: ds.cloneWithRows([
            { price: 50, priceDesc: "满200减50", id: "0" },
            { price: 150, priceDesc: "满300减150", id: "1" }
          ]) };
    }

    getTopMenuView(){

        var itemDataSource = [{ title: "未使用" }, { title: "已使用" }, { title: "已失效" }];
        var menuItemW = deviceWidth / itemDataSource.length;
        var menuItemH = 40
        let selectIndex = this.state.selectIndex
        
        var itemViews = [];
        for (var i = 0; i < itemDataSource.length; i++) {
            var titleStr = itemDataSource[i].title;
            var textColorStr = i == this.state.selectIndex ? "#e27700" : "#181818";
            var bgColorStr = i == this.state.selectIndex ? "#e27700" : null;

            var btn = <Button buttonStyle={{ height: menuItemH, width: menuItemW }} 
            title = {titleStr} 
            keyId = {i}
            key = {i}
            textStyle={{ color: textColorStr, fontSize: 16 }}
            underlineBackgroundColor = {bgColorStr} 
            onPress = { (index) => this.onMenuItemClick(index) }
              ></Button>
            itemViews.push(btn)
        }

        // var lineView = <View backgroundColor="#e27700" style={{ height: 2, width: menuItemW, alignItems: "flex-end" }} />;

        return <View typeStr={"0"} style={{ flexDirection: "row", height: menuItemH, alignItems: "center",backgroundColor:"#ffffff" }} >
            {itemViews}
            {/* {lineView} */}
          </View>;

    }

    onMenuItemClick(index) {

        this.setState(previousState => {
            return {selectIndex:index}
        });
    }

    renderCouponComponent(data,section){

        return <CouponCardView data={data}/>
    }

    render() {
    return <View style={styles.container}>
        <StatusBar barStyle={"default"} backgroundColor="#ffffff" />
        {/* navBarView,放最底部，显示在最上面*/}
        {this.getTopMenuView()}
        <ListView
          style={{ width: deviceWidth, height: deviceHeight, marginTop: 0 }}
          showsVerticalScrollIndicator={false}
          dataSource={this.state.dataSource}
          removeClippedSubviews={false}
          renderRow={this.renderCouponComponent} />
      </View>;
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    marginTop: 0
  },
  listView: {
    marginTop: 0,
    left: 0,
    right: 0,
    marginBottom: 0,
    backgroundColor: "red"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
