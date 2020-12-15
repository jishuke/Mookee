import React, {Component} from 'react';
import {
	View,
	Dimensions,
	Image,
	Text,
	Slider,
	TouchableWithoutFeedback,
	TouchableOpacity,
   StatusBar,
	StyleSheet
} from 'react-native';
import Video from 'react-native-video';
import LogUtil from "../util/LogUtil";
import ViewUtils from "../util/ViewUtils";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

function formatTime(second){
	let h = 0, i = 0, s = parseInt(second);
	if(s > 60){
		i = parseInt(s / 60);
		s = parseInt(s % 60);
	}
	// 补零
	let zero = function(v){
		return (v >> 0) < 10 ? "0" + v : v;
	};
	return [ zero(h), zero(i), zero(s) ].join(":");
}

export default class SldVideoPage extends Component{


	constructor(props){
		super(props);
		this.state = {
			videoUrl: props.navigation.state.params.videoUrl,
			videoCover: props.navigation.state.params.videoCover,
			videoWidth: screenWidth,
			// videoHeight: screenWidth * 9 / 16, // 默认16：9的宽高比
			videoHeight: screenHeight, // 默认16：9的宽高比
			showVideoCover: true,    // 是否显示视频封面
			showVideoControl: false, // 是否显示视频控制组件
			isPlaying: false,        // 视频是否正在播放
			currentTime: 0,        // 视频当前播放的时间
			duration: 0,           // 视频的总时长
			isFullScreen: true,     // 当前是否全屏显示
			playFromBeginning: false, // 是否从头开始播放
            volume : 0
		};

	}


	componentDidMount() : void{

	}

