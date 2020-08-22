module qmr
{
	export class DirtyWordsUtils
	{

		/**
		 * 是否有敏感词
		 * @param content    要检测的文字
		 * @return        true为有敏感词，false为没有敏感词
		 */
		public static hasDirtywords(content: string, callbackF: Function, thisObj: any)
		{
			let time: number = (new Date().getTime() / 1000 | 0);
			let contentEncode: string = encodeURI(content);
			let sign = encodeURI(Md5Util.getInstance().hex_md5(content+time+GlobalConfig.loginKey));
			let url = PlatformManager.instance.platform.dirtyWordCheckUrl
					+ "?time=" + time + "&content=" + contentEncode + "&sign=" + sign;
			LogUtil.log("url=", url);
			HttpRequest.sendGet(url, (res) =>{
				LogUtil.log("dirtywords", res);
				let hasDirty: boolean = true;
				if(res){
					let data = JSON.parse(res);
					if(data){
						if(data.ret == 1){
							hasDirty = false;
						}
					}
				}
				if(callbackF){
					callbackF.call(thisObj, hasDirty, res.content);
				}
			}, this);
		}

		
	}
}