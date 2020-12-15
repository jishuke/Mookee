import React, {Component} from 'react';
import HomeTypeComponent from "./HomeTypeComponent";

export default class HomePageComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            position: this.props.position,
            id: this.props.catid,
            navigation: this.props.navigation
        }
    }

    render() {
	    return (<HomeTypeComponent id={this.state.id}
	                               navigation={this.props.navigation}/>)
        // if (this.state.position == 0) {
        //     return (<HomeMainComponent navigation={this.props.navigation}/>)
        // } else if (this.state.position == 1) {
        //     return (<HomeTimeLimit navigation={this.props.navigation}/>)
        // } else if (this.state.position == 2) {
        //     return (<HomeQuanComponent navigation={this.props.navigation}/>)
        // } else {
        //     return (<HomeTypeComponent id={this.state.id}
        //                                navigation={this.props.navigation}/>)
        // }
    }

}