	componentWillUnmount() : void{
	}
    changeVolume () {
        let volume = this.state.volume === 0 ? 1.0 : 0
        console.log(volume,'volume')
        this.setState({
            volume: volume
        },()=>{
            console.log(this.state.volume)
        })
    }
	render(){
		return (

			<View style={ styles.container } >
				<StatusBar hidden={true} backgroundColor={'#000000'} barStyle={ "dark-content" } />
				<View style={ {
					width: this.state.videoWidth,
					height: this.state.videoHeight,
					backgroundColor: '#000000'
				} }>

					<Video
						ref={ (ref) => this.videoPlayer = ref }
						source={ {uri: this.state.videoUrl} }
						rate={ 1.0 }
						volume={ this.state.volume }
						muted={ false }
						paused={ !this.state.isPlaying }
						resizeMode={ 'contain' }
						playWhenInactive={ false }
						playInBackground={ false }
						ignoreSilentSwitch={ 'ignore' }
						progressUpdateInterval={ 250.0 }
						onLoadStart={ this._onLoadStart }
						onLoad={ this._onLoaded }
						onProgress={ this._onProgressChanged }
						onEnd={ this._onPlayEnd }
						onError={ this._onPlayError }
						onBuffer={ this._onBuffering }
						style={ {width: screenWidth, height: screenHeight} }
					/>
					{
						this.state.showVideoCover ?
							<Image
								style={ {
									position: 'absolute',
									top: 0,
									left: 0,
									width: this.state.videoWidth,
									height: this.state.videoHeight
								} }
								resizeMode={ 'cover' }
								source={ {uri: this.state.videoCover} }
							/> : null
					}
					<TouchableWithoutFeedback onPress={ () => { this.hideControl() } }>
						<View
							style={ {
								position: 'absolute',
								top: 0,
								left: 0,
								width: this.state.videoWidth,
								height: this.state.videoHeight,
								backgroundColor: this.state.isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.2)',
								alignItems: 'center',
								justifyContent: 'center'
							} }>
							{
								this.state.isPlaying ? null :
									<TouchableWithoutFeedback onPress={ () => { this.onPressPlayButton() } }>
										<Image
											style={ styles.playButton }
											source={ require('../assets/images/icon_video_play.png') }
										/>
									</TouchableWithoutFeedback>
							}
						</View>
					</TouchableWithoutFeedback>

					{
						this.state.showVideoControl ?
							<View style={styles.headControl}>
								<TouchableOpacity activeOpacity={ 0.3 }
								                  onPress={ () => { this.GoBack() } }>

										<View style={styles.circle}>
											<Image
												tintColor={ '#FFFFFF' }
												style={ styles.goBackButton }
												source={ require('../assets/images/goback.png') }
											/>
										</View>
								</TouchableOpacity>
							</View> : null
					}
					{
						this.state.showVideoControl ?
							<View style={ [ styles.control, {width: this.state.videoWidth} ] }>

								<TouchableOpacity activeOpacity={ 0.3 } onPress={ () => { this.onControlPlayPress() } }>
									<Image
										style={ styles.playControl }
										source={ this.state.isPlaying ? require('../assets/images/icon_control_pause.png') : require('../assets/images/icon_control_play.png') }
									/>
								</TouchableOpacity>
								<Text style={ styles.time }>{ formatTime(this.state.currentTime) }</Text>
								<Slider
									style={ {flex: 1} }
									maximumTrackTintColor={ '#999999' }
									minimumTrackTintColor={ '#00c06d' }
									thumbImage={ require('../assets/images/icon_control_slider.png') }
									value={ this.state.currentTime }
									minimumValue={ 0 }
									maximumValue={ this.state.duration }
									onValueChange={ (currentTime) => { this.onSliderValueChanged(currentTime) } }
								/>
								<Text style={ styles.time }>{ formatTime(this.state.duration) }</Text>
                                <TouchableOpacity activeOpacity={ 0.3 }
                                                  onPress={ () => { this.changeVolume() } }>
                                    <Image
                                        style={ styles.shrinkControl }
                                        source={ this.state.volume === 0 ? require('../assets/images/noVoice.png'):require('../assets/images/hasVoice.png')}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={ 0.3 }
								                  onPress={ () => { this.GoBack() } }>
									<Image
										style={ styles.shrinkControl }
										source={ this.state.isFullScreen ? require('../assets/images/icon_control_shrink_screen.png') : require('../assets/images/icon_control_full_screen.png') }
									/>
								</TouchableOpacity>
							</View> : null
					}
				</View>
			</View>
		)
	}

	/// -------Video组件回调事件-------

	_onLoadStart = () => {
		LogUtil.log('视频开始加载');
	};

	_onBuffering = () => {
		LogUtil.log('视频缓冲中...')
	};

	_onLoaded = (data) => {
		LogUtil.log('视频加载完成');
		this.setState({

			duration: data.duration,
		});
	};

	_onProgressChanged = (data) => {
		LogUtil.log('视频进度更新');
		if(this.state.isPlaying){
			this.setState({
				currentTime: data.currentTime,
			})
		}
	};

	_onPlayEnd = () => {
		LogUtil.log('视频播放结束');
		this.videoPlayer.seek(0);
		this.setState({
			currentTime: 0,
			isPlaying: false,
			playFromBeginning: false
		});
	};

	_onPlayError = () => {
		LogUtil.log('视频播放失败');
	};

	///-------控件点击事件-------

	/// 控制播放器工具栏的显示和隐藏
    hideControl(){
        if(this.state.showVideoControl){
            if(this.timer){
                clearTimeout(this.timer)
            }
            this.timer	= setTimeout(
                () => {
                    this.setState({
                        showVideoControl: false
                    })
                }, 8000)
        } else {
            this.setState(
                {
                    showVideoControl: true,
                },
                // 5秒后自动隐藏工具栏
                () => {
                    console.log(this.state.showVideoControl,'showVideoControl')
                    console.log(this.timer,'this.timer')
                    if(this.timer){
                        clearTimeout(this.timer)
                    }
                    this.timer	= setTimeout(
                        () => {
                            this.setState({
                                showVideoControl: false
                            })
                        }, 8000
                    )
                }
            )

        }


    }
	/// 点击了播放器正中间的播放按钮
	onPressPlayButton(){
		let isPlay = !this.state.isPlaying;
		this.setState({
			isPlaying: isPlay,
			showVideoCover: false
		});
		if(this.state.playFromBeginning){
			this.videoPlayer.seek(0);
			this.setState({
				playFromBeginning: true,
			})
		}
	}

	/// 点击了工具栏上的播放按钮
	onControlPlayPress(){
		this.onPressPlayButton();
	}


	GoBack(){
		ViewUtils.sldHeaderLeftEvent(this.props.navigation)
	}

	/// 进度条值改变
	onSliderValueChanged(currentTime){
		this.videoPlayer.seek(currentTime);
		if(this.state.isPlaying){
			this.setState({
				currentTime: currentTime
			})
		}else{
			this.setState({
				currentTime: currentTime,
				isPlaying: true,
				showVideoCover: false
			})
		}
	}

	/// 屏幕旋转时宽高会发生变化，可以在onLayout的方法中做处理，比监听屏幕旋转更加及时获取宽高变化
	_onLayout = (event) => {
		//获取根View的宽高
		let {width, height} = event.nativeEvent.layout;
		LogUtil.log('通过onLayout得到的宽度：' + width);
		LogUtil.log('通过onLayout得到的高度：' + height);

		// 一般设备横屏下都是宽大于高，这里可以用这个来判断横竖屏
		let isLandscape = (width > height);
		if(isLandscape){
			this.setState({
				videoWidth: width,
				videoHeight: height,
				isFullScreen: true,
			})
		}else{
			this.setState({
				videoWidth: width,
				videoHeight: height,
				isFullScreen: false,
			})
		}
	};

	// -------外部调用事件方法-------
	// 暂停播放，提供给外部调用
	pauseVideo(){
		this.setState({
			isPlaying: false,
		})
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000'
	},
	playButton: {
		width: 50,
		height: 50,
	},
	goBackButton:
		{
			width: 30,
			height: 30,

		},
	playControl: {
		width: 24,
		height: 24,
		marginLeft: 15,
	},
	shrinkControl: {
		width: 15,
		height: 15,
		marginRight: 15,
	},
	time: {
		fontSize: 12,
		color: 'white',
		marginLeft: 10,
		marginRight: 10
	},
	control: {
		flexDirection: 'row',
		height: 44,
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		position: 'absolute',
		bottom: 0,
		left: 0
	},

	headControl: {
		flexDirection: 'row',
		height: 44,
		width:44,
		alignItems: 'center',
		backgroundColor: 'rgba(1, 0, 0, 0)',
		position: 'absolute',
		top: 0,
		left: 0
	},

	circle:{
		marginLeft:10,
		alignItems:'center',
		justifyContent:'center',
		width: 30,
		height:30,
		backgroundColor:'#929292',
		borderRadius:15,
		paddingBottom:2,
		borderColor:'green',
		borderStyle:'solid'
	}
});