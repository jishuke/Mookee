import React, { Component } from "react";

import {
  View,
  StyleSheet,
  StatusBar,
  ListView
} from "react-native";

import RecipientsCouponCardView from "./RecipientsCouponCardView";


var Dimensions = require("Dimensions");
var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

/**
 *
 * 领券中心
 * @export
 * @class RecipientsCouponPage
 * @extends {Component}
 */
export default class RecipientsCouponPage extends Component {

    static navigationOptions = ({ navigation }) => ({ title: "领券中心" });

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = { selectIndex: 0, dataSource: ds.cloneWithRows([
            { price: 50, priceDesc: "满200减50", id: "0" },
            { price: 150, priceDesc: "满300减150", id: "1" }
          ]) };
    }

      renderCouponComponent(data,section){

        return <RecipientsCouponCardView data={data} />;
    }

    render() {
    return <View style={styles.container}>
        <StatusBar barStyle={"default"} backgroundColor="#ffffff" />
        {/* navBarView,放最底部，显示在最上面*/}
        {/* {this.getTopMenuView()} */}
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
