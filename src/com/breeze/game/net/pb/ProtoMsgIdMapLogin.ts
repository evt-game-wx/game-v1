module qmr {
	/**
	 *
	 * 根据消息MessageID自动生成，请勿修改
	 *
	 */
	export class ProtoMsgIdMapLogin {
		private static _instance: ProtoMsgIdMapLogin;
		public msgIdMap: any = {};

		/**
		*  获取单例
		*/
		public static get instance(): ProtoMsgIdMapLogin {
			if (this._instance == null) { this._instance = new ProtoMsgIdMapLogin(); }
			return this._instance;
		}

		public constructor() {
			this.msgIdMap[MessageIDLogin.S_EXCEPTION_MSG] = com.message.S_EXCEPTION_MSG;
			this.msgIdMap[MessageIDLogin.S_USER_LOGIN] = com.message.S_USER_LOGIN;
			this.msgIdMap[MessageIDLogin.S_USER_LOGOUT] = com.message.S_USER_LOGOUT;
			this.msgIdMap[MessageIDLogin.C_SYNC_TIME] = com.message.C_SYNC_TIME;
			this.msgIdMap[MessageIDLogin.S_SYNC_TIME] = com.message.S_SYNC_TIME;
			this.msgIdMap[MessageIDLogin.C_SEND_SDK_DATA] = com.message.C_SEND_SDK_DATA;
			this.msgIdMap[MessageIDLogin.S_SEND_SDK_DATA] = com.message.S_SEND_SDK_DATA;

		}

	}
}
