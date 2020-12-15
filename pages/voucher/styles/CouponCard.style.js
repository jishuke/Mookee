
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,

        marginTop: 0
    },

    bgView: {
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 15,
        overflow: "hidden"
    },
    bottomBgView: {
        backgroundColor: "#f36b70",
        flexDirection: "row"
    },
    bgImage: {
        width: "100%",
        height: 93
    },
    newPersonLog: {
        top: 0,
        width: 108,
        height: 25,
        left: 15,
        position: "absolute"
    },
    amount: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "left",
        top: 34,
        height: 33,
        left: 21,
        position: "absolute"
    },

    money: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "left",
        fontSize: 16
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "left",
        fontSize: 16,
        top: 28,
        height: 17,
        left: 132,
        position: "absolute"
    },

    date: {
        color: "#fff",
        textAlign: "left",
        fontSize: 11,
        top: 58,
        height: 11,
        left: 132,
        position: "absolute"
    },

    userView: {
        backgroundColor: "#f3d9da",
        justifyContent: "center",
        top: 21,
        height: 23,
        width: 69,
        right: 10,
        position: "absolute",
        borderRadius: 5
    },
    userText: {
        color: "#c24651",
        textAlign: "center",
        fontSize: 13
    },
    dayView: {
        flexDirection: "row",
        justifyContent: "center",
        top: 56,
        height: 15,
        right: 20,
        position: "absolute"
    },
    dayText: {
        textAlign: "center",
        color: "#fffe03",
        fontSize: 13
    },
    dayView1: {
        paddingLeft: 4,
        paddingRight: 4,
        marginLeft: 2,
        marginRight: 2,
        backgroundColor: "#bb4451",
        borderRadius: 2
    },
    desText: {
        color: "#832a29",
        fontSize: 13,
        marginTop: 18,
        marginRight: 50,
        marginLeft: 17,
        marginBottom: 16
    },

    arrowImage: {
        width: 12,
        height: 12,
        top: 10,
        right: 12,
        position: "absolute"
    },
    progressView: {
        right: 13,
        width: 75,
        height: 100,
        top: 11,
        position: "absolute"
    },

    progress: {
        height: 10,
        width: 75,
        marginTop: 5,
        // right: 13,
        backgroundColor: "#e9ab6b",
        borderRadius: 5
        // position: "absolute"
    },
    progressTitle: {
        height: 11,
        fontSize: 10,
        color: "#ffffff",
        textAlign: "center"
    },

    recView: {
        width: 75,
        height: 41,
        top: 41,
        right: 14,
        position: "absolute",
        borderRadius: 2,
        backgroundColor: "#e6cd10"
    },
    recViewTitle: {
        width: 75,
        height: 16,
        marginLeft: 0,
        marginTop: 6,
        textAlign: "center",
        fontSize: 15,
        color: "#333333"
    },
    recViewDesc: {
        width: 75,
        height: 13,
        marginLeft: 0,
        marginBottom: 5,
        textAlign: "center",
        fontSize: 12,
        color: "#333333"
    },

    receiveView: {
        flexDirection: "row-reverse",
        height: 13,
        top: 17,
        right: 19,
        width: 100,
        position: "absolute"
    },
    receiveViewTitle: {
        height: 13,
        marginRight: 0,
        fontSize: 12,
        color: "#ffffff"
    },
    receiveViewImage: {
        marginRight: 2,
        height: 12,
        width: 12
    },
    chooseView: {
        width: 22,
        height: 22,
        top: 15,
        right: 16,
        position: "absolute"
    },
    dash: {
        height: 3,
        top: 90,
        right: 16,
        left: 16,
        position: "absolute"
    },

    leftPoint: {
        backgroundColor: "#f6f6f6",
        height: 16,
        width: 8,
        top: 85,
        left: 0,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        position: "absolute"
    },
    rightPoint: {
        backgroundColor: "#f6f6f6",
        height: 16,
        width: 8,
        top: 85,
        right: 0,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        position: "absolute"
    }
});
export default styles;

// borderBottomLeftRadius?: number;
