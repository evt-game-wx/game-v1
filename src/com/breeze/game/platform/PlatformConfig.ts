module qmr {
	export class PlatformConfig {

		//------平台对接专用参数--------//
		/**当前游戏参数配置 */
		public static GAME_CONFIG:any = null;
		/**默认平台id为星灵互动的 */
		public static platformId: number = 0;
		/** 平台标识(用于oss的上报日志、获取公告)*/
		public static platform: string;
		/** 平台标记号 拼接api的url使用，用于请求后端接口*/
		public static platformSign: string;
		/**平台处理类的类型，当同一平台有多个sdk解析方式时区分，比如西游网的h5和apk大混服 */
		public static platformClassType: string;
		/**游戏ID,统一用字符串格式存储 */
		public static appIdStr: string;
		/**游戏 key */
		public static appKey: string;
		/**渠道id */
		public static channelId: string = "0";
		/**是否需要打点 */
		public static isNeedMarkPoint: boolean = true;
		/** 是否连接提审服务器*/
		public static isTSVersion: boolean = false;
		/** 是否屏蔽提审需要屏蔽的内容*/
		public static isShildTSV: boolean = false;
		/** 是否屏蔽苹果商业化版本 */
		public static isShieldIOSBusiness: boolean = false;
		/** 是否打开GM */
		public static isOpenGM:boolean = false;
		public static isShowNotice: boolean = true;
		/**是否是wss连接  */
		public static isWSS: boolean = true;
		/**扩展参数 */
		public static extendsParams:string = "";
		/**是否是调试状态，改为读取配置，这里赋值没有用 */
		public static isDebug: boolean;
		/**系统当前使用的资源版本号 */
		public static resVersion:string;
		/**是否使用外网cdn资源版本 */
        public static useCdnRes: boolean = false;
        public static baseRoot: string = "";
        public static webUrl:string = "";
        public static webRoot: string = "";
		/**平台域名*/
		public static serverDomain: string;
		/**平台提审域名*/
		public static ts_serverDomain: string;
		/** 打点域名 */
		public static markPointDomain: string;
		/**oss域名 */
		public static ossDoamin: string;

		public static async init() {
			let t = this;
			let config = window["GAME_CONFIG"];
			if(!config){
				throw new Error("platfrom config is not define");
			}
			t.GAME_CONFIG = config;
			t.platformId = Number(config["platformId"]);
			t.channelId = config["channelId"];
            t.isNeedMarkPoint = config["isMarkPoint"];
			t.isTSVersion = !!Number(config["isTSVersion"]);
			if(config["isWSS"]){
				t.isWSS = !!Number(config["isWSS"]);
			}
            t.isShildTSV = !!Number(config["isShildTSV"]);
            t.isShieldIOSBusiness = !!Number(config["isShieldIOSBusiness"]);
			t.isOpenGM = !!Number(Number(config["isOpenGM"]));
			t.isDebug = !!Number(config["isDebug"]);
			t.extendsParams = config["extendsParams"];
			t.platformClassType = config["platformClassType"];
			t.useCdnRes = !!Number(config["isPublish"]);
            t.baseRoot = config["basePath"];
			t.webUrl = config["resPath"];
			t.webRoot = t.webUrl + t.baseRoot;
			if(config["isShowNotice"])
			{
				t.isShowNotice = !!Number(config["isShowNotice"])
			}
			
			if(config["max_hw_ratio"]){
				StageUtil.MAX_HW_RATIO = Math.min(StageUtil.MAX_HW_RATIO, config["max_hw_ratio"]);
			}
			if(config["min_hw_ratio"]){
				StageUtil.MIN_HW_RATIO = Math.max(StageUtil.MIN_HW_RATIO, config["min_hw_ratio"]);
			}

			t.appIdStr = config["appId"];
			t.appKey = config["appKey"];
			t.platform = config["platform"];
			t.platformSign = config["platformSign"];
			t.serverDomain = config["serverDomain"];
			t.ts_serverDomain = config["ts_serverDomain"];
			t.markPointDomain = config["markPointServer"];
			t.ossDoamin = config["ossServer"];
			t.resVersion = config["resVersion"];
			await VersionManager.initGameVersion(t.resVersion);
		}

	}
}