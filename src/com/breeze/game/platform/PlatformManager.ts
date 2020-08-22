module qmr
{
	/**
	 * 平台代理类，此类禁止对特殊子平台的逻辑处理，一律在子平台类中处理
	 * dear_H
	 */
	export class PlatformManager
	{
		private _platform: BasePlatform;

		public constructor()
		{
			this._platform = PlatformFactory.creatPlatform(PlatformConfig.platformId);
		}

		/**
		 * 注册上报
		 */
		public reportRegister(): void
		{
			this.platform.reportRegister();
		}

		/**
		 * 登录上报
		 */
		public reportLogin(): void
		{
			this.platform.reportLogin();
		}

		/**
		 * 请求支付
		 */
		public reqPay(payInfo): void
		{
			if (!GlobalConfig.isOpenRecharge)
			{
				TipManagerCommon.getInstance().createCommonColorTip("暂未开放充值！");
				return;
			}
			this.platform.reqPay(payInfo);
		}

		/**
		 * 升级上报
		 */
		public reportUpLevel(): void
		{
			this.platform.reportUpLevel();
		}

		/**
		 * 分享游戏
		 */
		public shareGame(totalCount: number, hadCount: number, leaveTime: number):void
		{
			this.platform.shareGame(totalCount, hadCount, leaveTime);
		}

		/**
		 * 当前平台对象
		 */
		public get platform(): BasePlatform
		{
			return this._platform;
		}

		/**是否外部平台 */
		public get isOutNetPlatForm(): boolean
		{
			return PlatformConfig.platformId != PlatformEnum.P_SLOGAME_DEBUG;
		}

		/**
		 * 是否拉取到了平台参数，根据状态决定是否打点
		 */
		public get isGetPlatformInfo(): boolean
		{
			return this.platform.isGetPlatformInfo;
		}

		private static _instance: PlatformManager;
		public static get instance(): PlatformManager
		{
			return this._instance || (this._instance = new PlatformManager())
		}
	}
}