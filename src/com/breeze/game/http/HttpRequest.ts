module qmr
{
	/**
	 *
	 * @description 做一些Http请求封装类
	 *
	 */
    export class HttpRequest
    {

        /** 发送信息作为日志 */
        // public static sendPostToLog(url: string, args: any, callback?: Function, thisObject?: any): void
        // {
        //     if (GlobalConfig.bIsReportLog == true)
        //     {
        //         args["account"] = GlobalConfig.account;
        //         this.sendPost(url, args, callback, thisObject);
        //     }
        // }

		/**
		 * @description 发送post请求
		 */
        public static sendPost(url: string, args: any, callback?: Function, thisObject?: any): void
        {
            let requestData: string = "";
            let index: number = 0;
            for (let key in args)
            {
                if (index == 0)
                {
                    requestData += key + "=" + args[key];
                } else
                {
                    requestData += "&" + key + "=" + args[key];
                }
                index++;
            }
            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.POST);
            request.send(requestData);
            request.addEventListener(egret.Event.COMPLETE, function (evt: egret.Event)
            {
                if (callback)
                {
                    callback.call(request.response);
                }
            }, this)
        }
		/**
		 * @description 发送GET请求
		 */
        public static sendGet(url: string, callback: Function, thisObject: any): void
        {
            let request = new egret.HttpRequest();
            request.timeout = 10000;
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.GET);
            request.send(null);
            request.addEventListener(egret.Event.COMPLETE, function (evt: egret.Event)
            {
                if (callback)
                {
                    callback.call(thisObject, request.response);
                }
            }, this)
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (e)
            {
                // console.log("=========================================打点回调数据》》》："+request.response,e.type,e.data,e.currentTarget);
            }, this);
        }
    }
}
