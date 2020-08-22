
module qmr {
	/**
	 * 平台基类类，此类禁止对特殊子平台的逻辑处理，一律在子平台类中处理
	 */
	export abstract class BasePlatform {
		/**平台sdk*/
		public sdk: any;
		/**平台sdk_ios_web:http://h5.dyhyyx.com/themes/simplebootx/Public/js/hgame.js?ver=20170516*/
		public lq: any;
		/**平台数据*/
		public data: any;
		/**登陆服平台验证地址*/
		public loginServerUrl: string;
		/**最近登录服请求地址*/
		public loginServer: string;
		/**联调服域名*/
		public ltServerDomain: string = "xyws-sdk.dyhyyx.com";
		/**选服列表请求地址（外网平台根据联调服或者正式服切换地址）*/
		public serverListServer: string;
		/**提审版本选服列表请求地址*/
		public tsServerListServer: string;
		/**获取充值订单号请求地址*/
		public rechargeOrderIdServer: string;
		/**登陆前打点服务器地址*/
		public markPointUrlBeforeLogin: string;
		/**登陆后打点服务器地址*/
		public markPointUrl: string;
		/**最近登录服请求地址*/
		public lastLoginServerReqUrl: string;
		/**提审服最近登录服请求地址*/
		public tsLastLoginServerReqUrl: string;
		/**屏蔽字检测地址*/
		public dirtyWordCheckUrl: string;
		/**公告获取地址*/
		public NoticeUrl: string;
		/**后端登录验签地址 */
		public verifyUrl: string;

		/**订单号 */
		public orderId: number;
		/**是否验证通过*/
		public isVerify: boolean;
		/**是否拉取到了平台参数，根据状态决定是否打点*/
		public isGetPlatformInfo: boolean;
		/**订单请求后的返回数据 */
		public orderResultData: any;
		
		//初始化平台配置参数
		protected abstract initGetOption(): void;
		/**登陆接口*/
		protected abstract async login(): Promise<any>;
		/**sdk支付*/
		protected abstract async pay(payInfo: RechargeCfg): Promise<any>;
		/**该平台是否拥有清理缓存接口 */
		public abstract canClearResCache: boolean;
		/**第一个加载背景是否移除 */
		protected firstLoadBgHide: boolean;

		public constructor() {
			this.initGetOption();
		}
		
		/**该平台是否拥有重置窗口大小的能力 */
		public get canResizeStage(): boolean
		{
			return true;
		}

		/**请求登录 *///基类函数不可修改
		public async reqLogin() {
			this.setLoadingStatus("验证账号...");
			console.log("开始平台登录");
			await this.login();
			console.log("平台登录完成");
		}

		/**请求支付 *///不通用的平台在子类重写，基类函数不可修改
		public reqPay(payInfo: RechargeCfg) {
		}
		/**
		 * 设置加载进度
		 * @param  {number} vlaue 0-100
		 * @returns void
		 */
		public setLoadingProgress(vlaue: number): void {}
		/**登出接口*/
		public logout(): void { }
		/**创角成功并获取角色信息后上报*/
		public reportRegister(): void { };
		/**登陆成功并获取角色信息之后上报*/
		public reportLogin(): void { }
		/**角色升级上报*/
		public reportUpLevel(): void { }
		/**排行榜战力上报*/
		public reportFightPower(value: number): void { }
		/**分享游戏 */
		public shareGame(totalCount: number, hadCount: number, leaveTime: number): void { };
		/**分享游戏 */
		public onShareBack(): void { };
		/**分享接口*/
		public share(): void { }
		/**收藏到桌面*/
		public addToDesk(): void { }
		/**
		 * 尝试重新加载游戏，否则退出游戏
		 * @param  {boolean} clearCache? 是否清除缓存，微信、qq等平台等需要
		 * @returns void
		 */
		public reloadGame(clearCache?: boolean): void {
			if (window.location && window.location.reload) {
				window.location.reload();
			} else {
				TipManagerCommon.getInstance().createCommonColorTip("请重启游戏");
			}
		}

		public setLoadingStatus(msg?: string)
		{
			msg = msg || "";
			var showLoading = window["showPreLoading"];
			if(showLoading){
				showLoading(msg);
			}
			if(!msg && !this.firstLoadBgHide&& window["EgretSubPackageLoading"]){
				this.firstLoadBgHide = true;
				window["EgretSubPackageLoading"].instance.removePreLoading();
			}
		}
	}
}