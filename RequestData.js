import LogUtil from './util/LogUtil';
import StorageUtil from './util/StorageUtil';

export default class RequestData {
    /*
     * 封装的get请求
     * @param string url
     * @by slodon
     * */
    static getSldData(url){
        return new Promise((resolve,reject)=>{
            LogUtil.info("get请求接口数据："+url);
            fetch(url,{
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'TOKEN': key || ''
                },
            })
                .then(response=>response.json())
                // .then(response=>response.text())
                .then(result=>{
                    console.log('-------',JSON.stringify(result));
                    LogUtil.info("get接口"+url+"返回数据：\n"+JSON.stringify(result,undefined,2));
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                    LogUtil.info("get接口"+url+"异常："+error.toString());

                })
        })
    }
    /*
     * 封装的post请求
     * @param string url
     * @param json对象 data
     * @by slodon
     * */
    static postSldData(url,data){
        console.log('获取token:', key)

        let formData = new FormData();
        LogUtil.info("post请求接口参数");
        if(data) {
            for(let i in data){
                formData.append(i,data[i])
                LogUtil.info(i+" = "+data[i]);
            }
        }else {
            formData.append('','')
        }

        return new Promise((resolve, reject)=>{
            LogUtil.info("post请求接口地址："+url);
            LogUtil.info("post请求接口参数："+JSON.stringify(formData));

            fetch(url,{
                method:'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'TOKEN': key || ''
                },
                body: formData
            })
                .then(response=> {
                    LogUtil.info(response);
                    return response.json()
                })
                .then(result=>{
                    resolve(result);
                    LogUtil.info("post接口"+url+"返回\n"+JSON.stringify(result,undefined,2));

                })
                .catch(error=>{
                    reject(error);
                    LogUtil.info("post接口"+url+"异常："+error.toString());

                })
        })
    }

    //延时函数
    static delay = (timeOut = 3*1000) =>{
        return new Promise((resolve,reject) =>{
            setTimeout(() =>{
                reject(new Error('request timeout'));
            },timeOut);
        })
    }

    static getSldDataWithTimeout(url){
        return Promise.race([this.getSldData(url), this.delay(3000) ]);
    }
}























