module qmr {
	export class MessageIDLogin
	{
		/**
		 *
		 */
		/** 映射协议ID对应的协议名 */
		private static MSG_KEYS: qmr.Dictionary = new qmr.Dictionary();
		/** 游戏初始化调用 */
		public static init()
		{
			let t = this;
			let id:number;
			for (let p in t)
			{
				id = t[p];
				t.MSG_KEYS.set(id, p);
			}
		}

		/** 通过本类的协议ID映射协议名字 */
		public static getMsgNameById(id: number): string
		{
			return MessageIDLogin.MSG_KEYS.get(id)
		}
		
		/**  异常消息 */
		public static S_EXCEPTION_MSG:number = 900; 
		/**  登录 */
		public static C_USER_LOGIN:number = 1001; 
		/**  登录成功 */
		public static S_USER_LOGIN:number = 1002; 
		/** 注册 */
		public static C_LOGIN_REGISTER:number = 1005; 
		/** 登出 */
		public static C_USER_LOGOUT:number = 1007; 
		public static S_USER_LOGOUT:number = 1008;
		/** 同步时间 */
		public static C_SYNC_TIME:number = 2101; 
		/** 同步时间 */
		public static S_SYNC_TIME:number = 2102; 

		public static C_SEND_SDK_DATA:number = 1032;
		public static S_SEND_SDK_DATA:number = 1033;

	}
}