module qmr
{
	/**
	 * @description 浏览器工具类
	 */
	export class WebBrowerUtil
	{
		public static md: any;
		/**操作系统*/
		public static OS: string;
		/**手机型号*/
		public static model: string;

		public constructor()
		{
		}
		
		/**初始化系统信息 */
		public static initSysInfo(): void
		{
			this.initMd();
		}

		private static initMd(): void
		{
			console.log("运行系统:" + egret.Capabilities.os);
			let MobileDetect = window["MobileDetect"];
			if (MobileDetect)
			{
				let device_type = navigator.userAgent;//获取userAgent信息 
				let md = new MobileDetect(device_type);//初始化mobile-detect
				let os = md.os();//获取系统 
				let model: string = "";//获取手机型号
				if (os == "iOS")
				{//ios系统的处理
					model = md.mobile();
				} else if (os == "AndroidOS")
				{//Android系统的处理
					var sss = device_type.split(";");
					var i = this.contains(sss, "Build/");
					if (i > -1)
					{
						model = sss[i].substring(0, sss[i].indexOf("Build/"));
					}
					else
					{
						model = md.mobile();
					}
				}
				this.model = model;
				this.OS = os;
				egret.log("md:" + JSON.stringify(md));
				egret.log("操作系统:" + os);
				egret.log("手机型号:" + model);
			}
		}

		//判断数组中是否包含某字符串 
		private static contains(strArr: string[], needle: string): number
		{
			for (let i in strArr)
			{
				if (strArr[i].indexOf(needle) > 0)
					return Number(i);
			}
			return -1;
		}
	}
}