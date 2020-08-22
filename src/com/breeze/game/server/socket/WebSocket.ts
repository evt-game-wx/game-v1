module qmr
{
	/**
	 *
	 * @description websocket类
	 *
	 */
    export class WebSocket
    {
        private connectCallBack: Function;
        private connectCloseBack: Function;
        private connectErrorBack: Function;
        private thisObject: any;
        private websocket: egret.WebSocket;
        private _isConnect: boolean;
        private tid: number;
        private WEB_KEY: string = "/ws";//前后端约定的

        public constructor()
        {
            this.websocket = new egret.WebSocket();
            this.websocket.type = egret.WebSocket.TYPE_BINARY;
            this.websocket.addEventListener(egret.Event.CONNECT, this.onSocketConnected, this);
            this.websocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this.websocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onDataIn, this);
            this.websocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIoError, this);
        }
		/**
		 * @description 以host和port的方式链接
		 */
        public connect(host: string, port: number, connectCallBack: Function, connectCloseBack: Function, connectErrorBack: Function, thisObject: any): void
        {
            this.connectCallBack = connectCallBack;
            this.connectCloseBack = connectCloseBack;
            this.connectErrorBack = connectErrorBack;
            this.thisObject = thisObject;
            let platformManager: PlatformManager = PlatformManager.instance;
            let protocol: string = "";
            let socketUrl: string = "";
            let isOutNetPlatForm = platformManager.isOutNetPlatForm;

            if (isOutNetPlatForm)//平台下不加ws后缀 Nginx做转发
            {
                socketUrl = protocol + "://" + host + "/s" + GlobalConfig.sid;
                if (PlatformConfig.isWSS)//外网debug版本 默认走wss
                {
                    socketUrl = "wss://" + host + "/s" + GlobalConfig.sid;
                }
            }
            else
            {
                socketUrl = "ws://" + host + ":" + port + this.WEB_KEY;
            }
            this.websocket.connectByUrl(socketUrl);
            // let socketUrl = "wss://echo.websocket.org"
            // this.websocket.connect(host, port)

            this.clearConTimeout();
            this.tid = egret.setTimeout(this.onTimeOut, this, 10000);
            LogUtil.log("链接的服务器和端口:" + socketUrl);
        }

        /**
         * @description 10秒链接不上超时
         */
        private onTimeOut(): void
        {
            this.clearConTimeout();
            if (this.connectCloseBack)
            {
                this.connectCloseBack.call(this.thisObject);
            }
            LogUtil.log("10秒链接不上超时");
        }

		/**
		 * @description 当服务器连接上
		 */
        private onSocketConnected(evt: egret.Event): void
        {
            this._isConnect = true;
            this.clearConTimeout();
            if (this.connectCallBack)
            {
                this.connectCallBack.call(this.thisObject);
            }
            LogUtil.log("连接服务器成功！");
        }

        /**
         * @description 当服务器连接关闭
         */
        private onSocketClose(evt: egret.Event): void
        {
            this._isConnect = false;
            this.clearConTimeout();
            if (this.connectCloseBack)
            {
                this.connectCloseBack.call(this.thisObject);
            }
            LogUtil.log("服务器连接关闭");
        }

        /**
         * @description 当有数据过来
         */
        private onDataIn(evt: egret.ProgressEvent): void
        {
            if (this.websocket)
            {
                let reciveBuff: egret.ByteArray = ByteArrayPool.getInstance().createByte();
                this.websocket.readBytes(reciveBuff);
                while (reciveBuff.bytesAvailable)
                {
                    BufferGid.parseMsg(reciveBuff);
                }
                ByteArrayPool.getInstance().recycleByte(reciveBuff);
            }
        }

        /**
         * @description socket连接发生IO错误
         */
        private onIoError(evt: egret.IOErrorEvent): void
        {
            this._isConnect = false;
            this.clearConTimeout();
            if (this.connectErrorBack)
            {
                this.connectErrorBack.call(this.thisObject);
            }
            LogUtil.log("服务器连接错误");
        }
        /**
         * msg:发送协议
         * msgId:MessageID里面的协议
         * isLog:是否显示发送日志
         */
        public sendCmd(msg: any, msgId: number, isLog: boolean = false): void
        {
            if (this.isconnected)
            {
                var arrayBuffer: egret.ByteArray = BufferGid.getSendMsg(msg, msgId, isLog);
                if (arrayBuffer)
                {
                    this.websocket.writeBytes(arrayBuffer);
                    this.websocket.flush();
                    ByteArrayPool.getInstance().recycleByte(arrayBuffer);
                }
                msg = null;
            }
        }
        /**
         *  返回socket是否连接上
         */
        public get isconnected(): boolean
        {
            return this._isConnect && this.websocket && this.websocket.connected;
        }

        private clearConTimeout()
        {
            if (this.tid)
            {
                egret.clearTimeout(this.tid);
                this.tid = 0;
            }
        }

        /**
         *  资源释放
         */
        public dispos(): void
        {
            let t = this;
            t.clearConTimeout();
            if (t.websocket != null)
            {
                t.websocket.removeEventListener(egret.Event.CONNECT, t.onSocketConnected, t);
                t.websocket.removeEventListener(egret.Event.CLOSE, t.onSocketClose, t);
                t.websocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, t.onDataIn, t);
                t.websocket.removeEventListener(egret.IOErrorEvent.IO_ERROR, t.onIoError, t);
                if (t.isconnected)
                {
                    t._isConnect = false;
                    t.websocket.close();
                }
                t.websocket = null;
            }
            t.connectCallBack = null;
            t.connectCloseBack = null;
            t.connectErrorBack = null;
            t.thisObject = null;
        }
    }
}
