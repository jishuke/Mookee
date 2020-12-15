
import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback
} from "react-native";

import LinearGradient  from "react-native-linear-gradient";
import Button from "./Button";
import styles from "../styles/CouponCard.style";
import Dash from 'react-native-dash';

var Dimensions = require("Dimensions");
var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;
//
export default class CouponCardView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            /** 文本是否展开 */
            expanded: false,
            //是否选中
            choose:false,
            //0 优惠券列表 1领用优惠券 2选择优惠券 defaul 0
            typeStr:'-1'
        };

    }
    getCardView(){

        var views = [];

        var topBgView = <LinearGradient key={"bg"}  start={{ x: 0, y: 0 }} end={{ x:1, y: 0 }} colors={["#ff8781", "#ea5264"]} style={styles.bgImage} />;
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



        // 列表
        if (this.state.typeStr == "0") {

            var btn = <Text style={styles.userText}>去使用</Text>;
            var btnView = <View style={styles.userTView} key={"btnv"}>
                {btn}
            </View>;
            views.push(btnView);
        }


        //选择
        if (this.props.typeStr == "2") {

            //是否选择图片
            var image = this.state.choose ? require("../images/couponChoose.png") : require("../images/couponUnchoose.png");
            var chooseView = <Image key={"chooseView"} style={styles.chooseView} source={image} />;
            views.push(chooseView);

        }

        var dayView = <View style={styles.dayView} key={"dayview"}>
            <Text style={styles.dayText}>仅剩</Text>;
            <View style={styles.dayView1}>
                <Text style={styles.dayText}>3</Text>;
            </View>
            <Text style={styles.dayText}>天</Text>;
        </View>;
        views.push(dayView);

        var dash = <Dash key ={"dash"} dashGap={3} dashLength={3} dashThickness={3} dashColor={"#fff"} style={styles.dash} />;
        views.push(dash);

        var numberOfLines = this.state.expanded ? 0 : 1;
        var desText = <Text numberOfLines={numberOfLines} style={styles.desText} key={"des"}>
            CollapsibleText11112212112122121122121,CollapsibleText11112212112122121122121,CollapsibleText11112212112122121122121
        </Text>;
        var image = this.state.expanded ? require("../images/arrow-up.png") : require("../images/arrow-down.png");
        var arrowImage = <Button key={"arrow"} buttonStyle={styles.arrowImage} iconStyle={styles.arrowImage} iconSource={image} onPress={() => this.onArrowImageClick()} />;
        var bottomBgView = <View style={styles.bottomBgView} key={"bottom"}>
            {desText}
            {arrowImage}
        </View>;
        views.push(bottomBgView);


        var leftPoint = <View style={styles.leftPoint} />
        views.push(leftPoint);
        var rightPoint = <View style={styles.rightPoint} />;
        views.push(rightPoint);

        var bgView = <View style={styles.bgView} >
            {views}
        </View>;
        return bgView;

    }

    onArrowImageClick(){

        this.setState(previousState => {
            return { expanded: !previousState.expanded };
        });

    }

    pressHandler(){
        if(this.props.typeStr == '2'){
            this.setState(previousState => {
                return { choose: !previousState.choose };
            });
        }


    }

    render() {
        return <View style={styles.container}>
            <TouchableWithoutFeedback activeOpacity={0.5} underlayColor={"transparent"} onPress={() => this.pressHandler()}>
                {this.getCardView()}
            </TouchableWithoutFeedback>
        </View>;
    }
}
