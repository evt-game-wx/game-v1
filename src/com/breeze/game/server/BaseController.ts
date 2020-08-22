module qmr
{
	/**
	 *
	 * @description 和服务器通信的基类,所有的通信类都要继承这个类
	 *
	 */
	export class BaseController
	{
		private _reqDic: Dictionary;
		public constructor()
		{
			this.initListeners();
		}

		protected initListeners(): void
		{

		}

		/**
		 * msg:发送消息
		 * isLog:是否显示发送日志
		 */
		public sendCmd(msg: any, msgId: number, isLog: boolean = false): void
		{
			Rpc.getInstance().sendCmd(msg, msgId, isLog);
		}

		/**
		 * @description 发送一个消息通知
		 */
		public dispatch(type: string, params: any = null): void
		{
			NotifyManager.sendNotification(type, params);
		}

		/**
		* @description 注册一个消息
		* @param type 消息类型
		* @param callBack 回调函数
		* @param thisObject 当前作用域对象
		*/
		public registerNotify(type: string, callBack: Function, thisObject: any): void
		{
			NotifyManager.registerNotify(type, callBack, thisObject);
		}

        /**
		 * @description 取消一个注册消息
		 * @param type 消息类型
		 * @param callBack 回调函数
		 * @param thisObject 当前作用域对象
		 */
		public unRegisterNotify(type: string, callBack: Function, thisObject: any): void
		{
			NotifyManager.unRegisterNotify(type, callBack, thisObject);
		}

		/**
		 * @description 发送带回调的消息
		 */
		public rpc(eventMsgId: number, cmd: any, msgId: number, callBack: Function, thisObject: any, timeOutCallBack: Function = null, timeOut: number = null, isLog: boolean = false): void
		{
			Rpc.getInstance().rpcCMD(eventMsgId, cmd, msgId, callBack, thisObject, timeOutCallBack, timeOut, isLog);
		}

		/**
		 * @description 添加事件监听
		 */
		protected addSocketListener(msgId: number, callBack: Function, thisObject: any, isLog: boolean = false): void
		{
			Rpc.getInstance().addSocketListener(msgId, callBack, thisObject, isLog);
		}

		/**
		 * @description 移除监听
		 */
		protected removeSocketListener(msgId: number, callBack: Function, thisObject: any): void
		{
			Rpc.getInstance().removeSocketListener(msgId, callBack, thisObject);
		}

		/**
         * 播放特效
         */
		public loadAndPlayEffect(soundType: string, loops: number = 1,isOneKey:boolean = false): void
		{
			SoundManager.getInstance().loadAndPlayEffect(soundType, loops,isOneKey);
		}

		/** 检查是否还在锁定状态 */
		public checIsLock(rankId: number): boolean
		{
			if (!this._reqDic) return false;
			let lockTime = this._reqDic.has(rankId) ? this._reqDic.get(rankId) : 0;
			let t = egret.getTimer()
			// LogUtil.log(rankId + " checIsLock " + t + " " + lockTime);
			return lockTime > t;
		}

		/** 设置锁定状态,默认15秒 */
		public setReqLock(rankId: number, time: number = 15000)
		{
			if (!this._reqDic) this._reqDic = new Dictionary();
			let t = egret.getTimer();
			let lockTime = t + time;
			// LogUtil.log(rankId + " setReqLock " + t + " " + lockTime);
			this._reqDic.set(rankId, lockTime);
		}

		public resetLock()
		{
			if (this._reqDic) this._reqDic.clear();
		}

		/**
		 * @description 移除所有监听
		 */
		public removeAllListener(): void
		{
			this.resetLock();
		}
	}
}
