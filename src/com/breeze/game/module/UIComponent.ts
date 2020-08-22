module qmr
{
    export class UIComponent extends eui.Component
    {
        protected isSkinLoaded: boolean;
        private _data: any;
        private _eventDic: any;
        private _unpackDic: any;//exml中固定的unpack资源
        private _unpackDynamic: any;//程序动态设置的unpack资源
        private _notifyDic: any;
        private _touchBeginTaret: any;

        public constructor()
        {
            super();
            this._eventDic = {};
            this._notifyDic = {};
            this._unpackDic = {};
            this._unpackDynamic = {};
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreationComplete, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStage, this);
        }

		/**
		 * 组件初始化完毕
		 */
        protected onCreationComplete(evt: eui.UIEvent): void
        {
            this.initComponent();
            this.isSkinLoaded = true;
            this.initListener();
            this.initData();
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreationComplete, this);
        }

        protected initUnpackRes(container:egret.DisplayObjectContainer): void
        {
            let t = this;
            let num = container.numChildren;
            if (container instanceof eui.Component){
                if (container.skin instanceof eui.Skin){
                    t.initStatesUnpackRes(container.skin, container);
                }
            }
            for(let i = 0; i < num; i++){
                let child = container.getChildAt(i);
                if (child instanceof egret.DisplayObjectContainer){
                    t.initUnpackRes(child);
                }
                else if (child instanceof eui.Image){
                    let source = child.source;
                    if (typeof source == "string" && source != ""){
                        let info = RES.getResourceInfo(source);
                        
                        if (info && info.url.substr(0,6) == "unpack"){
                            t.addUnpackRef(source, child);
                        }
                    }
                }
            }
        }
        
        protected initStatesUnpackRes(skin:eui.Skin, container:egret.DisplayObjectContainer): void
        {
            let t = this;
            let current = skin.currentState;
            for(let state of skin.states){
                if (state.name == current){
                    continue;
                }
                for( let item of state.overrides){
                    if (item instanceof eui.SetProperty){
                        if (item.name == "source"){
                            let source = item.value;
                            if (typeof source == "string" && source != ""){
                                let info = RES.getResourceInfo(source);
                                
                                if (info && info.url.substr(0,6) == "unpack"){
                                    let child = container[item.target];
                                    if (child instanceof eui.Image){
                                       t.addUnpackRef(source, child);
                                    }
                                }
                            }
                        }
                    }
                    else if (item instanceof eui.AddItems){
                        let image = container[item.target];
                        if (!image){
                            image = skin[item.target];
                        }
                        if (image instanceof eui.Image){
                            let source = image.source;
                            if (typeof source == "string" && source != ""){
                                let info = RES.getResourceInfo(source);

                                if (info && info.url.substr(0,6) == "unpack"){
                                    t.addUnpackRef(source, image);
                                }
                            }
                        }
                    }
                }
            }
        }

        private addUnpackRef(source: string, child:eui.Image): void
        {
            let t = this;
            let imageArr = t._unpackDic[source];
            if (imageArr){
                imageArr.push(child);
            }
            else{
                t._unpackDic[source] = [child];
            }
        }

        protected addedToStage(evt: egret.Event): void
        {
            //this.registerNotify(StageUtil.STAGE_RESIZE, this.onStageResize, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        }

        protected removeFromStage(evt: egret.Event): void
        {
            //NotifyManager.removeThisObjectNofity(this);
            //this.unRegisterNotify(StageUtil.STAGE_RESIZE, this.onStageResize, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        }
        /**
         * 初始化组件,需被子类继承
         */
        protected initComponent(): void
        {
            
        }
        /**
        * 初始化数据
        */
        protected initData(): void
        {
            this.onStageResize();
            let unpackDic = this._unpackDic;
            for(let key in unpackDic){
                if (!RES.getRes(key)){
                    let imageArr:eui.Image[] = unpackDic[key];
                    if (imageArr){
                        for(let image of imageArr){
                            image.source = null;
                            image.source = key;
                        }
                    }
                }
                LoaderManager.instance.addGroupRef(key);
            }
        }

		/**
		 * @description 获取当前属于这个模块的数据
		 */
        public get data(): any
        {
            return this._data;
        }
		/**
		 * @description 获取当前属于这个模块的数据
		 */
        public set data(data: any)
        {
            this._data = data;
        }

        /**
         * 初始化事件监听器,需被子类继承
         */
        protected initListener(): void
        {
            
        }

        protected onStageResize()
        {

        }

        /**
		 * @description 注册一个消息
		 * @param type 消息类型
		 * @param callBack 回调函数
		 * @param thisObject 当前作用域对象
		 */
        public registerNotify(type: string, callBack: Function, thisObject: any = null): void
        {
            thisObject = thisObject ? thisObject : this;
            this._notifyDic[type] = { callBack: callBack, thisObject: thisObject };
            NotifyManager.registerNotify(type, callBack, thisObject);
        }

        /**
		 * @description 取消一个注册消息
		 * @param type 消息类型
		 * @param callBack 回调函数
		 * @param thisObject 当前作用域对象
		 */
        public unRegisterNotify(type: string, callBack: Function, thisObject: any = null): void
        {
            thisObject = thisObject ? thisObject : this;
            let obj = this._notifyDic[type];
            if (obj && obj.callback == callBack && obj.thisObject == thisObject)
            {
                delete this._notifyDic[type];
            }
            NotifyManager.unRegisterNotify(type, callBack, thisObject);
        }

        public unRegisterAllNotify(): void
        {
            let temp;
            let notifyDic = this._notifyDic;
            for (let type in notifyDic)
            {
                temp = notifyDic[type];
                if (temp)
                {
                    NotifyManager.unRegisterNotify(type, temp.callBack, temp.thisObject);
                }
                delete notifyDic[type];
            }
            this._notifyDic = {};
        }

        /**
		 * @description 发送一个消息通知
		 */
        public dispatch(type: string, params: any = null): void
        {
            NotifyManager.sendNotification(type, params);
        }

        /**
         * 事件注册，所有事件的注册都需要走这里
         */
        public addEvent(target: egret.EventDispatcher, type: string, callBack: Function, thisObject: any = null): void
        {
            thisObject = thisObject ? thisObject : this;
            var eventParams: any = {};
            eventParams.target = target;
            eventParams.type = type;
            eventParams.callBack = callBack;
            eventParams.thisObject = thisObject;
            if (target)
            {
                target.addEventListener(type, callBack, thisObject);
                this._eventDic[target.hashCode + type] = eventParams;
            }
        }
		/**
		 * @description 添加点击函数
		 */
        protected addClickEvent(target: egret.EventDispatcher, callBack: Function, thisObject: any = null): void
        {
            let t = this;
            let eventDic = t._eventDic;
            let scaleX = 1.0;
            let scaleY = 1.0;
            thisObject = thisObject ? thisObject : t;
            if (target instanceof eui.Group)
            {
                target.touchChildren = false;
            }
            if (target instanceof egret.DisplayObject)
            {
                if (target.anchorOffsetX == 0 && target.anchorOffsetY == 0)
                {
                    let harfWidth = target.width / 2;
                    let harfHeight = target.height / 2;
                    target.anchorOffsetX = harfWidth;
                    target.anchorOffsetY = harfHeight;
                    target.x += harfWidth;
                    target.y += harfHeight;
                }
                scaleX = target.scaleX;
                scaleY = target.scaleY;
            }
            var eventParams: any = {};
            eventParams.target = target;
            eventParams.scaleX = scaleX;
            eventParams.scaleY = scaleY;
            eventParams.type = egret.TouchEvent.TOUCH_BEGIN;
            eventParams.thisObject = thisObject;
            eventParams.callFunc = t.onTouchBegin;
            eventParams.thisCall = t;
            if (target)
            {
                target.addEventListener(eventParams.type, t.onTouchBegin, t);
                eventDic[target.hashCode + eventParams.type] = eventParams;
            }
            var eventParamsEnd: any = {};
            eventParamsEnd.target = target;
            eventParamsEnd.scaleX = scaleX;
            eventParamsEnd.scaleY = scaleY;
            eventParamsEnd.type = egret.TouchEvent.TOUCH_END;
            eventParamsEnd.callBack = callBack;
            eventParamsEnd.thisObject = thisObject;
            eventParamsEnd.callFunc = t.onTouchEnd;
            eventParamsEnd.thisCall = t;
            if (target)
            {
                target.addEventListener(eventParamsEnd.type, t.onTouchEnd, t);
                eventDic[target.hashCode + eventParamsEnd.type] = eventParamsEnd;
            }
            var eventParamsTap: any = {};
            eventParamsTap.target = target;
            eventParamsTap.scaleX = scaleX;
            eventParamsTap.scaleY = scaleY;
            eventParamsTap.type = egret.TouchEvent.TOUCH_TAP;
            eventParamsTap.callBack = callBack;
            eventParamsTap.thisObject = thisObject;
            eventParamsTap.callFunc = t.onTouchEnd;
            eventParamsTap.thisCall = t;
            if (target)
            {
                target.addEventListener(eventParamsTap.type, t.onTouchEnd, t);
                eventDic[target.hashCode + eventParamsTap.type] = eventParamsTap;
            }
            var eventParamsOutSide: any = {};
            eventParamsOutSide.target = target;
            eventParamsOutSide.scaleX = scaleX;
            eventParamsOutSide.scaleY = scaleY;
            eventParamsOutSide.type = egret.TouchEvent.TOUCH_RELEASE_OUTSIDE;
            eventParamsOutSide.thisObject = thisObject;
            eventParamsOutSide.callFunc = t.onTouchReleaseOutSide;
            eventParamsOutSide.thisCall = t;
            if (target)
            {
                target.addEventListener(eventParamsOutSide.type, t.onTouchReleaseOutSide, t);
                eventDic[target.hashCode + eventParamsOutSide.type] = eventParamsOutSide;
            }
            var eventParamsCanel: any = {};
            eventParamsCanel.target = target;
            eventParamsCanel.scaleX = scaleX;
            eventParamsCanel.scaleY = scaleY;
            eventParamsCanel.type = egret.TouchEvent.TOUCH_CANCEL;
            eventParamsCanel.thisObject = thisObject;
            eventParamsCanel.callFunc = t.onTouchReleaseOutSide;
            eventParamsCanel.thisCall = t;
            if (target)
            {
                target.addEventListener(eventParamsCanel.type, t.onTouchReleaseOutSide, t);
                eventDic[target.hashCode + eventParamsCanel.type] = eventParamsOutSide;
            }
        }
		/**
		 * @description 当点击开始
		 */
        private onTouchBegin(evt: egret.TouchEvent): void
        {
            let target: egret.DisplayObject = evt.target;
            let hashCode = target.hashCode;

            let obj = this._eventDic[hashCode + evt.type];
            this._touchBeginTaret = target;
            egret.Tween.removeTweens(target);
            egret.Tween.get(target).to({ scaleX: obj.scaleX * 0.9, scaleY: obj.scaleY * 0.9 }, 50);
            
            this.loadAndPlayEffect("SOUND_DIANJI");
        }

        /**
         * @description 当点击结束
         */
        private onTouchEnd(evt: egret.TouchEvent): void
        {
            let t = this;
            let target: any = evt.target;
            let eventDic = t._eventDic;
            if (t._touchBeginTaret != target) return;
            t._touchBeginTaret = null;

            let obj = eventDic[target.hashCode + evt.type];
            let touchScaleX = obj.scaleX;
            let touchScaleY = obj.scaleY;

            egret.Tween.get(target).to({ scaleX: touchScaleX, scaleY: touchScaleY }, 50).call(function ()
            {
                for (let key in eventDic)
                {
                    let eventParams: any = eventDic[key];
                    if (eventParams.target == target && eventParams.type == egret.TouchEvent.TOUCH_END)
                    {
                        eventParams.callBack.call(eventParams.thisObject, target);
                    }
                }
            }, t);
        }
        /**
         * @description 当点击结束的时候，按钮不在被点击的对象上
         */
        private onTouchReleaseOutSide(evt: egret.TouchEvent): void
        {
            let t = this;
            if (t._touchBeginTaret != evt.target) return;
            t._touchBeginTaret = null;
            let obj = t._eventDic[evt.target.hashCode + evt.type];
            if (obj){
                evt.target.scaleX = obj.scaleX;
                evt.target.scaleY = obj.scaleY;
            }
        }
        /**
         * 统一移除所有事件
         */
        public removeAllEvent(): void
        {
            let tempEvent;
            let tempTarget;
            let eventDic = this._eventDic;
            for (let name in eventDic)
            {
                tempEvent = eventDic[name];
                tempTarget = tempEvent.target;
                if (tempTarget != null)
                {
                    if (tempEvent.type == egret.TouchEvent.TOUCH_TAP && !(tempTarget instanceof egret.Stage)){
                        if (tempEvent.scaleX != undefined) tempTarget.scaleX = tempEvent.scaleX;
                        if (tempEvent.scaleY != undefined) tempTarget.scaleY = tempEvent.scaleY;
                    }
                    tempTarget.removeEventListener(tempEvent.type, tempEvent.callBack, tempEvent.thisObject);
                    tempTarget.removeEventListener(tempEvent.type, tempEvent.callFunc, tempEvent.thisCall);
                }
                delete eventDic[name];
            }
            this._eventDic = {};
        }

        /**
		 * 更新标题
		 */
        public updateTitle(title: string, ruleId:number): void
        {
            if (title || ruleId > 0){
                NotifyManager.sendNotification(NotifyConstLogin.UPDATE_MODULE_TITLE, {title:title,ruleId:ruleId});
            }
            else if (!title && ruleId == undefined){
                NotifyManager.sendNotification(NotifyConstLogin.UPDATE_MODULE_TITLE, {ruleId:0});
            }
        }

        /**
         * 播放音效
         */
        protected loadAndPlayEffect(soundType: string, loops: number = 1,isOneKey:boolean = false): void
        {
            SoundManager.getInstance().loadAndPlayEffect(soundType,loops,isOneKey);
        }
        /**
         * 停止音效
         */
        protected stopSoundEffect(soundType: string): void
        {
            SoundManager.getInstance().stopSoundEffect(soundType);
        }

        /** 每次initData执行一次 ,动态增加引用计数 */
        public addUnpackRes(unpack: string | string[]): void
        {
            let dynamic = this._unpackDynamic;
            if (typeof unpack === "string"){
                if (!dynamic[unpack]){
                    dynamic[unpack] = true;
                    LoaderManager.instance.addGroupRef(unpack);
                }
            }
            else{
                for(let name of unpack){
                    if (!dynamic[name]){
                        dynamic[name] = true;
                        LoaderManager.instance.addGroupRef(name);
                    }
                }
            }
        }

        /** 每次dispose执行一次 ,清引用*/
        protected destoryUnpackRes(): void
        {
            for (let unpack in this._unpackDic)
            {
                LoaderManager.instance.destoryGroup(unpack);
            }
            for (let unpack in this._unpackDynamic)
            {
                LoaderManager.instance.destoryGroup(unpack);
            }
            this._unpackDynamic = {};
        }

        /**
         * 资源释放
         * @$isDispos 是否彻底释放资源
         */
        public dispose($isDispos: boolean = false): void
        {
            let t = this;
            t.destoryUnpackRes();
            t.removeAllEvent();
            t.unRegisterAllNotify();
            t._touchBeginTaret = null;
            t._data = null;
            if (t.parent)
            {
                t.parent.removeChild(t);
            }
            if (ModuleManager.openPanelFromBattle)
            {
                ModuleManager.openPanelFromBattle = false;
            }
        }
    }
}
