module qmr {
	/**
	 *
	 * @description 方便发送接收消息
	 *
	 */
	export class BaseNotify {
		public constructor() {
			this.initListeners();
		}

		protected initListeners():void{
            
        }

		/**
		 * @description 发送一个消息通知
		 */
		public dispatch(type: string, params: any = null): void {
			NotifyManager.sendNotification(type, params);
		}

		 /**
		 * @description 注册一个消息
		 * @param type 消息类型
		 * @param callBack 回调函数
		 * @param thisObject 当前作用域对象
		 */
        public registerNotify(type: string, callBack: Function, thisObject: any): void {
            NotifyManager.registerNotify(type, callBack, thisObject);
        }

        /**
		 * @description 取消一个注册消息
		 * @param type 消息类型
		 * @param callBack 回调函数
		 * @param thisObject 当前作用域对象
		 */
        public unRegisterNotify(type: string, callBack: Function, thisObject: any): void {
            NotifyManager.unRegisterNotify(type, callBack, thisObject);
        }
	}
}
