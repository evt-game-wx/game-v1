module qmr
{
	/**
	 * coler
	 * 平台回调接口 
	 * 
	 * 	PS: 当且仅当IOS和android混服（不需要显示android的部分服务器）时才需要调用ios接口
    	否则默认全部调用 android 接口
	 * {0} http/https
	 * {1} domain
	 * {2} platform
	 * {3} ios/android
	 * 
	 *  1. domain: 平台域名, 由平台方提供, 每台机器一个域名
		2. platformVal: 平台标识, 例: jxtxj_solgame, bxxj_9187等
		3. apiname: 接口名字.
					3.1  login      ---  登录
					3.2  svrlist     ---  区服列表
					3.3  lastlogin ---  最后登录区服信息
					3.3  orderid  ---  生成订单ID
					3.4  order      ---  充值回调
					3.5  orderid   ---  生成订单ID接口, 调用域名会在角色login进入游戏时通过apiurl传入
					3.6  order      ---  充值接口. 平台回调(由平台接入), 默认在S1服

	 */
	export class PlatformUrlConsont
	{
		/** 充值生成订单ID接口 */
		public static ORDER_URL: string = "{0}//{1}/api/{2}.orderid_{3}.php";
		/** 开服列表接口 */
		public static SVRLISTOP_URL: string = "{0}//{1}/api/{2}.svrlist_{3}.php";
		/** 提审服列表接口 */
		public static TS_SVRLISTOP_URL: string = "{0}//{1}/api/{2}.svrlist_{3}_ts.php";
		/** 查询角色接口 */
		public static QUERY_URL: string = "{0}//{1}/api/{2}.query_{3}.php";
		/** 封禁/禁言账号 */
		public static FORBIDDEN_URL: string = "{0}//{1}/api/{2}.forbidden_{3}.php";
		/** 最近登录 */
		public static LASTLOGIN_URL: string = "{0}//{1}/api/{2}.lastlogin_{3}.php";
		/** 登录 */
		public static LOGIN_URL: string = "{0}//{1}/api/{2}.login_{3}.php";

		/** 屏蔽词 */
		public static WORD_URL: string = "{0}//{1}/api/dirtycli.php";
		/** 公告 */
		public static NOTICE_URL: string = "{0}//{1}/api/gm/getserver_notice.php";

		/** 用户验签 */
		public static VERIFY_URL: string = "{0}//{1}/api/{2}.validation.php";
	}
}