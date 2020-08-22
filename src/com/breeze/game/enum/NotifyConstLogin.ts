module qmr
{
	/**
	 *
	 * @description 消息通知的常量,登录模块的消息通知常量都写在这里
	 *
	 */
	export class NotifyConstLogin
	{
		/** 错误日志 */
		public static S_ERROR_CODE: string = "S_ERROR_CODE";//错误码事件
		
		/*-------------------------------登录--------------------------------------*/
		public static S_USER_LOGIN: string = "S_USER_LOGIN";                 				//登陆成功
		public static S_USER_LOGIN_REPEAT: string = "S_USER_LOGIN_REPEAT";                 	//角色名重复
		public static S_LOGIN_OFFLINE_HANGUP_PUSH: string = "S_LOGIN_OFFLINE_HANGUP_PUSH";  //服务器返回离线信息
		public static S_USER_LOGOUT: string = "S_USER_LOGOUT";   							//活动启动

		/*-------------------------------模块TabView--------------------------------------*/
		public static TAB_VIEW_ADDPAGE: string = "TAB_VIEW_ADDPAGE";       					//TabView打开子Page
		public static TAB_VIEW_REMOVEPAGE: string = "TAB_VIEW_REMOVEPAGE";       			//TabView移除子Page
		public static TAB_VIEW_CHANGE_TAB: string = "TAB_VIEW_CHANGE_TAB";       			//TabView切换分页
		public static UPDATE_OPEN_TITLE: string = "UPDATE_OPEN_TITLE";						//界面关闭派发事件，通知以打开界面刷新标题


		public static UPDATE_MODULE_TITLE: string = "UPDATE_MODULE_TITLE";					//更新某个模块面板的标题
		public static OPEN_PANEL_LAYER: string = "OPEN_PANEL_LAYER";        				//打开在哪个层
		public static CLOSE_PANEL_LAYER: string = "CLOSE_PANEL_LAYER";        				//打开在哪个层
		public static OPEN_PANEL_VIEW: string = "OPEN_PANEL_VIEW";        					//打开界面
		public static CLOSE_PANEL_VIEW: string = "CLOSE_PANEL_VIEW";        				//关闭界面

		/*-------------------------------分离登录模块--------------------------------------*/
		public static SCNY_ONE_SERVER_TIME = "SCNY_ONE_SERVER_TIME";						//同步一次服务器时间抛出
		public static CROSS_DAY = "CROSS_DAY";												//跨天抛出
		public static CHANGE_MODEL_VIEW: string = "SHOW_OR_HIDE_GUIDE";        				//展示隐藏底部选中框,引导
		public static TO_HIDE_VIP_VIEW: string = "TO_HIDE_VIP_VIEW";						//隐藏VIP界面 
		public static TO_REQUEST_SHARE_REWARD = "TO_REQUEST_SHARE_REWARD";					//请求分享奖励
	}
}