import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	Image,
	AppState,
	Dimensions,
	DeviceEventEmitter,
} from 'react-native';
import pxToDp from "../util/pxToDp";
import {I18n} from './../lang/index'
const PropTypes = require('prop-types');
import ProgressBar from './ProgressBar';
import CodePush from "react-native-code-push";
import LogUtil from '../util/LogUtil'

const {height, width} = Dimensions.get('window');
let SWidth, SHeight;

if(height > width){
	SWidth = width;
	SHeight = height;
}else{
	SWidth = height;
	SHeight = width;
}

export const ImmediateCheckCodePush = () => {
	DeviceEventEmitter.emit('ImmediateCheckCodePush');
};

class HotUpdate extends Component{

	constructor(props){
		super(props);
		this.listener;
		this.currProgress = 0.0;
		this.syncMessage = '';
		this.state = {
			showUpdate: false,
			isSync: false,
			update: false,
			syncStatus: '',
			isMandatory: false,
			next: false,
			currProgress: 0.0,
			updateInfo: {}
		}
	}

	static propTypes = {
		/**
		 *  code-push deploymentKey 非必须参数,没有会读取原生的;
		 */
		deploymentKey: PropTypes.string,
		/**
		 *  code-push CheckFrequency 检查更新策略,只提供2种, true 每次返回前台就更新(高频率), false 只有 App 启动才检测更新, 默认 true;
		 */
		isActiveCheck: PropTypes.bool,
	};

	static defaultProps = {
		isActiveCheck: true,
	};


	componentWillMount(){
		CodePush.disallowRestart();
	}

	componentDidMount(){
		CodePush.allowRestart();
		if(this.props.isActiveCheck){
			AppState.addEventListener('change', this._handleAppStateChange);
		}
		this._handleAppStateChange('active');

		this.listener = DeviceEventEmitter.addListener('ImmediateCheckCodePush', (e) => {
			this.setState({next: false}, () => {
				this._handleAppStateChange('active');
			});
		});
	}

	componentWillUnmount(){
		if(this.props.isActiveCheck){
			AppState.removeEventListener('change')
		}
		this.listener && this.listener.remove();
	}

	_handleAppStateChange = (nextAppState) => {
		LogUtil.log('-------_handleAppStateChange------', nextAppState);
		if(nextAppState === 'active'){
			this.syncImmediate();
		}
	};


	syncImmediate(){
		if(!this.state.next){
			CodePush.checkForUpdate(this.props.deploymentKey).then((update) => {
				LogUtil.log('-------CodePush-------检测热更新包--');
				LogUtil.log(update);
				if(update){
					this.setState({showUpdate: true, updateInfo: update, isMandatory: update.isMandatory})
				}
			})
		}
	}

	_immediateUpdate(){
		if(!this.state.isSync){
			this.setState({isSync: true}, () => {
				let codePushOptions = {
					installMode: CodePush.InstallMode.ON_NEXT_RESTART,
					mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
				};
				if(this.props.deploymentKey){
					codePushOptions.deploymentKey = this.props.deploymentKey;
				}
				CodePush.sync(
					codePushOptions,
					this.codePushStatusDidChange.bind(this),
					this.codePushDownloadDidProgress.bind(this)
				);
			});
		}
	}

	codePushStatusDidChange(syncStatus){
		LogUtil.log('-codePushStatusDidChange-');
		LogUtil.log(syncStatus);
		let syncMessage = this.state.syncMessage;
		switch(syncStatus){
			case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
				this.syncMessage = 'Checking for update';
				syncMessage = I18n.t('com_HotUpdate.text1')+'...';
				break;
			case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
				this.syncMessage = 'Downloading package';
				syncMessage = I18n.t('com_HotUpdate.text2')+'...';
				break;
			case CodePush.SyncStatus.AWAITING_USER_ACTION:
				this.syncMessage = 'Awaiting user action';
				syncMessage = I18n.t('com_HotUpdate.text3')+'...';
				break;
			case CodePush.SyncStatus.INSTALLING_UPDATE:
				this.syncMessage = 'Installing update';
				syncMessage = I18n.t('com_HotUpdate.text4')+'...';
				break;
			case CodePush.SyncStatus.UP_TO_DATE:
				this.syncMessage = 'App up to date.';
				syncMessage = I18n.t('com_HotUpdate.text5')+'...';
				break;
			case CodePush.SyncStatus.UPDATE_IGNORED:
				this.syncMessage = 'Update cancelled by user';
				syncMessage = I18n.t('com_HotUpdate.text6')+'...';
				break;
			case CodePush.SyncStatus.UPDATE_INSTALLED:
				this.syncMessage = 'Update installed and will be applied on restart.';
				this.setState({showUpdate: false});
				syncMessage = I18n.t('com_HotUpdate.text7')+'!';
				break;
			case CodePush.SyncStatus.UNKNOWN_ERROR:
				this.syncMessage = 'An unknown error occurred';
				syncMessage = I18n.t('com_HotUpdate.text8')+'!';
				this.setState({showUpdate: false});
				break;
		}
		LogUtil.log(syncMessage);
	}

