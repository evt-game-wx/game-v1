module qmr {
    /**资源加载管理器 */
    export class ResManager{
        /**该等级及以下最多占用的加载进程数 */
        private static LOW_PRIORITY_MAX_COUNT: number = 1;
        /**该等级及以下最多占用的加载进程数 */
        private static HIGH_PRIORITY_MAX_COUNT:number = 4;
        /**正在加载的loader个数 */
        private static _loadingCount: number = 0;
        /**等待加载的队列 */
        private static _loaderQueue:Loader[];
        /**相同地址的加载信息存储 */
        private static _sameResInfoDic: Dictionary;

        /**加载资源组 */
        public static loadGroup(source: string, compFunc:Function = null, thisObject: any = null, priority: number = 0, progFunc: Function = null){
            ResManager.addLoader(source, compFunc, thisObject, priority, null, true, progFunc);
        }

        /**加载单个资源 */
        public static getRes(source: string, compFunc:Function, thisObject: any, priority: number = 0, type: string = null){
            if(!source){
                return;
            }
            function onGetRes(data: any): void {
                if(compFunc){
                    compFunc.call(thisObject, data, source);
                }
            }
            if (RES.hasRes(source)) {
                let data = RES.getRes(source);
                if (data) {
                    onGetRes(data);
                    return;
                }
            }
            ResManager.addLoader(source, compFunc, thisObject, priority, type);
        }

        /**添加一个加载器 */
        private static addLoader(source: string, compFunc:Function, thisObject: any, priority: number = 0, type: string = null, isGroup: boolean = false, progFunc: Function = null){
            let loader = LoaderPool.get();
            loader.init(ResManager.loaderCompleted, source, compFunc, thisObject, type, priority, isGroup, progFunc);
            //相同资源地址加载器处理
            let sameResInfoDic = ResManager._sameResInfoDic;
            if(!sameResInfoDic){
                sameResInfoDic = new Dictionary();
                ResManager._sameResInfoDic = sameResInfoDic;
            }
            let sameResInfos:Loader[] = sameResInfoDic.get(source);
            if(sameResInfos){
                sameResInfos.push(loader);
                //处理之前添加的加载器优先级
                ResManager.checkSameLoaderPriority(source, priority);
            } else {
                sameResInfos = [];
                sameResInfoDic.set(source, sameResInfos);
                if(priority >= LoadPriority.IMMEDIATELY){
                    ResManager.startLoader(loader);
                } else{
                    let loaderQueue = ResManager._loaderQueue;
                    if(!loaderQueue){
                        loaderQueue = [];
                        ResManager._loaderQueue = loaderQueue;
                    }
                    loaderQueue.push(loader);
                    ResManager.checkToLoadNext();
                }
            }
            
        }

        /**检查并处理相同资源地址加载器的优先级 */
        private static checkSameLoaderPriority(source: string, priority: number){
            let loaderQueue = ResManager._loaderQueue;
            if(loaderQueue){
                let len = loaderQueue.length;
                for (let i = 0; i < len; i++){
                    let loader: Loader = loaderQueue[i];
                    if(loader.source == source){
                        if(loader.priority < priority){
                            loader.priority = priority;
                            if(priority == LoadPriority.IMMEDIATELY){
                                loaderQueue.splice(i, 1);
                                ResManager.startLoader(loader);
                            } else {
                                ResManager.checkToLoadNext();
                            }
                        }
                        break;
                    }
                }
            }
        }

        /**检测加载下一个 */
        private static checkToLoadNext(){
            let loaderQueue = ResManager._loaderQueue;
            if(loaderQueue){
                let len = loaderQueue.length;
                if(len > 0){
                    let loader = loaderQueue[len - 1];
                    let toLoad: boolean = false;
                    if(loader.priority >= LoadPriority.HIGH){
                        if(ResManager._loadingCount < ResManager.HIGH_PRIORITY_MAX_COUNT){
                            toLoad = true;
                        }
                    } else if(loader.priority <= LoadPriority.LOW){
                        if(ResManager._loadingCount < ResManager.LOW_PRIORITY_MAX_COUNT){
                            toLoad = true;
                        }
                    }
                    if(toLoad){
                        loader = loaderQueue.pop();
                        ResManager.startLoader(loader);
                    }
                }
            }
        }

        // private static testa = 0;
        // private static testb = 0;
        /**启动一个加载器 */
        private static startLoader(loader: Loader){
            // ResManager.testa++;
            // console.log("loadtest startLoader source=", loader.source, ResManager.testa);
            // console.log("startLoader");
            ResManager._loadingCount ++;
            // console.log("loadtest startLoader _loadingCount=", ResManager._loadingCount);
            // LogUtil.log("ResManager.startLoader", loader.source, loader.priority);
            loader.load();
        }

        /**加载器完成或者错误回调 */
        private static loaderCompleted(loader:Loader, isSuccess: boolean, data: any){
            // LogUtil.log("ResManager.loaderCompleted", loader.source, loader.priority, isSuccess);
            // ResManager.testb++;
            // console.log("loadtest loaderCompleted source=", loader.source, ResManager.testb);
            // LogUtil.log("loaderCompleted", loader.source, loader.isGroup, isSuccess, data);
            try{
                if(isSuccess){
                    //回调至加载发起者
                    ResManager.callbackLoader(loader, data);
                    //处理未开始的相同图集的加载器
                    let loaderQueue = ResManager._loaderQueue;
                    if(loaderQueue && loaderQueue.length > 0){
                        let len = loaderQueue.length;
                        for (let i = len - 1; i >= 0; i--){
                            let loaderOther: Loader = loaderQueue[i];
                            if (RES.hasRes(loaderOther.source)) {
                                let dataOther = RES.getRes(loaderOther.source);
                                if (dataOther) {
                                    ResManager.callbackLoader(loaderOther, dataOther);
                                    loaderQueue.splice(i, 1);
                                    LoaderPool.recycle(loaderOther);
                                    // console.log("loaderCompleted loaderQueue i=", i, ResManager._loaderQueue);
                                }
                            }
                        }
                    }
                }
                //处理已缓存的相同路径的加载器
                let sameResInfos:Loader[] = ResManager._sameResInfoDic.get(loader.source);
                let len = 0;
                if(sameResInfos){
                    ResManager._sameResInfoDic.remove(loader.source);
                    if(isSuccess){
                        len = sameResInfos.length;
                        for (let i = 0; i < len; i++){
                            let loaderSame: Loader = sameResInfos[i];
                            ResManager.startLoader(loaderSame);
                        }
                    }
                }
                //回收清除
                LoaderPool.recycle(loader);
            } catch(err){
                qmr.LogUtil.log("ResManager.loaderCompleted error" + err)
            } finally{
                //加载计数处理
                ResManager._loadingCount --;
                //检测是否开始新的加载
                ResManager.checkToLoadNext();
            }
        }

        /**回调至加载发起者 */
        private static callbackLoader(loader: Loader, data: any){
            if(loader.compFunc){
                if(data){
                    loader.compFunc.call(loader.thisObject, data, loader.source);
                } else{
                    loader.compFunc.call(loader.thisObject);
                }
            }
        }

    }

    export enum LoadPriority{
        LOW = -1,//低，预加载级别
        HIGH = 0,//高，界面级别
        IMMEDIATELY = 1//立即，动画加载
    }

    /**对象池，用于管理加载器的创建和回收 */
    class LoaderPool{
        private static _pool: Loader[];

        private static getPool(): Loader[]{
            let pool = LoaderPool._pool;
            if(!pool){
                pool = [];
                LoaderPool._pool = pool;
            }
            return pool;
        }

        public static get(): Loader{
            let loader: Loader;
            let pool = LoaderPool.getPool();
            if(pool.length > 0){
                loader = pool.pop();
            } else {
                loader = new Loader();
            }
            return loader;
        }

        public static recycle(loader: Loader){
            loader.reset();
            let pool = LoaderPool.getPool();
            pool.push(loader);
        }
    }

    /**加载器，执行单个加载任务 */
    class Loader{
        public callbackMananger: Function;
        public source: string;
        public compFunc: Function;
        public thisObject: any;
        public type: string;
        public priority:number;
        public isGroup: boolean;
        public progFunc: Function;
        public loadCount: number;

        public init(callbackMananger: Function, source: string, compFunc:Function, thisObject: any, type: string, priority: number = 0, isGroup: boolean = false, progFunc: Function = null){
            this.callbackMananger = callbackMananger;
            this.source = source;
            this.compFunc = compFunc;
            this.thisObject = thisObject;
            this.type = this.type;
            this.priority = priority;
            this.isGroup = isGroup;
            this.progFunc = progFunc;
            this.loadCount = 0;
        }

        public load(){
            this.loadCount ++;
            if(this.isGroup){
                if(this.loadCount <= 1){
                    RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
                    RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onGroupProgress, this);
                    RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupLoadCompleted, this); 
                }
                RES.loadGroup(this.source);
            } else {
                let resInConfig = false;
                if (RES.hasRes(this.source)) {
                    resInConfig = true;
                    let data = RES.getRes(this.source);
                    if (data) {
                        this.onGetResSuccess(data);
                        return;
                    }
                }
                if(this.loadCount <= 1){
                    RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                }
                if(resInConfig) {
                    RES.getResAsync(this.source, this.onGetResSuccess, this);
                } else {
                    RES.getResByUrl(this.source, this.onGetResSuccess, this, this.type);
                }
            } 
        }

        public reset(){
            if(this.isGroup){
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onGroupProgress, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupLoadCompleted, this); 
            } else {
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            }
            this.callbackMananger = null;
            this.source = null;
            this.compFunc = null;
            this.thisObject = null;
            this.type = null;
            this.priority = null;
            this.isGroup = false;
            this.progFunc = null;
            this.loadCount = 0;
        }
        
        private onGetResSuccess(data: any): void {
            //回调至manager
            if(this.callbackMananger){
                this.callbackMananger(this, true, data);
            }
        }

        private onItemLoadError(evt: RES.ResourceEvent): void {
            if (this.source == evt.resItem.url) {
                LogUtil.log("onItemLoadError", this.source)
                if(this.callbackMananger){
                    this.callbackMananger(this,false);
                }
            }
        }

        private onGroupLoadCompleted(evt: RES.ResourceEvent): void {
            if(this.source == evt.groupName){
                //回调至manager
                if(this.callbackMananger){
                    this.callbackMananger(this,true);
                }
            }
        }

        private onGroupLoadError(evt: RES.ResourceEvent): void {
            if(this.source == evt.groupName){
                if(this.callbackMananger){
                    this.callbackMananger(this,false);
                }
            }
        }
        
        private onGroupProgress(evt:RES.ResourceEvent):void
        {
            if(this.source == evt.groupName){
                if(this.progFunc){
                    this.progFunc(evt.itemsLoaded / evt.itemsTotal);
                }
            }
        }

    }
}
