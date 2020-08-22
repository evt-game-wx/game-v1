module qmr {
    export class JsUtil {
        //获取QueryString的数组 
        public static getQueryString() {
            var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
            for (var i = 0; i < result.length; i++) {
                result[i] = result[i].substring(1);
            }
            return result;
        }

        //根据QueryString参数名称获取值
        public static getQueryStringByName(name) {
            var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        }

        //根据QueryString参数索引获取值 
        public static getQueryStringByIndex(index) {
            if (index == null) {
                return "";
            }
            var queryStringList = JsUtil.getQueryString();
            if (index >= queryStringList.length) {
                return "";
            }
            var result = queryStringList[index];
            var startIndex = result.indexOf("=") + 1;
            result = result.substring(startIndex);
            return result;
        }

        /**
         * limit=1&h5limit=2
         * @param valueName 
         * @param params 
         */
        public static getValueFromParams(valueName, params) {
            var reg = new RegExp("(^|&)" + valueName + "=([^&]*)(&|$)", "i");
            if (params) {
                var r = params.match(reg);
                if (r) {
                    return decodeURIComponent(r[2]);//unescape
                }
            }
            return null;
        }
    }
}