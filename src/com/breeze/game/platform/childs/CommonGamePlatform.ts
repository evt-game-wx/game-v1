module qmr
{
	export class CommonGamePlatform extends BasePlatform
	{
		/**该平台是否拥有清理缓存接口 */
		public canClearResCache: boolean = false;
		
		public constructor()
		{
			super();
		}

		//初始化平台配置参数
        protected initGetOption()
        {
            PlatformConfig.platformSign = PlatformConfig.platform+"";
            this.isGetPlatformInfo = true;
        }

		protected async login()
		{
			egret.log("平台登陆");
			return new Promise((resolve, reject) =>
			{
				GlobalConfig.token = "2322232";
				this.isGetPlatformInfo = true;
				resolve();
				egret.log("平台登陆成功:" + status);
			})
		}

		/**请求支付 */
		public reqPay(payInfo) {
			
		}

		protected async pay(payInfo)
		{

		}
	}
}