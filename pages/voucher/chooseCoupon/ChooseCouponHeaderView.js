import React, { Component } from "react";
import { View, StyleSheet,Image, Text } from "react-native";

export default class ChooseCouponHeaderView extends Component {

    constructor(props) {
      super(props);
      this.state = {
        //是否选中
        choose:false,
      };

    }
   getSubview(){

     var imageStr = this.state.choose?require("../images/useCoupon.png"): require("../images/nonuseCoupon.png");
     var image = <Image style={styles.image} source={imageStr}/>;

      var bgView = <View style={styles.bgView}>
          <Text style={styles.title}>暂不使用优惠券</Text>
          {image}
        </View>;
      return bgView;

   }
   pressHandler(){

        this.setState(previousState => {
          return { choose: !previousState.choose };
        });
   }

    render() {
    return <View style={styles.container}>
        <TouchableWithoutFeedback activeOpacity={0.5} underlayColor={"transparent"} onPress={() => this.pressHandler()}>
          {this.getSubview()}
        </TouchableWithoutFeedback>
      </View>;
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "",
    marginTop: 0
  },
  bgView: {
    marginTop: 16,
    marginLeft: 17,
    marginRight: 17,
    height: 45,
    borderRadius: 2,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e74310",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  title: {
    fontSize: 15,
    textAlign: "center",
    color: "#e74310"
  },
  image: {
    width: 17,
    height: 17,
    right: 20,
    position: "absolute"
  }
});
