module qmr{
	export class ChannelUtil
	{
		public constructor()
		{
		}


		/**
		 * 动态加载js文件
		 * @param scriptUrl 文件地址
		 * @param isDecode  是否需要解码
		 * @param callFunc  文件载入完成后的回调
		 */

		public static loadScript(scriptUrl: string, isDecode: boolean, callFunc: Function): void
		{
			let script: any = window.document.createElement("script");
			script.type = "text/javascript";
			if (isDecode)
			{
				script.src = decodeURIComponent(scriptUrl);
			} else
			{
				script.src = scriptUrl
			}

			window.document.head.appendChild(script);
			script.onload = function ()
			{
				script.onload = null;
				callFunc();
			}
		}
	}
}
