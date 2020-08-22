namespace qmr
{
    import DisplayObjectContainer = egret.DisplayObjectContainer;
    export class ModuleManager
    {
        /** 映射class */
        private static _classAppMap: any = {};
        private static _cacheAppMap: Dictionary = new Dictionary();
        private static _currView: SuperBaseModule;//当前窗口
        /** 需要手动关闭 */
        public static _NO_TRIGGER_MODULE = [];
        /**重置未开放时不显示的视图 */
        public static NO_RECHARGE_HIDE_VIEW = [];
        //是否从战斗中打开
        public static openPanelFromBattle: boolean = false;

        constructor()
        {

        }

        public static clearModuleTick(now: number, maxAliveTime: number)
        {
            let t = this;
            let cacheAppMap = t._cacheAppMap;
            let keyArr = cacheAppMap.keys;
            for (let key of keyArr)
            {
                let app: SuperBaseModule = cacheAppMap.get(key);
                if (!app)
                {
                    LogUtil.error("ModuleManager.cacheAppMap变成空了？？ " + key);
                    continue;
                }
                if (!app.getEffective(now, maxAliveTime))
                {
                    cacheAppMap.remove(key);
                    LogUtil.warn("ModuleManager.clear " + key);
                }
            }
        }

        public static popModule(className: string, data: any = null, layer: string = LayerConst.ALERT, closeAll: boolean = false, isShowClose: boolean = true): void
        {
            ModuleManager.showModule(className, data, layer, closeAll, isShowClose);
            SoundManager.getInstance().loadAndPlayEffect("SOUND_TANCHU");
        }

        /** 
         * 显示一个界面
         * @className   打开的窗口实例
         * @data        携带数据
         * @layer       打开的窗口父级
         * @closeAll    是否关闭其它窗口
         * @isShowClose 是打开状态，要不要关闭
         * @closeOpenPanel 关闭后要打开的界面
         */
        public static showModule(className: string, data: any = null, layer: string = LayerConst.BASE_UI, closeAll: boolean = true, isShowClose: boolean = true, closeOpenPanel: string = "",
            closeOpenPanelData: any = null, preModule: SuperBaseModule = null): void
        {
            let t = this;
            let win: SuperBaseModule = t.getAppByClass(className) as SuperBaseModule;
            if (win)
            {
                win.preModule = preModule;
                win.name = className;
                win.closeOpenPanel = closeOpenPanel;
                win.closeOpenPanelData = closeOpenPanelData;
                if (isShowClose && win.isShow)
                {
                    if (t._NO_TRIGGER_MODULE.indexOf(className) != -1)
                    {//战斗界面打开情况下不关闭
                        win.show(data);
                        return;
                    }
                    t.hideModule(className);
                    return;
                }

                if (closeAll)
                {
                    t.closeAllWindow();
                }
                win.show(data);
                t._currView = win;
                let groupName = win.groupName;
                if (groupName != undefined && groupName != "") 
                {
                    if (groupName.match("_json")) 
                    {
                        ResManager.getRes(groupName, null, t);
                    } else {
                        ResManager.loadGroup(groupName);
                    }
                    LoaderManager.instance.addGroupRef(groupName);
                }
                win.layer = layer;
                LayerManager.instance.getLayer(layer).addChild(win);
                if (win.title)
                {
                    win.updateTitle(win.title, win.ruleId);
                }
                LogUtil.log("[openModule:" + className + "]");
                NotifyManager.sendNotification(NotifyConstLogin.OPEN_PANEL_VIEW, className);
                NotifyManager.sendNotification(NotifyConstLogin.OPEN_PANEL_LAYER, layer);
            }
            t.sendToTop();
        }

        /** 一个模块是否在显示中 */
        public static isShowModule(className: string): boolean
        {
            var win: SuperBaseModule = this._cacheAppMap.get(className) as SuperBaseModule;
            if (win)
            {
                return win.isShow;
            }
            return false;
        }

        /** 关闭一个界面 */
        public static hideModule(className: string | SuperBaseModule, isHideEffect: boolean = false): void
        {
            let t = this;
            let win: SuperBaseModule;
            let viewName = className;
            if (className instanceof SuperBaseModule)
            {
                win = className;
                viewName = win.name;
            }
            else
            {
                win = t._cacheAppMap.get(className) as SuperBaseModule;
            }
            if (win)
            {
                if (!win.isShow)
                {
                    return;
                }
                if (isHideEffect)
                {
                    win.hide();
                } else
                {
                    t.disposWin(win);
                }
                if (win.closeOpenPanel)
                {
                    t.showModule(win.closeOpenPanel, win.closeOpenPanelData);
                }
            }
            NotifyManager.sendNotification(NotifyConstLogin.CLOSE_PANEL_VIEW, viewName);
        }

        /** 关闭所有界面 */
        public static closeAllWindow(): void
        {
            let t = this;
            let sp: DisplayObjectContainer = LayerManager.instance.getLayer(LayerConst.BASE_UI);
            let win: DisplayObjectContainer;
            while (sp.numChildren)
            {
                win = sp.getChildAt(0) as DisplayObjectContainer;
                t.disposWin(win);
            }

            /** 弹出层 */
            sp = LayerManager.instance.getLayer(LayerConst.ALERT);
            while (sp.numChildren)
            {
                win = sp.getChildAt(0) as DisplayObjectContainer;
                t.disposWin(win);
            }
        }

        public static getCurrentView():SuperBaseModule
        {
            return this._currView;
        }

        /** 关闭当前界面 */
        public static closeCurrentModule()
        {
            if (this._currView)
            {
                this.disposWin(this._currView);
            }
        }

        /** 根据类获取缓存实例 */
        public static getAppByClass(appClass: string): SuperBaseModule
        {
            if (appClass == null) return null;
            var now = egret.getTimer();
            let t = this;
            var app: SuperBaseModule = t._cacheAppMap.get(appClass) as SuperBaseModule;
            var maxAliveTime: number = LoaderManager.instance.maxLivingTime;
            if (app == null || !app.getEffective(now, maxAliveTime))
            {
                let className = t.getClassName(appClass);
                app = new className() as SuperBaseModule;
                //app = eval("new " + appClass);//微信里面不支持。。
                t._cacheAppMap.set(appClass, app);
            }
            return app;
        }

        /** 获取在舞台中的指定显示对象,若在舞台中返回该实例，否则返回null */
        public static getSuperBaseModuleByClass(appClass: string): SuperBaseModule
        {
            let SuperBaseModule: SuperBaseModule = this._cacheAppMap.get(appClass) as SuperBaseModule;
            if(SuperBaseModule && SuperBaseModule.stage){
                return SuperBaseModule;
            }
            return null;
        }

        /**
		 *  获取模块中某个控件在舞台中的位置
		 */
        public static getComponentGlobalPoint(moduleName: string, componentName: string): any
        {
            let SuperBaseModule: SuperBaseModule = this._cacheAppMap.get(moduleName);
            if (SuperBaseModule)
            {
                return SuperBaseModule.getComponentGlobalPoint(componentName);
            }
            return { x: 0, y: 0 };
        }

        private static addMask(layer: string, isAlpha0: boolean = false): LayerMaskSprite
        {
            let mask = LayerMaskSprite.getLayerMaskSprite();
            mask.addMask(layer, isAlpha0);
            return mask;
        }

        private static disposWin(win: DisplayObjectContainer)
        {
            if (win instanceof SuperBaseModule)
            {
                win.dispose();
                if (win.maskSprite)
                {
                    win.maskSprite.tweenRemoveMask();
                    win.maskSprite = null;
                }

                /** 若前一个模块是module并且尚未关闭，刷新前一个模块的指引 */
                if (win.preModule && win.preModule.parent)
                {
                    win.updateGuide();
                    win.preModule = null;
                }
            }
            else
            {
                DisplayUtils.removeDisplay(win);
            }
            this.sendToTop();


        }

        private static sendToTop()
        {
            var sp: DisplayObjectContainer = LayerManager.instance.getLayer(LayerConst.BASE_UI);
            // console.log("指引 sendToTop");
            NotifyManager.sendNotification(NotifyConstLogin.CLOSE_PANEL_LAYER, sp.numChildren);
            // Ticker.getInstance().unRegisterTick(this.sendToTopEvent, this);
            // Ticker.getInstance().registerTick(this.sendToTopEvent, this, 30, 1);
            this.sendToTopEvent();
        }

        /** 20190921 */
        private static sendToTopEvent()
        {
            NotifyManager.sendNotification(NotifyConstLogin.CHANGE_MODEL_VIEW);
        }

        /**
         * 根据模块名删除一个模块引用,一般用于一次性界面
         */
        public static deleteModule(moduleName: string): void
        {
            this._cacheAppMap.remove(moduleName);
        }

        public static setupClass()
        {
            let t = this;
            t.registerClass(ModuleNameLogin.LOGIN_VIEW, qmr.LoginView);//登录界面
            t.registerClass(ModuleNameLogin.GAME_LOADING_VIEW, qmr.GameLoadingView); //游戏加载界面

        }

        public static registerClass(name: string, appClass: any)
        {
            this._classAppMap[name] = appClass;
        }

        private static getClassName(name: string): any
        {
            return this._classAppMap[name];
        }
    }
}