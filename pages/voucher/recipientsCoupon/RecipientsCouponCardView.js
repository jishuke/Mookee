import React, { Component } from "react";
import { View, Text,Image } from "react-native";
import Button from "../component/Button";
import styles from "../styles/CouponCard.style";

var Dimensions = require("Dimensions");
var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;


//
export default class RecipientsCouponCardView extends Component {
        constructor(props) {
        super(props);
        this.state = { /** 文本是否展开 */

          expanded: false,
          progress: 0

         };
        }
        getCardView() {
        var views = [];

        var topBgView = <Image key={"bg"} source={require("../images/couponBgImage.png")} style={styles.bgImage} resizeMode="contain" />;
        views.push(topBgView);

        var newPersonLog = <Image key={"newimage"} source={require("../images/couponNewPerson.png")} style={styles.newPersonLog} />;
        views.push(newPersonLog);

        var amount = <Text style={styles.amount} key={"tx"}>
            {this.props.data.price}
            <Text style={styles.money}>元</Text>
            </Text>;
        views.push(amount);

        var title = <Text style={styles.title} key={"title"}>
            {this.props.data.priceDesc}
            </Text>;
        views.push(title);

        var date = <Text style={styles.date} key={"date"}>
            2018.2.12-2018.3.14
            </Text>;
        views.push(date);

        // 已抢进度条
        // var progress = <TSProgressView progress={0.50} progressStyle={{ borderRadius: 5 }} progressColor={"#e58011"} style={styles.progress} />;
        // var progressView = <View key={"progressView"} style={styles.progressView}>
        //     <Text style={styles.progressTitle}>已抢50%</Text>
        //     {progress}
        //   </View>;
        // views.push(progressView);

        //是否可以领用
        // var bgColor = this.state.used ? "#9f9f9f" : "#e6cd10";//是否可以领用的背景颜色
        // var titleColor = this.state.used ? "#333333" : "#636363";//是否可以领用的title颜色
        // var recView = <View key={"recView"} style={[styles.recView,{backgroundColor:bgColor}]}>
        //     <Text style={[styles.recViewTitle,{titleColor:titleColor}]}>领用</Text>
        //     <Text style={[styles.recViewDesc,{titleColor:titleColor}]}>14:21:44</Text>
        //   </View>;
        // views.push(recView);

        // 已领用标识
        var receiveView = <View key={"receiveView"} style={styles.receiveView}>
            <Text style={styles.receiveViewTitle}>已领用</Text>
            <Image style={styles.receiveViewImage} source={require("../images/receivedCoupon.png")} />
          </View>;
        views.push(receiveView);

        //去使用
        var btn = <Text style={styles.userText}>去使用</Text>;
        var btnView = <View style={[styles.userView,{top:39,height:36}]} key={"btnv"}>
            {btn}
          </View>;
        views.push(btnView);



        var image = this.state.expanded ? require("../images/arrow-up.png") : require("../images/arrow-down.png");
        var numberOfLines = this.state.expanded ? 0 : 1;
        var desText = <Text numberOfLines={numberOfLines} style={styles.desText} key={"des"}>
            CollapsibleText11112212112122121122121,CollapsibleText11112212112122121122121,CollapsibleText11112212112122121122121
            </Text>;

        var arrowImage = <Button key={"arrow"} buttonStyle={styles.arrowImage} iconStyle={styles.arrowImage} iconSource={image} onPress={() => this.onArrowImageClick()} />;
        var bottomBgView = <View style={styles.bottomBgView} key={"bottom"}>
            {desText}
            {arrowImage}
            </View>;
        views.push(bottomBgView);
            var bgView = <View
                style={styles.bgView}
            >
                {views}
            </View>;
        return bgView;
        }

        onArrowImageClick() {
        this.setState(previousState => {
            return { expanded: !previousState.expanded };
        });
        }

        render() {
        return <View style={styles.container}>
            {this.getCardView()}
            </View>;
        }
    }


