module qmr
{
	export class SystemController extends BaseController
	{
		private static _instance: SystemController;
		/**是否同步过一次 */
		public isSyncOne: boolean;
		/**  获取单例对象 */
		public static get instance(): SystemController
		{
			if (this._instance == null) { this._instance = new SystemController(); }
			return this._instance;
		}
		private isStartSysn: boolean;//是否同步过一次服务器时间
		private timeKey: number = -1;
		private timeFlag: number;

		constructor()
		{
			super();
		}

		protected initListeners(): void
		{
			this.addSocketListener(MessageIDLogin.S_SYNC_TIME, this.onRecsynSystem, this);
			this.addSocketListener(MessageIDLogin.S_EXCEPTION_MSG, this.onRecExceptionMsg, this, true);
		}

		/**
		 * 启动心跳包
		 */
		public startHeart()
		{
			if (!this.isStartSysn)
			{
				this.isStartSysn = true;
				this.timeFlag = Date.now();
				this.timeKey = egret.setInterval(this.reqgetSystemTime, this, 8000);
				this.reqgetSystemTime();
			}
		}

		public clearHeart()
		{
			this.isStartSysn = false;
			if (this.timeKey != -1)
			{
				egret.clearInterval(this.timeKey);
				this.timeKey = -1;
			}
		}

		/**
		 * ---同步心跳包---
		 */
		private reqgetSystemTime(): void
		{
			var c: com.message.C_SYNC_TIME = new com.message.C_SYNC_TIME();
			this.sendCmd(c, MessageIDLogin.C_SYNC_TIME);
			// console.log("C_SYNC_TIME:", Date.now() - this.timeFlag);
			// this.timeFlag = Date.now();
		}

		/**
		 * ===同步心跳包===
		 */
		private onRecsynSystem(s: com.message.S_SYNC_TIME): void
		{
			TimeUtil.syncServerTime(parseInt(s.time.toString()));
			if (!this.isSyncOne)
			{
				this.isSyncOne = true;
				this.dispatch(NotifyConstLogin.SCNY_ONE_SERVER_TIME);
			}
		}

		/** 
		 * ===错误码===
		 */
		private onRecExceptionMsg(s: com.message.S_EXCEPTION_MSG): void
		{
			let code = s.code;
			LogUtil.log("[错误码: " + code + "]");
			let codeConf: CodeCfgCfg = ConfigManagerBase.getConf(ConfigEnumBase.CODECFG, code);
			if (codeConf)
			{
				if (code == 1217){//服务器不开放新注册用户
					Rpc.getInstance().close();
					GameLoading.getInstance().close();
					TipManagerCommon.getInstance().createCommonColorTip(codeConf.msg);
				}
				else if (code == 1171){
					this.dispatch(NotifyConstLogin.S_USER_LOGIN_REPEAT);
					TipManagerCommon.getInstance().createCommonColorTip(codeConf.msg);
				}
				else{
					this.dispatch(NotifyConstLogin.S_ERROR_CODE,code);	
				}
			}
		}
	}
}