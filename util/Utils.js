export default class Utils {

    static isEng(text) {
        let reg = /^[a-zA-Z ]*$/
        console.log("length: " + text.replace(reg, '').length);
        return text.replace(reg, '').length === 0
    }

    static isNum(text) {
        let reg = /[0-9]/g;
        return text.replace(reg, '').length === 0
    }

    static formatAccount(account) {
        var name = "";
        if (account.length === 11) {
            name = account.substring(0, 3) + "*****" + account.substring(account.length - 4);
        } else if (account.length === 16) {
            name = "*****" + account.substring(account.length - 4);
        } else {
            name = account;
        }

        return name;
    }
}