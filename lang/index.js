import I18n,{ getLanguages } from 'react-native-i18n';
import en from './en/index';
import zh from './zh/index';
import myn from './myn/index';
import StorageUtil from "../util/StorageUtil";

const LANGUAGE_CHINESE = 1;
const LANGUAGE_ENGLISH = 2;
const LANGUAGE_MIANWEN = 3;

//默认为中文
I18n.defaultLocale = 'zh';

// I18n.locale = 'en';

/*
* 官方推荐
* 本例只有一个en.js,假如系统返回的语言格式en-US或en-GB,I18n会自动寻找 en-US.js或en-GB.js,如果找不到会接着找 en.js
* Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
*/
I18n.fallbacks = true;
//支持转换的语言
I18n.translations = {
    en,
    zh,
    myn
};

function initLanguageFromCache() {
    StorageUtil.get('language', (error, object)=>{
        if(!error && object){
            setLanguage(object);
        }
    });
}

function setLanguage(language) {
    if (language === LANGUAGE_CHINESE){
        I18n.locale = 'zh';
    } else if (language === LANGUAGE_ENGLISH){
        I18n.locale = 'en';
    } else {
        I18n.locale = 'myn';
    }
}

export {
    LANGUAGE_CHINESE,
    LANGUAGE_ENGLISH,
    LANGUAGE_MIANWEN,
    I18n,
    getLanguages,
    initLanguageFromCache,
    setLanguage
}


