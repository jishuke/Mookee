//日志文件
export default class LogUtil {

	static info(message?: any, ...optionalParams: any[]): void{
		if(__DEV__){
			// debug模式
			console.info(message, optionalParams);
		}
	}

	static log(message?: any, ...optionalParams: any[]): void
	{
		if(__DEV__){
			console.log(message, optionalParams);
		}
	}

}
