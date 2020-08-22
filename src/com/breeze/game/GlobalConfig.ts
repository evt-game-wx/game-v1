module qmr
{
	export class GlobalConfig
	{
		/** 是否上报日志到reportLogUrl服务器上 */
		// public static bIsReportLog = false;
		public static reportLogData = {};
		public static reportLogUrl = "http://testmt.housepig.cn/xyws/";
		/** 是否开启Slow个人日志 */
		public static bIsShowSlowLog = false;

		public static loginInitFinish: boolean = false;			//是否是调试状态LOGIN_INIT_FINISH
		public static isDebugF: boolean = false;			   	//是否是调试战斗状态
		public static loginPort: number;                        //登陆服务器端口
		public static userId: number | Long = 0;				//玩家的账号
		public static signature: string = "";//会话签名，用于检验

		public static unverifysvr: number = 0;  //是否跳过校验用户(内部开发测试服务器全部传1, 接了SDK后传0或者不传)
		public static platLoginTime: string = "";//登录平台SDK返回的时间

		/**平台拉取的服务器列表*/
		public static serverList: any[];
		/**我最近登陆的服务器列表 */
		public static recentLoginServerList: any[] = [];
		/**登陆服下发后端参数(直接透传给后端)*/
		public static sparam: any;
		//------平台对接专用参数--------//

		public static nickName: string;						//sdk登陆返回自带的昵称
		public static loginProxyServer: string = "h5liutingting7000.cn";			 //当前QQ空间代理的登陆服务器

		/** 是否是sdk登出状态 */
		public static isSDKLogout:boolean = false;
		/**客户端注册用户英雄id */
        public static registerAccountHeroId: number = 0;
/**游戏登陆账号 */
		public static account: string = "";
		public static token: string = "";
		/**服务器id */
		public static sid: string = "1";
		public static sName: string;//服务器名字
		/**客户端登录游戏秘钥 */
		public static loginKey = '^SOLaMeMOBILE#2019!COMMONKEY24@^$^%(*9183098abcdhghhde';
		/**QOS打点服务器秘钥 */
		public static qosKey = 'SolGAmE2019QOSSecReTkeY#RewaRdSecRet^Ket%';
		/**用户唯一id */
		public static uid: string;
		/**登录服务器 */
		public static loginServer: string = "";
		/**是否是全新用户 */
		public static isFirstNewUser:boolean = false;
		/**客户端ip*/
		public static clientIp: string = "127.0.0.1";
		/**本次登录是否请求了创建角色 */
		public static isCreatRoleEnterGame: boolean;
		/**登录服下发前端参数(fcm-防沉迷标记,charge-充值标记(1-充值开启, false-充值关闭 qosurl-打点URL.(当此接口为空时表示不需要打点)))*/
		public static cdata: any;
		/**登录时间 */
		public static logintime: number = 0;
		
		/**是否开放充值 */
		public static get isOpenRecharge(): boolean
		{
			if (!this.cdata)
			{
				return true;
			}
			return this.cdata.charge == 1;
		}

		/**
		 * 是否ios系统
		 */
		public static get isSysIos(): boolean
		{
			return egret.Capabilities.os.toUpperCase() == "IOS";
		}
	}
}
