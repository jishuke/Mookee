
export default class PriceUtil {

    static formatPrice(price) {
      if(price === null || price === '' || typeof(price) === undefined){
        return "";
      }else {
        price = parseInt(price).toString();
        let arr = [];
        let pos = 0;
        for (let i = price.length - 1; i >= 0; i--) {
          pos += 1;
          arr.push(price[i]);
          if (pos % 3 === 0 && pos !== price.length) {
            arr.push(",");
          }
        }
        return arr.reverse().join('');
      }
	  }
}
