/**
 * 密码输入框组件
 * */
import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput
} from "react-native";

export default class PasswordInput extends Component{
    constructor(props) {
        super(props)
    }

    //弹出键盘
    showKeyboard() {
        this.textInput.focus()
    }

    render() {
        const { style, autoFocus, callBack, value } = this.props
        return (
            <View style={[styles.container, style]}>
                <View style={{flexDirection:'row', justifyContent:'center'}}>
                    {
                        [1,2,3,4,5,6].map((item, index) => {
                            return (
                                <View
                                    key={index}
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: style && style.height ? style.height-1 : 39,
                                        borderLeftWidth: index === 0 ? 0 : 1,
                                        borderLeftColor: index === 0 ? null : style && style.borderColor ? style.borderColor : '#333333'
                                    }}
                                >
                                    <Text style={{fontSize: 13, color: '#000', textAlign: 'center'}}>
                                        {index < value.length ? '●' : ''}
                                    </Text>
                                </View>
                            )
                        })
                    }
                </View>
                <TextInput
                    ref={ref => this.textInput = ref}
                    style={[
                        styles.textInput,
                        {
                            height: style && style.height ? style.height : 40
                        }
                    ]}
                    maxLength={6}
                    autoFocus={autoFocus}
                    caretHidden={true}
                    underlineColorAndroid={'transparent'}
                    keyboardType={'numeric'}
                    value={value}
                    onChangeText={text => {
                        if (text) {
                            callBack(text)
                        } else {
                            callBack('')
                        }
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 5.0,
        borderColor: '#333333',
        borderWidth: 1.0
    },
    textInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        color: 'rgba(0,0,0,0)',
        backgroundColor: 'rgba(0,0,0,0)'
    }
});