	codePushDownloadDidProgress(progress){
	//	LogUtil.log('-codePushDownloadDidProgress------');
	//	LogUtil.log(progress);
		if(this.state.isSync){
			let temp = parseFloat(progress.receivedBytes / progress.totalBytes).toFixed(2);
			this.setState({currProgress: temp}, () => {
				this.currProgress = temp;
				if(temp >= 1){
					this.setState({update: true});
					// if(!this.state.isMandatory){
					// 	this.setState({update: true});
					// }
				}else{
					this.refs.progressBar.progress = temp;
					this.refs.progressBar.buffer = temp > 0.2 ? temp - 0.1 : 0;
				}
			});
		}
	}

	render(){
		return <Modal visible={ this.state.showUpdate } onRequestClose={() => {}} transparent={ true }>
			<View style={ styles.update }>
				<View style={ styles.update_main }>
					<Image style={ styles.update_img } source={ require('../assets/images/updateBg.png') }/>

					<View style={ styles.update_con_wrap }>
						<Text style={ styles.update_title }>{I18n.t('com_HotUpdate.text9')}：</Text>

						<Text style={ styles.update_content }>{ this.state.updateInfo.description }</Text>

						{ this.state.update ? <TouchableOpacity
							activeOpacity={ 1 }
							style={ styles.update_btn }
							onPress={ () => {
								CodePush.restartApp(true);
							} }
						>
							<Text style={ styles.update_btn_txt }>{I18n.t('com_HotUpdate.text10')}</Text>
						</TouchableOpacity> : (
							this.state.isSync ? <View style={ styles.pro }>
									<ProgressBar ref="progressBar" currProgress={ this.state.currProgress }/>
								</View>
								:
								<TouchableOpacity
									activeOpacity={ 1 }
									style={ styles.update_btn }
									onPress={ () => this._immediateUpdate() }
								>
									<Text
										style={ styles.update_btn_txt }>{ this.state.isMandatory ? I18n.t('com_HotUpdate.update_now') : I18n.t('com_HotUpdate.Download_update_now') }</Text>
								</TouchableOpacity>
						) }

					</View>

					{ !this.state.isMandatory && <TouchableOpacity
						activeOpacity={ 1 }
						style={ styles.close_update }
						onPress={ () => {
							this.setState({showUpdate: false, next: true})
						} }
					>
						<Image style={ styles.close_update_img } source={ require('../assets/images/closeUpdate.png') }
						       resizeMode={ "contain" }/>
					</TouchableOpacity> }

				</View>
			</View>
		</Modal>
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'absolute',
		left: 0, right: 0, top: 0, bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.3)',
		height: SHeight,
		width: SWidth,
		alignItems: 'center',
		justifyContent: 'center'
	},
	update: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		width: width,
		height: height,
		backgroundColor: 'rgba(38, 38, 38, 0.87)',
		zIndex: 9999,
		justifyContent: 'center'
	},
	update_main: {
		position: 'absolute',
		left: SWidth * 0.15,
		paddingBottom: pxToDp(60)
	},
	update_img: {
		width: width * 0.758,
		height: width * 0.444,
	},
	update_con_wrap: {
		width: width * 0.7,
		backgroundColor: '#fff',
		borderBottomRightRadius: pxToDp(10),
		borderBottomLeftRadius: pxToDp(10),
		paddingHorizontal: pxToDp(41),
		paddingTop: pxToDp(10),
		marginTop: pxToDp(-1)
	},
	update_title: {
		color: '#2D2D2D',
		fontSize: pxToDp(26),
		lineHeight: pxToDp(45),
	},
	update_content: {
		color: '#949494',
		fontSize: pxToDp(22),
		lineHeight: pxToDp(33),
		minHeight: pxToDp(132)
	},
	update_btn: {
		marginVertical: pxToDp(30),
		width: pxToDp(247),
		height: pxToDp(48),
		borderRadius: pxToDp(24),
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FF5034',
		marginHorizontal: (width * 0.7 - pxToDp(329)) / 2,
	},
	update_btn_txt: {
		color: '#fff',
		fontSize: pxToDp(24),
		fontWeight: '600'
	},
	close_update: {
		position: 'absolute',
		bottom: pxToDp(6),
		right: width * 0.15 - pxToDp(34),
		width: pxToDp(34),
		height: pxToDp(54)
	},
	close_update_img: {
		width: pxToDp(34),
		height: pxToDp(54)
	},
	pro: {
		marginVertical: pxToDp(30),
		height: pxToDp(48),
		marginHorizontal: (width * 0.7 - pxToDp(518)) / 2,
	}
});

const codePushOptions = {
	checkFrequency: CodePush.CheckFrequency.MANUAL,
	updateDialog: null,
};
export default CodePush(codePushOptions)(HotUpdate);
