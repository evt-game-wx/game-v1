module qmr
{
    import ByteArray = egret.ByteArray;

    /*
    * coler
    * 协议加密解密
    */
    export class BufferGid
    {
        public static KEY: string = "";
        public static ADD_L: number = 4;//前后端约定增加长度
        private static byteHead: ByteArray;

        constructor()
        {

        }

        /** 处理服务端推送信息*/
        public static parseMsg(reciveBuff: ByteArray)
        {
            let bodyLen: number = reciveBuff.readInt() - BufferGid.ADD_L;
            let msgId: number = reciveBuff.readInt();

            let bodyBuff: egret.ByteArray = ByteArrayPool.getInstance().createByte();
            reciveBuff.readBytes(bodyBuff, 0, bodyLen);

            let decBodyBuff = this.decryptForDis(bodyBuff);  //解密
            ByteArrayPool.getInstance().recycleByte(bodyBuff);

            Rpc.getInstance().onDataIn(msgId, decBodyBuff);
            ByteArrayPool.getInstance().recycleByte(decBodyBuff);
        }

        /**
         * 
         * 向服务器发送信息
         * msg:构造的com.message.***proto消息
         * isLog:是否显示发送日志
         * 
         */
        public static getSendMsg(msg: any, msgId: number, isLog: boolean = false): egret.ByteArray
        {
            var className: string = MessageIDLogin.getMsgNameById(msgId);
            if(MessageID && MessageID.getMsgNameById){
                let tryClassName = MessageID.getMsgNameById(msgId);
                if(tryClassName){
                    className = tryClassName;
                }
            }
            var data: Uint8Array = com.message[className].encode(msg).finish();
            var msgLength: number = data.byteLength;

            var buff: egret.ByteArray;
            if (className == undefined || msgId == undefined)
            {
                LogUtil.log("[send:error:" + msg + "]");
                return buff;
            }
            if (isLog && qmr.PlatformConfig.isDebug) LogUtil.log("[C_S:" + msgId + " " + className + "] msgLength:" + msgLength);

            var enBytes = this.encryptForDis(data, msgLength);//加密
            buff = ByteArrayPool.getInstance().createByte();
            buff.writeInt(msgLength + BufferGid.ADD_L);
            buff.writeInt(msgId);
            buff.writeBytes(enBytes);

            ByteArrayPool.getInstance().recycleByte(enBytes);
            return buff;
        }

        //位移加密
        public static encryptForDis(data: Uint8Array, byteLen: number): egret.ByteArray
        {
            var bytes: egret.ByteArray = ByteArrayPool.getInstance().createByte();
            bytes._writeUint8Array(data);
            var buff: number;
            var utf8Array: Uint8Array = bytes.bytes;
            for (var i: number = 0; i < byteLen; i += 5)
            {
                if (i + 3 > byteLen - 1) break;
                buff = ~utf8Array[i + 2];
                utf8Array[i + 2] = utf8Array[i + 3];
                utf8Array[i + 3] = buff;
            }
            return bytes;
        }

        /**  
        * 位移解密
        */
        public static decryptForDis(data: ByteArray): ByteArray
        {
            var bodyBytes: egret.ByteArray = ByteArrayPool.getInstance().createByte();
            bodyBytes.writeBytes(data);
            var buff: number;
            let utf8Array: Uint8Array = bodyBytes.bytes;
            var byteLen: number = utf8Array.byteLength;
            for (var i: number = 0; i < byteLen; i += 5)
            {
                if (i + 3 > byteLen - 1) break;
                buff = utf8Array[i + 2];
                utf8Array[i + 2] = ~utf8Array[i + 3];
                utf8Array[i + 3] = buff;
            }
            return bodyBytes;
        }

    }
}
