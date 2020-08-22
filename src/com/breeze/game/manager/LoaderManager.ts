namespace qmr
{
    export class LoaderManager
    {
        private static _instance: LoaderManager;
        public static get instance(): LoaderManager
        {
            if (!this._instance) { this._instance = new LoaderManager(); }
            return this._instance;
        }
        /**无引用计数后的最大存活时间，单位毫秒 */
        public maxLivingTime: number = 120000;
        private groupNameDic: any;
        private postFlag:boolean;
        public constructor()
        {
            let t = this;
            t.groupNameDic = {};
            //每分钟检测一次
            Ticker.getInstance().registerTick(t.clearGroupTick, t, 60000);
        }
        
        /**
         * addRef
         */
        public addGroupRef(groupName: string)
        {
            let obj = this.groupNameDic[groupName];
            if (!obj)
            {
                this.groupNameDic[groupName] = obj = {};
            }
            let count: number = obj.count;
            if (count)
            {
                count += 1;
            } 
            else
            {
                count = 1;
            }
            obj.count = count;
            qmr.LogUtil.log("LoaderManager.addGroupRef:", groupName, count);
        }

        /** 直接删除资源引用计数，而不是清理一次引用【慎用】 */
        public removeGroupRef(groupName: string)
        {
            if (groupName in this.groupNameDic){
                delete this.groupNameDic[groupName];
            }
        }

        /**
         * 释放资源名
         * groupName：释放的资源组/unpack url
         * force:是否立即释放资源组
         */
        public destoryGroup(groupName: string, force: boolean = false)
        {
            let obj = this.groupNameDic[groupName];
            if (obj)
            {
                let count: number = obj.count;
                if (count)
                {
                    count -= 1;
                } else
                {
                    count = 0;
                }
                if (count <= 0)
                {
                    count = 0;
                }
                obj.count = count;
                qmr.LogUtil.log("LoaderManager.destoryGroup:", groupName, count);
                if (count == 0)
                {
                    obj.livingTime = egret.getTimer();
                    if(force){
                        let result: boolean = RES.destroyRes(groupName);
                        LogUtil.warn("强制释放 " + groupName + "  " + result);
                        this.groupNameDic[groupName] = null;
                        delete this.groupNameDic[groupName];
                    }
                }
            }
        }

        protected clearGroupTick()
        {
            let now: number = egret.getTimer();
            let groupNameDic = this.groupNameDic;
            let maxLivingTime: number = this.maxLivingTime;

            for (let key in groupNameDic)
            {
                let item: any = groupNameDic[key];
                if (item.count == 0 && item.livingTime)
                {
                    if (now - item.livingTime > maxLivingTime)
                    {
                        let rootStr: boolean = RES.destroyRes(key);
                        LogUtil.warn("RES.destroyRes res:" + key + "  " + rootStr);
                        groupNameDic[key] = null;
                        delete groupNameDic[key];
                    }
                }
            }
            ModuleManager.clearModuleTick(now, maxLivingTime);
            AnimateManager.getInstance().clear(now);
        }
    }
}