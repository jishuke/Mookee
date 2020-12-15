/*
* 发现
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import ViewUtils from "../util/ViewUtils";
import NavigationBar from '../component/NavigationBar';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import DiyPage from "../component/DiyPage";
import {I18n} from './../lang/index'

export default class FoundScreen extends Component {

    constructor(props){

        super(props);
        this.state={
            diyData: [],
            diy_data: [],
        }
    }
    componentDidMount() {
        this.getDiyData();
    }

    getDiyData(){
        RequestData.getSldData(AppSldUrl+'/index.php?app=index&mod=topic&activity_type=wapcmshome').then(res=>{
            if(res.code==200){
                this.setState({
                    diyData: res.datas
                },()=>{
                    this.handleData()
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    handleData = () => {
        let datainfo = this.state.diyData;
        for(let i=0;i<datainfo.length;i++){
            if(datainfo[i]['type'] == 'lunbo'){
                let new_data = datainfo[i]['data'];
                let new_image_info = ViewUtils.handleIMage(datainfo[i]['width'],datainfo[i]['height']);
                datainfo[i]['width'] = new_image_info.width;
                datainfo[i]['height'] = new_image_info.height;
            }else if(datainfo[i]['type'] == 'dapei'){
                let new_data = datainfo[i];
                let new_image_info = ViewUtils.handleIMage(datainfo[i]['width'],datainfo[i]['height']);
                datainfo[i]['width'] = new_image_info.width;
                datainfo[i]['height'] = new_image_info.height;
            }else if(datainfo[i]['type'] == 'tupianzuhe'){
                if(datainfo[i]['sele_style'] == 0){
                    let new_data = datainfo[i]['data'];
                    for(let j=0;j<new_data.length;j++){
                        let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'],datainfo[i]['data'][j]['height']);
                        datainfo[i]['data'][j]['width'] = new_image_info.width;
                        datainfo[i]['data'][j]['height'] = new_image_info.height;
                    }
                }else if(datainfo[i]['sele_style'] == 1){
                    let new_data = datainfo[i]['data'];
                    for(let j=0;j<new_data.length;j++){
                        let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'],datainfo[i]['data'][j]['height'],scrWidth*1-20);
                        datainfo[i]['data'][j]['width'] = new_image_info.width;
                        datainfo[i]['data'][j]['height'] = new_image_info.height;
                    }
                }else if(datainfo[i]['sele_style'] == 2){
                    let new_data = datainfo[i]['data'];
                    for(let j=0;j<new_data.length;j++){
                        let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'],datainfo[i]['data'][j]['height'],Math.floor((scrWidth*1-30)/2));
                        datainfo[i]['data'][j]['width'] = new_image_info.width;
                        datainfo[i]['data'][j]['height'] =  new_image_info.height;
                    }
                }else if(datainfo[i]['sele_style'] == 3){
                    let new_data = datainfo[i]['data'];
                    for(let j=0;j<new_data.length;j++){
                        let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'],datainfo[i]['data'][j]['height'],Math.floor((scrWidth*1-40)/3));
                        datainfo[i]['data'][j]['width'] = new_image_info.width;
                        datainfo[i]['data'][j]['height'] = new_image_info.height;
                    }
                }else if(datainfo[i]['sele_style'] == 4){
                    let new_data = datainfo[i]['data'];
                    for(let j=0;j<new_data.length;j++){
                        if(j==0){
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
                            datainfo[i]['data'][j]['height'] = Math.floor(datainfo[i]['data'][j]['width']*16/15);
                        }else if(j==1||j==2){
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
                            datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-30)/4);
                        }
                    }
                }else if(datainfo[i]['sele_style'] == 5){
                    let new_data = datainfo[i]['data'];
                    for(let j=0;j<new_data.length;j++){
                        if(j==0||j==3){
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/3);
                            datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
                        }else if(j==1||j==2){
                            datainfo[i]['data'][j]['width'] = scrWidth*1-30-Math.floor((scrWidth*1-30)/3);
                            datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-30)/3);
                        }
                    }
                }else if(datainfo[i]['sele_style'] == 6){
                    let new_data = datainfo[i]['data'];
                    for(let j=0;j<new_data.length;j++){
                        if(j==0||j==3){
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
                            datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-30)/4);
                        }else if(j==1||j==2){
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
                            datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
                        }
                    }
                }else if(datainfo[i]['sele_style'] == 7){
                    let new_data = datainfo[i]['data'];
                    for(let j=0;j<new_data.length;j++){
                        if(j==4){
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-40)/3);
                            datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-40)/10*7);
                        }else {
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-40)/3);
                            datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
                        }
                    }
                }
            }

        }
        this.setState ( {
            diy_data : datainfo
        } );
    }

    render() {
        const {diy_data} = this.state;
        console.log(diy_data)
        return (
            <View style={GlobalStyles.sld_container}>
                <NavigationBar
                    statusBar={{barStyle: "dark-content"}}
                    title={I18n.t('NewScreen.found')}
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                <View style={GlobalStyles.line}/>

                <ScrollView style={ {flex: 1} }>
                    { diy_data.length > 0 && diy_data.map((item, index) => {
                        return (<DiyPage key={ index } navigation={ this.props.navigation } data={ item }/>)
                    })
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    webView:{
        borderBottomColor:'#fff',
        backgroundColor:"#0000",
        marginTop: 0,
        left: 0,
        right: 0,
        marginBottom: 0,
    },
});
