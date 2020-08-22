module qmr
{
	/**
	 *
	 * @description 消息通知管理器
	 *
	 */
    export class NotifyManager
    {
        private static typeDic: any = {};
        public static splitTypeDic: any[] = [];

        private static logDic: any = {};

        public constructor()
        {
        }
		/**
		 * @description 注册一个消息
		 * @param type 消息类型
		 * @param callBack 回调函数
		 * @param thisObject 当前作用域对象
		 */
        public static registerNotify(type: string, callBack: Function, thisObject: any): void
        {
            let typeDic = NotifyManager.typeDic;
            let typeList: Array<any> = typeDic[type];
            if (!typeList)
            {
                typeDic[type] = [{ callback: callBack, thisObject: thisObject }];
            } else
            {
                let result: boolean = false;
                for (let item of typeList)
                {
                    if (item.callback == callBack && item.thisObject == thisObject)
                    {
                        result = true;
                        break;
                    }
                }
                if (!result)
                {
                    typeList.push({ callback: callBack, thisObject: thisObject });
                    typeDic[type] = typeList;
                }
            }
        }
		/**
		 * @description 取消一个注册消息
		 * @param type 消息类型
		 * @param callBack 回调函数
		 * @param thisObject 当前作用域对象
		 */
        public static unRegisterNotify(type: string, callBack: Function, thisObject: any): void
        {
            let typeList: Array<any> = NotifyManager.typeDic[type];
            if (typeList)
            {
                for (let item of typeList)
                {
                    if (item.callback == callBack && item.thisObject == thisObject)
                    {
                        let index: number = typeList.indexOf(item);
                        if (index != -1)
                        {
                            typeList.splice(index, 1);
                        }
                        break;
                    }
                }
                if (typeList.length == 0)
                {
                    delete NotifyManager.typeDic[type];
                }
                else
                {
                    NotifyManager.typeDic[type] = typeList;
                }
            }
        }

        /** 慎用，除非自己特有的事情类型 */
        public static unRegisterNotifyByType(type: string): void
        {
            delete NotifyManager.typeDic[type];
        }

        public static hasNotification(type: string): boolean
        {
            let typeList: Array<any> = NotifyManager.typeDic[type];
            if (typeList)
            {
                return typeList.length > 0;
            }
            return false;
        }
		/**
		 * @description 发送一个消息通知
		 */
        public static sendNotification(type: string, params: any = null): void
        {
            let typeList: Array<any> = NotifyManager.typeDic[type];

            if (typeList)
            {
                let count = typeList.length;
                let item: any;
                for (var i = count - 1; i >= 0; i--)
                {
                    item = typeList[i];
                    if (item && item.callback)
                    {
                        item.callback.call(item.thisObject, params);
                    }
                }
            }
        }

        /** 分批次处理事件 */
        public static sendNotificationSplit(type: string, params: any = null): void
        {
            let typeList: Array<any> = NotifyManager.typeDic[type];

            // let temp = JSON.parse( JSON.stringify(typeList));
            /**{ callback: any, thisObject: any, params: any } */
            let tempList: any[] = [];
            if (typeList)
            {
                let count = typeList.length;

                let item: any;
                for (var i = count - 1; i >= 0; i--)
                {
                    item = typeList[i];
                    if (item && item.callback)
                    {
                        if (!tempList[i])
                        {
                            tempList[i] = {};
                        }
                        tempList[i]["callback"] = item.callback;
                        tempList[i]["thisObject"] = item.thisObject;
                        tempList[i]["params"] = item.params;

                    }
                }

                NotifyManager.splitTypeDic.push(tempList);
            }
        }
		/**
		 * @description 移除对应thisObject的所有消息
		 */
        public static removeThisObjectNofity(thisObject: any): void
        {
            let typeDic = NotifyManager.typeDic;
            for (let type in typeDic)
            {
                let typeList: Array<any> = typeDic[type];
                for (let i: number = typeList.length - 1; i >= 0; i--)
                {
                    if (typeList[i].thisObject == thisObject)
                    {
                        typeList.splice(i, 1);
                    }
                }

                if (typeList.length == 0)
                {
                    delete typeDic[type];
                }
                else
                {
                    typeDic[type] = typeList;
                }
            }
        }

        /**
         * @description 打印下
         */
        public static test(): void
        {
            console.warn("NotifyManager.typeDic=======================================================>");
            console.warn(NotifyManager.typeDic);
            console.warn("egret.ticker=======================================================>");
            console.warn(egret.ticker);
        }
    }
}
