module qmr {
    import ByteArray = egret.ByteArray;
	/**
	 *
	 * @description websocket的rpc回调实现
	 *
	 */
    export class Rpc {
        private static instance: Rpc;
        private loginSocket: WebSocket;
        private eventPool: any;
        private callbackPool: any;

        public constructor() {
            this.eventPool = {};
            this.callbackPool = {};
        }

		/**
		 * @description 获取单例对象
		 */
        public static getInstance(): Rpc {
            if (!Rpc.instance) {
                Rpc.instance = new Rpc();
            }
            return Rpc.instance;
        }

		/**
		 * @description 添加协议监听
		 */
        public addSocketListener(msgId: number, callBack: Function, thisObject: any, isLog: boolean = false): void {
            if (this.eventPool[msgId] != null) {
                LogUtil.error("[error = addSocketListener 添加重复的消息 msgId=" + msgId + "]");
                return;
            }
            let requestHandler: RequestHandler = new RequestHandler();
            requestHandler.callBack = callBack;
            requestHandler.thisObject = thisObject;
            requestHandler.isRpc = false;
            requestHandler.isLog = isLog;
            this.eventPool[msgId] = requestHandler;
        }

		/**
		 * @description 移除协议监听
		 */
        public removeSocketListener(msgId: number, callBack: Function, thisObject: any): void {
            if (this.eventPool[msgId]) {
                delete this.eventPool[msgId];
            }
        }

		/**
		 * @description 以host和port的方式链接
		 */
        public connect(host: string, port: number, connectCallBack: Function, thisObject: any): void {
            this.close();
            this.loginSocket = new WebSocket();
            this.loginSocket.connect(
                host,
                port,
                function () { connectCallBack.call(thisObject); },
                this.onConnectClose,
                this.onConnectClose,
                this
            );
        }

        /**
         * @description 发送协议，不带回调的
         */
        public sendCmd(cmd: any, msgId: number, isLog: boolean = false): void {
            if (this.loginSocket) {
                this.loginSocket.sendCmd(cmd, msgId, isLog);
            }
        }

        /**
        * 带rpc回调的发送
        * @eventMsgId 返回的消息协议号
        * @callBack 收到服务器返回后的处理函数
        * @thisObject 函数引用的对象
        * @timeOutCallBack 发送协议超时还未返回后的处理函数
        * @timeOut 协议超时时间，默认是10秒
        */
        public rpcCMD(eventMsgId: number, cmd: any, msgId: number, callBack: Function, thisObject: any, timeOutCallBack: Function = null, timeOut: number = 10, isLog: boolean = false): void {
            if (this.callbackPool[eventMsgId] != null) {
                LogUtil.warn("[error = rpcCMD 添加重复的消息 eventMsgId=" + eventMsgId + "]");
                return;
            }
            let requestHandler: RequestHandler = new RequestHandler();
            requestHandler.callBack = callBack;
            requestHandler.thisObject = thisObject;
            requestHandler.timeOutCallBack = timeOutCallBack;
            requestHandler.timeOut = timeOut;
            requestHandler.isRpc = true;
            requestHandler.isLog = isLog;
            requestHandler.sendTime = Date.now();
            this.callbackPool[eventMsgId] = requestHandler;
            this.sendCmd(cmd, msgId, isLog);

            Ticker.getInstance().unRegisterTick(this.checkTimeOut, this);
            Ticker.getInstance().registerTick(this.checkTimeOut, this, 1000);
        }

		/**
		 * @description 当有数据过来的时候
		 */
        public onDataIn(msgId: number, data: ByteArray): void {
            let msgMap = qmr.ProtoMsgIdMapLogin.instance.msgIdMap;
            if(qmr.ProtoMsgIdMap && qmr.ProtoMsgIdMap.instance && qmr.ProtoMsgIdMap.instance.msgIdMap){
                msgMap = qmr.ProtoMsgIdMap.instance.msgIdMap;
            }
            let className: any = msgMap[msgId];
            if (className == null) {
                LogUtil.error("[尚未注册 ProtoMsgIdMap.instance.msgIdMap[" + msgId + "] = null]");
                return;
            }
            
            var getBuffer: ArrayBuffer = data.buffer;
            var reader: Uint8Array = new Uint8Array(getBuffer);
            var entify: any = className.decode(reader);
            // console.log(">>>>>>>>>>>>>>>>>x协议",getBuffer,reader,entify)
            let requestHandler: RequestHandler = this.eventPool[msgId];
            if (requestHandler) {
                if (requestHandler.isLog) {
                    LogUtil.log("[S_C:" + msgId + " " + className.name + "]");
                }
                if (requestHandler.clientData) {
                    requestHandler.callBack.call(requestHandler.thisObject, entify, requestHandler.clientData);
                } else {
                    requestHandler.callBack.call(requestHandler.thisObject, entify);
                }
                requestHandler = null;
            }
            else {
                LogUtil.error("[未监听协议 [msgId=" + msgId + "]");
            }
            let callbackHandler: RequestHandler = this.callbackPool[msgId];
            if (callbackHandler && callbackHandler.callBack) {
                delete this.callbackPool[msgId];
                if (callbackHandler.clientData) {
                    callbackHandler.callBack.call(callbackHandler.thisObject, entify, callbackHandler.clientData);
                } else {
                    callbackHandler.callBack.call(callbackHandler.thisObject, entify);
                }
                callbackHandler = null;
            }
        }

        /**
        *  判断是否链接上了
        */
        public get isconnect(): boolean {
            if (this.loginSocket) {
                return this.loginSocket.isconnected;
            }
            return true;
        }

        /**
        * @description 当链接关闭的时候调用
        */
        private onConnectClose(): void {
            let t = this;

            PbGlobalCounter.getInstance().resetCounter();
            SystemController.instance.clearHeart();
            
        }

        /**
        *  关闭一个socket（目前游戏使用一个socket就可以了）
        */
        public close(): void {
            // PbGlobalCounter.getInstance().resetCounter();
            if (this.loginSocket) {
                this.loginSocket.dispos();
                this.loginSocket = null;
            }
        }

         /**
         *  超时检测
         */
        private checkTimeOut(): void {
            let callbackPool = this.callbackPool;
            for (let msgId in callbackPool) {
                let requestHandler: RequestHandler = callbackPool[msgId];
                if (requestHandler) {
                    if (requestHandler.isRpc && Date.now() - requestHandler.sendTime > requestHandler.timeOut * 1000) {
                        delete callbackPool[msgId];
                    }
                }
            }
        }
    }
}
