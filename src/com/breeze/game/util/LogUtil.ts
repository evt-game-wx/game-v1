module qmr
{
	export class LogUtil
	{
		public static errorLogRequest: egret.HttpRequest;
		public static errorLogUrl: string = "v1/artisan/uploadlog";
		public static reportLogData = {};
		/**
		 * @description 打印普通日志
		 */
		public static log(msg: any, ...optionalParams: any[]): void
		{
			if (qmr.PlatformConfig.isDebug)
			{
				console.log(msg, ...optionalParams);
			}
		}

		/** 保存并且打印日志 */
		public static saveLogAndShowLog(logKey, msg: any): void
		{
			LogUtil.reportLogData["logKey"] = msg;
			egret.log(msg);
		}
		/**
		 * @description 打印战斗日志
		 */
		public static logF(msg: any): void
		{
			if (qmr.GlobalConfig.isDebugF)
			{
				egret.log(msg);
			}
		}
		/**
		 * @description 打印warn日志
		 */
		public static warn(msg: any): void
		{
			if (qmr.PlatformConfig.isDebug)
			{
				egret.warn(msg);
			}
		}
		/**
		 * @description 打印error日志
		 */
		public static error(msg: any): void
		{
			if (qmr.PlatformConfig.isDebug)
			{
				egret.error(msg);
			}
		}

		/**  @description 打印Slow 添加的log日志, */
		public static slowLog(msg: any): void
		{
			if (qmr.GlobalConfig.bIsShowSlowLog)
			{
				console.log(msg);
			}
		}
		/**
		 * @description 上报错误日志
		 */
		// public static uploadErrorLog(errorContent: string): void {
		// let sendData: any = {};
		// sendData.gameid = qmr.GlobalConfig.gameid;
		// sendData.channelid = qmr.PlatformConfig.channelId;
		// sendData.time = Date.now();
		// let signStr: string = "channelid=" + sendData.channelid + "&gameid=" + sendData.gameid + "&time=" + sendData.time + "#"+qmr.GlobalConfig.secret_key;
		// sendData.sign = new md5().hex_md5(signStr);
		// sendData.uid = qmr.GlobalConfig.uid;
		// // sendData.rolename = qmr.SingleModel.getInstance().playerModel.roleName;
		// sendData.serverid = qmr.GlobalConfig.gameServerIndex;
		// sendData.errorContent = errorContent;
		// if (errorContent.indexOf("null") != -1) {
		// 	if (!this.errorLogRequest){
		// 		 this.errorLogRequest = new egret.HttpRequest();
		// 	}
		// 	this.errorLogRequest.open(qmr.GlobalConfig.gmHost + LogUtil.errorLogUrl, egret.HttpMethod.POST);
		// 	this.errorLogRequest.send(JSON.stringify(sendData));
		// }
		// }
	}
}