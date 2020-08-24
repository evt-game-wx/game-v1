var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var qmr;
(function (qmr) {
    var UIComponent = (function (_super) {
        __extends(UIComponent, _super);
        function UIComponent() {
            var _this = _super.call(this) || this;
            _this._eventDic = {};
            _this._notifyDic = {};
            _this._unpackDic = {};
            _this._unpackDynamic = {};
            _this.addEventListener(eui.UIEvent.CREATION_COMPLETE, _this.onCreationComplete, _this);
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.addedToStage, _this);
            return _this;
        }
        /**
         * 组件初始化完毕
         */
        UIComponent.prototype.onCreationComplete = function (evt) {
            this.initComponent();
            this.isSkinLoaded = true;
            this.initListener();
            this.initData();
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreationComplete, this);
        };
        UIComponent.prototype.initUnpackRes = function (container) {
            var t = this;
            var num = container.numChildren;
            if (container instanceof eui.Component) {
                if (container.skin instanceof eui.Skin) {
                    t.initStatesUnpackRes(container.skin, container);
                }
            }
            for (var i = 0; i < num; i++) {
                var child = container.getChildAt(i);
                if (child instanceof egret.DisplayObjectContainer) {
                    t.initUnpackRes(child);
                }
                else if (child instanceof eui.Image) {
                    var source = child.source;
                    if (typeof source == "string" && source != "") {
                        var info = RES.getResourceInfo(source);
                        if (info && info.url.substr(0, 6) == "unpack") {
                            t.addUnpackRef(source, child);
                        }
                    }
                }
            }
        };
        UIComponent.prototype.initStatesUnpackRes = function (skin, container) {
            var t = this;
            var current = skin.currentState;
            for (var _i = 0, _a = skin.states; _i < _a.length; _i++) {
                var state = _a[_i];
                if (state.name == current) {
                    continue;
                }
                for (var _b = 0, _c = state.overrides; _b < _c.length; _b++) {
                    var item = _c[_b];
                    if (item instanceof eui.SetProperty) {
                        if (item.name == "source") {
                            var source = item.value;
                            if (typeof source == "string" && source != "") {
                                var info = RES.getResourceInfo(source);
                                if (info && info.url.substr(0, 6) == "unpack") {
                                    var child = container[item.target];
                                    if (child instanceof eui.Image) {
                                        t.addUnpackRef(source, child);
                                    }
                                }
                            }
                        }
                    }
                    else if (item instanceof eui.AddItems) {
                        var image = container[item.target];
                        if (!image) {
                            image = skin[item.target];
                        }
                        if (image instanceof eui.Image) {
                            var source = image.source;
                            if (typeof source == "string" && source != "") {
                                var info = RES.getResourceInfo(source);
                                if (info && info.url.substr(0, 6) == "unpack") {
                                    t.addUnpackRef(source, image);
                                }
                            }
                        }
                    }
                }
            }
        };
        UIComponent.prototype.addUnpackRef = function (source, child) {
            var t = this;
            var imageArr = t._unpackDic[source];
            if (imageArr) {
                imageArr.push(child);
            }
            else {
                t._unpackDic[source] = [child];
            }
        };
        UIComponent.prototype.addedToStage = function (evt) {
            //this.registerNotify(StageUtil.STAGE_RESIZE, this.onStageResize, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        };
        UIComponent.prototype.removeFromStage = function (evt) {
            //NotifyManager.removeThisObjectNofity(this);
            //this.unRegisterNotify(StageUtil.STAGE_RESIZE, this.onStageResize, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        };
        /**
         * 初始化组件,需被子类继承
         */
        UIComponent.prototype.initComponent = function () {
        };
        /**
        * 初始化数据
        */
        UIComponent.prototype.initData = function () {
            this.onStageResize();
            var unpackDic = this._unpackDic;
            for (var key in unpackDic) {
                if (!RES.getRes(key)) {
                    var imageArr = unpackDic[key];
                    if (imageArr) {
                        for (var _i = 0, imageArr_1 = imageArr; _i < imageArr_1.length; _i++) {
                            var image = imageArr_1[_i];
                            image.source = null;
                            image.source = key;
                        }
                    }
                }
                qmr.LoaderManager.instance.addGroupRef(key);
            }
        };
        Object.defineProperty(UIComponent.prototype, "data", {
            /**
             * @description 获取当前属于这个模块的数据
             */
            get: function () {
                return this._data;
            },
            /**
             * @description 获取当前属于这个模块的数据
             */
            set: function (data) {
                this._data = data;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 初始化事件监听器,需被子类继承
         */
        UIComponent.prototype.initListener = function () {
        };
        UIComponent.prototype.onStageResize = function () {
        };
        /**
         * @description 注册一个消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        UIComponent.prototype.registerNotify = function (type, callBack, thisObject) {
            if (thisObject === void 0) { thisObject = null; }
            thisObject = thisObject ? thisObject : this;
            this._notifyDic[type] = { callBack: callBack, thisObject: thisObject };
            qmr.NotifyManager.registerNotify(type, callBack, thisObject);
        };
        /**
         * @description 取消一个注册消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        UIComponent.prototype.unRegisterNotify = function (type, callBack, thisObject) {
            if (thisObject === void 0) { thisObject = null; }
            thisObject = thisObject ? thisObject : this;
            var obj = this._notifyDic[type];
            if (obj && obj.callback == callBack && obj.thisObject == thisObject) {
                delete this._notifyDic[type];
            }
            qmr.NotifyManager.unRegisterNotify(type, callBack, thisObject);
        };
        UIComponent.prototype.unRegisterAllNotify = function () {
            var temp;
            var notifyDic = this._notifyDic;
            for (var type in notifyDic) {
                temp = notifyDic[type];
                if (temp) {
                    qmr.NotifyManager.unRegisterNotify(type, temp.callBack, temp.thisObject);
                }
                delete notifyDic[type];
            }
            this._notifyDic = {};
        };
        /**
         * @description 发送一个消息通知
         */
        UIComponent.prototype.dispatch = function (type, params) {
            if (params === void 0) { params = null; }
            qmr.NotifyManager.sendNotification(type, params);
        };
        /**
         * 事件注册，所有事件的注册都需要走这里
         */
        UIComponent.prototype.addEvent = function (target, type, callBack, thisObject) {
            if (thisObject === void 0) { thisObject = null; }
            thisObject = thisObject ? thisObject : this;
            var eventParams = {};
            eventParams.target = target;
            eventParams.type = type;
            eventParams.callBack = callBack;
            eventParams.thisObject = thisObject;
            if (target) {
                target.addEventListener(type, callBack, thisObject);
                this._eventDic[target.hashCode + type] = eventParams;
            }
        };
        /**
         * @description 添加点击函数
         */
        UIComponent.prototype.addClickEvent = function (target, callBack, thisObject) {
            if (thisObject === void 0) { thisObject = null; }
            var t = this;
            var eventDic = t._eventDic;
            var scaleX = 1.0;
            var scaleY = 1.0;
            thisObject = thisObject ? thisObject : t;
            if (target instanceof eui.Group) {
                target.touchChildren = false;
            }
            if (target instanceof egret.DisplayObject) {
                if (target.anchorOffsetX == 0 && target.anchorOffsetY == 0) {
                    var harfWidth = target.width / 2;
                    var harfHeight = target.height / 2;
                    target.anchorOffsetX = harfWidth;
                    target.anchorOffsetY = harfHeight;
                    target.x += harfWidth;
                    target.y += harfHeight;
                }
                scaleX = target.scaleX;
                scaleY = target.scaleY;
            }
            var eventParams = {};
            eventParams.target = target;
            eventParams.scaleX = scaleX;
            eventParams.scaleY = scaleY;
            eventParams.type = egret.TouchEvent.TOUCH_BEGIN;
            eventParams.thisObject = thisObject;
            eventParams.callFunc = t.onTouchBegin;
            eventParams.thisCall = t;
            if (target) {
                target.addEventListener(eventParams.type, t.onTouchBegin, t);
                eventDic[target.hashCode + eventParams.type] = eventParams;
            }
            var eventParamsEnd = {};
            eventParamsEnd.target = target;
            eventParamsEnd.scaleX = scaleX;
            eventParamsEnd.scaleY = scaleY;
            eventParamsEnd.type = egret.TouchEvent.TOUCH_END;
            eventParamsEnd.callBack = callBack;
            eventParamsEnd.thisObject = thisObject;
            eventParamsEnd.callFunc = t.onTouchEnd;
            eventParamsEnd.thisCall = t;
            if (target) {
                target.addEventListener(eventParamsEnd.type, t.onTouchEnd, t);
                eventDic[target.hashCode + eventParamsEnd.type] = eventParamsEnd;
            }
            var eventParamsTap = {};
            eventParamsTap.target = target;
            eventParamsTap.scaleX = scaleX;
            eventParamsTap.scaleY = scaleY;
            eventParamsTap.type = egret.TouchEvent.TOUCH_TAP;
            eventParamsTap.callBack = callBack;
            eventParamsTap.thisObject = thisObject;
            eventParamsTap.callFunc = t.onTouchEnd;
            eventParamsTap.thisCall = t;
            if (target) {
                target.addEventListener(eventParamsTap.type, t.onTouchEnd, t);
                eventDic[target.hashCode + eventParamsTap.type] = eventParamsTap;
            }
            var eventParamsOutSide = {};
            eventParamsOutSide.target = target;
            eventParamsOutSide.scaleX = scaleX;
            eventParamsOutSide.scaleY = scaleY;
            eventParamsOutSide.type = egret.TouchEvent.TOUCH_RELEASE_OUTSIDE;
            eventParamsOutSide.thisObject = thisObject;
            eventParamsOutSide.callFunc = t.onTouchReleaseOutSide;
            eventParamsOutSide.thisCall = t;
            if (target) {
                target.addEventListener(eventParamsOutSide.type, t.onTouchReleaseOutSide, t);
                eventDic[target.hashCode + eventParamsOutSide.type] = eventParamsOutSide;
            }
            var eventParamsCanel = {};
            eventParamsCanel.target = target;
            eventParamsCanel.scaleX = scaleX;
            eventParamsCanel.scaleY = scaleY;
            eventParamsCanel.type = egret.TouchEvent.TOUCH_CANCEL;
            eventParamsCanel.thisObject = thisObject;
            eventParamsCanel.callFunc = t.onTouchReleaseOutSide;
            eventParamsCanel.thisCall = t;
            if (target) {
                target.addEventListener(eventParamsCanel.type, t.onTouchReleaseOutSide, t);
                eventDic[target.hashCode + eventParamsCanel.type] = eventParamsOutSide;
            }
        };
        /**
         * @description 当点击开始
         */
        UIComponent.prototype.onTouchBegin = function (evt) {
            var target = evt.target;
            var hashCode = target.hashCode;
            var obj = this._eventDic[hashCode + evt.type];
            this._touchBeginTaret = target;
            egret.Tween.removeTweens(target);
            egret.Tween.get(target).to({ scaleX: obj.scaleX * 0.9, scaleY: obj.scaleY * 0.9 }, 50);
            this.loadAndPlayEffect("SOUND_DIANJI");
        };
        /**
         * @description 当点击结束
         */
        UIComponent.prototype.onTouchEnd = function (evt) {
            var t = this;
            var target = evt.target;
            var eventDic = t._eventDic;
            if (t._touchBeginTaret != target)
                return;
            t._touchBeginTaret = null;
            var obj = eventDic[target.hashCode + evt.type];
            var touchScaleX = obj.scaleX;
            var touchScaleY = obj.scaleY;
            egret.Tween.get(target).to({ scaleX: touchScaleX, scaleY: touchScaleY }, 50).call(function () {
                for (var key in eventDic) {
                    var eventParams = eventDic[key];
                    if (eventParams.target == target && eventParams.type == egret.TouchEvent.TOUCH_END) {
                        eventParams.callBack.call(eventParams.thisObject, target);
                    }
                }
            }, t);
        };
        /**
         * @description 当点击结束的时候，按钮不在被点击的对象上
         */
        UIComponent.prototype.onTouchReleaseOutSide = function (evt) {
            var t = this;
            if (t._touchBeginTaret != evt.target)
                return;
            t._touchBeginTaret = null;
            var obj = t._eventDic[evt.target.hashCode + evt.type];
            if (obj) {
                evt.target.scaleX = obj.scaleX;
                evt.target.scaleY = obj.scaleY;
            }
        };
        /**
         * 统一移除所有事件
         */
        UIComponent.prototype.removeAllEvent = function () {
            var tempEvent;
            var tempTarget;
            var eventDic = this._eventDic;
            for (var name_1 in eventDic) {
                tempEvent = eventDic[name_1];
                tempTarget = tempEvent.target;
                if (tempTarget != null) {
                    if (tempEvent.type == egret.TouchEvent.TOUCH_TAP && !(tempTarget instanceof egret.Stage)) {
                        if (tempEvent.scaleX != undefined)
                            tempTarget.scaleX = tempEvent.scaleX;
                        if (tempEvent.scaleY != undefined)
                            tempTarget.scaleY = tempEvent.scaleY;
                    }
                    tempTarget.removeEventListener(tempEvent.type, tempEvent.callBack, tempEvent.thisObject);
                    tempTarget.removeEventListener(tempEvent.type, tempEvent.callFunc, tempEvent.thisCall);
                }
                delete eventDic[name_1];
            }
            this._eventDic = {};
        };
        /**
         * 更新标题
         */
        UIComponent.prototype.updateTitle = function (title, ruleId) {
            if (title || ruleId > 0) {
                qmr.NotifyManager.sendNotification(qmr.NotifyConstLogin.UPDATE_MODULE_TITLE, { title: title, ruleId: ruleId });
            }
            else if (!title && ruleId == undefined) {
                qmr.NotifyManager.sendNotification(qmr.NotifyConstLogin.UPDATE_MODULE_TITLE, { ruleId: 0 });
            }
        };
        /**
         * 播放音效
         */
        UIComponent.prototype.loadAndPlayEffect = function (soundType, loops, isOneKey) {
            if (loops === void 0) { loops = 1; }
            if (isOneKey === void 0) { isOneKey = false; }
            qmr.SoundManager.getInstance().loadAndPlayEffect(soundType, loops, isOneKey);
        };
        /**
         * 停止音效
         */
        UIComponent.prototype.stopSoundEffect = function (soundType) {
            qmr.SoundManager.getInstance().stopSoundEffect(soundType);
        };
        /** 每次initData执行一次 ,动态增加引用计数 */
        UIComponent.prototype.addUnpackRes = function (unpack) {
            var dynamic = this._unpackDynamic;
            if (typeof unpack === "string") {
                if (!dynamic[unpack]) {
                    dynamic[unpack] = true;
                    qmr.LoaderManager.instance.addGroupRef(unpack);
                }
            }
            else {
                for (var _i = 0, unpack_1 = unpack; _i < unpack_1.length; _i++) {
                    var name_2 = unpack_1[_i];
                    if (!dynamic[name_2]) {
                        dynamic[name_2] = true;
                        qmr.LoaderManager.instance.addGroupRef(name_2);
                    }
                }
            }
        };
        /** 每次dispose执行一次 ,清引用*/
        UIComponent.prototype.destoryUnpackRes = function () {
            for (var unpack in this._unpackDic) {
                qmr.LoaderManager.instance.destoryGroup(unpack);
            }
            for (var unpack in this._unpackDynamic) {
                qmr.LoaderManager.instance.destoryGroup(unpack);
            }
            this._unpackDynamic = {};
        };
        /**
         * 资源释放
         * @$isDispos 是否彻底释放资源
         */
        UIComponent.prototype.dispose = function ($isDispos) {
            if ($isDispos === void 0) { $isDispos = false; }
            var t = this;
            t.destoryUnpackRes();
            t.removeAllEvent();
            t.unRegisterAllNotify();
            t._touchBeginTaret = null;
            t._data = null;
            if (t.parent) {
                t.parent.removeChild(t);
            }
            if (qmr.ModuleManager.openPanelFromBattle) {
                qmr.ModuleManager.openPanelFromBattle = false;
            }
        };
        return UIComponent;
    }(eui.Component));
    qmr.UIComponent = UIComponent;
    __reflect(UIComponent.prototype, "qmr.UIComponent");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 所有模块的基类
     *
     */
    var SuperBaseModule = (function (_super) {
        __extends(SuperBaseModule, _super);
        function SuperBaseModule() {
            var _this = _super.call(this) || this;
            /** 是否可以点击背景黑幕来关闭面板 */
            _this.isClickHide = true;
            /** 是否需要半透明遮罩 */
            _this.isNeedMask = false;
            /** 是否需要全透明遮罩 */
            _this.isNeedAlpha0Mask = false;
            /** 是否需要弹出效果 */
            _this.isPopupEffect = false;
            /** 是否居中显示，居中显示不做屏幕大小适配 */
            _this.isCenter = false;
            /** 是否适配屏幕状态栏（刘海屏） */
            _this.needAdaptStatusBar = true;
            /** 是否显示中 */
            _this._isShow = false;
            _this.offsetY = 0; //弹出界面位置偏移
            return _this;
        }
        Object.defineProperty(SuperBaseModule.prototype, "groupName", {
            get: function () {
                return this._groupName;
            },
            /** 设置资源组名字,需要在构造函数里面调用 */
            set: function (value) {
                this._groupName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SuperBaseModule.prototype, "qmrSkinName", {
            /** 设置皮肤名字 */
            set: function (value) {
                this._qmrSkinName = value;
            },
            enumerable: true,
            configurable: true
        });
        /** 初始化组件 */
        SuperBaseModule.prototype.initComponent = function () {
            _super.prototype.initComponent.call(this);
            this.resetPos();
            this.initUnpackRes(this);
        };
        /** 刷新界面指引 */
        SuperBaseModule.prototype.updateGuide = function () {
        };
        SuperBaseModule.prototype.resetPos = function () {
            if (this.isPopupEffect || this.isCenter) {
                this.anchorOffsetX = this.width >> 1;
                this.anchorOffsetY = (this.height >> 1) + this.offsetY;
                this.x = qmr.StageUtil.stageWidth >> 1;
                this.y = qmr.StageUtil.stageHeight >> 1;
            }
        };
        /** 初始化事件 */
        SuperBaseModule.prototype.initListener = function () {
            var t = this;
            if (t.numChildren > 0) {
                // let panelBg = t.getChildAt(0);
                // if (panelBg && panelBg instanceof PanelBgUI)
                // {
                // 	t._panelBg = panelBg;
                // 	t.addClickEvent(panelBg.btnClose, t.onPageBgCloseView, t);
                // }
                // else if (panelBg && panelBg instanceof PanelPopBgUI)
                // {
                // 	t.addClickEvent(panelBg.btnClose, t.onPageBgCloseView, t);
                // }
                // else if (panelBg instanceof egret.DisplayObjectContainer)
                // {
                // 	if (panelBg.numChildren > 0)
                // 	{
                // 		let child = panelBg.getChildAt(0);
                // 		if (child && child instanceof PanelPopBgUI)
                // 		{
                // 			t.addClickEvent(child.btnClose, t.onPageBgCloseView, t);
                // 		}
                // 	}
                // }
            }
            t.registerNotify(qmr.StageUtil.STAGE_RESIZE, t.onStageResize, t);
            _super.prototype.initListener.call(this);
        };
        /** 对象是否有效 */
        SuperBaseModule.prototype.getEffective = function (now, maxAliveTime) {
            if (this.isShow) {
                return true;
            }
            if (this.useTime && now - this.useTime >= maxAliveTime) {
                return false;
            }
            return true;
        };
        /**关闭界面 不满意子类重写*/
        SuperBaseModule.prototype.onPageBgCloseView = function () {
            this.hide();
        };
        SuperBaseModule.prototype.addedToStage = function (evt) {
            _super.prototype.addedToStage.call(this, evt);
            egret.callLater(this.popupEffect, this);
        };
        SuperBaseModule.prototype.onStageResize = function (evt) {
            var t = this;
            if (!(t.isPopupEffect || t.isCenter)) {
                t.width = qmr.StageUtil.stageWidth;
                //刘海屏适配？临时处理
                if (qmr.StageUtil.stageHeight > 1400 && t.needAdaptStatusBar) {
                    t.height = qmr.StageUtil.stageHeight - 50;
                    t.y = 50;
                }
                else {
                    t.height = qmr.StageUtil.stageHeight;
                    t.y = 0;
                }
            }
            t.resetPos();
            t.layout();
            if (t.maskSprite) {
                t.maskSprite.onStageResize();
            }
        };
        /**
         * 打开模块
         * @param data 打开模块时，需要向这个模块传递的一些数据
         */
        SuperBaseModule.prototype.show = function (data) {
            var t = this;
            t.data = data;
            if (!t.isSkinLoaded) {
                if (t._qmrSkinName) {
                    t.skinName = t._qmrSkinName;
                }
            }
            else {
                t.initListener();
                egret.callLater(t.initData, t);
            }
            t.isShow = true;
        };
        Object.defineProperty(SuperBaseModule.prototype, "isShow", {
            /** 获取当前模块的显示状态 */
            get: function () {
                return this._isShow;
            },
            set: function (flag) {
                this._isShow = flag;
            },
            enumerable: true,
            configurable: true
        });
        /** 界面初始化之后布局 */
        SuperBaseModule.prototype.layout = function () {
        };
        /** 获取模块中某个控件在舞台中的位置 */
        SuperBaseModule.prototype.getComponentGlobalPoint = function (componentName) {
            var component = this[componentName];
            if (component) {
                if (component.parent) {
                    return component.parent.localToGlobal(component.x, component.y);
                }
                else {
                    return component.localToGlobal(component.x, component.y);
                }
            }
            return { x: 0, y: 0 };
        };
        /** 隐藏界面 */
        SuperBaseModule.prototype.hide = function () {
            if (this.isPopupEffect) {
                this.closeEffect();
            }
            else {
                qmr.ModuleManager.hideModule(this);
            }
        };
        /** 弹出对话框效果*/
        SuperBaseModule.prototype.popupEffect = function () {
            var t = this;
            if (!t.isPopupEffect)
                return;
            t.alpha = 0.2;
            t.scaleX = 0.2;
            t.scaleY = 0.2;
            var toX, toY;
            if (t.openPos) {
                toX = t.openPos.x;
                toY = t.openPos.y;
            }
            else {
                toX = (qmr.StageUtil.stageWidth) >> 1;
                toY = (qmr.StageUtil.stageHeight) >> 1;
            }
            egret.Tween.get(t).to({ scaleX: 1, scaleY: 1, alpha: 1, x: toX, y: toY }, 200, egret.Ease.backOut).call(t.doOpenOver, t);
        };
        /** 关闭对话框效果*/
        SuperBaseModule.prototype.closeEffect = function () {
            var toX = 0;
            var toY = 0;
            if (this._closePos) {
                toX = this._closePos.x;
                toY = this._closePos.y;
            }
            else {
                toX = (qmr.StageUtil.stageWidth) >> 1;
                toY = (qmr.StageUtil.stageHeight) >> 1;
            }
            egret.Tween.get(this).to({ scaleX: 0.3, scaleY: .3, alpha: 0, x: toX, y: toY }, 180, egret.Ease.cubicOut).call(this.doCloseOver, this);
        };
        /** 执行打开弹出框 */
        SuperBaseModule.prototype.doOpenOver = function () {
        };
        /** 执行关闭弹出框 */
        SuperBaseModule.prototype.doCloseOver = function () {
            qmr.ModuleManager.hideModule(this);
        };
        Object.defineProperty(SuperBaseModule.prototype, "closePos", {
            get: function () {
                return this._closePos;
            },
            set: function (value) {
                this._closePos = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SuperBaseModule.prototype, "openPos", {
            get: function () {
                return this._openPos;
            },
            set: function (value) {
                this._openPos = value;
            },
            enumerable: true,
            configurable: true
        });
        /** 资源释放 */
        SuperBaseModule.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.isShow = false;
            this.useTime = egret.getTimer();
            if (this.title) {
                this.updateTitle("", 0);
            }
            var groupName = this.groupName;
            if (groupName != undefined && groupName != "") {
                qmr.LoaderManager.instance.destoryGroup(groupName);
            }
        };
        /**
         * 关闭自身
         */
        SuperBaseModule.prototype.closeView = function () {
            qmr.ModuleManager.hideModule(this);
        };
        return SuperBaseModule;
    }(qmr.UIComponent));
    qmr.SuperBaseModule = SuperBaseModule;
    __reflect(SuperBaseModule.prototype, "qmr.SuperBaseModule");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var AnimateClip = (function (_super) {
        __extends(AnimateClip, _super);
        function AnimateClip(callBack, thisObject) {
            if (callBack === void 0) { callBack = null; }
            if (thisObject === void 0) { thisObject = null; }
            var _this = _super.call(this) || this;
            _this._scale = 1.0;
            _this._offsetX = 0;
            _this._offsetY = 0;
            /** 用于设置特效宽度，设置之后无需设置scaleX */
            _this._effectWidth = 0;
            _this.callBack = callBack;
            _this.thisObject = thisObject;
            _this.isDirLoad = false;
            _this.actList = [];
            _this.isBody = false;
            _this.pixelHitTest = true;
            _this.offsetX = 0;
            _this.offsetY = 0;
            _this.curFrame = 0;
            return _this;
        }
        /**
         * @description 动态设置是否是分方向加载
         */
        AnimateClip.prototype.setIsDirLoad = function (value) {
            this.isDirLoad = value;
        };
        /**
         * @description 获取是否是分方向加载
         */
        AnimateClip.prototype.getIsDirLoad = function () {
            return this.isDirLoad;
        };
        /**
         * @description 设置该动画片段包含的动作组
         */
        AnimateClip.prototype.setActs = function (acts) {
            this.actList = acts.split(",");
        };
        /**
         * @description 该动画片段是否包含该动作
         */
        AnimateClip.prototype.containsAct = function (act) {
            var actList = this.actList;
            if (actList.length == 0) {
                return true;
            }
            for (var _i = 0, actList_1 = actList; _i < actList_1.length; _i++) {
                var key = actList_1[_i];
                if (key == act) {
                    return true;
                }
            }
            return false;
        };
        /**
         * @description 加载
         * @param path 文件的相对路径
         * @param resName 当前动画片段的名字
         * @param animationName 动画片段属于的动画的名字
         * @param dir 有些动画会带方向的
          @param act 动作名
         */
        AnimateClip.prototype.load = function (path, resName, dir) {
            if (dir === void 0) { dir = -1; }
            var t = this;
            var agrIns = qmr.AnimateManager.getInstance();
            t.curFrame = 0;
            //特殊处理
            if (t.animateData && t.resName) {
                agrIns.dispos(t.resName);
            }
            t.resName = resName;
            var teampAnimataData = agrIns.getAnimalData(t.resName, t.isDirLoad ? -1 : dir);
            if (teampAnimataData) {
                t.animateData = teampAnimataData;
                if (t.callBack) {
                    egret.callLater(t.callBack, t.thisObject, true, resName);
                    // t.callBack.call(t.thisObject, true, resName);
                }
            }
            else {
                var onJsonLoaded = function (jsonData) {
                    var onTextureLoaded = function (texture, url) {
                        if (texture) {
                            var newResName = resName;
                            agrIns.parseSpriteSheet(newResName, url, jsonData, texture, dir);
                            if (newResName == t.resName) {
                                t.animateData = agrIns.getAnimalData(newResName, dir);
                            }
                            if (t.callBack) {
                                egret.callLater(t.callBack, t.thisObject, false, resName);
                                //t.callBack.call(t.thisObject, false, resName);
                            }
                        }
                        else {
                            t.reset();
                        }
                    };
                    if (jsonData) {
                        var off = jsonData.harf ? "_f.png" : ".png";
                        var resPath = path + resName + off;
                        var tempTexture = RES.getRes(resPath);
                        if (tempTexture) {
                            //动画资源统一在AnimationManager里面管理，在LoaderManager看清除
                            qmr.LoaderManager.instance.removeGroupRef(resPath);
                            onTextureLoaded(tempTexture, resPath);
                        }
                        else {
                            qmr.ResManager.getRes(resPath, onTextureLoaded, t, qmr.LoadPriority.IMMEDIATELY, RES.ResourceItem.TYPE_IMAGE);
                        }
                    }
                    else {
                        t.reset();
                    }
                };
                if (t.isBody) {
                    t.texture = RES.getRes("preloading_defaultBody_png");
                    t.x = -t.texture.textureWidth / 2;
                    t.y = -t.texture.textureHeight;
                }
                var jsonPath = path + resName + ".json";
                var data = RES.getRes(jsonPath);
                if (data) {
                    onJsonLoaded(data);
                }
                else {
                    qmr.ResManager.getRes(jsonPath, onJsonLoaded, t, qmr.LoadPriority.IMMEDIATELY, RES.ResourceItem.TYPE_JSON);
                }
            }
        };
        /**
         * @description 重置，防止夸帧
         */
        AnimateClip.prototype.reset = function () {
            if (this.animateData) {
                this.texture = null;
                this.animateData = null;
            }
            this.curFrame = 0;
        };
        /**
         * @description 渲染第几帧
         */
        AnimateClip.prototype.render = function (frame) {
            // console.log("渲染第几帧:" + frame);
            // if (frame == this.curFrame) return;
            this.curFrame = frame;
            var t = this;
            var animateData = t.animateData;
            if (animateData != null) {
                var scale = t._scale;
                var offset = animateData.getOffset(frame);
                var texture = animateData.getTextureByFrame(frame);
                t.texture = texture;
                if (offset) {
                    t.x = (offset.x * scale + t._offsetX);
                    t.y = (offset.y * scale + t._offsetY);
                    if (animateData.halfTexture) {
                        t.width = offset.w;
                        t.height = offset.h;
                    }
                    else if (texture) {
                        t.width = texture.textureWidth;
                        t.height = texture.textureHeight;
                    }
                }
                if (t._effectWidth > 0) {
                    if (animateData.halfTexture) {
                        t.scaleX = t._effectWidth / offset.w;
                    }
                    else {
                        t.scaleX = t._effectWidth / texture.textureWidth;
                    }
                }
                else {
                    t.scaleX = t.scaleY = scale;
                }
            }
        };
        Object.defineProperty(AnimateClip.prototype, "offsetX", {
            set: function (value) {
                this._offsetX = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimateClip.prototype, "offsetY", {
            set: function (value) {
                this._offsetY = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimateClip.prototype, "scale", {
            set: function (value) {
                this._scale = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimateClip.prototype, "effectWidth", {
            get: function () {
                return this._effectWidth;
            },
            set: function (value) {
                this._effectWidth = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimateClip.prototype, "firstFrameHeight", {
            /**获取第一帧的高度*/
            get: function () {
                var animateData = this.animateData;
                if (animateData) {
                    return animateData.getTextureByFrame(1).textureHeight;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimateClip.prototype, "totalFrames", {
            /** 获取总帧数 */
            get: function () {
                var animateData = this.animateData;
                if (animateData != null) {
                    return animateData.totalFrames;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimateClip.prototype, "frameRate", {
            /**获取帧频*/
            get: function () {
                var animateData = this.animateData;
                if (animateData != null) {
                    return animateData.frameRate;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        /**  资源释放   */
        AnimateClip.prototype.dispos = function () {
            var t = this;
            t.curFrame = 0;
            if (t.parent) {
                t.reset();
                qmr.AnimateManager.getInstance().dispos(t.resName);
                t.parent.removeChild(t);
            }
        };
        return AnimateClip;
    }(egret.Bitmap));
    qmr.AnimateClip = AnimateClip;
    __reflect(AnimateClip.prototype, "qmr.AnimateClip");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var BaseBean = (function () {
        function BaseBean(d) {
            this.d = d;
        }
        /** 用于两个值相merge */
        BaseBean.prototype.merge = function (bean, rate) {
            if (rate === void 0) { rate = 1; }
            if (bean && bean.hasOwnProperty('d')) {
                var element = bean['d'];
                if (!this.key) {
                    this.key = bean.key;
                }
                var sd = this.d;
                if (!sd) {
                    sd = new Object();
                    this.d = sd;
                }
                var t = this;
                for (var key in element) {
                    var char = element[key];
                    if (typeof (char) === "number") {
                        if (!sd[key])
                            sd[key] = 0;
                        if (!char)
                            char = 0;
                        sd[key] = parseFloat(sd[key]) + char * rate;
                    }
                    else if (typeof (char) === "string") {
                        if (!sd[key])
                            sd[key] = "";
                        if (!char)
                            char = "";
                        sd[key] = char;
                    }
                    else if (typeof (char) === "boolean") {
                        if (!char)
                            char = false;
                        sd[key] = char;
                    }
                    else {
                        sd[key] = char;
                    }
                }
            }
        };
        BaseBean.prototype.setRate = function (rate) {
            var sd = this.d;
            for (var key in sd) {
                var char = sd[key];
                if (typeof (char) === "number") {
                    char = char * rate;
                    sd[key] = char;
                }
            }
        };
        return BaseBean;
    }());
    qmr.BaseBean = BaseBean;
    __reflect(BaseBean.prototype, "qmr.BaseBean");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var LoginViewUI = (function (_super) {
        __extends(LoginViewUI, _super);
        function LoginViewUI() {
            var _this = _super.call(this) || this;
            _this.qmrSkinName = "LoginViewSkin";
            return _this;
        }
        return LoginViewUI;
    }(qmr.SuperBaseModule));
    qmr.LoginViewUI = LoginViewUI;
    __reflect(LoginViewUI.prototype, "qmr.LoginViewUI");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 方便发送接收消息
     *
     */
    var BaseNotify = (function () {
        function BaseNotify() {
            this.initListeners();
        }
        BaseNotify.prototype.initListeners = function () {
        };
        /**
         * @description 发送一个消息通知
         */
        BaseNotify.prototype.dispatch = function (type, params) {
            if (params === void 0) { params = null; }
            qmr.NotifyManager.sendNotification(type, params);
        };
        /**
        * @description 注册一个消息
        * @param type 消息类型
        * @param callBack 回调函数
        * @param thisObject 当前作用域对象
        */
        BaseNotify.prototype.registerNotify = function (type, callBack, thisObject) {
            qmr.NotifyManager.registerNotify(type, callBack, thisObject);
        };
        /**
         * @description 取消一个注册消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        BaseNotify.prototype.unRegisterNotify = function (type, callBack, thisObject) {
            qmr.NotifyManager.unRegisterNotify(type, callBack, thisObject);
        };
        return BaseNotify;
    }());
    qmr.BaseNotify = BaseNotify;
    __reflect(BaseNotify.prototype, "qmr.BaseNotify");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * 平台基类类，此类禁止对特殊子平台的逻辑处理，一律在子平台类中处理
     */
    var BasePlatform = (function () {
        function BasePlatform() {
            /**联调服域名*/
            this.ltServerDomain = "xyws-sdk.dyhyyx.com";
            this.initGetOption();
        }
        Object.defineProperty(BasePlatform.prototype, "canResizeStage", {
            /**该平台是否拥有重置窗口大小的能力 */
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        /**请求登录 */ //基类函数不可修改
        BasePlatform.prototype.reqLogin = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setLoadingStatus("验证账号...");
                            console.log("开始平台登录");
                            return [4 /*yield*/, this.login()];
                        case 1:
                            _a.sent();
                            console.log("平台登录完成");
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**请求支付 */ //不通用的平台在子类重写，基类函数不可修改
        BasePlatform.prototype.reqPay = function (payInfo) {
        };
        /**
         * 设置加载进度
         * @param  {number} vlaue 0-100
         * @returns void
         */
        BasePlatform.prototype.setLoadingProgress = function (vlaue) { };
        /**登出接口*/
        BasePlatform.prototype.logout = function () { };
        /**创角成功并获取角色信息后上报*/
        BasePlatform.prototype.reportRegister = function () { };
        ;
        /**登陆成功并获取角色信息之后上报*/
        BasePlatform.prototype.reportLogin = function () { };
        /**角色升级上报*/
        BasePlatform.prototype.reportUpLevel = function () { };
        /**排行榜战力上报*/
        BasePlatform.prototype.reportFightPower = function (value) { };
        /**分享游戏 */
        BasePlatform.prototype.shareGame = function (totalCount, hadCount, leaveTime) { };
        ;
        /**分享游戏 */
        BasePlatform.prototype.onShareBack = function () { };
        ;
        /**分享接口*/
        BasePlatform.prototype.share = function () { };
        /**收藏到桌面*/
        BasePlatform.prototype.addToDesk = function () { };
        /**
         * 尝试重新加载游戏，否则退出游戏
         * @param  {boolean} clearCache? 是否清除缓存，微信、qq等平台等需要
         * @returns void
         */
        BasePlatform.prototype.reloadGame = function (clearCache) {
            if (window.location && window.location.reload) {
                window.location.reload();
            }
            else {
                qmr.TipManagerCommon.getInstance().createCommonColorTip("请重启游戏");
            }
        };
        BasePlatform.prototype.setLoadingStatus = function (msg) {
            msg = msg || "";
            var showLoading = window["showPreLoading"];
            if (showLoading) {
                showLoading(msg);
            }
            if (!msg && !this.firstLoadBgHide && window["EgretSubPackageLoading"]) {
                this.firstLoadBgHide = true;
                window["EgretSubPackageLoading"].instance.removePreLoading();
            }
        };
        return BasePlatform;
    }());
    qmr.BasePlatform = BasePlatform;
    __reflect(BasePlatform.prototype, "qmr.BasePlatform");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 和服务器通信的基类,所有的通信类都要继承这个类
     *
     */
    var BaseController = (function () {
        function BaseController() {
            this.initListeners();
        }
        BaseController.prototype.initListeners = function () {
        };
        /**
         * msg:发送消息
         * isLog:是否显示发送日志
         */
        BaseController.prototype.sendCmd = function (msg, msgId, isLog) {
            if (isLog === void 0) { isLog = false; }
            qmr.Rpc.getInstance().sendCmd(msg, msgId, isLog);
        };
        /**
         * @description 发送一个消息通知
         */
        BaseController.prototype.dispatch = function (type, params) {
            if (params === void 0) { params = null; }
            qmr.NotifyManager.sendNotification(type, params);
        };
        /**
        * @description 注册一个消息
        * @param type 消息类型
        * @param callBack 回调函数
        * @param thisObject 当前作用域对象
        */
        BaseController.prototype.registerNotify = function (type, callBack, thisObject) {
            qmr.NotifyManager.registerNotify(type, callBack, thisObject);
        };
        /**
         * @description 取消一个注册消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        BaseController.prototype.unRegisterNotify = function (type, callBack, thisObject) {
            qmr.NotifyManager.unRegisterNotify(type, callBack, thisObject);
        };
        /**
         * @description 发送带回调的消息
         */
        BaseController.prototype.rpc = function (eventMsgId, cmd, msgId, callBack, thisObject, timeOutCallBack, timeOut, isLog) {
            if (timeOutCallBack === void 0) { timeOutCallBack = null; }
            if (timeOut === void 0) { timeOut = null; }
            if (isLog === void 0) { isLog = false; }
            qmr.Rpc.getInstance().rpcCMD(eventMsgId, cmd, msgId, callBack, thisObject, timeOutCallBack, timeOut, isLog);
        };
        /**
         * @description 添加事件监听
         */
        BaseController.prototype.addSocketListener = function (msgId, callBack, thisObject, isLog) {
            if (isLog === void 0) { isLog = false; }
            qmr.Rpc.getInstance().addSocketListener(msgId, callBack, thisObject, isLog);
        };
        /**
         * @description 移除监听
         */
        BaseController.prototype.removeSocketListener = function (msgId, callBack, thisObject) {
            qmr.Rpc.getInstance().removeSocketListener(msgId, callBack, thisObject);
        };
        /**
         * 播放特效
         */
        BaseController.prototype.loadAndPlayEffect = function (soundType, loops, isOneKey) {
            if (loops === void 0) { loops = 1; }
            if (isOneKey === void 0) { isOneKey = false; }
            qmr.SoundManager.getInstance().loadAndPlayEffect(soundType, loops, isOneKey);
        };
        /** 检查是否还在锁定状态 */
        BaseController.prototype.checIsLock = function (rankId) {
            if (!this._reqDic)
                return false;
            var lockTime = this._reqDic.has(rankId) ? this._reqDic.get(rankId) : 0;
            var t = egret.getTimer();
            // LogUtil.log(rankId + " checIsLock " + t + " " + lockTime);
            return lockTime > t;
        };
        /** 设置锁定状态,默认15秒 */
        BaseController.prototype.setReqLock = function (rankId, time) {
            if (time === void 0) { time = 15000; }
            if (!this._reqDic)
                this._reqDic = new qmr.Dictionary();
            var t = egret.getTimer();
            var lockTime = t + time;
            // LogUtil.log(rankId + " setReqLock " + t + " " + lockTime);
            this._reqDic.set(rankId, lockTime);
        };
        BaseController.prototype.resetLock = function () {
            if (this._reqDic)
                this._reqDic.clear();
        };
        /**
         * @description 移除所有监听
         */
        BaseController.prototype.removeAllListener = function () {
            this.resetLock();
        };
        return BaseController;
    }());
    qmr.BaseController = BaseController;
    __reflect(BaseController.prototype, "qmr.BaseController");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * <code>Dictionary</code> 是一个字典型的数据存取类。
     */
    var Dictionary = (function () {
        function Dictionary() {
            this._values = [];
            this._keys = [];
        }
        Object.defineProperty(Dictionary.prototype, "values", {
            /**
             * 获取所有的子元素列表。
             */
            get: function () {
                return this._values;
            },
            set: function (v) {
                this._values = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dictionary.prototype, "keys", {
            /**
             * 获取所有的子元素键名列表。
             */
            get: function () {
                return this._keys;
            },
            set: function (v) {
                this._keys = v;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 给指定的键名设置值。
         * @param	key 键名。
         * @param	value 值。
         */
        Dictionary.prototype.set = function (key, value) {
            var index = this.indexOf(key);
            if (index >= 0) {
                this._values[index] = value;
                return;
            }
            this._keys.push(key);
            this._values.push(value);
        };
        /** 紧限于解析配置时使用 */
        Dictionary.prototype.setConf = function (key, value) {
            this._keys.push(key);
            this._values.push(value);
        };
        /**
         * 获取指定对象的键名索引。
         * @param	key 键名对象。
         * @return 键名索引。
         */
        Dictionary.prototype.indexOf = function (key) {
            var index = this._keys.indexOf(key);
            if (index >= 0)
                return index;
            key = (key instanceof String) ? Number(key) : ((key instanceof Number) ? key.toString() : key);
            return this._keys.indexOf(key);
        };
        /**
         * 返回指定键名的值。
         * @param	key 键名对象。
         * @return 指定键名的值。
         */
        Dictionary.prototype.get = function (key) {
            var index = this.indexOf(key);
            return index < 0 ? null : this._values[index];
        };
        /**
         * 是否有这个键
         */
        Dictionary.prototype.has = function (key) {
            var index = this.indexOf(key);
            return index >= 0;
        };
        Object.defineProperty(Dictionary.prototype, "length", {
            /**
             * 数据长度
             */
            get: function () {
                return this.keys.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 移除指定键名的值。
         * @param	key 键名对象。
         * @return 是否成功移除。
         */
        Dictionary.prototype.remove = function (key) {
            var index = this.indexOf(key);
            if (index >= 0) {
                this._keys.splice(index, 1);
                this._values.splice(index, 1);
                return true;
            }
            return false;
        };
        /**
         * 清除此对象的键名列表和键值列表。
         */
        Dictionary.prototype.clear = function () {
            this._values.length = 0;
            this._keys.length = 0;
        };
        return Dictionary;
    }());
    qmr.Dictionary = Dictionary;
    __reflect(Dictionary.prototype, "qmr.Dictionary");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var MessageIDLogin = (function () {
        function MessageIDLogin() {
        }
        /** 游戏初始化调用 */
        MessageIDLogin.init = function () {
            var t = this;
            var id;
            for (var p in t) {
                id = t[p];
                t.MSG_KEYS.set(id, p);
            }
        };
        /** 通过本类的协议ID映射协议名字 */
        MessageIDLogin.getMsgNameById = function (id) {
            return MessageIDLogin.MSG_KEYS.get(id);
        };
        /**
         *
         */
        /** 映射协议ID对应的协议名 */
        MessageIDLogin.MSG_KEYS = new qmr.Dictionary();
        /**  异常消息 */
        MessageIDLogin.S_EXCEPTION_MSG = 900;
        /**  登录 */
        MessageIDLogin.C_USER_LOGIN = 1001;
        /**  登录成功 */
        MessageIDLogin.S_USER_LOGIN = 1002;
        /** 注册 */
        MessageIDLogin.C_LOGIN_REGISTER = 1005;
        /** 登出 */
        MessageIDLogin.C_USER_LOGOUT = 1007;
        MessageIDLogin.S_USER_LOGOUT = 1008;
        /** 同步时间 */
        MessageIDLogin.C_SYNC_TIME = 2101;
        /** 同步时间 */
        MessageIDLogin.S_SYNC_TIME = 2102;
        MessageIDLogin.C_SEND_SDK_DATA = 1032;
        MessageIDLogin.S_SEND_SDK_DATA = 1033;
        return MessageIDLogin;
    }());
    qmr.MessageIDLogin = MessageIDLogin;
    __reflect(MessageIDLogin.prototype, "qmr.MessageIDLogin");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 动作状态枚举
     *
     */
    var Status = (function () {
        function Status() {
        }
        Status.IDLE = "idle"; //待机状态
        Status.ATTACK = "attack"; //攻击状态
        Status.ATTACK2 = "attack2"; //攻击状态2
        Status.MOVE = "move"; //行走状态
        Status.FLY = "move"; //飞行状态
        Status.DEAD = "death"; //死亡状态
        Status.SKILL = "skill"; //释法动作1
        Status.SKILL2 = "skill2"; //释法动作2
        Status.IDLE_RIDE = "idle_ride"; //坐骑待机状态
        Status.MOVE_RIDE = "move_ride"; //坐骑行走状态
        Status.ATTACK_RIDE = "attack_ride"; //坐骑攻击状态
        Status.JUMP = "fly"; //跳跃状态
        Status.JUMP_ATTACK = "jump_attack"; //跳斩,没有坐骑状态的跳斩
        Status.STAND = "stand"; //站立展示的，用于在面板上显示
        Status.PICK = "pick"; //拾取状态
        Status.UI_SHOW = "ui_show"; //ui上面的式神跳舞动画
        Status.UI_SHOW1 = "ui_show_1"; //ui上面的式神升级跳舞动画
        Status.UI_IDLE = "ui_idle"; //ui上面的式神待机动画
        return Status;
    }());
    qmr.Status = Status;
    __reflect(Status.prototype, "qmr.Status");
})(qmr || (qmr = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var AssetAdapter = (function () {
    function AssetAdapter() {
    }
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
        function onGetRes(data) {
            compFunc.call(thisObject, data, source);
        }
        if (RES.hasRes(source)) {
            var data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            }
            else {
                RES.getResAsync(source, onGetRes, this);
            }
        }
        else {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
    };
    return AssetAdapter;
}());
__reflect(AssetAdapter.prototype, "AssetAdapter", ["eui.IAssetAdapter"]);
var qmr;
(function (qmr) {
    /**
     *
     * @description 动画片段数据，比如某个动画组中的待机动画
     *
     */
    var AnimateData = (function () {
        function AnimateData(resJson, spriteSheet, autoParseTexture, autoHalfTexture) {
            if (autoParseTexture === void 0) { autoParseTexture = false; }
            if (autoHalfTexture === void 0) { autoHalfTexture = false; }
            this.resJson = resJson;
            this.spriteSheet = spriteSheet;
            this.autoHalfTexture = autoHalfTexture;
            this.autoParseTexture = autoParseTexture;
            this.framesList = [];
        }
        /**
         * @description 解析数据
         */
        AnimateData.prototype.parseClip = function (spriteJson) {
            var t = this;
            var index = 0;
            var framesList = this.framesList;
            t._frameRate = parseInt(spriteJson.frameRate);
            for (var _i = 0, _a = spriteJson.frames; _i < _a.length; _i++) {
                var item = _a[_i];
                var duraton = parseInt(item.duration);
                if (isNaN(duraton))
                    duraton = 1;
                for (var i = 1; i <= duraton; i++) {
                    index += 1;
                    framesList.push(item);
                }
            }
            if (t.autoParseTexture) {
                var spriteSheet = t.spriteSheet;
                var autoHalfTexture = t.autoHalfTexture;
                for (var _b = 0, framesList_1 = framesList; _b < framesList_1.length; _b++) {
                    var frameJson = framesList_1[_b];
                    if (!spriteSheet.getTexture(frameJson.res)) {
                        var rect = t.resJson[frameJson.res];
                        if (autoHalfTexture) {
                            spriteSheet.createTexture(frameJson.res, Math.ceil(rect.x / 2), Math.ceil(rect.y / 2), rect.w >> 1, rect.h >> 1);
                        }
                        else {
                            spriteSheet.createTexture(frameJson.res, rect.x, rect.y, rect.w, rect.h);
                        }
                    }
                }
            }
            t._totalFrames = t.framesList.length;
        };
        /**
         * @description 通过起始帧解析数据
         */
        AnimateData.prototype.parseClipByStartAndEnd = function (spriteJson, start, end) {
            var t = this;
            var index = 0;
            var framesList = t.framesList;
            t._frameRate = parseInt(spriteJson.frameRate);
            for (var _i = 0, _a = spriteJson.frames; _i < _a.length; _i++) {
                var item = _a[_i];
                var duraton = parseInt(item.duration);
                if (isNaN(duraton))
                    duraton = 1;
                for (var i = 1; i <= duraton; i++) {
                    index += 1;
                    if (index >= start && index <= end) {
                        framesList.push(item);
                    }
                }
            }
            //多个动作的资源，消息自己解析贴图
            // if(t.autoParseTexture) {
            //     for(let frameJson of framesList) {
            //         if(!t.spriteSheet.getTexture(frameJson.res)) {
            //          // this.spriteSheet.createTexture(frameJson.res,this.resJson[frameJson.res].x,this.resJson[frameJson.res].y,this.resJson[frameJson.res].w,this.resJson[frameJson.res].h);
            //         }
            //     }
            // }
            t._totalFrames = framesList.length;
        };
        /**
         * @description 获取某一帧texture
         */
        AnimateData.prototype.getTextureByFrame = function (frame) {
            var frameJson;
            var t = this;
            if (frame <= t.framesList.length) {
                frameJson = t.framesList[frame - 1];
            }
            else {
                return null;
            }
            var texture = t.spriteSheet.getTexture(frameJson.res);
            if (!texture) {
                var rect = t.resJson[frameJson.res];
                texture = t.spriteSheet.createTexture(frameJson.res, rect.x, rect.y, rect.w, rect.h);
            }
            return texture;
        };
        /**
         * @description 获取某一帧偏移值
         */
        AnimateData.prototype.getOffset = function (frame) {
            var offset;
            var framesList = this.framesList;
            if (frame <= framesList.length) {
                offset = framesList[frame - 1];
            }
            else {
                offset = framesList[framesList.length - 1];
            }
            if (this.autoHalfTexture) {
                var rect = this.resJson[offset.res];
                var x = rect.x % 2 ? 1 : 0;
                var y = rect.y % 2 ? 1 : 0;
                return { x: offset.x + x, y: offset.y + y, w: (rect.w >> 1) << 1, h: (rect.h >> 1) << 1 };
            }
            return offset;
        };
        Object.defineProperty(AnimateData.prototype, "totalFrames", {
            /**
             * @description 获取总的帧数
             */
            get: function () {
                return this._totalFrames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimateData.prototype, "halfTexture", {
            /**
             * 是方法一倍
             */
            get: function () {
                return this.autoHalfTexture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimateData.prototype, "frameRate", {
            /**
             * @description 获取帧频         */
            get: function () {
                return this._frameRate;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @description 资源释放
         */
        AnimateData.prototype.dispos = function () {
            this.framesList.length = 0;
            this.framesList = null;
        };
        return AnimateData;
    }());
    qmr.AnimateData = AnimateData;
    __reflect(AnimateData.prototype, "qmr.AnimateData");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 所有序列帧动画的管理器 draw到300就差不多了
     *
     */
    var AnimateManager = (function () {
        function AnimateManager() {
            this.maxAliveTime = 10000; //30s
            this.animaDic = {};
        }
        /**
         * @descripion 获取单例
         */
        AnimateManager.getInstance = function () {
            if (AnimateManager.instance == null) {
                AnimateManager.instance = new AnimateManager();
            }
            return AnimateManager.instance;
        };
        /**
         * @description 析对应序列帧动画
         */
        AnimateManager.prototype.parseSpriteSheet = function (resName, url, jsonData, texture, dir, autoParseTexture) {
            if (dir === void 0) { dir = -1; }
            if (autoParseTexture === void 0) { autoParseTexture = true; }
            var spriteJson;
            var spriteSheet = new egret.SpriteSheet(texture);
            for (var movieClipName in jsonData.mc) {
                if (movieClipName != null && movieClipName.length != 0) {
                    spriteJson = jsonData.mc[movieClipName];
                    break;
                }
            }
            if (spriteJson) {
                var obj = this.animaDic[resName];
                if (!obj) {
                    obj = {};
                    this.animaDic[resName] = obj;
                }
                obj.url = url;
                obj.sheet = spriteSheet;
                var labels = spriteJson.labels;
                var half = jsonData.harf;
                if (labels && labels.length > 1) {
                    for (var _i = 0, labels_1 = labels; _i < labels_1.length; _i++) {
                        var label = labels_1[_i];
                        var animalData = new qmr.AnimateData(jsonData.res, spriteSheet, autoParseTexture, half);
                        animalData.parseClipByStartAndEnd(spriteJson, parseInt(label.frame), parseInt(label.end));
                        obj[parseInt(label.name)] = animalData;
                    }
                }
                else {
                    var animalData = new qmr.AnimateData(jsonData.res, spriteSheet, autoParseTexture, half);
                    animalData.parseClip(spriteJson);
                    obj.data = animalData;
                }
            }
        };
        /**
         * @description 根据对应的动画名和标名获取序列帧数据
         * @param resName 资源名
         * @param dir 方向
         */
        AnimateManager.prototype.getAnimalData = function (resName, dir) {
            var obj = this.animaDic[resName];
            if (!obj)
                return null;
            var count = obj.count;
            if (count) {
                count += 1;
            }
            else {
                count = 1;
            }
            obj.count = count;
            obj.useTime = egret.getTimer();
            if (dir > 0 && resName.indexOf("death") == -1) {
                return obj[dir];
            }
            return obj.data;
        };
        /**
         * @description 释放资源，其实是释放对应animaion的引用计数
         */
        AnimateManager.prototype.dispos = function (resName) {
            if (resName == "168_idle") {
                return;
            }
            var obj = this.animaDic[resName];
            if (obj) {
                var count = obj.count;
                if (count) {
                    count -= 1;
                }
                else {
                    count = 0;
                }
                if (count <= 0) {
                    count = 0;
                }
                obj.count = count;
            }
        };
        /**
         * @description 清理过期资源
         */
        AnimateManager.prototype.clear = function (now) {
            var animaDic = this.animaDic;
            var maxAliveTime = this.maxAliveTime;
            for (var key in animaDic) {
                var item = animaDic[key];
                if (item.count == 0 && item.useTime) {
                    if (now - item.useTime > maxAliveTime) {
                        if (item.sheet) {
                            item.sheet.dispose();
                        }
                        var rootStr = RES.destroyRes(item.url);
                        qmr.LogUtil.warn("AnimationManager.destroy url=" + item.url + "  " + rootStr);
                        animaDic[key] = null;
                        delete animaDic[key];
                    }
                }
            }
            //可能会导致内网卡，先注释了。。
            // if (!PlatformConfig.useCdnRes){
            //     RES.profile();
            // }
        };
        return AnimateManager;
    }());
    qmr.AnimateManager = AnimateManager;
    __reflect(AnimateManager.prototype, "qmr.AnimateManager");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * @description 翅膀动画片段
     */
    var AnimateWing = (function (_super) {
        __extends(AnimateWing, _super);
        function AnimateWing(callBack, thisObject) {
            if (callBack === void 0) { callBack = null; }
            if (thisObject === void 0) { thisObject = null; }
            var _this = _super.call(this, callBack, thisObject) || this;
            _this._wingFrame = 0;
            _this._wingFrameIndex = 0;
            return _this;
        }
        /**
         * @description 渲染第几帧 8-10[1-8,1-8]
         */
        AnimateWing.prototype.render = function (frame) {
            if (this._wingFrame != frame) {
                this._wingFrame = frame;
                this._wingFrameIndex++;
            }
            frame = 1 + (this._wingFrameIndex % this.totalFrames);
            _super.prototype.render.call(this, frame);
        };
        AnimateWing.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this._wingFrame = 0;
            this._wingFrameIndex = 0;
        };
        return AnimateWing;
    }(qmr.AnimateClip));
    qmr.AnimateWing = AnimateWing;
    __reflect(AnimateWing.prototype, "qmr.AnimateWing");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 序列帧动画基类,所有的序列帧动画都要继承此类
     *
     */
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip() {
            var _this = _super.call(this) || this;
            _this.currentFrame = 1;
            _this.totalFrame = 0;
            _this.isStopped = true;
            _this.passedTime = 0;
            _this.lastTime = 0;
            _this.frameRate = 30;
            _this.eventDic = {};
            _this._timeScale = 1;
            _this.mainClip = new qmr.AnimateClip(_this.onLoaded, _this);
            _this.addChild(_this.mainClip);
            return _this;
        }
        /**
         * @description 加载素材资源
         */
        MovieClip.prototype.load = function (path, resName, loopCallBack, thisObject, playeTimes) {
            if (playeTimes === void 0) { playeTimes = 1; }
            this.playeTimes = 1;
            this.loopCallBack = loopCallBack;
            this.thisObject = thisObject;
            this.mainClip.load(path, resName);
        };
        /**
         * @description 资源加载完毕,需被子类继承        */
        MovieClip.prototype.onLoaded = function () {
            this.totalFrame = this.mainClip.totalFrames;
            this.frameRate = this.mainClip.frameRate;
            this.currentFrame = 1;
            this.render();
            this.setIsStopped(false);
            if (this.totalFrame == 1) {
                this.gotoAndStop(1);
            }
        };
        /**
         * @description 注册一个帧事件         */
        MovieClip.prototype.registerFrameEvent = function (frame, callBack, thisObject) {
            this.eventDic[frame] = { callBack: callBack, thisObject: thisObject };
        };
        /**
         * @description 取消一个帧事件         */
        MovieClip.prototype.unRegisterFrameEvent = function (frame) {
            if (this.eventDic[frame]) {
                this.eventDic[frame] = null;
                delete this.eventDic[frame];
            }
        };
        /**
         * @description 帧频调用         */
        MovieClip.prototype.advanceTime = function (timeStamp) {
            var t = this;
            var advancedTime = timeStamp - t.lastTime;
            t.lastTime = timeStamp;
            var frameIntervalTime = t.frameIntervalTime;
            var currentTime = t.passedTime + advancedTime;
            t.passedTime = currentTime % frameIntervalTime;
            var num = currentTime / frameIntervalTime;
            if (num < 1) {
                return false;
            }
            t.render();
            while (num >= 1) {
                num--;
                t.currentFrame++;
                t.checkFrameEvent();
            }
            return false;
        };
        /**
         * @description 检测帧事件         */
        MovieClip.prototype.checkFrameEvent = function () {
            var obj = this.eventDic[this.currentFrame];
            if (obj && obj.callBack) {
                obj.callBack.call(obj.thisObject);
            }
        };
        /**
         * @description 清除回调
         */
        MovieClip.prototype.clearCallBack = function () {
            this.loopCallBack = null;
        };
        /**
         * @description 渲染 需被子类继承*/
        MovieClip.prototype.render = function () {
            var t = this;
            if (t.totalFrame > 0) {
                if (t.currentFrame > t.totalFrame) {
                    if (t.loopCallBack) {
                        t.loopCallBack.call(t.thisObject);
                    }
                    t.currentFrame = 1;
                    if (t.playeTimes == 1) {
                        t.setIsStopped(true);
                        return;
                    }
                }
            }
            t.mainClip.render(t.currentFrame);
        };
        Object.defineProperty(MovieClip.prototype, "frameRate", {
            /**
             * @description 设置帧频         */
            set: function (value) {
                if (value > 60) {
                    value = 60;
                }
                this._frameRate = value;
                this.frameIntervalTime = 1000 / (value * this._timeScale);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "timeScale", {
            /**
             * @description 设置timescale
             */
            set: function (value) {
                if (!isNaN(this.frameRate)) {
                    this._timeScale = value;
                    this.frameIntervalTime = 1000 / (this._frameRate * value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "totalFrames", {
            /**
             * @description 获取总帧数
             */
            get: function () {
                return this.totalFrame;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @description 停止在某帧
         */
        MovieClip.prototype.gotoAndStop = function (frame) {
            this.mainClip.render(frame);
            this.setIsStopped(true);
        };
        /**
            * @private
            *
            * @param value
            */
        MovieClip.prototype.setIsStopped = function (value) {
            if (this.isStopped == value) {
                return;
            }
            this.isStopped = value;
            if (value) {
                egret.stopTick(this.advanceTime, this);
            }
            else {
                this.lastTime = egret.getTimer();
                egret.startTick(this.advanceTime, this);
            }
        };
        /**
         * @description 清除
         */
        MovieClip.prototype.clear = function () {
            if (this.mainClip) {
                this.mainClip.reset();
            }
        };
        /**
         * @description 资源释放         */
        MovieClip.prototype.dispos = function () {
            if (this.mainClip) {
                this.mainClip.dispos();
            }
            this.setIsStopped(true);
            for (var key in this.eventDic) {
                this.eventDic[key] = null;
                delete this.eventDic[key];
            }
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        return MovieClip;
    }(egret.DisplayObjectContainer));
    qmr.MovieClip = MovieClip;
    __reflect(MovieClip.prototype, "qmr.MovieClip");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var CommonTip = (function (_super) {
        __extends(CommonTip, _super);
        function CommonTip() {
            var _this = _super.call(this) || this;
            _this.iscompleted = false;
            _this.isSeted = false;
            _this.skinName = "CommonTipSkin";
            _this.touchEnabled = _this.touchChildren = false;
            return _this;
        }
        CommonTip.prototype.initComponent = function () {
            _super.prototype.initComponent.call(this);
            this.iscompleted = true;
        };
        CommonTip.prototype.initData = function () {
            _super.prototype.initData.call(this);
            this.setTip();
        };
        CommonTip.prototype.onStageResize = function () {
            _super.prototype.onStageResize.call(this);
            this.x = (qmr.StageUtil.stageWidth - 640) / 2;
        };
        /**
         * @description显示操作成功与失败的普通提示
         */
        CommonTip.prototype.showTip = function (data) {
            this.data = data;
            if (this.iscompleted) {
                this.setTip();
            }
        };
        CommonTip.prototype.setTip = function () {
            if (!this.data)
                return;
            if (this.isSeted)
                return;
            this.x = (qmr.StageUtil.stageWidth - 640) / 2;
            this.isSeted = true;
            this.alpha = 1;
            if (this.data.color) {
                this.lbl_tipMsg.text = this.data.mess;
                this.lbl_tipMsg.textColor = this.data.color;
            }
            else {
                this.lbl_tipMsg.textFlow = qmr.HtmlUtil.getHtmlString(this.data.mess);
            }
            if (this.data.itemcfg) {
                qmr.ImageUtil.setItemIcon(this.img_icon, this.data.itemcfg.icon, this.data.itemcfg.page);
            }
            this.y = qmr.StageUtil.stageHeight / 2 - this.height / 2 + this.data.yPos;
            this.common_g.width = this.lbl_tipMsg.width + 200;
            egret.Tween.get(this)
                .to({ y: qmr.StageUtil.stageHeight / 3 + 50 + this.data.yPos }, 1500)
                .to({ y: qmr.StageUtil.stageHeight / 3 + this.data.yPos, alpha: 0 }, 800)
                .call(this.dispose, this);
        };
        /**
         * @desc onFlyEnd
         */
        CommonTip.prototype.dispose = function () {
            this.data = null;
            this.isSeted = false;
            this.lbl_tipMsg.text = "";
            this.img_icon.source = null;
            egret.Tween.removeTweens(this);
            _super.prototype.dispose.call(this);
            qmr.TipManagerCommon.getInstance().recycleCommonTip(this);
        };
        return CommonTip;
    }(qmr.UIComponent));
    qmr.CommonTip = CommonTip;
    __reflect(CommonTip.prototype, "qmr.CommonTip");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var ConfigManagerBase = (function () {
        function ConfigManagerBase() {
        }
        /**
         * @description 根据Id获取当前行数对象
         * ConfigEnum
         */
        ConfigManagerBase.getConf = function (jsonName, confId) {
            var conf;
            var cfg = this.getBean(jsonName);
            if (cfg) {
                conf = cfg.get(confId);
                return conf;
            }
            return null;
        };
        /*
         * 根据文件名获取一个配置表
         * return dic
         */
        ConfigManagerBase.getBean = function (fileName) {
            var dic = this.cfgDic.get(fileName);
            if (!dic) {
                dic = this.parseConfigFromZip(fileName);
                this.cfgDic.set(fileName, dic);
                qmr.LogUtil.log("ConfigManagerBase.parseConfigFromZip:", fileName);
            }
            return dic;
        };
        /**从zip中解析一张表*/
        ConfigManagerBase.parseConfigFromZip = function (fileName) {
            var t = this;
            var dic = new qmr.Dictionary();
            var className = fileName.charAt(0).toLocaleUpperCase() + fileName.slice(1, fileName.length) + "Cfg"; //转换为类名
            var greeter = qmr[className];
            var zip = t.getZip(t.WHOLE_CONFIG_NAME);
            if (!zip) {
                zip = t.getZip(t.BASE_CONFIG_NAME);
            }
            if (!zip) {
                console.error("配置读取失败");
            }
            var zipObj = zip.file(fileName + ".json");
            if (!zipObj) {
                qmr.LogUtil.warn("从zip中解析一张表 = " + fileName + " 异常，请查看配置是否提交？？");
            }
            var contentObj = JSON.parse(zipObj.asText());
            if (greeter) {
                contentObj.forEach(function (element) {
                    var cfg = new greeter(element); //实例化类
                    if (cfg.key) {
                        var key = t.getkey(cfg, element);
                        dic.setConf(key, cfg);
                    }
                    else {
                        qmr.LogUtil.warn("获取配置表的唯一key 错误了。。。" + cfg);
                    }
                });
            }
            return dic;
        };
        ConfigManagerBase.getZip = function (resName) {
            if (!this.zipDic) {
                this.zipDic = new qmr.Dictionary();
            }
            var zip = this.zipDic.get(resName);
            if (!zip) {
                var bin = RES.getRes(resName);
                if (bin) {
                    zip = new JSZip(bin);
                    this.zipDic.set(resName, zip);
                }
            }
            return zip;
        };
        //获取配置表的唯一key值
        ConfigManagerBase.getkey = function (cfg, cfgValue) {
            if (!cfg.key) {
                return;
            }
            var keys = cfg.key.split("_");
            var newKey = "";
            var len = keys.length;
            if (len == 1) {
                newKey = cfgValue[cfg.key];
            }
            else {
                keys.forEach(function (element, index) {
                    newKey += index != len - 1 ? cfgValue[element] + "_" : cfgValue[element];
                });
            }
            return newKey;
        };
        ConfigManagerBase.cfgDic = new qmr.Dictionary();
        /**默认的资源包名称 */
        ConfigManagerBase.WHOLE_CONFIG_NAME = "config_bin";
        ConfigManagerBase.BASE_CONFIG_NAME = "configbase_bin";
        return ConfigManagerBase;
    }());
    qmr.ConfigManagerBase = ConfigManagerBase;
    __reflect(ConfigManagerBase.prototype, "qmr.ConfigManagerBase");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var GlobalConfig = (function () {
        function GlobalConfig() {
        }
        Object.defineProperty(GlobalConfig, "isOpenRecharge", {
            /**是否开放充值 */
            get: function () {
                if (!this.cdata) {
                    return true;
                }
                return this.cdata.charge == 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GlobalConfig, "isSysIos", {
            /**
             * 是否ios系统
             */
            get: function () {
                return egret.Capabilities.os.toUpperCase() == "IOS";
            },
            enumerable: true,
            configurable: true
        });
        /** 是否上报日志到reportLogUrl服务器上 */
        // public static bIsReportLog = false;
        GlobalConfig.reportLogData = {};
        GlobalConfig.reportLogUrl = "http://testmt.housepig.cn/xyws/";
        /** 是否开启Slow个人日志 */
        GlobalConfig.bIsShowSlowLog = false;
        GlobalConfig.loginInitFinish = false; //是否是调试状态LOGIN_INIT_FINISH
        GlobalConfig.isDebugF = false; //是否是调试战斗状态
        GlobalConfig.userId = 0; //玩家的账号
        GlobalConfig.signature = ""; //会话签名，用于检验
        GlobalConfig.unverifysvr = 0; //是否跳过校验用户(内部开发测试服务器全部传1, 接了SDK后传0或者不传)
        GlobalConfig.platLoginTime = ""; //登录平台SDK返回的时间
        /**我最近登陆的服务器列表 */
        GlobalConfig.recentLoginServerList = [];
        GlobalConfig.loginProxyServer = "h5liutingting7000.cn"; //当前QQ空间代理的登陆服务器
        /** 是否是sdk登出状态 */
        GlobalConfig.isSDKLogout = false;
        /**客户端注册用户英雄id */
        GlobalConfig.registerAccountHeroId = 0;
        /**游戏登陆账号 */
        GlobalConfig.account = "";
        GlobalConfig.token = "";
        /**服务器id */
        GlobalConfig.sid = "1";
        /**客户端登录游戏秘钥 */
        GlobalConfig.loginKey = '^SOLaMeMOBILE#2019!COMMONKEY24@^$^%(*9183098abcdhghhde';
        /**QOS打点服务器秘钥 */
        GlobalConfig.qosKey = 'SolGAmE2019QOSSecReTkeY#RewaRdSecRet^Ket%';
        /**登录服务器 */
        GlobalConfig.loginServer = "";
        /**是否是全新用户 */
        GlobalConfig.isFirstNewUser = false;
        /**客户端ip*/
        GlobalConfig.clientIp = "127.0.0.1";
        /**登录时间 */
        GlobalConfig.logintime = 0;
        return GlobalConfig;
    }());
    qmr.GlobalConfig = GlobalConfig;
    __reflect(GlobalConfig.prototype, "qmr.GlobalConfig");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var BaseConfigKeys = (function () {
        function BaseConfigKeys() {
        }
        /**名字*/
        BaseConfigKeys.PlayerName = true;
        /**消息*/
        BaseConfigKeys.CodeCfg = true;
        /**音效*/
        BaseConfigKeys.Music = true;
        /**中文配置*/
        BaseConfigKeys.ClientCn = true;
        return BaseConfigKeys;
    }());
    qmr.BaseConfigKeys = BaseConfigKeys;
    __reflect(BaseConfigKeys.prototype, "qmr.BaseConfigKeys");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var PlayerNameCfg = (function (_super) {
        __extends(PlayerNameCfg, _super);
        function PlayerNameCfg(element) {
            var _this = _super.call(this, element) || this;
            _this.key = "id";
            return _this;
        }
        Object.defineProperty(PlayerNameCfg.prototype, "id", {
            /**ID*/
            get: function () {
                return this.d["id"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNameCfg.prototype, "name_xing", {
            /**姓*/
            get: function () {
                return this.d["name_xing"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNameCfg.prototype, "name_ming_nan", {
            /**男名*/
            get: function () {
                return this.d["name_ming_nan"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNameCfg.prototype, "name_ming_nv", {
            /**女名*/
            get: function () {
                return this.d["name_ming_nv"];
            },
            enumerable: true,
            configurable: true
        });
        return PlayerNameCfg;
    }(qmr.BaseBean));
    qmr.PlayerNameCfg = PlayerNameCfg;
    __reflect(PlayerNameCfg.prototype, "qmr.PlayerNameCfg");
    var CodeCfgCfg = (function (_super) {
        __extends(CodeCfgCfg, _super);
        function CodeCfgCfg(element) {
            var _this = _super.call(this, element) || this;
            _this.key = "id";
            return _this;
        }
        Object.defineProperty(CodeCfgCfg.prototype, "id", {
            /**ID*/
            get: function () {
                return this.d["id"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CodeCfgCfg.prototype, "msg", {
            /**消息描述*/
            get: function () {
                return this.d["msg"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CodeCfgCfg.prototype, "type", {
            /**消息类型*/
            get: function () {
                return this.d["type"];
            },
            enumerable: true,
            configurable: true
        });
        return CodeCfgCfg;
    }(qmr.BaseBean));
    qmr.CodeCfgCfg = CodeCfgCfg;
    __reflect(CodeCfgCfg.prototype, "qmr.CodeCfgCfg");
    var MusicCfg = (function (_super) {
        __extends(MusicCfg, _super);
        function MusicCfg(element) {
            var _this = _super.call(this, element) || this;
            _this.key = "soundType";
            return _this;
        }
        Object.defineProperty(MusicCfg.prototype, "soundType", {
            /**音效key*/
            get: function () {
                return this.d["soundType"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MusicCfg.prototype, "soundName", {
            /**音效名字*/
            get: function () {
                return this.d["soundName"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MusicCfg.prototype, "isPlaySameTime", {
            /**是否同时播放*/
            get: function () {
                return this.d["isPlaySameTime"];
            },
            enumerable: true,
            configurable: true
        });
        return MusicCfg;
    }(qmr.BaseBean));
    qmr.MusicCfg = MusicCfg;
    __reflect(MusicCfg.prototype, "qmr.MusicCfg");
    var ClientCnCfg = (function (_super) {
        __extends(ClientCnCfg, _super);
        function ClientCnCfg(element) {
            var _this = _super.call(this, element) || this;
            _this.key = "id";
            return _this;
        }
        Object.defineProperty(ClientCnCfg.prototype, "id", {
            /**键*/
            get: function () {
                return this.d["id"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientCnCfg.prototype, "value", {
            /**值*/
            get: function () {
                return this.d["value"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientCnCfg.prototype, "colerType", {
            /**颜色:1：绿色，0：红色 --默认不填不设置颜色*/
            get: function () {
                return this.d["colerType"];
            },
            enumerable: true,
            configurable: true
        });
        return ClientCnCfg;
    }(qmr.BaseBean));
    qmr.ClientCnCfg = ClientCnCfg;
    __reflect(ClientCnCfg.prototype, "qmr.ClientCnCfg");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var ConfigEnumBase = (function () {
        function ConfigEnumBase() {
        }
        /**名字*/
        ConfigEnumBase.PLAYERNAME = 'PlayerName';
        /**消息*/
        ConfigEnumBase.CODECFG = 'CodeCfg';
        /**音效*/
        ConfigEnumBase.MUSIC = 'Music';
        /**中文配置*/
        ConfigEnumBase.CLIENTCN = 'ClientCn';
        return ConfigEnumBase;
    }());
    qmr.ConfigEnumBase = ConfigEnumBase;
    __reflect(ConfigEnumBase.prototype, "qmr.ConfigEnumBase");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    //灰质按钮皮肤类型
    var BtnSkinType;
    (function (BtnSkinType) {
        BtnSkinType[BtnSkinType["Type_1"] = 1] = "Type_1";
        BtnSkinType[BtnSkinType["Type_2"] = 2] = "Type_2";
    })(BtnSkinType = qmr.BtnSkinType || (qmr.BtnSkinType = {}));
    //消息频道	1系统信息/公告  2世界聊天  3组队聊天  4私聊  5帮会聊天	6跨服聊天
    var CHAT_CHANNELID;
    (function (CHAT_CHANNELID) {
        CHAT_CHANNELID[CHAT_CHANNELID["SYSTEM"] = 1] = "SYSTEM";
        CHAT_CHANNELID[CHAT_CHANNELID["WORLD"] = 2] = "WORLD";
        CHAT_CHANNELID[CHAT_CHANNELID["TEAM"] = 3] = "TEAM";
        CHAT_CHANNELID[CHAT_CHANNELID["SELF"] = 4] = "SELF";
        CHAT_CHANNELID[CHAT_CHANNELID["UNION"] = 5] = "UNION";
        CHAT_CHANNELID[CHAT_CHANNELID["CROSS"] = 6] = "CROSS";
    })(CHAT_CHANNELID = qmr.CHAT_CHANNELID || (qmr.CHAT_CHANNELID = {}));
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    //音乐类型
    var MusicType;
    (function (MusicType) {
        MusicType[MusicType["BG_MUSIC"] = 1] = "BG_MUSIC";
        MusicType[MusicType["EFFECT_MUSIC"] = 2] = "EFFECT_MUSIC";
    })(MusicType = qmr.MusicType || (qmr.MusicType = {}));
    /**主角武将id枚举*/
    var WarriorRole;
    (function (WarriorRole) {
        WarriorRole[WarriorRole["ROLE_MALE"] = 101] = "ROLE_MALE";
        WarriorRole[WarriorRole["ROLE_FEMALE"] = 102] = "ROLE_FEMALE";
    })(WarriorRole = qmr.WarriorRole || (qmr.WarriorRole = {}));
    var ColorQualityConst;
    (function (ColorQualityConst) {
        ColorQualityConst[ColorQualityConst["COLOR_G"] = 9067563] = "COLOR_G";
        ColorQualityConst[ColorQualityConst["COLOR_GREEN"] = 632328] = "COLOR_GREEN";
        ColorQualityConst[ColorQualityConst["COLOR_BLUE"] = 2197196] = "COLOR_BLUE";
        ColorQualityConst[ColorQualityConst["COLOR_VIOLET"] = 16722152] = "COLOR_VIOLET";
        ColorQualityConst[ColorQualityConst["COLOR_CADMIUM"] = 15095046] = "COLOR_CADMIUM";
        ColorQualityConst[ColorQualityConst["COLOR_RED"] = 14489856] = "COLOR_RED";
        ColorQualityConst[ColorQualityConst["COLOR_DIAMOND"] = 4758466] = "COLOR_DIAMOND";
    })(ColorQualityConst = qmr.ColorQualityConst || (qmr.ColorQualityConst = {}));
    //背包类型
    var BagType;
    (function (BagType) {
        BagType[BagType["TIEM"] = 0] = "TIEM";
        BagType[BagType["HERO"] = 1] = "HERO";
        BagType[BagType["EQUIP"] = 2] = "EQUIP"; //装备
    })(BagType = qmr.BagType || (qmr.BagType = {}));
    //角色类型
    var ActorSizeType;
    (function (ActorSizeType) {
        ActorSizeType[ActorSizeType["small"] = 0] = "small";
        ActorSizeType[ActorSizeType["mid"] = 1] = "mid";
        ActorSizeType[ActorSizeType["big"] = 2] = "big";
        ActorSizeType[ActorSizeType["UI"] = 3] = "UI";
    })(ActorSizeType = qmr.ActorSizeType || (qmr.ActorSizeType = {}));
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var NotifyConstBase = (function () {
        function NotifyConstBase() {
        }
        return NotifyConstBase;
    }());
    qmr.NotifyConstBase = NotifyConstBase;
    __reflect(NotifyConstBase.prototype, "qmr.NotifyConstBase");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 消息通知的常量,登录模块的消息通知常量都写在这里
     *
     */
    var NotifyConstLogin = (function () {
        function NotifyConstLogin() {
        }
        /** 错误日志 */
        NotifyConstLogin.S_ERROR_CODE = "S_ERROR_CODE"; //错误码事件
        /*-------------------------------登录--------------------------------------*/
        NotifyConstLogin.S_USER_LOGIN = "S_USER_LOGIN"; //登陆成功
        NotifyConstLogin.S_USER_LOGIN_REPEAT = "S_USER_LOGIN_REPEAT"; //角色名重复
        NotifyConstLogin.S_LOGIN_OFFLINE_HANGUP_PUSH = "S_LOGIN_OFFLINE_HANGUP_PUSH"; //服务器返回离线信息
        NotifyConstLogin.S_USER_LOGOUT = "S_USER_LOGOUT"; //活动启动
        /*-------------------------------模块TabView--------------------------------------*/
        NotifyConstLogin.TAB_VIEW_ADDPAGE = "TAB_VIEW_ADDPAGE"; //TabView打开子Page
        NotifyConstLogin.TAB_VIEW_REMOVEPAGE = "TAB_VIEW_REMOVEPAGE"; //TabView移除子Page
        NotifyConstLogin.TAB_VIEW_CHANGE_TAB = "TAB_VIEW_CHANGE_TAB"; //TabView切换分页
        NotifyConstLogin.UPDATE_OPEN_TITLE = "UPDATE_OPEN_TITLE"; //界面关闭派发事件，通知以打开界面刷新标题
        NotifyConstLogin.UPDATE_MODULE_TITLE = "UPDATE_MODULE_TITLE"; //更新某个模块面板的标题
        NotifyConstLogin.OPEN_PANEL_LAYER = "OPEN_PANEL_LAYER"; //打开在哪个层
        NotifyConstLogin.CLOSE_PANEL_LAYER = "CLOSE_PANEL_LAYER"; //打开在哪个层
        NotifyConstLogin.OPEN_PANEL_VIEW = "OPEN_PANEL_VIEW"; //打开界面
        NotifyConstLogin.CLOSE_PANEL_VIEW = "CLOSE_PANEL_VIEW"; //关闭界面
        /*-------------------------------分离登录模块--------------------------------------*/
        NotifyConstLogin.SCNY_ONE_SERVER_TIME = "SCNY_ONE_SERVER_TIME"; //同步一次服务器时间抛出
        NotifyConstLogin.CROSS_DAY = "CROSS_DAY"; //跨天抛出
        NotifyConstLogin.CHANGE_MODEL_VIEW = "SHOW_OR_HIDE_GUIDE"; //展示隐藏底部选中框,引导
        NotifyConstLogin.TO_HIDE_VIP_VIEW = "TO_HIDE_VIP_VIEW"; //隐藏VIP界面 
        NotifyConstLogin.TO_REQUEST_SHARE_REWARD = "TO_REQUEST_SHARE_REWARD"; //请求分享奖励
        return NotifyConstLogin;
    }());
    qmr.NotifyConstLogin = NotifyConstLogin;
    __reflect(NotifyConstLogin.prototype, "qmr.NotifyConstLogin");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * 事件处理器类
     * dear_H
     */
    var Handler = (function () {
        /**
         * 根据指定的属性值，创建一个 <code>Handler</code> 类的实例。
        * @param	caller 执行域。
        * @param	method 处理函数。
        * @param	args 函数参数。
        * @param	once 是否只执行一次。
        */
        function Handler(caller, method, args, once) {
            this._id = 0;
            this.setTo(caller, method, args, once);
        }
        /**
         * 设置此对象的指定属性值。
         * @param	caller 执行域(this)。
         * @param	method 回调方法。
         * @param	args 携带的参数。
         * @param	once 是否只执行一次，如果为true，执行后执行recover()进行回收。
         * @return  返回 handler 本身。
         */
        Handler.prototype.setTo = function (caller, method, args, once) {
            this._id = Handler._gid++;
            this.caller = caller;
            this.method = method;
            this.args = args;
            this.once = once;
            return this;
        };
        /**执行处理器。*/
        Handler.prototype.run = function () {
            if (this.method == null)
                return null;
            var id = this._id;
            var result = this.method.apply(this.caller, this.args);
            this._id === id && this.once && this.recover();
            return result;
        };
        /**执行处理器，携带额外数据。 */
        Handler.prototype.runWith = function (data) {
            if (this.method == null)
                return null;
            var id = this._id;
            var result;
            if (this.args)
                result = this.method.apply(this.caller, this.args.concat(data));
            else
                result = this.method.apply(this.caller, data);
            this._id === id && this.once && this.recover();
            return result;
        };
        /**
         * 回收
         */
        Handler.prototype.recover = function () {
            if (this._id > 0) {
                this._id = 0;
                Handler._pool.push(this.clear());
            }
        };
        /**
         * 从对象池内创建一个Handler，默认会执行一次并立即回收，如果不需要自动回收，设置once参数为false。
         * @param	caller 执行域(this)。
         * @param	method 回调方法。
         * @param	args 携带的参数。
         * @param	once 是否只执行一次，如果为true，回调后执行recover()进行回收，默认为true。
         * @return  返回创建的handler实例。
         */
        Handler.create = function (caller, method, args, once) {
            if (args === void 0) { args = null; }
            if (once === void 0) { once = true; }
            if (this._pool.length)
                return this._pool.pop().setTo(caller, method, args, once);
            return new Handler(caller, method, args, once);
        };
        /**清理对象引用。 */
        Handler.prototype.clear = function () {
            this.caller = null;
            this.method = null;
            this.args = null;
            return this;
        };
        /**@private handler对象池*/
        Handler._pool = [];
        /**@private */
        Handler._gid = 1;
        return Handler;
    }());
    qmr.Handler = Handler;
    __reflect(Handler.prototype, "qmr.Handler");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 做一些Http请求封装类
     *
     */
    var HttpRequest = (function () {
        function HttpRequest() {
        }
        /** 发送信息作为日志 */
        // public static sendPostToLog(url: string, args: any, callback?: Function, thisObject?: any): void
        // {
        //     if (GlobalConfig.bIsReportLog == true)
        //     {
        //         args["account"] = GlobalConfig.account;
        //         this.sendPost(url, args, callback, thisObject);
        //     }
        // }
        /**
         * @description 发送post请求
         */
        HttpRequest.sendPost = function (url, args, callback, thisObject) {
            var requestData = "";
            var index = 0;
            for (var key in args) {
                if (index == 0) {
                    requestData += key + "=" + args[key];
                }
                else {
                    requestData += "&" + key + "=" + args[key];
                }
                index++;
            }
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.POST);
            request.send(requestData);
            request.addEventListener(egret.Event.COMPLETE, function (evt) {
                if (callback) {
                    callback.call(request.response);
                }
            }, this);
        };
        /**
         * @description 发送GET请求
         */
        HttpRequest.sendGet = function (url, callback, thisObject) {
            var request = new egret.HttpRequest();
            request.timeout = 10000;
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.GET);
            request.send(null);
            request.addEventListener(egret.Event.COMPLETE, function (evt) {
                if (callback) {
                    callback.call(thisObject, request.response);
                }
            }, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (e) {
                // console.log("=========================================打点回调数据》》》："+request.response,e.type,e.data,e.currentTarget);
            }, this);
        };
        return HttpRequest;
    }());
    qmr.HttpRequest = HttpRequest;
    __reflect(HttpRequest.prototype, "qmr.HttpRequest");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var LayerConst = (function () {
        function LayerConst() {
        }
        LayerConst.MAP_LAYER = "mapLayer"; //战斗层
        LayerConst.FIGTH_UI = "figthUI"; //战斗UI层
        LayerConst.TOOLBAR = "toolbar";
        LayerConst.BASE_UI = "baseUI"; //ui层(一级界面)
        LayerConst.UI_EFFECT = "uiEffect"; //ui特效层
        LayerConst.ALERT = "alert";
        LayerConst.TIP = "tip";
        LayerConst.LOADING = "loading";
        LayerConst.TOP = "top";
        return LayerConst;
    }());
    qmr.LayerConst = LayerConst;
    __reflect(LayerConst.prototype, "qmr.LayerConst");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var DisplayObjectContainer = egret.DisplayObjectContainer;
    var LayerManager = (function () {
        function LayerManager() {
            this.layerList = new Array();
            this.layerDic = new qmr.Dictionary();
        }
        Object.defineProperty(LayerManager, "instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new (LayerManager)();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        LayerManager.prototype.setup = function (container) {
            this._parent = container;
            this.layerIndex = this._parent.numChildren;
            this.addLayer(qmr.LayerConst.MAP_LAYER, true); //战斗场景
            this.addLayer(qmr.LayerConst.FIGTH_UI, true); //战斗UI
            this.addLayer(qmr.LayerConst.TOOLBAR, true);
            this.addLayer(qmr.LayerConst.BASE_UI, true); //全屏窗口UI
            this.addLayer(qmr.LayerConst.UI_EFFECT, true);
            this.addLayer(qmr.LayerConst.ALERT, true);
            this.addLayer(qmr.LayerConst.TIP, true);
            this.addLayer(qmr.LayerConst.LOADING, true);
            this.addLayer(qmr.LayerConst.TOP, true);
        };
        LayerManager.prototype.addLayer = function (layerName, mouseEnabled) {
            var layer;
            var d = this._parent.getChildByName(layerName);
            if (d) {
                return;
            }
            layer = new DisplayObjectContainer();
            //layer.width = Config.width;
            //layer.height = Config.height;
            layer.touchEnabled = layer.touchChildren = mouseEnabled;
            layer.name = layerName;
            this.layerList.push(layer);
            this._parent.addChild(layer);
            this.layerDic.set(layerName, layer);
        };
        LayerManager.prototype.getLayer = function (type) {
            if (!type) {
                return (null);
            }
            return this.layerDic.get(type);
        };
        LayerManager.prototype.addChild = function (dis, type) {
            var sp = this.getLayer(type);
            if (sp) {
                sp.addChild(dis);
            }
            return (dis);
        };
        LayerManager.prototype.addChildAt = function (dis, _arg2, _arg3) {
            if (_arg3 === void 0) { _arg3 = 0; }
            var layer = this.getLayer(_arg2);
            if (layer) {
                layer.addChildAt(dis, 0);
            }
            return (dis);
        };
        LayerManager.prototype.removeChild = function (window) {
            if (!window) {
                return (window);
            }
            if (window.parent) {
                window.parent.removeChild(window);
            }
            return (window);
        };
        LayerManager.prototype.setCenter = function (window) {
            if (!window) {
                return;
            }
            window.x = Math.floor(((qmr.StageUtil.stageWidth - window.width) / 2));
            window.y = Math.floor(((qmr.StageUtil.stageHeight - window.height) / 2));
        };
        Object.defineProperty(LayerManager.prototype, "layersVisible", {
            set: function (b) {
                for (var _i = 0, _a = this.layerList; _i < _a.length; _i++) {
                    var layer = _a[_i];
                    if (layer.visible == b)
                        break;
                    layer.visible = b;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @description 添加显示对象
         * @param disPlay 要添加的显示对象
         * @param layer 显示对象的层级
         */
        LayerManager.prototype.addDisplay = function (disPlay, layerType, zIndex) {
            var layer = this.getLayer(layerType);
            if (zIndex) {
                layer.addChildAt(disPlay, 999);
            }
            else {
                layer.addChild(disPlay);
            }
        };
        return LayerManager;
    }());
    qmr.LayerManager = LayerManager;
    __reflect(LayerManager.prototype, "qmr.LayerManager");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**资源加载管理器 */
    var ResManager = (function () {
        function ResManager() {
        }
        /**加载资源组 */
        ResManager.loadGroup = function (source, compFunc, thisObject, priority, progFunc) {
            if (compFunc === void 0) { compFunc = null; }
            if (thisObject === void 0) { thisObject = null; }
            if (priority === void 0) { priority = 0; }
            if (progFunc === void 0) { progFunc = null; }
            ResManager.addLoader(source, compFunc, thisObject, priority, null, true, progFunc);
        };
        /**加载单个资源 */
        ResManager.getRes = function (source, compFunc, thisObject, priority, type) {
            if (priority === void 0) { priority = 0; }
            if (type === void 0) { type = null; }
            if (!source) {
                return;
            }
            function onGetRes(data) {
                if (compFunc) {
                    compFunc.call(thisObject, data, source);
                }
            }
            if (RES.hasRes(source)) {
                var data = RES.getRes(source);
                if (data) {
                    onGetRes(data);
                    return;
                }
            }
            ResManager.addLoader(source, compFunc, thisObject, priority, type);
        };
        /**添加一个加载器 */
        ResManager.addLoader = function (source, compFunc, thisObject, priority, type, isGroup, progFunc) {
            if (priority === void 0) { priority = 0; }
            if (type === void 0) { type = null; }
            if (isGroup === void 0) { isGroup = false; }
            if (progFunc === void 0) { progFunc = null; }
            var loader = LoaderPool.get();
            loader.init(ResManager.loaderCompleted, source, compFunc, thisObject, type, priority, isGroup, progFunc);
            //相同资源地址加载器处理
            var sameResInfoDic = ResManager._sameResInfoDic;
            if (!sameResInfoDic) {
                sameResInfoDic = new qmr.Dictionary();
                ResManager._sameResInfoDic = sameResInfoDic;
            }
            var sameResInfos = sameResInfoDic.get(source);
            if (sameResInfos) {
                sameResInfos.push(loader);
                //处理之前添加的加载器优先级
                ResManager.checkSameLoaderPriority(source, priority);
            }
            else {
                sameResInfos = [];
                sameResInfoDic.set(source, sameResInfos);
                if (priority >= LoadPriority.IMMEDIATELY) {
                    ResManager.startLoader(loader);
                }
                else {
                    var loaderQueue = ResManager._loaderQueue;
                    if (!loaderQueue) {
                        loaderQueue = [];
                        ResManager._loaderQueue = loaderQueue;
                    }
                    loaderQueue.push(loader);
                    ResManager.checkToLoadNext();
                }
            }
        };
        /**检查并处理相同资源地址加载器的优先级 */
        ResManager.checkSameLoaderPriority = function (source, priority) {
            var loaderQueue = ResManager._loaderQueue;
            if (loaderQueue) {
                var len = loaderQueue.length;
                for (var i = 0; i < len; i++) {
                    var loader = loaderQueue[i];
                    if (loader.source == source) {
                        if (loader.priority < priority) {
                            loader.priority = priority;
                            if (priority == LoadPriority.IMMEDIATELY) {
                                loaderQueue.splice(i, 1);
                                ResManager.startLoader(loader);
                            }
                            else {
                                ResManager.checkToLoadNext();
                            }
                        }
                        break;
                    }
                }
            }
        };
        /**检测加载下一个 */
        ResManager.checkToLoadNext = function () {
            var loaderQueue = ResManager._loaderQueue;
            if (loaderQueue) {
                var len = loaderQueue.length;
                if (len > 0) {
                    var loader = loaderQueue[len - 1];
                    var toLoad = false;
                    if (loader.priority >= LoadPriority.HIGH) {
                        if (ResManager._loadingCount < ResManager.HIGH_PRIORITY_MAX_COUNT) {
                            toLoad = true;
                        }
                    }
                    else if (loader.priority <= LoadPriority.LOW) {
                        if (ResManager._loadingCount < ResManager.LOW_PRIORITY_MAX_COUNT) {
                            toLoad = true;
                        }
                    }
                    if (toLoad) {
                        loader = loaderQueue.pop();
                        ResManager.startLoader(loader);
                    }
                }
            }
        };
        // private static testa = 0;
        // private static testb = 0;
        /**启动一个加载器 */
        ResManager.startLoader = function (loader) {
            // ResManager.testa++;
            // console.log("loadtest startLoader source=", loader.source, ResManager.testa);
            // console.log("startLoader");
            ResManager._loadingCount++;
            // console.log("loadtest startLoader _loadingCount=", ResManager._loadingCount);
            // LogUtil.log("ResManager.startLoader", loader.source, loader.priority);
            loader.load();
        };
        /**加载器完成或者错误回调 */
        ResManager.loaderCompleted = function (loader, isSuccess, data) {
            // LogUtil.log("ResManager.loaderCompleted", loader.source, loader.priority, isSuccess);
            // ResManager.testb++;
            // console.log("loadtest loaderCompleted source=", loader.source, ResManager.testb);
            // LogUtil.log("loaderCompleted", loader.source, loader.isGroup, isSuccess, data);
            try {
                if (isSuccess) {
                    //回调至加载发起者
                    ResManager.callbackLoader(loader, data);
                    //处理未开始的相同图集的加载器
                    var loaderQueue = ResManager._loaderQueue;
                    if (loaderQueue && loaderQueue.length > 0) {
                        var len_1 = loaderQueue.length;
                        for (var i = len_1 - 1; i >= 0; i--) {
                            var loaderOther = loaderQueue[i];
                            if (RES.hasRes(loaderOther.source)) {
                                var dataOther = RES.getRes(loaderOther.source);
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
                var sameResInfos = ResManager._sameResInfoDic.get(loader.source);
                var len = 0;
                if (sameResInfos) {
                    ResManager._sameResInfoDic.remove(loader.source);
                    if (isSuccess) {
                        len = sameResInfos.length;
                        for (var i = 0; i < len; i++) {
                            var loaderSame = sameResInfos[i];
                            ResManager.startLoader(loaderSame);
                        }
                    }
                }
                //回收清除
                LoaderPool.recycle(loader);
            }
            catch (err) {
                qmr.LogUtil.log("ResManager.loaderCompleted error" + err);
            }
            finally {
                //加载计数处理
                ResManager._loadingCount--;
                //检测是否开始新的加载
                ResManager.checkToLoadNext();
            }
        };
        /**回调至加载发起者 */
        ResManager.callbackLoader = function (loader, data) {
            if (loader.compFunc) {
                if (data) {
                    loader.compFunc.call(loader.thisObject, data, loader.source);
                }
                else {
                    loader.compFunc.call(loader.thisObject);
                }
            }
        };
        /**该等级及以下最多占用的加载进程数 */
        ResManager.LOW_PRIORITY_MAX_COUNT = 1;
        /**该等级及以下最多占用的加载进程数 */
        ResManager.HIGH_PRIORITY_MAX_COUNT = 4;
        /**正在加载的loader个数 */
        ResManager._loadingCount = 0;
        return ResManager;
    }());
    qmr.ResManager = ResManager;
    __reflect(ResManager.prototype, "qmr.ResManager");
    var LoadPriority;
    (function (LoadPriority) {
        LoadPriority[LoadPriority["LOW"] = -1] = "LOW";
        LoadPriority[LoadPriority["HIGH"] = 0] = "HIGH";
        LoadPriority[LoadPriority["IMMEDIATELY"] = 1] = "IMMEDIATELY"; //立即，动画加载
    })(LoadPriority = qmr.LoadPriority || (qmr.LoadPriority = {}));
    /**对象池，用于管理加载器的创建和回收 */
    var LoaderPool = (function () {
        function LoaderPool() {
        }
        LoaderPool.getPool = function () {
            var pool = LoaderPool._pool;
            if (!pool) {
                pool = [];
                LoaderPool._pool = pool;
            }
            return pool;
        };
        LoaderPool.get = function () {
            var loader;
            var pool = LoaderPool.getPool();
            if (pool.length > 0) {
                loader = pool.pop();
            }
            else {
                loader = new Loader();
            }
            return loader;
        };
        LoaderPool.recycle = function (loader) {
            loader.reset();
            var pool = LoaderPool.getPool();
            pool.push(loader);
        };
        return LoaderPool;
    }());
    __reflect(LoaderPool.prototype, "LoaderPool");
    /**加载器，执行单个加载任务 */
    var Loader = (function () {
        function Loader() {
        }
        Loader.prototype.init = function (callbackMananger, source, compFunc, thisObject, type, priority, isGroup, progFunc) {
            if (priority === void 0) { priority = 0; }
            if (isGroup === void 0) { isGroup = false; }
            if (progFunc === void 0) { progFunc = null; }
            this.callbackMananger = callbackMananger;
            this.source = source;
            this.compFunc = compFunc;
            this.thisObject = thisObject;
            this.type = this.type;
            this.priority = priority;
            this.isGroup = isGroup;
            this.progFunc = progFunc;
            this.loadCount = 0;
        };
        Loader.prototype.load = function () {
            this.loadCount++;
            if (this.isGroup) {
                if (this.loadCount <= 1) {
                    RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
                    RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onGroupProgress, this);
                    RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupLoadCompleted, this);
                }
                RES.loadGroup(this.source);
            }
            else {
                var resInConfig = false;
                if (RES.hasRes(this.source)) {
                    resInConfig = true;
                    var data = RES.getRes(this.source);
                    if (data) {
                        this.onGetResSuccess(data);
                        return;
                    }
                }
                if (this.loadCount <= 1) {
                    RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                }
                if (resInConfig) {
                    RES.getResAsync(this.source, this.onGetResSuccess, this);
                }
                else {
                    RES.getResByUrl(this.source, this.onGetResSuccess, this, this.type);
                }
            }
        };
        Loader.prototype.reset = function () {
            if (this.isGroup) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onGroupProgress, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupLoadCompleted, this);
            }
            else {
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
        };
        Loader.prototype.onGetResSuccess = function (data) {
            //回调至manager
            if (this.callbackMananger) {
                this.callbackMananger(this, true, data);
            }
        };
        Loader.prototype.onItemLoadError = function (evt) {
            if (this.source == evt.resItem.url) {
                qmr.LogUtil.log("onItemLoadError", this.source);
                if (this.callbackMananger) {
                    this.callbackMananger(this, false);
                }
            }
        };
        Loader.prototype.onGroupLoadCompleted = function (evt) {
            if (this.source == evt.groupName) {
                //回调至manager
                if (this.callbackMananger) {
                    this.callbackMananger(this, true);
                }
            }
        };
        Loader.prototype.onGroupLoadError = function (evt) {
            if (this.source == evt.groupName) {
                if (this.callbackMananger) {
                    this.callbackMananger(this, false);
                }
            }
        };
        Loader.prototype.onGroupProgress = function (evt) {
            if (this.source == evt.groupName) {
                if (this.progFunc) {
                    this.progFunc(evt.itemsLoaded / evt.itemsTotal);
                }
            }
        };
        return Loader;
    }());
    __reflect(Loader.prototype, "Loader");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * 游戏激活触发事件
     * coler
     *
     */
    var GameLifecycleManger = (function () {
        function GameLifecycleManger() {
            /**共计后台运行的次数 */
            this.onHideCount = 0;
        }
        Object.defineProperty(GameLifecycleManger, "instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new GameLifecycleManger;
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        GameLifecycleManger.prototype.init = function () {
            var _this = this;
            egret.lifecycle.onPause = function () {
                _this.onPause();
                // egret.ticker.pause();
            };
            egret.lifecycle.onResume = function () {
                _this.onResume();
                // egret.ticker.resume();
            };
        };
        /** 游戏重现获得焦点触发 */
        GameLifecycleManger.prototype.onResume = function () {
            qmr.LogUtil.log("焦点触发");
            qmr.SoundManager.getInstance().isMusicSoundOpen = GameLifecycleManger.bgSoundIsOpen;
            qmr.SoundManager.getInstance().isEffectSoundOpen = GameLifecycleManger.effectSoundIsOpen;
            /** 开启背景音乐 */
            // SoundManager.getInstance().reStartMusic();
            // egret.ticker.resume();
            qmr.PlatformManager.instance.platform.onShareBack();
        };
        /** 焦点失去时触发 */
        GameLifecycleManger.prototype.onPause = function () {
            qmr.LogUtil.log("焦点失去");
            //记录后台运行次数
            GameLifecycleManger.instance.onHideCount++;
            /** 关闭背景音乐 */
            // SoundManager.getInstance().stopMusic();
            // egret.ticker.pause();
            GameLifecycleManger.bgSoundIsOpen = qmr.SoundManager.getInstance().isMusicSoundOpen;
            GameLifecycleManger.effectSoundIsOpen = qmr.SoundManager.getInstance().isEffectSoundOpen;
            qmr.SoundManager.getInstance().isMusicSoundOpen = false;
            qmr.SoundManager.getInstance().isEffectSoundOpen = false;
        };
        GameLifecycleManger.bgSoundIsOpen = true;
        GameLifecycleManger.effectSoundIsOpen = true;
        return GameLifecycleManger;
    }());
    qmr.GameLifecycleManger = GameLifecycleManger;
    __reflect(GameLifecycleManger.prototype, "qmr.GameLifecycleManger");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * 游戏资源加载管理方案
     * 1-加载登陆资源配置
     * 2-加载登录资源
     * 3-登陆成功之后加载其他资源
     */
    var GameLoadManager = (function (_super) {
        __extends(GameLoadManager, _super);
        function GameLoadManager() {
            return _super.call(this) || this;
        }
        /**加载基础资源*/
        GameLoadManager.prototype.loadLoginRes = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            qmr.PlatformManager.instance.platform.setLoadingStatus("玩命加载中...");
                            return [4 /*yield*/, this.loadResJson("login.res.json", "resourceLogin/")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.loadThmJson("login.thm.json")];
                        case 2:
                            _a.sent();
                            //游戏配置文件、屏蔽字、随机名字都是在这个地方加载
                            return [4 /*yield*/, this.loadPreloadingGroup()];
                        case 3:
                            //游戏配置文件、屏蔽字、随机名字都是在这个地方加载
                            _a.sent();
                            qmr.PlatformManager.instance.platform.setLoadingProgress(50);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
        * @description 加载创角资源
        */
        GameLoadManager.prototype.loadcreateRes = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadResJson("createrole.res.json")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.loadThmJson("createrole.thm.json")];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.loadCreateRoleThmJs()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var totalCount = 2;
                                    var loadedCount = 0;
                                    var comFunc = function () {
                                        loadedCount++;
                                        if (loadedCount >= totalCount) {
                                            // PlatformManager.instance.platform.setLoadingStatus("");
                                            resolve();
                                        }
                                    };
                                    qmr.ResManager.loadGroup("createrole", comFunc, _this, qmr.LoadPriority.IMMEDIATELY);
                                    qmr.ResManager.getRes("cjbg1_jpg", comFunc, _this, qmr.LoadPriority.IMMEDIATELY);
                                })];
                    }
                });
            });
        };
        /**
         * 加载登录后游戏资源
        */
        GameLoadManager.prototype.loadGameResAfterLogin = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isGameResAfterLoginLoading) {
                                return [2 /*return*/];
                            }
                            this.isGameResAfterLoginLoading = true;
                            this.isGameResAfterLoginLoaded = false;
                            this.setLoadingViewParams("加载资源配置...", true, 0.05, 0.1, false);
                            this.setLoadingViewParams("加载皮肤配置...", true, 0.1, 0.2, true);
                            return [4 /*yield*/, this.loadResJson("default.res.json")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.loadDefaultThmJs()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.loadThmJson("default.thm.json")];
                        case 3:
                            _a.sent();
                            this.setLoadingViewParams("加载游戏配置...", true, 0.2, 0.5, true);
                            return [4 /*yield*/, this.loadConfigGroup()];
                        case 4:
                            _a.sent();
                            this.setLoadingViewParams("加载公共资源...", true, 0.5, 0.9, true);
                            return [4 /*yield*/, this.loadCommonGroup()];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**等待登录界面后台资源加载完成 */
        GameLoadManager.prototype.waiGameResAfterLoginLoaded = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        /**等待资源加载完成 */
        GameLoadManager.prototype.waitGameResLoaded = function () {
            return __awaiter(this, void 0, void 0, function () {
                var t;
                return __generator(this, function (_a) {
                    t = this;
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var completeFunc = function () {
                                t.setLoadingViewParams("准备进入游戏...", true, 0.99, 0.99, true);
                                var timer = new egret.Timer(30, 1);
                                timer.addEventListener(egret.TimerEvent.TIMER, function () {
                                    //发起预加载
                                    t.loadPreModel();
                                    resolve();
                                }, t);
                                timer.start();
                            };
                            if (t.isGameResAfterLoginLoaded) {
                                t.showLoadingView();
                                completeFunc();
                            }
                            else {
                                t.gameResAfterLoginLoadedCall = completeFunc;
                                t.showLoadingView();
                            }
                        })];
                });
            });
        };
        GameLoadManager.prototype.setLoadingViewParams = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            this.loadingViewparams = arg;
            if (this.gameResAfterLoginLoadedCall) {
                this.showLoadingView();
            }
        };
        GameLoadManager.prototype.showLoadingView = function () {
            if (this.loadingViewparams) {
                qmr.GameLoadingView.getInstance().showSelf(this.loadingViewparams[0], this.loadingViewparams[1], this.loadingViewparams[2], this.loadingViewparams[3], this.loadingViewparams[4]);
            }
        };
        GameLoadManager.prototype.updateTotalProgress = function (progress) {
            var isShow = qmr.ModuleManager.isShowModule(qmr.ModuleNameLogin.GAME_LOADING_VIEW);
            if (isShow) {
                qmr.GameLoadingView.getInstance().updateTotalProgress(progress, true);
            }
        };
        /** 添加预加载资源引用 */
        GameLoadManager.prototype.loaderSilentResource = function (resArr, completeFunc, priority) {
            if (completeFunc === void 0) { completeFunc = null; }
            if (priority === void 0) { priority = 0; }
            var _self = this;
            var resName = null;
            var resPath = null;
            for (var _i = 0, resArr_1 = resArr; _i < resArr_1.length; _i++) {
                var item = resArr_1[_i];
                resPath = item.path;
                if (item.type) {
                    qmr.ResManager.getRes(resPath, completeFunc, _self, priority, item.type);
                }
                else {
                    resName = item.res;
                    this.preLoadAnimation(item.path, resName, priority, completeFunc, _self, item.harf);
                    resPath = item.path + resName + ".png";
                    qmr.LoaderManager.instance.addGroupRef(resPath);
                }
            }
        };
        /**
         * 预加载加载动画模型资源，优先级为低
         */
        GameLoadManager.prototype.preLoadAnimation = function (path, resName, priority, callback, callbackObj, harf) {
            if (priority === void 0) { priority = 0; }
            if (callback === void 0) { callback = null; }
            if (callbackObj === void 0) { callbackObj = null; }
            if (harf === void 0) { harf = false; }
            var pngResName = resName;
            if (harf) {
                pngResName = pngResName + "_f";
            }
            if (callback) {
                var loadJson_1 = false;
                var loadImage_1 = false;
                qmr.ResManager.getRes(path + resName + ".json", function (data) {
                    loadJson_1 = true;
                    if (loadImage_1 && callback) {
                        callback.call(callbackObj);
                    }
                }, this, priority, RES.ResourceItem.TYPE_JSON);
                qmr.ResManager.getRes(path + pngResName + ".png", function (data) {
                    loadImage_1 = true;
                    if (loadJson_1 && callback) {
                        callback.call(callbackObj);
                    }
                }, this, priority, RES.ResourceItem.TYPE_IMAGE);
            }
            else {
                qmr.ResManager.getRes(path + resName + ".json", null, null, priority, RES.ResourceItem.TYPE_JSON);
                qmr.ResManager.getRes(path + pngResName + ".png", null, null, priority, RES.ResourceItem.TYPE_IMAGE);
            }
        };
        /**
        * @description 加载前期资源
        */
        GameLoadManager.prototype.loadPreloadingGroup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var t;
                return __generator(this, function (_a) {
                    t = this;
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var completeFunc = function () {
                                resolve();
                            };
                            qmr.ResManager.loadGroup("loginPre", completeFunc, _this, qmr.LoadPriority.IMMEDIATELY, t.updateTotalProgress);
                        })];
                });
            });
        };
        /** 加载登录后皮肤文件 */
        GameLoadManager.prototype.loadCreateRoleThmJs = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var onScriptLoaded = function () {
                                // console.log("----default.thm.js onScriptLoaded----:" + egret.getTimer());
                                resolve();
                            };
                            var onScriptLoadingProgress = function (progress) {
                                // console.log("----default.thm.js onScriptLoadingProgress----:" + progress);
                            };
                            window["onScriptLoadedCallBack"] = onScriptLoaded;
                            window["onScriptLoadingProgressCallBack"] = onScriptLoadingProgress;
                            if (window["loadJsForEgretGame"]) {
                                window["loadJsForEgretGame"]("createrole", qmr.VersionManager.getPathWithGameVersion);
                            }
                            else {
                                resolve();
                            }
                        })];
                });
            });
        };
        /** 加载登录后皮肤文件 */
        GameLoadManager.prototype.loadDefaultThmJs = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var onScriptLoaded = function () {
                                // console.log("----default.thm.js onScriptLoaded----:" + egret.getTimer());
                                resolve();
                            };
                            var onScriptLoadingProgress = function (progress) {
                                // console.log("----default.thm.js onScriptLoadingProgress----:" + progress);
                            };
                            window["onScriptLoadedCallBack"] = onScriptLoaded;
                            window["onScriptLoadingProgressCallBack"] = onScriptLoadingProgress;
                            if (window["loadJsForEgretGame"]) {
                                window["loadJsForEgretGame"]("game", qmr.VersionManager.getPathWithGameVersion);
                            }
                            else if (window["loadSub2"]) {
                                window["loadSub2"]();
                            }
                            else {
                                resolve();
                            }
                        })];
                });
            });
        };
        /**  加载资源配置文件 */
        GameLoadManager.prototype.loadResJson = function (configName, resourceRootRalative) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var completeFunc = function () {
                                RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, completeFunc, this);
                                resolve();
                            };
                            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, completeFunc, _this);
                            if (!resourceRootRalative) {
                                resourceRootRalative = qmr.PlatformConfig.baseRoot;
                            }
                            var resourceRoot = resourceRootRalative;
                            RES.loadConfig(resourceRoot + configName, resourceRoot);
                        })];
                });
            });
        };
        /**加载皮肤配置 */
        GameLoadManager.prototype.loadThmJson = function (url, resourceRootRalative) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
                            var theme;
                            if (!resourceRootRalative) {
                                resourceRootRalative = qmr.PlatformConfig.baseRoot;
                            }
                            var resourceRoot = resourceRootRalative;
                            theme = new eui.Theme(resourceRoot + url, qmr.StageUtil.stage);
                            var completeFunc = function () {
                                theme.removeEventListener(eui.UIEvent.COMPLETE, completeFunc, this);
                                resolve();
                            };
                            theme.addEventListener(eui.UIEvent.COMPLETE, completeFunc, _this);
                        })];
                });
            });
        };
        /**
        * @description 加载游戏配置文件
        */
        GameLoadManager.prototype.loadConfigGroup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var t = _this;
                            var completeFunc = function () {
                                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, completeFunc, t);
                                resolve();
                            };
                            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, completeFunc, t);
                            qmr.ResManager.loadGroup("config", completeFunc, _this, qmr.LoadPriority.IMMEDIATELY, t.updateTotalProgress);
                        })];
                });
            });
        };
        /**
        * @description 加载公共资源文件
        */
        GameLoadManager.prototype.loadCommonGroup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var t = _this;
                            var completeFunc = function () {
                                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, completeFunc, t);
                                resolve();
                            };
                            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, completeFunc, t);
                            qmr.ResManager.loadGroup("common", completeFunc, _this, qmr.LoadPriority.IMMEDIATELY, t.updateTotalProgress);
                        })];
                });
            });
        };
        /**
        * @description 预加载模型/技能资源
        */
        GameLoadManager.prototype.loadPreModel = function () {
        };
        Object.defineProperty(GameLoadManager, "instance", {
            get: function () {
                if (!this._instance) {
                    this._instance = new GameLoadManager();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        return GameLoadManager;
    }(qmr.BaseNotify));
    qmr.GameLoadManager = GameLoadManager;
    __reflect(GameLoadManager.prototype, "qmr.GameLoadManager");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var LayerMaskSprite = (function () {
        function LayerMaskSprite() {
            this.mask = new egret.Sprite();
        }
        LayerMaskSprite.getLayerMaskSprite = function () {
            var card = qmr.Pool.getItemByClass("LayerMaskSprite", LayerMaskSprite);
            return card;
        };
        LayerMaskSprite.recovryLayerMaskSprite = function (card) {
            qmr.Pool.recover("LayerMaskSprite", card);
        };
        LayerMaskSprite.prototype.addMask = function (layer, isAlpha0) {
            if (isAlpha0 === void 0) { isAlpha0 = false; }
            this._isAlpha0 = isAlpha0;
            if (!this.mask) {
                this.mask = new egret.Sprite();
            }
            this.onStageResize();
            this.mask.touchEnabled = true;
            this.mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMaskHandler, this);
            qmr.LayerManager.instance.getLayer(layer).addChild(this.mask);
            if (!isAlpha0)
                this.tweenAddMask();
        };
        LayerMaskSprite.prototype.onClickMaskHandler = function (evt) {
            if (this.mask && this.mask.parent) {
                var count = this.mask.parent.numChildren;
                if (count > 1) {
                    var win = this.mask.parent.getChildAt(count - 1);
                    if (win instanceof qmr.SuperBaseModule) {
                        if (win.isClickHide) {
                            win.hide();
                        }
                    }
                }
            }
        };
        LayerMaskSprite.prototype.tweenAddMask = function () {
            if (this.mask && this.mask.parent) {
                egret.Tween.resumeTweens(this.mask);
                egret.Tween.get(this.mask).to({ alpha: 1 }, 120);
            }
        };
        LayerMaskSprite.prototype.tweenRemoveMask = function () {
            var mask = this.mask;
            if (mask && mask.parent) {
                if (mask.alpha > 0) {
                    mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMaskHandler, this);
                    egret.Tween.resumeTweens(mask);
                    egret.Tween.get(mask).to({ alpha: 0 }, 100).call(this.removeMask, this);
                }
                else {
                    this.removeMask();
                }
            }
        };
        LayerMaskSprite.prototype.onStageResize = function () {
            var w = this.stageWidth;
            var h = this.stageHeight;
            this.mask.graphics.clear();
            this.mask.graphics.beginFill(0x000000, this._isAlpha0 ? 0 : 0.6);
            this.mask.graphics.drawRect(0, 0, w, h);
            this.mask.graphics.endFill();
            this.mask.width = w;
            this.mask.height = h;
        };
        LayerMaskSprite.prototype.removeMask = function () {
            var mask = this.mask;
            if (mask && mask.parent) {
                mask.graphics.clear();
                mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMaskHandler, this);
                mask.parent.removeChild(mask);
            }
            this.dispose();
        };
        Object.defineProperty(LayerMaskSprite.prototype, "stageWidth", {
            get: function () {
                return qmr.StageUtil.stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayerMaskSprite.prototype, "stageHeight", {
            get: function () {
                return qmr.StageUtil.stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        LayerMaskSprite.prototype.reset = function () {
        };
        LayerMaskSprite.prototype.dispose = function () {
            this.reset();
            LayerMaskSprite.recovryLayerMaskSprite(this);
        };
        return LayerMaskSprite;
    }());
    qmr.LayerMaskSprite = LayerMaskSprite;
    __reflect(LayerMaskSprite.prototype, "qmr.LayerMaskSprite");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var LoaderManager = (function () {
        function LoaderManager() {
            /**无引用计数后的最大存活时间，单位毫秒 */
            this.maxLivingTime = 120000;
            var t = this;
            t.groupNameDic = {};
            //每分钟检测一次
            qmr.Ticker.getInstance().registerTick(t.clearGroupTick, t, 60000);
        }
        Object.defineProperty(LoaderManager, "instance", {
            get: function () {
                if (!this._instance) {
                    this._instance = new LoaderManager();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * addRef
         */
        LoaderManager.prototype.addGroupRef = function (groupName) {
            var obj = this.groupNameDic[groupName];
            if (!obj) {
                this.groupNameDic[groupName] = obj = {};
            }
            var count = obj.count;
            if (count) {
                count += 1;
            }
            else {
                count = 1;
            }
            obj.count = count;
            qmr.LogUtil.log("LoaderManager.addGroupRef:", groupName, count);
        };
        /** 直接删除资源引用计数，而不是清理一次引用【慎用】 */
        LoaderManager.prototype.removeGroupRef = function (groupName) {
            if (groupName in this.groupNameDic) {
                delete this.groupNameDic[groupName];
            }
        };
        /**
         * 释放资源名
         * groupName：释放的资源组/unpack url
         * force:是否立即释放资源组
         */
        LoaderManager.prototype.destoryGroup = function (groupName, force) {
            if (force === void 0) { force = false; }
            var obj = this.groupNameDic[groupName];
            if (obj) {
                var count = obj.count;
                if (count) {
                    count -= 1;
                }
                else {
                    count = 0;
                }
                if (count <= 0) {
                    count = 0;
                }
                obj.count = count;
                qmr.LogUtil.log("LoaderManager.destoryGroup:", groupName, count);
                if (count == 0) {
                    obj.livingTime = egret.getTimer();
                    if (force) {
                        var result = RES.destroyRes(groupName);
                        qmr.LogUtil.warn("强制释放 " + groupName + "  " + result);
                        this.groupNameDic[groupName] = null;
                        delete this.groupNameDic[groupName];
                    }
                }
            }
        };
        LoaderManager.prototype.clearGroupTick = function () {
            var now = egret.getTimer();
            var groupNameDic = this.groupNameDic;
            var maxLivingTime = this.maxLivingTime;
            for (var key in groupNameDic) {
                var item = groupNameDic[key];
                if (item.count == 0 && item.livingTime) {
                    if (now - item.livingTime > maxLivingTime) {
                        var rootStr = RES.destroyRes(key);
                        qmr.LogUtil.warn("RES.destroyRes res:" + key + "  " + rootStr);
                        groupNameDic[key] = null;
                        delete groupNameDic[key];
                    }
                }
            }
            qmr.ModuleManager.clearModuleTick(now, maxLivingTime);
            qmr.AnimateManager.getInstance().clear(now);
        };
        return LoaderManager;
    }());
    qmr.LoaderManager = LoaderManager;
    __reflect(LoaderManager.prototype, "qmr.LoaderManager");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**游戏服务器登录流程控制类 */
    var LoginManager = (function () {
        function LoginManager() {
        }
        LoginManager.showLoginView = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    qmr.ModuleManager.showModule(qmr.ModuleNameLogin.LOGIN_VIEW);
                    return [2 /*return*/];
                });
            });
        };
        return LoginManager;
    }());
    qmr.LoginManager = LoginManager;
    __reflect(LoginManager.prototype, "qmr.LoginManager");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var SystemController = (function (_super) {
        __extends(SystemController, _super);
        function SystemController() {
            var _this = _super.call(this) || this;
            _this.timeKey = -1;
            return _this;
        }
        Object.defineProperty(SystemController, "instance", {
            /**  获取单例对象 */
            get: function () {
                if (this._instance == null) {
                    this._instance = new SystemController();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        SystemController.prototype.initListeners = function () {
            this.addSocketListener(qmr.MessageIDLogin.S_SYNC_TIME, this.onRecsynSystem, this);
            this.addSocketListener(qmr.MessageIDLogin.S_EXCEPTION_MSG, this.onRecExceptionMsg, this, true);
        };
        /**
         * 启动心跳包
         */
        SystemController.prototype.startHeart = function () {
            if (!this.isStartSysn) {
                this.isStartSysn = true;
                this.timeFlag = Date.now();
                this.timeKey = egret.setInterval(this.reqgetSystemTime, this, 8000);
                this.reqgetSystemTime();
            }
        };
        SystemController.prototype.clearHeart = function () {
            this.isStartSysn = false;
            if (this.timeKey != -1) {
                egret.clearInterval(this.timeKey);
                this.timeKey = -1;
            }
        };
        /**
         * ---同步心跳包---
         */
        SystemController.prototype.reqgetSystemTime = function () {
            var c = new com.message.C_SYNC_TIME();
            this.sendCmd(c, qmr.MessageIDLogin.C_SYNC_TIME);
            // console.log("C_SYNC_TIME:", Date.now() - this.timeFlag);
            // this.timeFlag = Date.now();
        };
        /**
         * ===同步心跳包===
         */
        SystemController.prototype.onRecsynSystem = function (s) {
            qmr.TimeUtil.syncServerTime(parseInt(s.time.toString()));
            if (!this.isSyncOne) {
                this.isSyncOne = true;
                this.dispatch(qmr.NotifyConstLogin.SCNY_ONE_SERVER_TIME);
            }
        };
        /**
         * ===错误码===
         */
        SystemController.prototype.onRecExceptionMsg = function (s) {
            var code = s.code;
            qmr.LogUtil.log("[错误码: " + code + "]");
            var codeConf = qmr.ConfigManagerBase.getConf(qmr.ConfigEnumBase.CODECFG, code);
            if (codeConf) {
                if (code == 1217) {
                    qmr.Rpc.getInstance().close();
                    qmr.GameLoading.getInstance().close();
                    qmr.TipManagerCommon.getInstance().createCommonColorTip(codeConf.msg);
                }
                else if (code == 1171) {
                    this.dispatch(qmr.NotifyConstLogin.S_USER_LOGIN_REPEAT);
                    qmr.TipManagerCommon.getInstance().createCommonColorTip(codeConf.msg);
                }
                else {
                    this.dispatch(qmr.NotifyConstLogin.S_ERROR_CODE, code);
                }
            }
        };
        return SystemController;
    }(qmr.BaseController));
    qmr.SystemController = SystemController;
    __reflect(SystemController.prototype, "qmr.SystemController");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var TipManagerCommon = (function () {
        function TipManagerCommon() {
            //多个飘字的间隔时间
            this.commonTipCdTime = 500;
            this.commonMessInfo = [];
            this.isConmmoning = false;
            this.commonTips = [];
        }
        /**
         * @desc 获取一个单例
         */
        TipManagerCommon.getInstance = function () {
            if (TipManagerCommon.instance == null) {
                TipManagerCommon.instance = new TipManagerCommon();
            }
            return TipManagerCommon.instance;
        };
        /**
         * ----------------------------添加飘字内容-------------------------------
         * 添加了新的背景，所有的颜色只能用白色  2017-04-01 by Don
         */
        TipManagerCommon.prototype.createCommonTip = function (msg, msgColor, yPos, itemcfg) {
            if (msgColor === void 0) { msgColor = 0xffffff; }
            if (yPos === void 0) { yPos = 0; }
            if (itemcfg === void 0) { itemcfg = null; }
            var flag = false;
            for (var _i = 0, _a = this.commonMessInfo; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.mess == msg) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                this.commonMessInfo.push({ mess: msg, color: msgColor, yPos: yPos, itemcfg: itemcfg });
            }
            if (!this.isConmmoning) {
                this.isConmmoning = true;
                this.showCommonTip();
            }
        };
        /**成功飘绿色的/失败飘红色*/
        TipManagerCommon.prototype.createCommonColorTip = function (msg, isSuccess, yPos, itemcfg) {
            if (isSuccess === void 0) { isSuccess = false; }
            if (yPos === void 0) { yPos = 0; }
            if (itemcfg === void 0) { itemcfg = null; }
            this.createCommonTip(msg, isSuccess ? 0x09a608 : 0xFF0000, yPos, itemcfg);
        };
        TipManagerCommon.prototype.recycleCommonTip = function (commonTip) {
            this.commonTips.push(commonTip);
        };
        /**
         * 在界面显示飘字内容
         */
        TipManagerCommon.prototype.showCommonTip = function () {
            var _this = this;
            if (!this.isConmmoning)
                return;
            var messInfo = this.commonMessInfo.shift();
            if (!messInfo)
                return;
            var commonTip = this.commonTips.shift();
            if (!commonTip) {
                commonTip = new qmr.CommonTip();
            }
            qmr.LayerManager.instance.addDisplay(commonTip, qmr.LayerConst.TIP);
            commonTip.showTip(messInfo);
            egret.setTimeout(function () {
                if (!_this.commonMessInfo.length) {
                    _this.isConmmoning = false;
                }
                else {
                    _this.showCommonTip();
                }
            }, this, this.commonTipCdTime);
        };
        return TipManagerCommon;
    }());
    qmr.TipManagerCommon = TipManagerCommon;
    __reflect(TipManagerCommon.prototype, "qmr.TipManagerCommon");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var VersionManager = (function () {
        function VersionManager() {
        }
        VersionManager.initGameVersion = function (v) {
            return __awaiter(this, void 0, void 0, function () {
                var t;
                return __generator(this, function (_a) {
                    t = this;
                    if (!qmr.PlatformConfig.useCdnRes) {
                        return [2 /*return*/];
                    }
                    t.resVersion = v;
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            //通过httpReques获得配置资源信息
                            var versionConfigPath = qmr.PlatformConfig.webUrl + t.defaultDir + "/" + t.resVersion + "/version.json";
                            qmr.LogUtil.log("=========》》》加载版本控制文件：" + versionConfigPath);
                            var request = new egret.HttpRequest();
                            request.responseType = egret.HttpResponseType.TEXT;
                            request.open(versionConfigPath, egret.HttpMethod.GET);
                            request.send();
                            request.addEventListener(egret.Event.COMPLETE, function (event) {
                                var request = event.currentTarget;
                                var verJson = JSON.parse(request.response);
                                t.versionConfig = verJson.verDic;
                                t.defaultVer = verJson.defaultVer;
                                resolve();
                            }, t);
                            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
                                egret.error("post error : " + event);
                                reject();
                            }, t);
                        })];
                });
            });
        };
        /**获取带版本号的资源路径 */
        VersionManager.getPathWithGameVersion = function (resPath) {
            var version = VersionManager.defaultVer;
            //取版本控制的的version
            if (VersionManager.versionConfig && VersionManager.versionConfig[resPath]) {
                version = VersionManager.versionConfig[resPath];
            }
            // 文件路径中插入版本号+后缀扩展名
            resPath = qmr.PlatformConfig.webUrl + VersionManager.defaultDir + "/" + version + "/" + resPath;
            return resPath;
        };
        /**默认版本控制目录 */
        VersionManager.defaultDir = "ver";
        return VersionManager;
    }());
    qmr.VersionManager = VersionManager;
    __reflect(VersionManager.prototype, "qmr.VersionManager");
    var VersionController = (function () {
        function VersionController() {
        }
        // 在游戏开始加载资源的时候就会调用这个函数
        VersionController.prototype.init = function () {
            return Promise.resolve();
        };
        //在游戏运行时，每个资源加载url都要经过这个函数
        VersionController.prototype.getVirtualUrl = function (url) {
            // qmr.LogUtil.log("=======》》》加载绝对路径资源："+url);
            // 在开发模式下，所有资源还是以原来的资源路径去加载，方便开发者替换资源
            if (qmr.PlatformConfig.useCdnRes) {
                return this.getResUrlByVersion(url);
            }
            else {
                return url + "?v=" + new Date().getTime();
            }
        };
        /**
         * 获得版本控制之后的路径信息
         */
        VersionController.prototype.getResUrlByVersion = function (url) {
            // qmr.LogUtil.log("==============================》》》加载绝对路径资源："+url);
            //判断是否为版本控制的资源，其他域的资源，比如玩家头像，或是初始包体里面的资源以原始url加载
            if (url.indexOf("eui_skins") != -1) {
                // qmr.LogUtil.log("==================》》》加载eui_skins资源："+url);
                return url;
            }
            var starIndex = url.indexOf(qmr.PlatformConfig.baseRoot);
            if (starIndex == -1) {
                // qmr.LogUtil.error("==============================》》》出现不在跟目录下的资源："+url);
                return url;
            }
            // 部分文件可能存在？v=加数字进行控制的形式，在引擎底层这里是不支持加v=的，只会以原始url加载路径
            // 如果项目中存在类似的情况，将其还原成普通形式
            var endIndex = url.indexOf("?v=");
            var resPath;
            // //取版本控制的路径
            if (endIndex != -1) {
                resPath = url.slice(starIndex, endIndex);
            }
            else {
                resPath = url.slice(starIndex);
            }
            var version = VersionManager.defaultVer;
            //取版本控制的的version
            if (VersionManager.versionConfig && VersionManager.versionConfig[resPath]) {
                version = VersionManager.versionConfig[resPath];
            }
            // 文件路径中插入版本号+后缀扩展名
            resPath = qmr.PlatformConfig.webUrl + VersionManager.defaultDir + "/" + version + "/" + resPath;
            // qmr.LogUtil.log("==================》》》加载版本控制路径资源："+resPath);
            return resPath;
        };
        return VersionController;
    }());
    qmr.VersionController = VersionController;
    __reflect(VersionController.prototype, "qmr.VersionController", ["RES.IVersionController"]);
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var ModuleManager = (function () {
        function ModuleManager() {
        }
        ModuleManager.clearModuleTick = function (now, maxAliveTime) {
            var t = this;
            var cacheAppMap = t._cacheAppMap;
            var keyArr = cacheAppMap.keys;
            for (var _i = 0, keyArr_1 = keyArr; _i < keyArr_1.length; _i++) {
                var key = keyArr_1[_i];
                var app = cacheAppMap.get(key);
                if (!app) {
                    qmr.LogUtil.error("ModuleManager.cacheAppMap变成空了？？ " + key);
                    continue;
                }
                if (!app.getEffective(now, maxAliveTime)) {
                    cacheAppMap.remove(key);
                    qmr.LogUtil.warn("ModuleManager.clear " + key);
                }
            }
        };
        ModuleManager.popModule = function (className, data, layer, closeAll, isShowClose) {
            if (data === void 0) { data = null; }
            if (layer === void 0) { layer = qmr.LayerConst.ALERT; }
            if (closeAll === void 0) { closeAll = false; }
            if (isShowClose === void 0) { isShowClose = true; }
            ModuleManager.showModule(className, data, layer, closeAll, isShowClose);
            qmr.SoundManager.getInstance().loadAndPlayEffect("SOUND_TANCHU");
        };
        /**
         * 显示一个界面
         * @className   打开的窗口实例
         * @data        携带数据
         * @layer       打开的窗口父级
         * @closeAll    是否关闭其它窗口
         * @isShowClose 是打开状态，要不要关闭
         * @closeOpenPanel 关闭后要打开的界面
         */
        ModuleManager.showModule = function (className, data, layer, closeAll, isShowClose, closeOpenPanel, closeOpenPanelData, preModule) {
            if (data === void 0) { data = null; }
            if (layer === void 0) { layer = qmr.LayerConst.BASE_UI; }
            if (closeAll === void 0) { closeAll = true; }
            if (isShowClose === void 0) { isShowClose = true; }
            if (closeOpenPanel === void 0) { closeOpenPanel = ""; }
            if (closeOpenPanelData === void 0) { closeOpenPanelData = null; }
            if (preModule === void 0) { preModule = null; }
            var t = this;
            var win = t.getAppByClass(className);
            if (win) {
                win.preModule = preModule;
                win.name = className;
                win.closeOpenPanel = closeOpenPanel;
                win.closeOpenPanelData = closeOpenPanelData;
                if (isShowClose && win.isShow) {
                    if (t._NO_TRIGGER_MODULE.indexOf(className) != -1) {
                        win.show(data);
                        return;
                    }
                    t.hideModule(className);
                    return;
                }
                if (closeAll) {
                    t.closeAllWindow();
                }
                win.show(data);
                t._currView = win;
                var groupName = win.groupName;
                if (groupName != undefined && groupName != "") {
                    if (groupName.match("_json")) {
                        qmr.ResManager.getRes(groupName, null, t);
                    }
                    else {
                        qmr.ResManager.loadGroup(groupName);
                    }
                    qmr.LoaderManager.instance.addGroupRef(groupName);
                }
                win.layer = layer;
                qmr.LayerManager.instance.getLayer(layer).addChild(win);
                if (win.title) {
                    win.updateTitle(win.title, win.ruleId);
                }
                qmr.LogUtil.log("[openModule:" + className + "]");
                qmr.NotifyManager.sendNotification(qmr.NotifyConstLogin.OPEN_PANEL_VIEW, className);
                qmr.NotifyManager.sendNotification(qmr.NotifyConstLogin.OPEN_PANEL_LAYER, layer);
            }
            t.sendToTop();
        };
        /** 一个模块是否在显示中 */
        ModuleManager.isShowModule = function (className) {
            var win = this._cacheAppMap.get(className);
            if (win) {
                return win.isShow;
            }
            return false;
        };
        /** 关闭一个界面 */
        ModuleManager.hideModule = function (className, isHideEffect) {
            if (isHideEffect === void 0) { isHideEffect = false; }
            var t = this;
            var win;
            var viewName = className;
            if (className instanceof qmr.SuperBaseModule) {
                win = className;
                viewName = win.name;
            }
            else {
                win = t._cacheAppMap.get(className);
            }
            if (win) {
                if (!win.isShow) {
                    return;
                }
                if (isHideEffect) {
                    win.hide();
                }
                else {
                    t.disposWin(win);
                }
                if (win.closeOpenPanel) {
                    t.showModule(win.closeOpenPanel, win.closeOpenPanelData);
                }
            }
            qmr.NotifyManager.sendNotification(qmr.NotifyConstLogin.CLOSE_PANEL_VIEW, viewName);
        };
        /** 关闭所有界面 */
        ModuleManager.closeAllWindow = function () {
            var t = this;
            var sp = qmr.LayerManager.instance.getLayer(qmr.LayerConst.BASE_UI);
            var win;
            while (sp.numChildren) {
                win = sp.getChildAt(0);
                t.disposWin(win);
            }
            /** 弹出层 */
            sp = qmr.LayerManager.instance.getLayer(qmr.LayerConst.ALERT);
            while (sp.numChildren) {
                win = sp.getChildAt(0);
                t.disposWin(win);
            }
        };
        ModuleManager.getCurrentView = function () {
            return this._currView;
        };
        /** 关闭当前界面 */
        ModuleManager.closeCurrentModule = function () {
            if (this._currView) {
                this.disposWin(this._currView);
            }
        };
        /** 根据类获取缓存实例 */
        ModuleManager.getAppByClass = function (appClass) {
            if (appClass == null)
                return null;
            var now = egret.getTimer();
            var t = this;
            var app = t._cacheAppMap.get(appClass);
            var maxAliveTime = qmr.LoaderManager.instance.maxLivingTime;
            if (app == null || !app.getEffective(now, maxAliveTime)) {
                var className = t.getClassName(appClass);
                app = new className();
                //app = eval("new " + appClass);//微信里面不支持。。
                t._cacheAppMap.set(appClass, app);
            }
            return app;
        };
        /** 获取在舞台中的指定显示对象,若在舞台中返回该实例，否则返回null */
        ModuleManager.getSuperBaseModuleByClass = function (appClass) {
            var SuperBaseModule = this._cacheAppMap.get(appClass);
            if (SuperBaseModule && SuperBaseModule.stage) {
                return SuperBaseModule;
            }
            return null;
        };
        /**
         *  获取模块中某个控件在舞台中的位置
         */
        ModuleManager.getComponentGlobalPoint = function (moduleName, componentName) {
            var SuperBaseModule = this._cacheAppMap.get(moduleName);
            if (SuperBaseModule) {
                return SuperBaseModule.getComponentGlobalPoint(componentName);
            }
            return { x: 0, y: 0 };
        };
        ModuleManager.addMask = function (layer, isAlpha0) {
            if (isAlpha0 === void 0) { isAlpha0 = false; }
            var mask = qmr.LayerMaskSprite.getLayerMaskSprite();
            mask.addMask(layer, isAlpha0);
            return mask;
        };
        ModuleManager.disposWin = function (win) {
            if (win instanceof qmr.SuperBaseModule) {
                win.dispose();
                if (win.maskSprite) {
                    win.maskSprite.tweenRemoveMask();
                    win.maskSprite = null;
                }
                /** 若前一个模块是module并且尚未关闭，刷新前一个模块的指引 */
                if (win.preModule && win.preModule.parent) {
                    win.updateGuide();
                    win.preModule = null;
                }
            }
            else {
                qmr.DisplayUtils.removeDisplay(win);
            }
            this.sendToTop();
        };
        ModuleManager.sendToTop = function () {
            var sp = qmr.LayerManager.instance.getLayer(qmr.LayerConst.BASE_UI);
            // console.log("指引 sendToTop");
            qmr.NotifyManager.sendNotification(qmr.NotifyConstLogin.CLOSE_PANEL_LAYER, sp.numChildren);
            // Ticker.getInstance().unRegisterTick(this.sendToTopEvent, this);
            // Ticker.getInstance().registerTick(this.sendToTopEvent, this, 30, 1);
            this.sendToTopEvent();
        };
        /** 20190921 */
        ModuleManager.sendToTopEvent = function () {
            qmr.NotifyManager.sendNotification(qmr.NotifyConstLogin.CHANGE_MODEL_VIEW);
        };
        /**
         * 根据模块名删除一个模块引用,一般用于一次性界面
         */
        ModuleManager.deleteModule = function (moduleName) {
            this._cacheAppMap.remove(moduleName);
        };
        ModuleManager.setupClass = function () {
            var t = this;
            t.registerClass(qmr.ModuleNameLogin.LOGIN_VIEW, qmr.LoginView); //登录界面
            t.registerClass(qmr.ModuleNameLogin.GAME_LOADING_VIEW, qmr.GameLoadingView); //游戏加载界面
        };
        ModuleManager.registerClass = function (name, appClass) {
            this._classAppMap[name] = appClass;
        };
        ModuleManager.getClassName = function (name) {
            return this._classAppMap[name];
        };
        /** 映射class */
        ModuleManager._classAppMap = {};
        ModuleManager._cacheAppMap = new qmr.Dictionary();
        /** 需要手动关闭 */
        ModuleManager._NO_TRIGGER_MODULE = [];
        /**重置未开放时不显示的视图 */
        ModuleManager.NO_RECHARGE_HIDE_VIEW = [];
        //是否从战斗中打开
        ModuleManager.openPanelFromBattle = false;
        return ModuleManager;
    }());
    qmr.ModuleManager = ModuleManager;
    __reflect(ModuleManager.prototype, "qmr.ModuleManager");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var ModuleNameLogin = (function () {
        function ModuleNameLogin() {
        }
        ModuleNameLogin.LOGIN_VIEW = "qmr.LoginView"; //登录模块
        ModuleNameLogin.GAME_LOADING_VIEW = "qmr.GameLoadingView"; //游戏加载界面
        return ModuleNameLogin;
    }());
    qmr.ModuleNameLogin = ModuleNameLogin;
    __reflect(ModuleNameLogin.prototype, "qmr.ModuleNameLogin");
})(qmr || (qmr = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        qmr.GameMain.setup(this.stage);
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
var qmr;
(function (qmr) {
    /**
     *
     * @description 游戏loading
     *
     */
    var GameLoading = (function (_super) {
        __extends(GameLoading, _super);
        function GameLoading() {
            var _this = _super.call(this) || this;
            /**
             * @description 设置加载进度
             */
            _this.vitureCount = 0;
            var t = _this;
            t.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
                if (t.hasEventListener(egret.Event.ENTER_FRAME)) {
                    t.removeEventListener(egret.Event.ENTER_FRAME, t.runLoading, t);
                }
            }, t);
            t.addEventListener(egret.Event.ADDED_TO_STAGE, function () {
                t.setProgress(0, 1);
                t.addEventListener(egret.Event.ENTER_FRAME, t.runLoading, t);
            }, t);
            t.touchEnabled = true;
            return _this;
        }
        GameLoading.prototype.onTouch = function (evt) {
            evt.stopImmediatePropagation();
        };
        GameLoading.prototype.runLoading = function (evt) {
            if (this._loadingRun) {
                this._loadingRun.rotation += 3;
            }
        };
        /**
         * @description 获取loading单例对象
         */
        GameLoading.getInstance = function () {
            if (GameLoading.inttance == null) {
                GameLoading.inttance = new GameLoading();
            }
            return GameLoading.inttance;
        };
        GameLoading.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.rect = new eui.Rect();
            this.rect.fillColor = 0x0;
            this.rect.fillAlpha = 0.2;
            this.addChild(this.rect);
            this.rect.touchEnabled = true;
            this.rect.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
            this._loadingRun = new eui.Image(RES.getRes("preloading_loading_png"));
            this.addChild(this._loadingRun);
            this._txProgress = new eui.Label;
            this.addChild(this._txProgress);
            this.updateSize();
        };
        /**
         * @description 更新尺寸
         */
        GameLoading.prototype.updateSize = function () {
            this._loadingRun.verticalCenter = 0;
            this._loadingRun.horizontalCenter = 0;
            this._txProgress.verticalCenter = 0;
            this._txProgress.horizontalCenter = 0;
            this._txProgress.size = 20;
            // this._txProgress.stroke = 1;
            // this._txProgress.strokeColor = 0;
            this.rect.width = qmr.StageUtil.stageWidth;
            this.rect.height = qmr.StageUtil.stageHeight;
        };
        GameLoading.prototype.setProgress = function (itemsLoaded, itemsTotal) {
            qmr.LayerManager.instance.addDisplay(this, qmr.LayerConst.TOP);
            if (this._txProgress) {
                this._txProgress.text = Math.round(itemsLoaded / itemsTotal * 100) + "%";
                if (itemsLoaded == 0) {
                    this.vitureCount = 1;
                    qmr.Ticker.getInstance().registerTick(this.onTimer, this, 50);
                }
                else {
                    qmr.Ticker.getInstance().unRegisterTick(this.onTimer, this);
                }
            }
        };
        GameLoading.prototype.onTimer = function () {
            this.vitureCount++;
            if (this.vitureCount < 100) {
                this._txProgress.text = Math.round(this.vitureCount) + "%";
            }
        };
        /**
         * @description 设置loading提示
         */
        GameLoading.prototype.setLoadingTip = function (msg) {
            qmr.Ticker.getInstance().unRegisterTick(this.onTimer, this);
            qmr.NotifyManager.registerNotify(qmr.StageUtil.STAGE_RESIZE, this.updateSize, this);
            qmr.LayerManager.instance.addDisplay(this, qmr.LayerConst.TOP);
            if (this._txProgress) {
                this._txProgress.text = msg;
            }
        };
        /**
         * @description 关闭loading
         */
        GameLoading.prototype.close = function () {
            qmr.NotifyManager.unRegisterNotify(qmr.StageUtil.STAGE_RESIZE, this.updateSize, this);
            qmr.Ticker.getInstance().unRegisterTick(this.onTimer, this);
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        return GameLoading;
    }(eui.Group));
    qmr.GameLoading = GameLoading;
    __reflect(GameLoading.prototype, "qmr.GameLoading");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var GameLoadingProgressBar = (function (_super) {
        __extends(GameLoadingProgressBar, _super);
        function GameLoadingProgressBar() {
            var _this = _super.call(this) || this;
            _this.skinName = "GameLoadingProgressBarSkin";
            _this.touchEnabled = _this.touchChildren = false;
            return _this;
        }
        GameLoadingProgressBar.prototype.showProgressRate = function (rateNum, isShowTween) {
            if (isShowTween === void 0) { isShowTween = false; }
            var rate = rateNum;
            if (rate <= 0)
                rate = 0;
            if (rate >= 1)
                rate = 1;
            var progressWidth = rate * 528;
            egret.Tween.removeTweens(this.imgProgress);
            if (!isShowTween) {
                this.imgProgress.width = progressWidth;
            }
            else {
                egret.Tween.get(this.imgProgress).to({ width: progressWidth }, 300);
            }
            this.imgCloud.x = progressWidth;
        };
        GameLoadingProgressBar.prototype.setLoadingTip = function (txt) {
            this.labHint.text = txt;
        };
        GameLoadingProgressBar.prototype.dispose = function () {
            egret.Tween.removeTweens(this.imgProgress);
        };
        return GameLoadingProgressBar;
    }(eui.Component));
    qmr.GameLoadingProgressBar = GameLoadingProgressBar;
    __reflect(GameLoadingProgressBar.prototype, "qmr.GameLoadingProgressBar");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * 游戏大加载进度条
     */
    var GameLoadingView = (function (_super) {
        __extends(GameLoadingView, _super);
        function GameLoadingView() {
            var _this = _super.call(this) || this;
            _this.currentProgress = 0; //当前进度
            _this.maxProgress = 100; //最大进度
            _this.fromProgressTotal = 0;
            _this.dProgressTotal = 1;
            _this.HREF = "event_refresh_game";
            _this.needAdaptStatusBar = false;
            _this.skinName = "GameLoadingViewSkin";
            _this.progressBar1.visible = true;
            _this.progressBar2.visible = true;
            return _this;
        }
        GameLoadingView.getInstance = function () {
            if (!GameLoadingView._instance) {
                GameLoadingView._instance = qmr.ModuleManager.getAppByClass(qmr.ModuleNameLogin.GAME_LOADING_VIEW);
            }
            return GameLoadingView._instance;
        };
        GameLoadingView.prototype.initComponent = function () {
            _super.prototype.initComponent.call(this);
            var actionName = " 刷新游戏";
            if (qmr.PlatformManager.instance.platform.canClearResCache) {
                actionName = " 清除缓存";
            }
            var arr1 = qmr.HtmlUtil.getHtmlTextElement("若长时间加载不成功，请点击", 0xffffff);
            var arr2 = qmr.HtmlUtil.getHtmlTextElement(actionName, 0x31FF2C, true, this.HREF, 0x1D4810, 1);
            this.labRefresh.textFlow = arr1.concat(arr2);
            this.labRefresh.touchEnabled = true;
        };
        /**
         * 初始化事件监听器,需被子类继承
         */
        GameLoadingView.prototype.initListener = function () {
            _super.prototype.initListener.call(this);
            this.addEvent(this.labRefresh, egret.TextEvent.LINK, this.onRefresh, this);
        };
        GameLoadingView.prototype.addedToStage = function (evt) {
            _super.prototype.addedToStage.call(this, evt);
        };
        GameLoadingView.prototype.showSelf = function (msg, showVitureProgress, fromProgress, toProgress, isShowTween) {
            if (showVitureProgress === void 0) { showVitureProgress = true; }
            if (fromProgress === void 0) { fromProgress = 0; }
            if (toProgress === void 0) { toProgress = 1; }
            if (isShowTween === void 0) { isShowTween = true; }
            if (!qmr.ModuleManager.isShowModule(qmr.ModuleNameLogin.GAME_LOADING_VIEW)) {
                qmr.ModuleManager.showModule(qmr.ModuleNameLogin.GAME_LOADING_VIEW, null, qmr.LayerConst.LOADING, false);
            }
            this.setPrelMessage(msg);
            if (this.fromProgressTotal >= 0.99) {
                showVitureProgress = false;
                isShowTween = false;
            }
            if (showVitureProgress) {
                this.showVitureProgress();
            }
            else {
                this.closeVitureProgress();
            }
            this.fromProgressTotal = fromProgress;
            this.dProgressTotal = toProgress - fromProgress;
            this.updateTotalProgress(0, isShowTween);
        };
        GameLoadingView.prototype.hideSelf = function () {
            this.currentProgress = 0;
            if (qmr.ModuleManager.isShowModule(qmr.ModuleNameLogin.GAME_LOADING_VIEW)) {
                qmr.ModuleManager.hideModule(qmr.ModuleNameLogin.GAME_LOADING_VIEW);
            }
        };
        GameLoadingView.prototype.updateTotalProgress = function (progress, isShowTween) {
            if (isShowTween === void 0) { isShowTween = false; }
            if (this.isShow) {
                if (this.fromProgressTotal >= 0.99) {
                    this.closeVitureProgress();
                    isShowTween = false;
                }
                this.showTotalProgress(this.fromProgressTotal + progress * this.dProgressTotal, isShowTween);
            }
        };
        /**
         * 跑虚拟进度
         */
        GameLoadingView.prototype.showVitureProgress = function () {
            var _this = this;
            if (!this.tid) {
                this.tid = setInterval(function () {
                    _this.updateAutoLoading();
                }, 50);
                this.updateAutoLoading();
            }
        };
        /**
         * @description 关闭进度条
         */
        GameLoadingView.prototype.closeVitureProgress = function () {
            if (this.tid) {
                clearInterval(this.tid);
                this.tid = null;
            }
            this.showPreProgress(1);
        };
        GameLoadingView.prototype.updateAutoLoading = function () {
            if (this.currentProgress < this.maxProgress) {
                this.currentProgress += 10;
            }
            else {
                this.currentProgress = 0;
            }
            this.showPreProgress(this.currentProgress / this.maxProgress);
        };
        GameLoadingView.prototype.onRefresh = function (evt) {
            qmr.PlatformManager.instance.platform.reloadGame(qmr.PlatformManager.instance.platform.canClearResCache);
        };
        GameLoadingView.prototype.setPrelMessage = function (tips) {
            this.progressBar1.setLoadingTip(tips);
        };
        GameLoadingView.prototype.setTotalMessage = function (tips) {
            this.progressBar2.setLoadingTip(tips);
        };
        /**
         * 总进度
         */
        GameLoadingView.prototype.showTotalProgress = function (rateNum, isShowTween) {
            if (isShowTween === void 0) { isShowTween = false; }
            this.progressBar2.showProgressRate(rateNum, isShowTween);
        };
        /**
         * 单进度
         */
        GameLoadingView.prototype.showPreProgress = function (rateNum, isShowTween) {
            if (isShowTween === void 0) { isShowTween = false; }
            this.progressBar1.showProgressRate(rateNum, isShowTween);
        };
        /**
         *  资源释放
         */
        GameLoadingView.prototype.dispose = function () {
            this.currentProgress = 0;
            this.closeVitureProgress();
            _super.prototype.dispose.call(this);
            qmr.LoaderManager.instance.destoryGroup("serverlist_loginBg_jpg");
        };
        return GameLoadingView;
    }(qmr.SuperBaseModule));
    qmr.GameLoadingView = GameLoadingView;
    __reflect(GameLoadingView.prototype, "qmr.GameLoadingView");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 登陆通信控制器
     *
     */
    var LoginController = (function (_super) {
        __extends(LoginController, _super);
        function LoginController() {
            var _this = _super.call(this) || this;
            _this.isEnterGame = false;
            return _this;
        }
        Object.defineProperty(LoginController, "instance", {
            /**  获取单例对象  */
            get: function () {
                if (this._instance == null) {
                    this._instance = new LoginController();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        LoginController.prototype.initListeners = function () {
        };
        LoginController.prototype.onEnterGame = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.isEnterGame = true;
                    this.destoryLoginRes();
                    /**
                     * 非常重要：
                     * 这里是进入游戏之前加载完成必须加载
                     * 进入游戏所需要资源必须在这里先加载完成后才允许执行游戏渲染逻辑
                     * */
                    // GameLoadManager.instance.loadGameResAfterLogin();
                    // await GameLoadManager.instance.waitGameResLoaded();
                    qmr.EntryAfterLogin.onEnterGame();
                    return [2 /*return*/];
                });
            });
        };
        LoginController.prototype.destoryLoginRes = function () {
            var preLoadBg = document.getElementById("preLoadBg");
            if (preLoadBg && preLoadBg.parentNode) {
                preLoadBg.parentNode.removeChild(preLoadBg);
            }
            qmr.ModuleManager.hideModule(qmr.ModuleNameLogin.LOGIN_VIEW, true);
        };
        return LoginController;
    }(qmr.BaseController));
    qmr.LoginController = LoginController;
    __reflect(LoginController.prototype, "qmr.LoginController");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var LoginModel = (function () {
        function LoginModel() {
        }
        Object.defineProperty(LoginModel, "instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new LoginModel;
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        return LoginModel;
    }());
    qmr.LoginModel = LoginModel;
    __reflect(LoginModel.prototype, "qmr.LoginModel");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var LoginView = (function (_super) {
        __extends(LoginView, _super);
        function LoginView() {
            var _this = _super.call(this) || this;
            _this.needAdaptStatusBar = false;
            return _this;
        }
        /**
         * @description 初始化事件
         */
        LoginView.prototype.initListener = function () {
            _super.prototype.initListener.call(this);
            this.addClickEvent(this.btnClose, this.onCloseClick, this);
            this.addClickEvent(this.btnReturn, this.onCloseClick, this);
        };
        LoginView.prototype.onCloseClick = function () {
            qmr.LoginController.instance.onEnterGame();
        };
        LoginView.prototype.addedToStage = function (evt) {
            _super.prototype.addedToStage.call(this, evt);
            var loadSpan = document.getElementById("gameLoading");
            if (loadSpan && loadSpan.parentNode) {
                loadSpan.parentNode.removeChild(loadSpan);
            }
            var styleSpan = document.getElementById("style");
            if (styleSpan && styleSpan.parentNode) {
                styleSpan.parentNode.removeChild(styleSpan);
            }
            qmr.PlatformManager.instance.platform.setLoadingStatus("");
            qmr.GameLoadManager.instance.loadGameResAfterLogin();
            this.onBgResBack();
        };
        LoginView.prototype.onBgResBack = function () {
            qmr.LogUtil.log("onBgResBack");
            if (document && document.getElementById("loaingMyBg")) {
                var myBg = document.getElementById("loaingMyBg");
                myBg.style.display = "none";
            }
        };
        /**
        * @description 初始化数据,需被子类继承
        */
        LoginView.prototype.initData = function () {
            _super.prototype.initData.call(this);
        };
        LoginView.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            qmr.ModuleManager.deleteModule(qmr.ModuleNameLogin.LOGIN_VIEW);
            var destroySuccess = RES.destroyRes("login");
            qmr.LogUtil.log("RES.destroyRes,login=", destroySuccess);
        };
        return LoginView;
    }(qmr.LoginViewUI));
    qmr.LoginView = LoginView;
    __reflect(LoginView.prototype, "qmr.LoginView");
})(qmr || (qmr = {}));
var DebugPlatform = (function () {
    function DebugPlatform() {
    }
    DebugPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    DebugPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return DebugPlatform;
}());
__reflect(DebugPlatform.prototype, "DebugPlatform", ["Platform"]);
if (!window.platform) {
    window.platform = new DebugPlatform();
}
var qmr;
(function (qmr) {
    /** 登录信息 */
    var LoginInfoVo = (function () {
        function LoginInfoVo() {
        }
        return LoginInfoVo;
    }());
    qmr.LoginInfoVo = LoginInfoVo;
    __reflect(LoginInfoVo.prototype, "qmr.LoginInfoVo");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var GameMain = (function () {
        function GameMain() {
        }
        GameMain.setup = function (stage) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            qmr.WebBrowerUtil.initSysInfo();
                            //初始化平台配置文件
                            return [4 /*yield*/, qmr.PlatformConfig.init()];
                        case 1:
                            //初始化平台配置文件
                            _a.sent();
                            qmr.StageUtil.init(stage);
                            egret.ImageLoader.crossOrigin = "anonymous";
                            //注入自定义的素材解析器
                            egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
                            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
                            //在最开始将AssetsManager的默认版本控制替换掉
                            RES.registerVersionController(new qmr.VersionController());
                            qmr.MessageIDLogin.init();
                            qmr.LayerManager.instance.setup(qmr.StageUtil.stage);
                            qmr.ModuleManager.setupClass();
                            qmr.LoginController.instance; //登录协议注册
                            qmr.SystemController.instance; //系统协议注册
                            qmr.GameLifecycleManger.instance.init();
                            //this.stage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF;
                            this.initLocalStorage();
                            return [4 /*yield*/, qmr.GameLoadManager.instance.loadLoginRes()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, qmr.LoginManager.showLoginView()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** 读取缓存 */
        GameMain.initLocalStorage = function () {
            var isCloseBgSound = egret.localStorage.getItem("bgSoundIsOpen") == "0";
            var isCloseEffectSound = egret.localStorage.getItem("effectSoundIsOpen") == "0";
            console.log("背景音乐是否关闭：" + isCloseBgSound);
            console.log("音效是否关闭：" + isCloseEffectSound);
            qmr.SoundManager.getInstance().isMusicSoundOpen = !isCloseBgSound;
            qmr.SoundManager.getInstance().isEffectSoundOpen = !isCloseEffectSound;
        };
        return GameMain;
    }());
    qmr.GameMain = GameMain;
    __reflect(GameMain.prototype, "qmr.GameMain");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * 根据消息MessageID自动生成，请勿修改
     *
     */
    var ProtoMsgIdMapLogin = (function () {
        function ProtoMsgIdMapLogin() {
            this.msgIdMap = {};
            this.msgIdMap[qmr.MessageIDLogin.S_EXCEPTION_MSG] = com.message.S_EXCEPTION_MSG;
            this.msgIdMap[qmr.MessageIDLogin.S_USER_LOGIN] = com.message.S_USER_LOGIN;
            this.msgIdMap[qmr.MessageIDLogin.S_USER_LOGOUT] = com.message.S_USER_LOGOUT;
            this.msgIdMap[qmr.MessageIDLogin.C_SYNC_TIME] = com.message.C_SYNC_TIME;
            this.msgIdMap[qmr.MessageIDLogin.S_SYNC_TIME] = com.message.S_SYNC_TIME;
            this.msgIdMap[qmr.MessageIDLogin.C_SEND_SDK_DATA] = com.message.C_SEND_SDK_DATA;
            this.msgIdMap[qmr.MessageIDLogin.S_SEND_SDK_DATA] = com.message.S_SEND_SDK_DATA;
        }
        Object.defineProperty(ProtoMsgIdMapLogin, "instance", {
            /**
            *  获取单例
            */
            get: function () {
                if (this._instance == null) {
                    this._instance = new ProtoMsgIdMapLogin();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        return ProtoMsgIdMapLogin;
    }());
    qmr.ProtoMsgIdMapLogin = ProtoMsgIdMapLogin;
    __reflect(ProtoMsgIdMapLogin.prototype, "qmr.ProtoMsgIdMapLogin");
})(qmr || (qmr = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var ThemeAdapter = (function () {
    function ThemeAdapter() {
    }
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param onSuccess 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param onError 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    ThemeAdapter.prototype.getTheme = function (url, onSuccess, onError, thisObject) {
        var _this = this;
        function onResGet(e) {
            onSuccess.call(thisObject, e);
        }
        function onResError(e) {
            if (e.resItem.url == url) {
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
                onError.call(thisObject);
            }
        }
        if (typeof generateEUI !== 'undefined') {
            qmr.LogUtil.log("[url:" + url + "]");
            egret.callLater(function () {
                onSuccess.call(thisObject, generateEUI);
            }, this);
        }
        else if (typeof generateEUI2 !== 'undefined') {
            RES.getResByUrl("resource/gameEui.json", function (data, url) {
                window["JSONParseClass"]["setData"](data);
                egret.callLater(function () {
                    onSuccess.call(thisObject, generateEUI2);
                }, _this);
            }, this, RES.ResourceItem.TYPE_JSON);
        }
        else if (typeof generateJSON !== 'undefined') {
            if (url.indexOf(".exml") > -1) {
                var dataPath = url.split("/");
                dataPath.pop();
                var dirPath = dataPath.join("/") + "_EUI.json";
                if (!generateJSON.paths[url]) {
                    RES.getResByUrl(dirPath, function (data) {
                        window["JSONParseClass"]["setData"](data);
                        egret.callLater(function () {
                            onSuccess.call(thisObject, generateJSON.paths[url]);
                        }, _this);
                    }, this, RES.ResourceItem.TYPE_JSON);
                }
                else {
                    egret.callLater(function () {
                        onSuccess.call(thisObject, generateJSON.paths[url]);
                    }, this);
                }
            }
            else {
                egret.callLater(function () {
                    onSuccess.call(thisObject, generateJSON);
                }, this);
            }
        }
        else {
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
            RES.getResByUrl(url, onResGet, this, RES.ResourceItem.TYPE_TEXT);
        }
    };
    return ThemeAdapter;
}());
__reflect(ThemeAdapter.prototype, "ThemeAdapter", ["eui.IThemeAdapter"]);
var qmr;
(function (qmr) {
    /**
     *
     * @description 消息通知管理器
     *
     */
    var NotifyManager = (function () {
        function NotifyManager() {
        }
        /**
         * @description 注册一个消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        NotifyManager.registerNotify = function (type, callBack, thisObject) {
            var typeDic = NotifyManager.typeDic;
            var typeList = typeDic[type];
            if (!typeList) {
                typeDic[type] = [{ callback: callBack, thisObject: thisObject }];
            }
            else {
                var result = false;
                for (var _i = 0, typeList_1 = typeList; _i < typeList_1.length; _i++) {
                    var item = typeList_1[_i];
                    if (item.callback == callBack && item.thisObject == thisObject) {
                        result = true;
                        break;
                    }
                }
                if (!result) {
                    typeList.push({ callback: callBack, thisObject: thisObject });
                    typeDic[type] = typeList;
                }
            }
        };
        /**
         * @description 取消一个注册消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        NotifyManager.unRegisterNotify = function (type, callBack, thisObject) {
            var typeList = NotifyManager.typeDic[type];
            if (typeList) {
                for (var _i = 0, typeList_2 = typeList; _i < typeList_2.length; _i++) {
                    var item = typeList_2[_i];
                    if (item.callback == callBack && item.thisObject == thisObject) {
                        var index = typeList.indexOf(item);
                        if (index != -1) {
                            typeList.splice(index, 1);
                        }
                        break;
                    }
                }
                if (typeList.length == 0) {
                    delete NotifyManager.typeDic[type];
                }
                else {
                    NotifyManager.typeDic[type] = typeList;
                }
            }
        };
        /** 慎用，除非自己特有的事情类型 */
        NotifyManager.unRegisterNotifyByType = function (type) {
            delete NotifyManager.typeDic[type];
        };
        NotifyManager.hasNotification = function (type) {
            var typeList = NotifyManager.typeDic[type];
            if (typeList) {
                return typeList.length > 0;
            }
            return false;
        };
        /**
         * @description 发送一个消息通知
         */
        NotifyManager.sendNotification = function (type, params) {
            if (params === void 0) { params = null; }
            var typeList = NotifyManager.typeDic[type];
            if (typeList) {
                var count = typeList.length;
                var item = void 0;
                for (var i = count - 1; i >= 0; i--) {
                    item = typeList[i];
                    if (item && item.callback) {
                        item.callback.call(item.thisObject, params);
                    }
                }
            }
        };
        /** 分批次处理事件 */
        NotifyManager.sendNotificationSplit = function (type, params) {
            if (params === void 0) { params = null; }
            var typeList = NotifyManager.typeDic[type];
            // let temp = JSON.parse( JSON.stringify(typeList));
            /**{ callback: any, thisObject: any, params: any } */
            var tempList = [];
            if (typeList) {
                var count = typeList.length;
                var item = void 0;
                for (var i = count - 1; i >= 0; i--) {
                    item = typeList[i];
                    if (item && item.callback) {
                        if (!tempList[i]) {
                            tempList[i] = {};
                        }
                        tempList[i]["callback"] = item.callback;
                        tempList[i]["thisObject"] = item.thisObject;
                        tempList[i]["params"] = item.params;
                    }
                }
                NotifyManager.splitTypeDic.push(tempList);
            }
        };
        /**
         * @description 移除对应thisObject的所有消息
         */
        NotifyManager.removeThisObjectNofity = function (thisObject) {
            var typeDic = NotifyManager.typeDic;
            for (var type in typeDic) {
                var typeList = typeDic[type];
                for (var i = typeList.length - 1; i >= 0; i--) {
                    if (typeList[i].thisObject == thisObject) {
                        typeList.splice(i, 1);
                    }
                }
                if (typeList.length == 0) {
                    delete typeDic[type];
                }
                else {
                    typeDic[type] = typeList;
                }
            }
        };
        /**
         * @description 打印下
         */
        NotifyManager.test = function () {
            console.warn("NotifyManager.typeDic=======================================================>");
            console.warn(NotifyManager.typeDic);
            console.warn("egret.ticker=======================================================>");
            console.warn(egret.ticker);
        };
        NotifyManager.typeDic = {};
        NotifyManager.splitTypeDic = [];
        NotifyManager.logDic = {};
        return NotifyManager;
    }());
    qmr.NotifyManager = NotifyManager;
    __reflect(NotifyManager.prototype, "qmr.NotifyManager");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 角色部件枚举
     *
     */
    var ActorPart = (function () {
        function ActorPart() {
        }
        ActorPart.BODY = 0; //裸体
        ActorPart.WEAPON = 1; //武器
        ActorPart.WING = 2; //翅膀
        ActorPart.HORSE = 4; //坐骑
        ActorPart.HORSE_UP = 5; //坐骑上的头套?
        ActorPart.SHIELD = 6; //护盾
        ActorPart.DEFAULT = 7; //默认特效
        return ActorPart;
    }());
    qmr.ActorPart = ActorPart;
    __reflect(ActorPart.prototype, "qmr.ActorPart");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var PlatformConfig = (function () {
        function PlatformConfig() {
        }
        PlatformConfig.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var t, config;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            t = this;
                            config = window["GAME_CONFIG"];
                            if (!config) {
                                throw new Error("platfrom config is not define");
                            }
                            t.GAME_CONFIG = config;
                            t.platformId = Number(config["platformId"]);
                            t.channelId = config["channelId"];
                            t.isNeedMarkPoint = config["isMarkPoint"];
                            t.isTSVersion = !!Number(config["isTSVersion"]);
                            if (config["isWSS"]) {
                                t.isWSS = !!Number(config["isWSS"]);
                            }
                            t.isShildTSV = !!Number(config["isShildTSV"]);
                            t.isShieldIOSBusiness = !!Number(config["isShieldIOSBusiness"]);
                            t.isOpenGM = !!Number(Number(config["isOpenGM"]));
                            t.isDebug = !!Number(config["isDebug"]);
                            t.extendsParams = config["extendsParams"];
                            t.platformClassType = config["platformClassType"];
                            t.useCdnRes = !!Number(config["isPublish"]);
                            t.baseRoot = config["basePath"];
                            t.webUrl = config["resPath"];
                            t.webRoot = t.webUrl + t.baseRoot;
                            if (config["isShowNotice"]) {
                                t.isShowNotice = !!Number(config["isShowNotice"]);
                            }
                            if (config["max_hw_ratio"]) {
                                qmr.StageUtil.MAX_HW_RATIO = Math.min(qmr.StageUtil.MAX_HW_RATIO, config["max_hw_ratio"]);
                            }
                            if (config["min_hw_ratio"]) {
                                qmr.StageUtil.MIN_HW_RATIO = Math.max(qmr.StageUtil.MIN_HW_RATIO, config["min_hw_ratio"]);
                            }
                            t.appIdStr = config["appId"];
                            t.appKey = config["appKey"];
                            t.platform = config["platform"];
                            t.platformSign = config["platformSign"];
                            t.serverDomain = config["serverDomain"];
                            t.ts_serverDomain = config["ts_serverDomain"];
                            t.markPointDomain = config["markPointServer"];
                            t.ossDoamin = config["ossServer"];
                            t.resVersion = config["resVersion"];
                            return [4 /*yield*/, qmr.VersionManager.initGameVersion(t.resVersion)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        //------平台对接专用参数--------//
        /**当前游戏参数配置 */
        PlatformConfig.GAME_CONFIG = null;
        /**默认平台id为星灵互动的 */
        PlatformConfig.platformId = 0;
        /**渠道id */
        PlatformConfig.channelId = "0";
        /**是否需要打点 */
        PlatformConfig.isNeedMarkPoint = true;
        /** 是否连接提审服务器*/
        PlatformConfig.isTSVersion = false;
        /** 是否屏蔽提审需要屏蔽的内容*/
        PlatformConfig.isShildTSV = false;
        /** 是否屏蔽苹果商业化版本 */
        PlatformConfig.isShieldIOSBusiness = false;
        /** 是否打开GM */
        PlatformConfig.isOpenGM = false;
        PlatformConfig.isShowNotice = true;
        /**是否是wss连接  */
        PlatformConfig.isWSS = true;
        /**扩展参数 */
        PlatformConfig.extendsParams = "";
        /**是否使用外网cdn资源版本 */
        PlatformConfig.useCdnRes = false;
        PlatformConfig.baseRoot = "";
        PlatformConfig.webUrl = "";
        PlatformConfig.webRoot = "";
        return PlatformConfig;
    }());
    qmr.PlatformConfig = PlatformConfig;
    __reflect(PlatformConfig.prototype, "qmr.PlatformConfig");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * 平台id枚举
     * dear_H
     */
    var PlatformEnum;
    (function (PlatformEnum) {
        /**星灵互动(默认平台)*/
        PlatformEnum[PlatformEnum["P_SLOGAME_DEBUG"] = 0] = "P_SLOGAME_DEBUG";
        PlatformEnum[PlatformEnum["P_SLOGAME_WEB"] = 100] = "P_SLOGAME_WEB";
        /**大雁互娱_IOS*/
        PlatformEnum[PlatformEnum["P_DYHY_IOS"] = 6] = "P_DYHY_IOS";
        /**大雁互娱_quick*/
        PlatformEnum[PlatformEnum["P_DYHY_QUICK"] = 7] = "P_DYHY_QUICK";
        /**大雁互娱_米壳*/
        PlatformEnum[PlatformEnum["P_DYHY_MK"] = 8] = "P_DYHY_MK";
        /** 西游手QQ小游戏*/
        PlatformEnum[PlatformEnum["P_XIYOU_SQQ"] = 9] = "P_XIYOU_SQQ";
        /**大雁互娱_IOS_WEB 和安卓apk*/
        PlatformEnum[PlatformEnum["P_DYHY_IOS_WEB"] = 10] = "P_DYHY_IOS_WEB";
        /** 微信小游戏 */
        PlatformEnum[PlatformEnum["P_WX"] = 11] = "P_WX";
        /**大雁互娱_IOS_WD*/
        PlatformEnum[PlatformEnum["P_DYHY_IOS_WEB_crown"] = 120] = "P_DYHY_IOS_WEB_crown";
        /** 6kw 自出安卓母包*/
        PlatformEnum[PlatformEnum["P_6kwAndriod"] = 130] = "P_6kwAndriod";
        /**9377 */
        PlatformEnum[PlatformEnum["P_9377"] = 12] = "P_9377";
        /**7477 */
        PlatformEnum[PlatformEnum["P_7477"] = 13] = "P_7477";
        /**西游网H5 */
        PlatformEnum[PlatformEnum["P_XIYOU_H5"] = 14] = "P_XIYOU_H5";
        /**游民星空 */
        PlatformEnum[PlatformEnum["P_YMXK"] = 15] = "P_YMXK";
        /**OPPO */
        PlatformEnum[PlatformEnum["P_OPPO"] = 16] = "P_OPPO";
        /** 懒猫*/
        PlatformEnum[PlatformEnum["L_CAT"] = 1000] = "L_CAT";
    })(PlatformEnum = qmr.PlatformEnum || (qmr.PlatformEnum = {}));
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
    * 平台工厂
    * dear_H
    */
    var PlatformFactory = (function () {
        function PlatformFactory() {
        }
        /**
         * 创建一个平台
         */
        PlatformFactory.creatPlatform = function (platformId) {
            var basePlatform;
            switch (platformId) {
                case qmr.PlatformEnum.P_SLOGAME_DEBUG:
                    basePlatform = new qmr.CommonGamePlatform();
                    break;
            }
            return basePlatform;
        };
        return PlatformFactory;
    }());
    qmr.PlatformFactory = PlatformFactory;
    __reflect(PlatformFactory.prototype, "qmr.PlatformFactory");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * 平台代理类，此类禁止对特殊子平台的逻辑处理，一律在子平台类中处理
     * dear_H
     */
    var PlatformManager = (function () {
        function PlatformManager() {
            this._platform = qmr.PlatformFactory.creatPlatform(qmr.PlatformConfig.platformId);
        }
        /**
         * 注册上报
         */
        PlatformManager.prototype.reportRegister = function () {
            this.platform.reportRegister();
        };
        /**
         * 登录上报
         */
        PlatformManager.prototype.reportLogin = function () {
            this.platform.reportLogin();
        };
        /**
         * 请求支付
         */
        PlatformManager.prototype.reqPay = function (payInfo) {
            if (!qmr.GlobalConfig.isOpenRecharge) {
                qmr.TipManagerCommon.getInstance().createCommonColorTip("暂未开放充值！");
                return;
            }
            this.platform.reqPay(payInfo);
        };
        /**
         * 升级上报
         */
        PlatformManager.prototype.reportUpLevel = function () {
            this.platform.reportUpLevel();
        };
        /**
         * 分享游戏
         */
        PlatformManager.prototype.shareGame = function (totalCount, hadCount, leaveTime) {
            this.platform.shareGame(totalCount, hadCount, leaveTime);
        };
        Object.defineProperty(PlatformManager.prototype, "platform", {
            /**
             * 当前平台对象
             */
            get: function () {
                return this._platform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformManager.prototype, "isOutNetPlatForm", {
            /**是否外部平台 */
            get: function () {
                return qmr.PlatformConfig.platformId != qmr.PlatformEnum.P_SLOGAME_DEBUG;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformManager.prototype, "isGetPlatformInfo", {
            /**
             * 是否拉取到了平台参数，根据状态决定是否打点
             */
            get: function () {
                return this.platform.isGetPlatformInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformManager, "instance", {
            get: function () {
                return this._instance || (this._instance = new PlatformManager());
            },
            enumerable: true,
            configurable: true
        });
        return PlatformManager;
    }());
    qmr.PlatformManager = PlatformManager;
    __reflect(PlatformManager.prototype, "qmr.PlatformManager");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * coler
     * 平台回调接口
     *
     * 	PS: 当且仅当IOS和android混服（不需要显示android的部分服务器）时才需要调用ios接口
        否则默认全部调用 android 接口
     * {0} http/https
     * {1} domain
     * {2} platform
     * {3} ios/android
     *
     *  1. domain: 平台域名, 由平台方提供, 每台机器一个域名
        2. platformVal: 平台标识, 例: jxtxj_solgame, bxxj_9187等
        3. apiname: 接口名字.
                    3.1  login      ---  登录
                    3.2  svrlist     ---  区服列表
                    3.3  lastlogin ---  最后登录区服信息
                    3.3  orderid  ---  生成订单ID
                    3.4  order      ---  充值回调
                    3.5  orderid   ---  生成订单ID接口, 调用域名会在角色login进入游戏时通过apiurl传入
                    3.6  order      ---  充值接口. 平台回调(由平台接入), 默认在S1服

     */
    var PlatformUrlConsont = (function () {
        function PlatformUrlConsont() {
        }
        /** 充值生成订单ID接口 */
        PlatformUrlConsont.ORDER_URL = "{0}//{1}/api/{2}.orderid_{3}.php";
        /** 开服列表接口 */
        PlatformUrlConsont.SVRLISTOP_URL = "{0}//{1}/api/{2}.svrlist_{3}.php";
        /** 提审服列表接口 */
        PlatformUrlConsont.TS_SVRLISTOP_URL = "{0}//{1}/api/{2}.svrlist_{3}_ts.php";
        /** 查询角色接口 */
        PlatformUrlConsont.QUERY_URL = "{0}//{1}/api/{2}.query_{3}.php";
        /** 封禁/禁言账号 */
        PlatformUrlConsont.FORBIDDEN_URL = "{0}//{1}/api/{2}.forbidden_{3}.php";
        /** 最近登录 */
        PlatformUrlConsont.LASTLOGIN_URL = "{0}//{1}/api/{2}.lastlogin_{3}.php";
        /** 登录 */
        PlatformUrlConsont.LOGIN_URL = "{0}//{1}/api/{2}.login_{3}.php";
        /** 屏蔽词 */
        PlatformUrlConsont.WORD_URL = "{0}//{1}/api/dirtycli.php";
        /** 公告 */
        PlatformUrlConsont.NOTICE_URL = "{0}//{1}/api/gm/getserver_notice.php";
        /** 用户验签 */
        PlatformUrlConsont.VERIFY_URL = "{0}//{1}/api/{2}.validation.php";
        return PlatformUrlConsont;
    }());
    qmr.PlatformUrlConsont = PlatformUrlConsont;
    __reflect(PlatformUrlConsont.prototype, "qmr.PlatformUrlConsont");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var CommonGamePlatform = (function (_super) {
        __extends(CommonGamePlatform, _super);
        function CommonGamePlatform() {
            var _this = _super.call(this) || this;
            /**该平台是否拥有清理缓存接口 */
            _this.canClearResCache = false;
            return _this;
        }
        //初始化平台配置参数
        CommonGamePlatform.prototype.initGetOption = function () {
            qmr.PlatformConfig.platformSign = qmr.PlatformConfig.platform + "";
            this.isGetPlatformInfo = true;
        };
        CommonGamePlatform.prototype.login = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    egret.log("平台登陆");
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            qmr.GlobalConfig.token = "2322232";
                            _this.isGetPlatformInfo = true;
                            resolve();
                            egret.log("平台登陆成功:" + status);
                        })];
                });
            });
        };
        /**请求支付 */
        CommonGamePlatform.prototype.reqPay = function (payInfo) {
        };
        CommonGamePlatform.prototype.pay = function (payInfo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        return CommonGamePlatform;
    }(qmr.BasePlatform));
    qmr.CommonGamePlatform = CommonGamePlatform;
    __reflect(CommonGamePlatform.prototype, "qmr.CommonGamePlatform");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * 各个部位对应的资源加载地址
     */
    var ActorPartResourceDic = (function () {
        function ActorPartResourceDic() {
            var partDic = {};
            partDic[qmr.ActorPart.WEAPON] = qmr.SystemPath.weaponPath;
            partDic[qmr.ActorPart.WING] = qmr.SystemPath.wingPath;
            partDic[qmr.ActorPart.HORSE] = qmr.SystemPath.horsePath;
            partDic[qmr.ActorPart.HORSE_UP] = qmr.SystemPath.horsePath;
            partDic[qmr.ActorPart.DEFAULT] = qmr.SystemPath.defaultPath;
            this.partDic = partDic;
        }
        ActorPartResourceDic.getInstance = function () {
            if (ActorPartResourceDic._instance == null) {
                ActorPartResourceDic._instance = new ActorPartResourceDic();
            }
            return ActorPartResourceDic._instance;
        };
        return ActorPartResourceDic;
    }());
    qmr.ActorPartResourceDic = ActorPartResourceDic;
    __reflect(ActorPartResourceDic.prototype, "qmr.ActorPartResourceDic");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /*
    * coler
    * 协议加密解密
    */
    var BufferGid = (function () {
        function BufferGid() {
        }
        /** 处理服务端推送信息*/
        BufferGid.parseMsg = function (reciveBuff) {
            var bodyLen = reciveBuff.readInt() - BufferGid.ADD_L;
            var msgId = reciveBuff.readInt();
            var bodyBuff = qmr.ByteArrayPool.getInstance().createByte();
            reciveBuff.readBytes(bodyBuff, 0, bodyLen);
            var decBodyBuff = this.decryptForDis(bodyBuff); //解密
            qmr.ByteArrayPool.getInstance().recycleByte(bodyBuff);
            qmr.Rpc.getInstance().onDataIn(msgId, decBodyBuff);
            qmr.ByteArrayPool.getInstance().recycleByte(decBodyBuff);
        };
        /**
         *
         * 向服务器发送信息
         * msg:构造的com.message.***proto消息
         * isLog:是否显示发送日志
         *
         */
        BufferGid.getSendMsg = function (msg, msgId, isLog) {
            if (isLog === void 0) { isLog = false; }
            var className = qmr.MessageIDLogin.getMsgNameById(msgId);
            if (qmr.MessageID && qmr.MessageID.getMsgNameById) {
                var tryClassName = qmr.MessageID.getMsgNameById(msgId);
                if (tryClassName) {
                    className = tryClassName;
                }
            }
            var data = com.message[className].encode(msg).finish();
            var msgLength = data.byteLength;
            var buff;
            if (className == undefined || msgId == undefined) {
                qmr.LogUtil.log("[send:error:" + msg + "]");
                return buff;
            }
            if (isLog && qmr.PlatformConfig.isDebug)
                qmr.LogUtil.log("[C_S:" + msgId + " " + className + "] msgLength:" + msgLength);
            var enBytes = this.encryptForDis(data, msgLength); //加密
            buff = qmr.ByteArrayPool.getInstance().createByte();
            buff.writeInt(msgLength + BufferGid.ADD_L);
            buff.writeInt(msgId);
            buff.writeBytes(enBytes);
            qmr.ByteArrayPool.getInstance().recycleByte(enBytes);
            return buff;
        };
        //位移加密
        BufferGid.encryptForDis = function (data, byteLen) {
            var bytes = qmr.ByteArrayPool.getInstance().createByte();
            bytes._writeUint8Array(data);
            var buff;
            var utf8Array = bytes.bytes;
            for (var i = 0; i < byteLen; i += 5) {
                if (i + 3 > byteLen - 1)
                    break;
                buff = ~utf8Array[i + 2];
                utf8Array[i + 2] = utf8Array[i + 3];
                utf8Array[i + 3] = buff;
            }
            return bytes;
        };
        /**
        * 位移解密
        */
        BufferGid.decryptForDis = function (data) {
            var bodyBytes = qmr.ByteArrayPool.getInstance().createByte();
            bodyBytes.writeBytes(data);
            var buff;
            var utf8Array = bodyBytes.bytes;
            var byteLen = utf8Array.byteLength;
            for (var i = 0; i < byteLen; i += 5) {
                if (i + 3 > byteLen - 1)
                    break;
                buff = utf8Array[i + 2];
                utf8Array[i + 2] = ~utf8Array[i + 3];
                utf8Array[i + 3] = buff;
            }
            return bodyBytes;
        };
        BufferGid.KEY = "";
        BufferGid.ADD_L = 4; //前后端约定增加长度
        return BufferGid;
    }());
    qmr.BufferGid = BufferGid;
    __reflect(BufferGid.prototype, "qmr.BufferGid");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * coler
     * byteArray对象池
     */
    var ByteArrayPool = (function () {
        function ByteArrayPool() {
            this.byteList = [];
            for (var i = 0; i < 20; i++) {
                var byte = new egret.ByteArray();
                byte.endian = egret.Endian.BIG_ENDIAN;
                this.byteList.push(byte);
            }
        }
        /**
         *  获取单例
         */
        ByteArrayPool.getInstance = function () {
            if (ByteArrayPool._instance == null) {
                ByteArrayPool._instance = new ByteArrayPool();
            }
            return ByteArrayPool._instance;
        };
        /**
         *  获取一个byteArrary
         */
        ByteArrayPool.prototype.createByte = function () {
            if (this.byteList.length > 0) {
                return this.byteList.shift();
            }
            var byte = new egret.ByteArray();
            byte.endian = egret.Endian.BIG_ENDIAN;
            return byte;
        };
        /**
         *  回收一个byteArrary
         */
        ByteArrayPool.prototype.recycleByte = function (byte) {
            byte.clear();
            this.byteList.push(byte);
        };
        return ByteArrayPool;
    }());
    qmr.ByteArrayPool = ByteArrayPool;
    __reflect(ByteArrayPool.prototype, "qmr.ByteArrayPool");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 全局计数器，协议发送用的，每用一次，数字递增一次
     *
     */
    var PbGlobalCounter = (function () {
        function PbGlobalCounter() {
            this._counter = -1;
        }
        /**
         * @description 获取单例对象
         */
        PbGlobalCounter.getInstance = function () {
            if (PbGlobalCounter.instance == null) {
                PbGlobalCounter.instance = new PbGlobalCounter();
            }
            return PbGlobalCounter.instance;
        };
        /**
         * @description 获取当前序列号
         */
        PbGlobalCounter.prototype.getCountter = function () {
            this._counter += 1;
            return this._counter;
        };
        /**
         * @description 重置序列号
         */
        PbGlobalCounter.prototype.resetCounter = function () {
            this._counter = -1;
        };
        PbGlobalCounter.maxReconnectCount = 3;
        return PbGlobalCounter;
    }());
    qmr.PbGlobalCounter = PbGlobalCounter;
    __reflect(PbGlobalCounter.prototype, "qmr.PbGlobalCounter");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 请求对象
     *
     */
    var RequestHandler = (function () {
        function RequestHandler() {
        }
        return RequestHandler;
    }());
    qmr.RequestHandler = RequestHandler;
    __reflect(RequestHandler.prototype, "qmr.RequestHandler");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description websocket的rpc回调实现
     *
     */
    var Rpc = (function () {
        function Rpc() {
            this.eventPool = {};
            this.callbackPool = {};
        }
        /**
         * @description 获取单例对象
         */
        Rpc.getInstance = function () {
            if (!Rpc.instance) {
                Rpc.instance = new Rpc();
            }
            return Rpc.instance;
        };
        /**
         * @description 添加协议监听
         */
        Rpc.prototype.addSocketListener = function (msgId, callBack, thisObject, isLog) {
            if (isLog === void 0) { isLog = false; }
            if (this.eventPool[msgId] != null) {
                qmr.LogUtil.error("[error = addSocketListener 添加重复的消息 msgId=" + msgId + "]");
                return;
            }
            var requestHandler = new qmr.RequestHandler();
            requestHandler.callBack = callBack;
            requestHandler.thisObject = thisObject;
            requestHandler.isRpc = false;
            requestHandler.isLog = isLog;
            this.eventPool[msgId] = requestHandler;
        };
        /**
         * @description 移除协议监听
         */
        Rpc.prototype.removeSocketListener = function (msgId, callBack, thisObject) {
            if (this.eventPool[msgId]) {
                delete this.eventPool[msgId];
            }
        };
        /**
         * @description 以host和port的方式链接
         */
        Rpc.prototype.connect = function (host, port, connectCallBack, thisObject) {
            this.close();
            this.loginSocket = new qmr.WebSocket();
            this.loginSocket.connect(host, port, function () { connectCallBack.call(thisObject); }, this.onConnectClose, this.onConnectClose, this);
        };
        /**
         * @description 发送协议，不带回调的
         */
        Rpc.prototype.sendCmd = function (cmd, msgId, isLog) {
            if (isLog === void 0) { isLog = false; }
            if (this.loginSocket) {
                this.loginSocket.sendCmd(cmd, msgId, isLog);
            }
        };
        /**
        * 带rpc回调的发送
        * @eventMsgId 返回的消息协议号
        * @callBack 收到服务器返回后的处理函数
        * @thisObject 函数引用的对象
        * @timeOutCallBack 发送协议超时还未返回后的处理函数
        * @timeOut 协议超时时间，默认是10秒
        */
        Rpc.prototype.rpcCMD = function (eventMsgId, cmd, msgId, callBack, thisObject, timeOutCallBack, timeOut, isLog) {
            if (timeOutCallBack === void 0) { timeOutCallBack = null; }
            if (timeOut === void 0) { timeOut = 10; }
            if (isLog === void 0) { isLog = false; }
            if (this.callbackPool[eventMsgId] != null) {
                qmr.LogUtil.warn("[error = rpcCMD 添加重复的消息 eventMsgId=" + eventMsgId + "]");
                return;
            }
            var requestHandler = new qmr.RequestHandler();
            requestHandler.callBack = callBack;
            requestHandler.thisObject = thisObject;
            requestHandler.timeOutCallBack = timeOutCallBack;
            requestHandler.timeOut = timeOut;
            requestHandler.isRpc = true;
            requestHandler.isLog = isLog;
            requestHandler.sendTime = Date.now();
            this.callbackPool[eventMsgId] = requestHandler;
            this.sendCmd(cmd, msgId, isLog);
            qmr.Ticker.getInstance().unRegisterTick(this.checkTimeOut, this);
            qmr.Ticker.getInstance().registerTick(this.checkTimeOut, this, 1000);
        };
        /**
         * @description 当有数据过来的时候
         */
        Rpc.prototype.onDataIn = function (msgId, data) {
            var msgMap = qmr.ProtoMsgIdMapLogin.instance.msgIdMap;
            if (qmr.ProtoMsgIdMap && qmr.ProtoMsgIdMap.instance && qmr.ProtoMsgIdMap.instance.msgIdMap) {
                msgMap = qmr.ProtoMsgIdMap.instance.msgIdMap;
            }
            var className = msgMap[msgId];
            if (className == null) {
                qmr.LogUtil.error("[尚未注册 ProtoMsgIdMap.instance.msgIdMap[" + msgId + "] = null]");
                return;
            }
            var getBuffer = data.buffer;
            var reader = new Uint8Array(getBuffer);
            var entify = className.decode(reader);
            // console.log(">>>>>>>>>>>>>>>>>x协议",getBuffer,reader,entify)
            var requestHandler = this.eventPool[msgId];
            if (requestHandler) {
                if (requestHandler.isLog) {
                    qmr.LogUtil.log("[S_C:" + msgId + " " + className.name + "]");
                }
                if (requestHandler.clientData) {
                    requestHandler.callBack.call(requestHandler.thisObject, entify, requestHandler.clientData);
                }
                else {
                    requestHandler.callBack.call(requestHandler.thisObject, entify);
                }
                requestHandler = null;
            }
            else {
                qmr.LogUtil.error("[未监听协议 [msgId=" + msgId + "]");
            }
            var callbackHandler = this.callbackPool[msgId];
            if (callbackHandler && callbackHandler.callBack) {
                delete this.callbackPool[msgId];
                if (callbackHandler.clientData) {
                    callbackHandler.callBack.call(callbackHandler.thisObject, entify, callbackHandler.clientData);
                }
                else {
                    callbackHandler.callBack.call(callbackHandler.thisObject, entify);
                }
                callbackHandler = null;
            }
        };
        Object.defineProperty(Rpc.prototype, "isconnect", {
            /**
            *  判断是否链接上了
            */
            get: function () {
                if (this.loginSocket) {
                    return this.loginSocket.isconnected;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        /**
        * @description 当链接关闭的时候调用
        */
        Rpc.prototype.onConnectClose = function () {
            var t = this;
            qmr.PbGlobalCounter.getInstance().resetCounter();
            qmr.SystemController.instance.clearHeart();
        };
        /**
        *  关闭一个socket（目前游戏使用一个socket就可以了）
        */
        Rpc.prototype.close = function () {
            // PbGlobalCounter.getInstance().resetCounter();
            if (this.loginSocket) {
                this.loginSocket.dispos();
                this.loginSocket = null;
            }
        };
        /**
        *  超时检测
        */
        Rpc.prototype.checkTimeOut = function () {
            var callbackPool = this.callbackPool;
            for (var msgId in callbackPool) {
                var requestHandler = callbackPool[msgId];
                if (requestHandler) {
                    if (requestHandler.isRpc && Date.now() - requestHandler.sendTime > requestHandler.timeOut * 1000) {
                        delete callbackPool[msgId];
                    }
                }
            }
        };
        return Rpc;
    }());
    qmr.Rpc = Rpc;
    __reflect(Rpc.prototype, "qmr.Rpc");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description websocket类
     *
     */
    var WebSocket = (function () {
        function WebSocket() {
            this.WEB_KEY = "/ws"; //前后端约定的
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
        WebSocket.prototype.connect = function (host, port, connectCallBack, connectCloseBack, connectErrorBack, thisObject) {
            this.connectCallBack = connectCallBack;
            this.connectCloseBack = connectCloseBack;
            this.connectErrorBack = connectErrorBack;
            this.thisObject = thisObject;
            var platformManager = qmr.PlatformManager.instance;
            var protocol = "";
            var socketUrl = "";
            var isOutNetPlatForm = platformManager.isOutNetPlatForm;
            if (isOutNetPlatForm) {
                socketUrl = protocol + "://" + host + "/s" + qmr.GlobalConfig.sid;
                if (qmr.PlatformConfig.isWSS) {
                    socketUrl = "wss://" + host + "/s" + qmr.GlobalConfig.sid;
                }
            }
            else {
                socketUrl = "ws://" + host + ":" + port + this.WEB_KEY;
            }
            this.websocket.connectByUrl(socketUrl);
            // let socketUrl = "wss://echo.websocket.org"
            // this.websocket.connect(host, port)
            this.clearConTimeout();
            this.tid = egret.setTimeout(this.onTimeOut, this, 10000);
            qmr.LogUtil.log("链接的服务器和端口:" + socketUrl);
        };
        /**
         * @description 10秒链接不上超时
         */
        WebSocket.prototype.onTimeOut = function () {
            this.clearConTimeout();
            if (this.connectCloseBack) {
                this.connectCloseBack.call(this.thisObject);
            }
            qmr.LogUtil.log("10秒链接不上超时");
        };
        /**
         * @description 当服务器连接上
         */
        WebSocket.prototype.onSocketConnected = function (evt) {
            this._isConnect = true;
            this.clearConTimeout();
            if (this.connectCallBack) {
                this.connectCallBack.call(this.thisObject);
            }
            qmr.LogUtil.log("连接服务器成功！");
        };
        /**
         * @description 当服务器连接关闭
         */
        WebSocket.prototype.onSocketClose = function (evt) {
            this._isConnect = false;
            this.clearConTimeout();
            if (this.connectCloseBack) {
                this.connectCloseBack.call(this.thisObject);
            }
            qmr.LogUtil.log("服务器连接关闭");
        };
        /**
         * @description 当有数据过来
         */
        WebSocket.prototype.onDataIn = function (evt) {
            if (this.websocket) {
                var reciveBuff = qmr.ByteArrayPool.getInstance().createByte();
                this.websocket.readBytes(reciveBuff);
                while (reciveBuff.bytesAvailable) {
                    qmr.BufferGid.parseMsg(reciveBuff);
                }
                qmr.ByteArrayPool.getInstance().recycleByte(reciveBuff);
            }
        };
        /**
         * @description socket连接发生IO错误
         */
        WebSocket.prototype.onIoError = function (evt) {
            this._isConnect = false;
            this.clearConTimeout();
            if (this.connectErrorBack) {
                this.connectErrorBack.call(this.thisObject);
            }
            qmr.LogUtil.log("服务器连接错误");
        };
        /**
         * msg:发送协议
         * msgId:MessageID里面的协议
         * isLog:是否显示发送日志
         */
        WebSocket.prototype.sendCmd = function (msg, msgId, isLog) {
            if (isLog === void 0) { isLog = false; }
            if (this.isconnected) {
                var arrayBuffer = qmr.BufferGid.getSendMsg(msg, msgId, isLog);
                if (arrayBuffer) {
                    this.websocket.writeBytes(arrayBuffer);
                    this.websocket.flush();
                    qmr.ByteArrayPool.getInstance().recycleByte(arrayBuffer);
                }
                msg = null;
            }
        };
        Object.defineProperty(WebSocket.prototype, "isconnected", {
            /**
             *  返回socket是否连接上
             */
            get: function () {
                return this._isConnect && this.websocket && this.websocket.connected;
            },
            enumerable: true,
            configurable: true
        });
        WebSocket.prototype.clearConTimeout = function () {
            if (this.tid) {
                egret.clearTimeout(this.tid);
                this.tid = 0;
            }
        };
        /**
         *  资源释放
         */
        WebSocket.prototype.dispos = function () {
            var t = this;
            t.clearConTimeout();
            if (t.websocket != null) {
                t.websocket.removeEventListener(egret.Event.CONNECT, t.onSocketConnected, t);
                t.websocket.removeEventListener(egret.Event.CLOSE, t.onSocketClose, t);
                t.websocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, t.onDataIn, t);
                t.websocket.removeEventListener(egret.IOErrorEvent.IO_ERROR, t.onIoError, t);
                if (t.isconnected) {
                    t._isConnect = false;
                    t.websocket.close();
                }
                t.websocket = null;
            }
            t.connectCallBack = null;
            t.connectCloseBack = null;
            t.connectErrorBack = null;
            t.thisObject = null;
        };
        return WebSocket;
    }());
    qmr.WebSocket = WebSocket;
    __reflect(WebSocket.prototype, "qmr.WebSocket");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @desc 单个sound存储
     *
     */
    var SoundItem = (function () {
        function SoundItem(sound, type) {
            if (sound === void 0) { sound = null; }
            if (type === void 0) { type = egret.Sound.EFFECT; }
            this.sound = sound;
            this.isPlay = false;
            this.type = type;
            if (sound != null) {
                this.sound.type = type;
            }
        }
        /**
         * 播放声音
         */
        SoundItem.prototype.play = function (startTime, loops) {
            if (loops === void 0) { loops = 0; }
            if (this.sound != null) {
                this.isPlay = true;
                this.soundChannel = this.sound.play(startTime, loops);
                this.soundChannel.once(egret.Event.SOUND_COMPLETE, this.onPlayerEnd, this);
                if (this.sound.type == egret.Sound.MUSIC) {
                    this.soundChannel.volume = 0.7;
                }
            }
        };
        SoundItem.prototype.onPlayerEnd = function () {
            this.isPlay = false;
        };
        /**
         * 停止播放
         */
        SoundItem.prototype.stop = function () {
            if (this.sound != null) {
                this.isPlay = false;
                if (this.soundChannel != null) {
                    this.soundChannel.stop();
                }
            }
        };
        Object.defineProperty(SoundItem.prototype, "position", {
            /**
             * @desc 当前播放位置
             */
            get: function () {
                if (this.soundChannel) {
                    return this.soundChannel.position;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        return SoundItem;
    }());
    qmr.SoundItem = SoundItem;
    __reflect(SoundItem.prototype, "qmr.SoundItem");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @desc 音效音乐管理器
     *
     */
    var SoundManager = (function () {
        function SoundManager() {
            this._isEffectSoundOpen = true;
            this._isMusicSoundOpen = true;
            this._isMusicLifecycleOpen = true;
            this._soundCfgDic = new qmr.Dictionary();
            this._lastMusicName = "";
            this._musicName = "";
            this._soundPool = {};
        }
        SoundManager.getInstance = function () {
            if (SoundManager.instance == null) {
                SoundManager.instance = new SoundManager();
            }
            return SoundManager.instance;
        };
        Object.defineProperty(SoundManager.prototype, "soundPool", {
            /**
             * 获取soundpool
             */
            get: function () {
                return this._soundPool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundManager.prototype, "isEffectSoundOpen", {
            /**
             * 获取特效音乐是否打开
             */
            get: function () {
                return this._isEffectSoundOpen;
            },
            /**
             * 设置是否打开特效音乐
             */
            set: function (value) {
                this._isEffectSoundOpen = value;
                if (!value) {
                    for (var key in this._soundPool) {
                        var soundItem = this._soundPool[key];
                        if (soundItem != null && soundItem.sound != null) {
                            if (soundItem.sound.type == egret.Sound.EFFECT) {
                                soundItem.stop();
                            }
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundManager.prototype, "isMusicSoundOpen", {
            /**
             * 获取背景音乐是否打开
             */
            get: function () {
                return this._isMusicSoundOpen;
            },
            /**
             * 设置是否打开背景音乐
             */
            set: function (value) {
                this._isMusicSoundOpen = value;
                if (value) {
                    if (this._bgSoundItem != null) {
                        this._bgSoundItem.stop();
                    }
                    if (this._musicName != "") {
                        this._bgSoundItem = this._soundPool[this._musicName];
                        if (this._bgSoundItem) {
                            this._lastMusicName = this._musicName;
                            this._bgSoundItem.play(0);
                        }
                        else {
                            this.loadBgMusic(this._musicName);
                        }
                    }
                }
                else if (this._bgSoundItem != null) {
                    this._bgSoundItem.stop();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 播放特效
         */
        SoundManager.prototype.loadAndPlayEffect = function (soundType, loops, isOneKey) {
            if (loops === void 0) { loops = 1; }
            if (isOneKey === void 0) { isOneKey = false; }
            // console.log("==============================》》》播放音效："+this._isMusicLifecycleOpen, this._isEffectSoundOpen, qmr.WebBrowerUtil.isSupportMusic());
            if (this._isMusicLifecycleOpen && this._isEffectSoundOpen) {
                var soundPool_1 = this._soundPool;
                var musicCfg = this.getSoundCfg(soundType);
                if (!musicCfg) {
                    qmr.LogUtil.log("音效不存在。。。" + soundType);
                    return;
                }
                var musicName_1 = musicCfg.soundName;
                if (musicName_1 == undefined || musicName_1 == "") {
                    return;
                }
                var soundItem = soundPool_1[musicName_1];
                var isPlaySameTime_1 = musicCfg.isPlaySameTime > 0;
                if (soundItem == null) {
                    var sound = RES.getRes(musicName_1 + "_mp3");
                    if (sound) {
                        var item = soundPool_1[musicName_1];
                        if (!item) {
                            soundItem = new qmr.SoundItem(sound);
                            soundPool_1[musicName_1] = soundItem;
                        }
                        if (!isPlaySameTime_1 || isOneKey) {
                            //不同时播放
                            if (!soundItem.isPlay && soundItem.position <= 0) {
                                soundItem.play(0, loops);
                            }
                        }
                        else {
                            soundItem.play(0, loops);
                        }
                    }
                    else {
                        qmr.ResManager.getRes(qmr.SystemPath.getEffect_musicUrl(musicName_1), function (sound) {
                            var item = soundPool_1[musicName_1];
                            if (!item) {
                                var loadSound = new qmr.SoundItem(sound);
                                soundPool_1[musicName_1] = loadSound;
                                if (!isPlaySameTime_1 || isOneKey) {
                                    //不同时播放
                                    if (!loadSound.isPlay && loadSound.position <= 0) {
                                        loadSound.play(0, loops);
                                    }
                                }
                                else {
                                    loadSound.play(0, loops);
                                }
                            }
                        }, this, qmr.LoadPriority.HIGH, RES.ResourceItem.TYPE_SOUND);
                    }
                }
                else {
                    if (!isPlaySameTime_1 || isOneKey) {
                        //不同时播放
                        if (!soundItem.isPlay && soundItem.position <= 0) {
                            soundItem.play(0, loops);
                        }
                    }
                    else {
                        soundItem.play(0, loops);
                    }
                }
            }
        };
        /** 停止音效 */
        SoundManager.prototype.stopSoundEffect = function (soundType) {
            var musicName = this.getMusicName(soundType);
            if (musicName == undefined || musicName == "")
                return;
            if (this._isEffectSoundOpen) {
                var soundItem = this._soundPool[musicName];
                if (soundItem != null) {
                    soundItem.stop();
                }
            }
        };
        /**
         * 播放背景音乐,一般都是无限循环的
         */
        SoundManager.prototype.loadAndPlayMusic = function (musicName) {
            this._musicName = musicName;
            if (musicName == null || musicName == "")
                return;
            if (this._isMusicLifecycleOpen && this._isMusicSoundOpen) {
                if (this._bgSoundItem != null) {
                    if (this._lastMusicName == musicName) {
                        if (this._bgSoundItem.position <= 0) {
                            this._bgSoundItem.stop();
                            this._bgSoundItem.play(0);
                        }
                    }
                    else {
                        if (this._bgSoundItem) {
                            this._bgSoundItem.stop();
                        }
                        this._bgSoundItem = this._soundPool[musicName];
                        if (this._bgSoundItem) {
                            this._lastMusicName = musicName;
                            if (SoundManager.getInstance().isMusicSoundOpen) {
                                this._bgSoundItem.play(0);
                            }
                        }
                        else {
                            this.loadBgMusic(musicName);
                        }
                    }
                }
                else {
                    this.loadBgMusic(musicName);
                }
            }
        };
        SoundManager.prototype.getMusicName = function (soundType) {
            var cfg = this.getSoundCfg(soundType);
            if (cfg) {
                return cfg.soundName;
            }
            qmr.LogUtil.log("音效不存在。。。" + soundType);
            return "";
        };
        SoundManager.prototype.getMusicIsPlaySameTime = function (soundType) {
            var cfg = this.getSoundCfg(soundType);
            if (cfg) {
                return cfg.isPlaySameTime;
            }
            qmr.LogUtil.log("音效不存在。。。" + soundType);
            return 0;
        };
        SoundManager.prototype.getSoundCfg = function (soundType) {
            if (this._soundCfgDic.has(soundType)) {
                return this._soundCfgDic.get(soundType);
            }
            var cfg = qmr.ConfigManagerBase.getConf(qmr.ConfigEnumBase.MUSIC, soundType);
            if (cfg) {
                this._soundCfgDic.set(soundType, cfg);
            }
            return cfg;
        };
        /**
         * @description 加载背景音乐
         */
        SoundManager.prototype.loadBgMusic = function (soundType) {
            var musicName = this.getMusicName(soundType);
            if (musicName == undefined || musicName == "")
                return;
            this._lastMusicName = musicName;
            var t = this;
            qmr.ResManager.getRes(qmr.SystemPath.bg_music + musicName + ".mp3", function (sound) {
                var loadSound = new qmr.SoundItem(sound, egret.Sound.MUSIC);
                t._soundPool[soundType] = loadSound;
                if (t._bgSoundItem) {
                    t._bgSoundItem.stop();
                }
                t._bgSoundItem = loadSound;
                if (SoundManager.getInstance().isMusicSoundOpen) {
                    t._bgSoundItem.play(0);
                }
                // if (!egret.Capabilities.isMobile) {
                //     t._bgSoundItem.play(0);
                // }
            }, this, qmr.LoadPriority.LOW, RES.ResourceItem.TYPE_SOUND);
        };
        /**
         * 关闭背景音乐
         */
        SoundManager.prototype.stopMusic = function () {
            var bgSoundItem = this._bgSoundItem;
            if (bgSoundItem != null && bgSoundItem.isPlay) {
                bgSoundItem.stop();
            }
            this._isMusicLifecycleOpen = false;
        };
        /**
         * 重新恢复背景音乐
         */
        SoundManager.prototype.reStartMusic = function () {
            if (!this._isMusicLifecycleOpen) {
                this._isMusicLifecycleOpen = true;
                this.loadAndPlayMusic(this._lastMusicName);
            }
        };
        return SoundManager;
    }());
    qmr.SoundManager = SoundManager;
    __reflect(SoundManager.prototype, "qmr.SoundManager");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 一个自定义的FightTimer封装类,具有时间缩放功能,用于战斗
     *
     */
    var FightTimer = (function () {
        function FightTimer() {
            /** 时针缩放。*/
            this.scale = 1;
            this.eventList = [];
            this._running = false;
            this.start();
        }
        Object.defineProperty(FightTimer, "instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new FightTimer;
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *  开始运转
         */
        FightTimer.prototype.start = function () {
            if (this._running)
                return;
            for (var _i = 0, _a = this.eventList; _i < _a.length; _i++) {
                var tick = _a[_i];
                if (tick) {
                    tick.lastCount = tick.updateInterval;
                    tick.lastTimeStamp = egret.getTimer();
                }
            }
            egret.startTick(this.update, this);
            this._running = true;
        };
        /**
         * Timer以60FPS频率刷新此方法
         */
        FightTimer.prototype.update = function (timeStamp) {
            for (var _i = 0, _a = this.eventList; _i < _a.length; _i++) {
                var tick = _a[_i];
                if (tick) {
                    var deltaTime = timeStamp - tick.lastTimeStamp;
                    deltaTime = deltaTime * this.scale; //时间缩放
                    if (deltaTime >= tick.delay) {
                        var num = Math.floor(deltaTime / tick.delay);
                        if (num > 4) {
                            num = 4;
                        }
                        while (num > 0) {
                            num--;
                            if (tick.repeatCount == 0) {
                                if (tick.callBack) {
                                    if (tick.params) {
                                        tick.callBack.call(tick.thisObject, tick.params);
                                    }
                                    else {
                                        tick.callBack.call(tick.thisObject);
                                    }
                                }
                            }
                            else {
                                tick.currentCount++;
                                var complete = (tick.repeatCount > 0 && tick.currentCount >= tick.repeatCount);
                                if (complete) {
                                    if (tick.callBack) {
                                        if (tick.params) {
                                            tick.callBack.call(tick.thisObject, tick.params);
                                        }
                                        else {
                                            tick.callBack.call(tick.thisObject);
                                        }
                                    }
                                    var index = this.eventList.indexOf(tick);
                                    if (index != -1) {
                                        this.eventList.splice(index, 1);
                                    }
                                }
                            }
                        }
                        tick.lastTimeStamp = timeStamp;
                        tick.lastCount = tick.updateInterval;
                    }
                    else {
                        tick.lastCount -= (1000 * this.scale); //时间缩放
                        if (tick.lastCount > 0) {
                            continue;
                        }
                        tick.lastCount += tick.updateInterval;
                        tick.lastTimeStamp = timeStamp;
                        tick.currentCount++;
                        if (tick.repeatCount == 0) {
                            if (tick.callBack) {
                                if (tick.params) {
                                    tick.callBack.call(tick.thisObject, tick.params);
                                }
                                else {
                                    tick.callBack.call(tick.thisObject);
                                }
                            }
                        }
                        else {
                            var complete = (tick.repeatCount > 0 && tick.currentCount >= tick.repeatCount);
                            if (complete) {
                                if (tick.callBack) {
                                    if (tick.params) {
                                        tick.callBack.call(tick.thisObject, tick.params);
                                    }
                                    else {
                                        tick.callBack.call(tick.thisObject);
                                    }
                                }
                                var index = this.eventList.indexOf(tick);
                                if (index != -1) {
                                    this.eventList.splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
            return false;
        };
        /**
         * @description 停止
         */
        FightTimer.prototype.stop = function () {
            if (!this._running)
                return;
            egret.stopTick(this.update, this);
            this._running = false;
        };
        Object.defineProperty(FightTimer.prototype, "running", {
            /**
             * @description 获取是否正在运转
             */
            get: function () {
                return this._running;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @description 注册tick
         */
        FightTimer.prototype.registerTick = function (callback, thisObject, delay, repeatCount, params) {
            if (delay === void 0) { delay = 1000; }
            if (repeatCount === void 0) { repeatCount = 0; }
            if (params === void 0) { params = null; }
            var result = true;
            for (var _i = 0, _a = this.eventList; _i < _a.length; _i++) {
                var tick = _a[_i];
                if (tick.callBack == callback && tick.thisObject == thisObject) {
                    tick.update(delay, repeatCount);
                    tick.params = params;
                    result = false;
                    break;
                }
            }
            if (result) {
                var tickParam = new TickParams(delay, repeatCount);
                tickParam.callBack = callback;
                tickParam.params = params;
                tickParam.thisObject = thisObject;
                this.eventList.push(tickParam);
            }
        };
        /**
         * @description 取消tick
         */
        FightTimer.prototype.unRegisterTick = function (callback, thisObject) {
            for (var _i = 0, _a = this.eventList; _i < _a.length; _i++) {
                var tick = _a[_i];
                if (tick.callBack == callback && tick.thisObject == thisObject) {
                    var index = this.eventList.indexOf(tick);
                    if (index != -1) {
                        this.eventList.splice(index, 1);
                    }
                    break;
                }
            }
        };
        /** 移除所有事件侦听 */
        FightTimer.prototype.clearAllTick = function () {
            this.eventList.length = 0;
        };
        FightTimer.prototype.test = function () {
            console.warn("FightTicker:eventList.length...............................", this.eventList.length);
            console.warn(this.eventList);
        };
        return FightTimer;
    }());
    qmr.FightTimer = FightTimer;
    __reflect(FightTimer.prototype, "qmr.FightTimer");
    /**
    * @description 具体的tickparams
    */
    var TickParams = (function () {
        function TickParams(delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            this.lastTimeStamp = 0;
            this.currentCount = 0;
            this.update(delay, repeatCount);
        }
        /**
         * @description 更新delay和repeatCount
         */
        TickParams.prototype.update = function (delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            this.currentCount = 0;
            if (delay < 1) {
                delay = 1;
            }
            if (this._delay == delay) {
                return;
            }
            this._delay = delay;
            this.lastCount = this.updateInterval = Math.round(60 * delay);
            this.lastTimeStamp = egret.getTimer();
            this._repeatCount = +repeatCount | 0;
        };
        Object.defineProperty(TickParams.prototype, "delay", {
            /**
             * @description 获取延时
             */
            get: function () {
                return this._delay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TickParams.prototype, "repeatCount", {
            /**
             * @description 获取repeatCount
             */
            get: function () {
                return this._repeatCount;
            },
            enumerable: true,
            configurable: true
        });
        return TickParams;
    }());
    __reflect(TickParams.prototype, "TickParams");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 一个自定义的tick封装类
     *
     */
    var Ticker = (function () {
        function Ticker() {
            this.eventList = [];
            this._running = false;
            this.start();
        }
        /**
         * 获取单例
         */
        Ticker.getInstance = function () {
            if (this.instance == null) {
                this.instance = new Ticker();
            }
            return this.instance;
        };
        /**
         * 开始运转
         */
        Ticker.prototype.start = function () {
            if (this._running)
                return;
            for (var _i = 0, _a = this.eventList; _i < _a.length; _i++) {
                var tick = _a[_i];
                if (tick) {
                    tick.lastCount = tick.updateInterval;
                    tick.lastTimeStamp = egret.getTimer();
                }
            }
            egret.startTick(this.update, this);
            this._running = true;
        };
        /**
         * Ticker以60FPS频率刷新此方法
         */
        Ticker.prototype.update = function (timeStamp) {
            for (var _i = 0, _a = this.eventList; _i < _a.length; _i++) {
                var tick = _a[_i];
                if (tick) {
                    var deltaTime = timeStamp - tick.lastTimeStamp;
                    if (deltaTime >= tick.delay) {
                        var num = Math.floor(deltaTime / tick.delay);
                        if (num > 4) {
                            num = 4;
                        }
                        while (num > 0) {
                            num--;
                            if (tick.repeatCount == 0) {
                                if (tick.callBack) {
                                    tick.callBack.call(tick.thisObject);
                                }
                            }
                            else {
                                tick.currentCount++;
                                var complete = (tick.repeatCount > 0 && tick.currentCount >= tick.repeatCount);
                                if (complete) {
                                    if (tick.callBack) {
                                        tick.callBack.call(tick.thisObject);
                                    }
                                    var index = this.eventList.indexOf(tick);
                                    if (index != -1) {
                                        this.eventList.splice(index, 1);
                                    }
                                }
                            }
                        }
                        tick.lastTimeStamp = timeStamp;
                        tick.lastCount = tick.updateInterval;
                    }
                    else {
                        tick.lastCount -= 1000;
                        if (tick.lastCount > 0) {
                            continue;
                        }
                        tick.lastCount += tick.updateInterval;
                        tick.lastTimeStamp = timeStamp;
                        tick.currentCount++;
                        if (tick.repeatCount == 0) {
                            if (tick.callBack) {
                                tick.callBack.call(tick.thisObject);
                            }
                        }
                        else {
                            var complete = (tick.repeatCount > 0 && tick.currentCount >= tick.repeatCount);
                            if (complete) {
                                if (tick.callBack) {
                                    tick.callBack.call(tick.thisObject);
                                }
                                var index = this.eventList.indexOf(tick);
                                if (index != -1) {
                                    this.eventList.splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
            return false;
        };
        /**
         * @description 停止
         */
        Ticker.prototype.stop = function () {
            if (!this._running)
                return;
            egret.stopTick(this.update, this);
            this._running = false;
        };
        Object.defineProperty(Ticker.prototype, "running", {
            /**
             * @description 获取是否正在运转
             */
            get: function () {
                return this._running;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @description 注册tick
         */
        Ticker.prototype.registerTick = function (callback, thisObject, delay, repeatCount) {
            if (delay === void 0) { delay = 1000; }
            if (repeatCount === void 0) { repeatCount = 0; }
            var result = true;
            var eventList = this.eventList;
            for (var _i = 0, eventList_1 = eventList; _i < eventList_1.length; _i++) {
                var tick = eventList_1[_i];
                if (tick.callBack == callback && tick.thisObject == thisObject) {
                    tick.update(delay, repeatCount);
                    result = false;
                    break;
                }
            }
            if (result) {
                var tickParam = new TickParams(delay, repeatCount);
                tickParam.callBack = callback;
                tickParam.thisObject = thisObject;
                eventList.push(tickParam);
            }
        };
        /**
         * @description 取消tick
         */
        Ticker.prototype.unRegisterTick = function (callback, thisObject) {
            var eventList = this.eventList;
            for (var _i = 0, eventList_2 = eventList; _i < eventList_2.length; _i++) {
                var tick = eventList_2[_i];
                if (tick.callBack == callback && tick.thisObject == thisObject) {
                    var index = eventList.indexOf(tick);
                    if (index != -1) {
                        eventList.splice(index, 1);
                    }
                    break;
                }
            }
        };
        Ticker.prototype.test = function () {
            console.warn("Ticker info......................................................", this.eventList.length);
            console.warn(this.eventList);
        };
        return Ticker;
    }());
    qmr.Ticker = Ticker;
    __reflect(Ticker.prototype, "qmr.Ticker");
    /**
    * @description 具体的tickparams
    */
    var TickParams = (function () {
        function TickParams(delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            this.lastTimeStamp = 0;
            this.currentCount = 0;
            this.update(delay, repeatCount);
        }
        /**
         * @description 更新delay和repeatCount
         */
        TickParams.prototype.update = function (delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            this.currentCount = 0;
            if (delay < 1) {
                delay = 1;
            }
            if (this._delay == delay) {
                return;
            }
            this._delay = delay;
            this.lastCount = this.updateInterval = Math.round(60 * delay);
            this.lastTimeStamp = egret.getTimer();
            this._repeatCount = +repeatCount | 0;
        };
        Object.defineProperty(TickParams.prototype, "delay", {
            /**
             * @description 获取延时
             */
            get: function () {
                return this._delay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TickParams.prototype, "repeatCount", {
            /**
             * @description 获取repeatCount
             */
            get: function () {
                return this._repeatCount;
            },
            enumerable: true,
            configurable: true
        });
        return TickParams;
    }());
    __reflect(TickParams.prototype, "TickParams");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * @description 位操作类
     */
    var BitUtil = (function () {
        function BitUtil() {
        }
        /**
         * @description 检测一个int值的某一位是否有效，1代表有效，0代表无效
         */
        BitUtil.checkAvalibe = function (code, bit) {
            var result = false;
            if (((code >> bit - 1) & 1) == 1) {
                result = true;
            }
            return result;
        };
        /**
         * @description 改变某个int值的某一位,并返回修改后的int值
         */
        BitUtil.changeBit = function (code, bit, value) {
            var pow = Math.pow(2, (bit - 1));
            if (code & pow) {
                if (!value) {
                    code = code - pow;
                }
            }
            else {
                if (value) {
                    code = code + pow;
                }
            }
            return code;
        };
        /**
         * @description 整型转化为byte数组
         */
        BitUtil.inToBytes = function (value) {
            var byte = [];
            byte[0] = (value >> 24) & 0xFF;
            byte[1] = (value >> 16) & 0xFF;
            byte[2] = (value >> 8) & 0xFF;
            byte[3] = value & 0xFF;
            return byte;
        };
        return BitUtil;
    }());
    qmr.BitUtil = BitUtil;
    __reflect(BitUtil.prototype, "qmr.BitUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var ChannelUtil = (function () {
        function ChannelUtil() {
        }
        /**
         * 动态加载js文件
         * @param scriptUrl 文件地址
         * @param isDecode  是否需要解码
         * @param callFunc  文件载入完成后的回调
         */
        ChannelUtil.loadScript = function (scriptUrl, isDecode, callFunc) {
            var script = window.document.createElement("script");
            script.type = "text/javascript";
            if (isDecode) {
                script.src = decodeURIComponent(scriptUrl);
            }
            else {
                script.src = scriptUrl;
            }
            window.document.head.appendChild(script);
            script.onload = function () {
                script.onload = null;
                callFunc();
            };
        };
        return ChannelUtil;
    }());
    qmr.ChannelUtil = ChannelUtil;
    __reflect(ChannelUtil.prototype, "qmr.ChannelUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var ColorUtil = (function () {
        function ColorUtil() {
        }
        /**
         * @desc 根据品质返回对应颜色
         */
        ColorUtil.getColorByQuality = function (quality) {
            switch (quality) {
                case 1:
                    return qmr.ColorQualityConst.COLOR_G; //默认颜色改成默认颜色试试
                //return ColorConst.COLOR_WHITE;
                case 2:
                    return qmr.ColorQualityConst.COLOR_GREEN;
                case 3:
                    return qmr.ColorQualityConst.COLOR_BLUE;
                case 4:
                    return qmr.ColorQualityConst.COLOR_VIOLET;
                case 5:
                    return qmr.ColorQualityConst.COLOR_CADMIUM;
                case 6:
                    return qmr.ColorQualityConst.COLOR_RED;
                case 7:
                    return qmr.ColorQualityConst.COLOR_DIAMOND;
            }
            return qmr.ColorQualityConst.COLOR_G;
        };
        /**
         * 若类型为8，则1=绿品，2=蓝品，3=紫品，4=金品，5=红品
         * @desc 根据subType返回日常任务品质颜色
         */
        ColorUtil.getColorBySubType = function (subType) {
            switch (subType) {
                case 2:
                    return qmr.ColorQualityConst.COLOR_GREEN;
                case 3:
                    return qmr.ColorQualityConst.COLOR_BLUE;
                case 4:
                    return qmr.ColorQualityConst.COLOR_VIOLET;
                case 5:
                    return qmr.ColorQualityConst.COLOR_CADMIUM;
                case 6:
                    return qmr.ColorQualityConst.COLOR_RED;
            }
            return qmr.ColorQualityConst.COLOR_G;
        };
        ColorUtil.getTipColorByType = function (colorType) {
            switch (colorType) {
                case 0:
                    return 0xFF0000; //红色
                case 1:
                    return 0x09a608; //绿色
            }
            return 0xffffff; //白色
        };
        return ColorUtil;
    }());
    qmr.ColorUtil = ColorUtil;
    __reflect(ColorUtil.prototype, "qmr.ColorUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var CommonTool = (function () {
        function CommonTool() {
        }
        CommonTool.getMsg = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            var s = arg.shift();
            for (var key in arg) {
                var value = arg[key];
                s = s.replace(/\{\d+\}/, value);
            }
            return s;
        };
        return CommonTool;
    }());
    qmr.CommonTool = CommonTool;
    __reflect(CommonTool.prototype, "qmr.CommonTool");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * @date 2016.12.01
     * @description 带动画和移动操作的角色类,默认是待机状态,idle
     */
    var BaseActor = (function (_super) {
        __extends(BaseActor, _super);
        function BaseActor(resourcePath, loadCallBack, loadThisObject, defaultAct) {
            if (defaultAct === void 0) { defaultAct = "idle"; }
            var _this = _super.call(this) || this;
            var t = _this;
            t.resourcePath = resourcePath;
            t.loadCallBack = loadCallBack;
            t.loadThisObject = loadThisObject;
            t.currentFrame = 1;
            t.totalFrame = 0;
            t.isStopped = true;
            t.isDirLoaded = false;
            t.isNoRendering = false;
            t.passedTime = 0;
            t.lastTime = 0;
            t._timeScale = 1;
            t.act = defaultAct;
            t.frameRate = 30;
            t.eventDic = {};
            t.actDic = {};
            t.partDic = {};
            t.partIdDic = {};
            t.addEventListener(egret.Event.ADDED_TO_STAGE, t.addToStage, t);
            t.addEventListener(egret.Event.REMOVED_FROM_STAGE, t.removeToStage, t);
            return _this;
        }
        BaseActor.prototype.addToStage = function () {
            this.setIsStopped(false);
            this.render();
        };
        BaseActor.prototype.removeToStage = function () {
            this.setIsStopped(true);
        };
        Object.defineProperty(BaseActor.prototype, "isNoRendering", {
            get: function () {
                return this._isNoRendering;
            },
            set: function (value) {
                this._isNoRendering = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @description 设置是否是分方向加载
         */
        BaseActor.prototype.setIsDirLoad = function (value) {
            this.isDirLoaded = value;
            var partDic = this.partDic;
            for (var part in partDic) {
                var animalClip = partDic[part];
                animalClip.setIsDirLoad(value);
            }
        };
        /**
         * @description 添加部件
         * @param part部件位置，参考ActorPart
         * @param partId 部件的Id
         * @param partIndex 部件层级位置,数字越大层级越高
         */
        BaseActor.prototype.addPartAt = function (part, partId, partIndex, dir, isDirLoad, resPath, isShowDefault) {
            if (partIndex === void 0) { partIndex = -1; }
            if (dir === void 0) { dir = 1; }
            if (isDirLoad === void 0) { isDirLoad = false; }
            if (resPath === void 0) { resPath = null; }
            if (isShowDefault === void 0) { isShowDefault = true; }
            if (partId) {
                var t = this;
                t.addPartTo(part, partId, partIndex, dir, isDirLoad, resPath);
                //这里是添加转圈特效，用来在模型资源加载完成之前显示一个loading特效的功能
                if (part == qmr.ActorPart.BODY && isShowDefault) {
                    var animalClip = t.partDic[qmr.ActorPart.DEFAULT];
                    if (!animalClip) {
                        t.addPartTo(qmr.ActorPart.DEFAULT, 168, partIndex, dir, isDirLoad, resPath);
                        animalClip = t.partDic[qmr.ActorPart.DEFAULT];
                        animalClip.offsetY = -85;
                    }
                }
            }
        };
        BaseActor.prototype.addPartTo = function (part, partId, partIndex, dir, isDirLoad, resPath) {
            if (partIndex === void 0) { partIndex = -1; }
            if (dir === void 0) { dir = 1; }
            if (isDirLoad === void 0) { isDirLoad = false; }
            if (resPath === void 0) { resPath = null; }
            var t = this;
            var tempAct = t.act;
            var animalClip = t.partDic[part];
            t.partIdDic[part] = partId;
            t.dir = dir;
            if (animalClip) {
                if (partIndex != -1) {
                    t.addChildAt(animalClip, partIndex);
                }
                else {
                    t.addChild(animalClip);
                }
                animalClip.setIsDirLoad(isDirLoad);
                if (!animalClip.containsAct(tempAct)) {
                    tempAct = part == qmr.ActorPart.HORSE ? qmr.Status.IDLE_RIDE : qmr.Status.IDLE;
                }
                var partPath = qmr.ActorPartResourceDic.getInstance().partDic[part];
                animalClip.load(partPath ? partPath : t.resourcePath, partId + "_" + tempAct, qmr.DirUtil.getDir(dir));
            }
            else {
                if (part == qmr.ActorPart.BODY) {
                    animalClip = new qmr.AnimateClip(t.onLoaded, t);
                    // animalClip.isBody = true;
                }
                else if (part == qmr.ActorPart.DEFAULT) {
                    animalClip = new qmr.AnimateClip(t.onLoadedDefault, t);
                }
                else if (part == qmr.ActorPart.WING) {
                    animalClip = new qmr.AnimateWing(t.onLoadedOther, t);
                }
                else {
                    animalClip = new qmr.AnimateClip(t.onLoadedOther, t);
                }
                // animalClip.setIsDirLoad(isDirLoad); 本项目不需要
                if (partIndex != -1) {
                    t.addChildAt(animalClip, partIndex);
                }
                else {
                    t.addChild(animalClip);
                }
                if (!animalClip.containsAct(tempAct)) {
                    tempAct = part == qmr.ActorPart.HORSE ? qmr.Status.IDLE_RIDE : qmr.Status.IDLE;
                }
                t.partDic[part] = animalClip;
                var partPath = qmr.ActorPartResourceDic.getInstance().partDic[part];
                animalClip.load(partPath ? partPath : t.resourcePath, partId + "_" + tempAct, qmr.DirUtil.getDir(dir));
            }
        };
        BaseActor.prototype.setPartVisible = function (part, show) {
            var animalClip = this.partDic[part];
            animalClip.visible = show;
        };
        /**
         * @description 移除部件
         * @param part部件位置，参考ActorPart
         */
        BaseActor.prototype.removePart = function (part) {
            var animalClip = this.partDic[part];
            if (animalClip) {
                animalClip.dispos();
                delete this.partDic[part];
                delete this.partIdDic[part];
            }
        };
        BaseActor.prototype.getPart = function (part) {
            if (part === void 0) { part = qmr.ActorPart.BODY; }
            return this.partDic[part];
        };
        /**
         * @description 设置该部位包含的动作
         */
        BaseActor.prototype.setPartActs = function (part, acts) {
            var partDic = this.partDic;
            for (var key in partDic) {
                if (parseInt(key) == part) {
                    var animalClip = partDic[part];
                    if (animalClip) {
                        animalClip.setActs(acts);
                    }
                }
            }
            if (acts.indexOf(',') > -1) {
                this.act = acts.split(',')[0];
            }
            else {
                this.act = acts;
            }
        };
        /**
         * @description 跳转并播放
         */
        BaseActor.prototype.gotoAndPlay = function (act, dir, loopCallBack, loopThisObject, force) {
            if (loopCallBack === void 0) { loopCallBack = null; }
            if (loopThisObject === void 0) { loopThisObject = null; }
            if (force === void 0) { force = false; }
            var t = this;
            t.loopCallBack = loopCallBack;
            t.loopThisObject = loopThisObject;
            if (!force) {
                if (t.act == act)
                    return;
            }
            t.actDic[act] = false;
            t.act = act;
            t.dir = dir;
            t.currentFrame = 1;
            var currentScale = Math.abs(t.scaleX);
            if (dir <= 5) {
                t.scaleX = currentScale;
            }
            else {
                t.scaleX = -currentScale;
            }
            if (t.act == qmr.Status.DEAD) {
                dir = -1;
            }
            var partDic = t.partDic;
            var partIdDic = t.partIdDic;
            t.setIsStopped(true);
            for (var part in partDic) {
                var animalClip = partDic[part];
                if (animalClip) {
                    var tempAct = t.act;
                    if (!animalClip.containsAct(tempAct)) {
                        if (parseInt(part) == qmr.ActorPart.HORSE) {
                            tempAct = qmr.Status.IDLE_RIDE;
                        }
                        else {
                            tempAct = qmr.Status.IDLE;
                        }
                    }
                    var partPath = qmr.ActorPartResourceDic.getInstance().partDic[part];
                    var resPath = partPath ? partPath : t.resourcePath;
                    animalClip.load(resPath, partIdDic[part] + "_" + tempAct, qmr.DirUtil.getDir(dir));
                }
            }
        };
        /**
         * @description 清除回调
         */
        BaseActor.prototype.clearCallBack = function () {
            this.loopCallBack = null;
        };
        /**
         * @description 调整方向
         */
        BaseActor.prototype.changeDir = function (dir) {
            var t = this;
            if (t.dir == dir)
                return;
            t.dir = dir;
            var currentScale = Math.abs(t.scaleX);
            if (dir <= 5) {
                t.scaleX = currentScale;
            }
            else {
                t.scaleX = -currentScale;
            }
            var partDic = t.partDic;
            var partIdDic = t.partIdDic;
            for (var part in partDic) {
                var animalClip = partDic[part];
                if (animalClip) {
                    var tempAct = t.act;
                    if (!animalClip.containsAct(tempAct)) {
                        if (parseInt(part) == qmr.ActorPart.HORSE) {
                            tempAct = qmr.Status.IDLE_RIDE;
                        }
                        else {
                            tempAct = qmr.Status.IDLE;
                        }
                    }
                    var partPath = qmr.ActorPartResourceDic.getInstance().partDic[part];
                    var resPath = partPath ? partPath : t.resourcePath;
                    animalClip.load(resPath + partIdDic[part] + "/", partIdDic[part] + "_" + tempAct, qmr.DirUtil.getDir(dir));
                }
            }
        };
        /**
         * @description 跳转并停止在某一帧
         */
        BaseActor.prototype.gotoAndStop = function (frame) {
            this.currentFrame = frame;
            this.render();
            this.setIsStopped(true);
        };
        /**
        * @description 资源加载完毕
        */
        BaseActor.prototype.onLoadedDefault = function (isFromCache, resName) {
            var t = this;
            var animalClip = t.partDic[qmr.ActorPart.DEFAULT];
            if (animalClip) {
                t.totalFrame = animalClip.totalFrames;
                t.frameRate = animalClip.frameRate;
                t.setIsStopped(false);
            }
        };
        /**
         * @description 其它部位加载完毕
         */
        BaseActor.prototype.onLoadedOther = function (isFromCache) {
            var t = this;
            var animalClip = t.partDic[qmr.ActorPart.DEFAULT];
            if (animalClip) {
                t.removePart(qmr.ActorPart.DEFAULT);
                t.totalFrame = 1;
            }
            if (!isFromCache) {
                t.changeDir(t.dir);
            }
        };
        BaseActor.prototype.onLoaded = function (isFromCache, resName) {
            var t = this;
            t.removePart(qmr.ActorPart.DEFAULT);
            if (resName.indexOf(t.act) == -1)
                return;
            var animalClip = t.partDic[qmr.ActorPart.BODY];
            if (animalClip) {
                t.totalFrame = animalClip.totalFrames;
                t.frameRate = animalClip.frameRate;
            }
            else {
                t.totalFrame = 0;
            }
            if (t.totalFrame > 0) {
                t.actDic[t.act] = true;
                //如果只是有一帧
                if (t.totalFrame == 1) {
                    t.gotoAndStop(1);
                }
                else {
                    t.setIsStopped(false);
                }
                if (t.loadCallBack) {
                    t.loadCallBack.call(t.loadThisObject);
                }
            }
            else {
                t.gotoAndPlay(t.act, t.dir);
            }
        };
        Object.defineProperty(BaseActor.prototype, "firstBodyFrameHeight", {
            /**
             * @description 获取第一帧裸体的高度
             */
            get: function () {
                var animalClip = this.partDic[qmr.ActorPart.BODY];
                if (animalClip) {
                    return animalClip.firstFrameHeight;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @description 注册一个帧事件         */
        BaseActor.prototype.registerFrameEvent = function (frame, callBack, thisObject) {
            this.eventDic[frame] = { callBack: callBack, thisObject: thisObject };
        };
        /**
         * @description 取消一个帧事件         */
        BaseActor.prototype.unRegisterFrameEvent = function (frame) {
            var eventDic = this.eventDic;
            if (eventDic[frame]) {
                eventDic[frame] = null;
                delete eventDic[frame];
            }
        };
        /**
         * @description 清除帧事件注册
         */
        BaseActor.prototype.clearFrameEvent = function () {
            var eventDic = this.eventDic;
            for (var key in eventDic) {
                eventDic[key] = null;
                delete eventDic[key];
            }
        };
        /**
         * @description 帧频调用         */
        BaseActor.prototype.advanceTime = function (timeStamp) {
            var t = this;
            if (t.isNoRendering) {
                t.gotoAndStop(1);
                return false;
            }
            var advancedTime = timeStamp - t.lastTime;
            t.lastTime = timeStamp;
            var frameIntervalTime = t.frameIntervalTime;
            var currentTime = t.passedTime + advancedTime;
            t.passedTime = currentTime % frameIntervalTime;
            var num = currentTime / frameIntervalTime;
            if (num < 1) {
                return false;
            }
            t.render();
            while (num >= 1) {
                num--;
                t.currentFrame++;
                if (t.actDic[t.act]) {
                    t.checkFrameEvent();
                }
            }
            return false;
        };
        /**
         * @description 检测帧事件         */
        BaseActor.prototype.checkFrameEvent = function () {
            var obj = this.eventDic[this.currentFrame];
            if (obj && obj.callBack) {
                obj.callBack.call(obj.thisObject);
            }
        };
        /**
         * @description 渲染*/
        BaseActor.prototype.render = function () {
            var t = this;
            if (t.totalFrame > 0) {
                if (t.currentFrame > t.totalFrame) {
                    t.currentFrame = 1;
                    if (t.loopCallBack) {
                        t.loopCallBack.call(t.loopThisObject);
                    }
                }
                if (t.totalFrame == 1 || t.stage) {
                    var partDic = t.partDic;
                    var currentFrame = t.currentFrame;
                    for (var part in partDic) {
                        var animalClip = partDic[part];
                        if (animalClip) {
                            animalClip.render(currentFrame);
                        }
                    }
                }
            }
        };
        Object.defineProperty(BaseActor.prototype, "frameRate", {
            /**
             * @description 设置帧频         */
            set: function (value) {
                if (value > 60) {
                    value = 60;
                }
                this._frameRate = value;
                this.frameIntervalTime = 1000 / (value * this._timeScale);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @description 获取总帧数
         */
        BaseActor.prototype.getTotalFrame = function () {
            return this.totalFrame;
        };
        Object.defineProperty(BaseActor.prototype, "timeScale", {
            /**
             * @description 获取timescale
             */
            get: function () {
                return this._timeScale;
            },
            /**
             * @description 设置timescale
             */
            set: function (value) {
                if (value <= 0) {
                    value = 1;
                }
                this._timeScale = value;
                this.frameIntervalTime = 1000 / (this._frameRate * value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseActor.prototype, "act", {
            /**
             * @description 获取timescale
             */
            get: function () {
                return this._act;
            },
            set: function (value) {
                this._act = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseActor.prototype, "resourcePath", {
            /**
             * @description 获取timescale
             */
            get: function () {
                return this._resourcePath;
            },
            set: function (value) {
                this._resourcePath = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
            * @private
            *
            * @param value
            */
        BaseActor.prototype.setIsStopped = function (value) {
            var t = this;
            if (t.isStopped == value) {
                return;
            }
            t.isStopped = value;
            if (value) {
                egret.stopTick(t.advanceTime, t);
            }
            else {
                //如果只是有一帧或者外面设置了不在渲染
                if (t.totalFrame == 1 || t.isNoRendering) {
                    t.gotoAndStop(1);
                }
                else {
                    t.lastTime = egret.getTimer();
                    egret.startTick(t.advanceTime, t);
                }
            }
        };
        BaseActor.prototype.getDir = function () {
            return this.dir;
        };
        /**
         * @description 清除资源
         */
        BaseActor.prototype.clear = function () {
            this.setIsStopped(true);
            this.clearFrameEvent();
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        /**
         * @description 资源释放         */
        BaseActor.prototype.dispos = function (isRemoveFromParent) {
            if (isRemoveFromParent === void 0) { isRemoveFromParent = true; }
            var t = this;
            t.setIsStopped(true);
            t.clearFrameEvent();
            t.removeEventListener(egret.Event.ADDED_TO_STAGE, t.addToStage, t);
            t.removeEventListener(egret.Event.REMOVED_FROM_STAGE, t.removeToStage, t);
            for (var part in t.partDic) {
                t.removePart(part);
            }
            if (t.parent && isRemoveFromParent) {
                t.parent.removeChild(t);
            }
        };
        return BaseActor;
    }(egret.DisplayObjectContainer));
    qmr.BaseActor = BaseActor;
    __reflect(BaseActor.prototype, "qmr.BaseActor");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var DirtyWordsUtils = (function () {
        function DirtyWordsUtils() {
        }
        /**
         * 是否有敏感词
         * @param content    要检测的文字
         * @return        true为有敏感词，false为没有敏感词
         */
        DirtyWordsUtils.hasDirtywords = function (content, callbackF, thisObj) {
            var time = (new Date().getTime() / 1000 | 0);
            var contentEncode = encodeURI(content);
            var sign = encodeURI(qmr.Md5Util.getInstance().hex_md5(content + time + qmr.GlobalConfig.loginKey));
            var url = qmr.PlatformManager.instance.platform.dirtyWordCheckUrl
                + "?time=" + time + "&content=" + contentEncode + "&sign=" + sign;
            qmr.LogUtil.log("url=", url);
            qmr.HttpRequest.sendGet(url, function (res) {
                qmr.LogUtil.log("dirtywords", res);
                var hasDirty = true;
                if (res) {
                    var data = JSON.parse(res);
                    if (data) {
                        if (data.ret == 1) {
                            hasDirty = false;
                        }
                    }
                }
                if (callbackF) {
                    callbackF.call(thisObj, hasDirty, res.content);
                }
            }, this);
        };
        return DirtyWordsUtils;
    }());
    qmr.DirtyWordsUtils = DirtyWordsUtils;
    __reflect(DirtyWordsUtils.prototype, "qmr.DirtyWordsUtils");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var DirUtil = (function () {
        function DirUtil() {
        }
        /**
         * @description 获取真实的5方向
         */
        DirUtil.getDir = function (dir) {
            if (dir <= 5)
                return dir;
            if (dir == 6)
                return DirUtil.RIGHT_DOWN;
            if (dir == 7)
                return DirUtil.RIGHT;
            if (dir == 8)
                return DirUtil.RIGHT_UP;
        };
        DirUtil.UP = 1; //向上
        DirUtil.RIGHT_UP = 2; //右上
        DirUtil.RIGHT = 3; //向右
        DirUtil.RIGHT_DOWN = 4; //右下
        DirUtil.DOWN = 5; //向下
        DirUtil.LEFT_DOWN = 6; //左下
        DirUtil.LEFT = 7; //向左
        DirUtil.LEFT_UP = 8; //左上
        return DirUtil;
    }());
    qmr.DirUtil = DirUtil;
    __reflect(DirUtil.prototype, "qmr.DirUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var DisplayUtils = (function () {
        function DisplayUtils() {
        }
        DisplayUtils.removeAllChild = function (dis) {
            if (!dis)
                return;
            while (dis.numChildren) {
                var c = dis.removeChildAt(0);
            }
        };
        DisplayUtils.removeDisplay = function (dis, parent) {
            if (parent === void 0) { parent = null; }
            if (!dis)
                return;
            if (!parent) {
                parent = dis.parent;
            }
            if (!parent)
                return;
            parent.removeChild(dis);
        };
        DisplayUtils.addDisplayToTop = function (dis, parent) {
            if (parent === void 0) { parent = null; }
            if (!dis)
                return;
            if (!parent) {
                parent = dis.parent;
            }
            if (!parent)
                return;
            parent.addChild(dis);
        };
        DisplayUtils.removeClick = function (target) {
            var tempEvent;
            for (var name_3 in this.eventDic) {
                tempEvent = this.eventDic[name_3];
                if (tempEvent.target == target) {
                    tempEvent.target.removeEventListener(tempEvent.type, tempEvent.callBack, tempEvent.thisObject);
                    tempEvent.target.removeEventListener(tempEvent.type, tempEvent.callFunc, tempEvent.thisCall);
                    delete this.eventDic[name_3];
                    break;
                }
            }
        };
        DisplayUtils.removeAllEvent = function (target) {
            var code = target.hashCode;
            delete this.eventDic[code + egret.TouchEvent.TOUCH_BEGIN];
            delete this.eventDic[code + egret.TouchEvent.TOUCH_END];
            delete this.eventDic[code + egret.TouchEvent.TOUCH_CANCEL];
            delete this.eventDic[code + egret.TouchEvent.TOUCH_RELEASE_OUTSIDE];
        };
        DisplayUtils.addClick = function (target, callBack, thisObject, longPressCallBack) {
            if (longPressCallBack === void 0) { longPressCallBack = null; }
            if (!target)
                return;
            if (this.eventDic == null) {
                this.eventDic = {};
            }
            if (target instanceof eui.Group) {
                target.touchChildren = false;
            }
            var eventParams = {};
            eventParams.target = target;
            eventParams.type = egret.TouchEvent.TOUCH_BEGIN;
            eventParams.thisObject = thisObject;
            eventParams.callFunc = this.onTouchBegin;
            eventParams.longPressCallBack = longPressCallBack;
            eventParams.thisCall = this;
            if (target && !this.eventDic[target.hashCode + eventParams.type]) {
                target.addEventListener(eventParams.type, this.onTouchBegin, this);
                this.eventDic[target.hashCode + eventParams.type] = eventParams;
            }
            var eventParamsEnd = {};
            eventParamsEnd.target = target;
            eventParamsEnd.type = egret.TouchEvent.TOUCH_END;
            eventParamsEnd.callBack = callBack;
            eventParamsEnd.thisObject = thisObject;
            eventParamsEnd.callFunc = this.onTouchEnd;
            eventParamsEnd.thisCall = this;
            if (target && !this.eventDic[target.hashCode + eventParamsEnd.type]) {
                target.addEventListener(eventParamsEnd.type, this.onTouchEnd, this);
                this.eventDic[target.hashCode + eventParamsEnd.type] = eventParamsEnd;
            }
            var eventParamsCancel = {};
            eventParamsCancel.target = target;
            eventParamsCancel.type = egret.TouchEvent.TOUCH_CANCEL;
            eventParamsCancel.callBack = callBack;
            eventParamsCancel.thisObject = thisObject;
            eventParamsCancel.callFunc = this.onTouchReleaseCancel;
            eventParamsCancel.thisCall = this;
            if (target && !this.eventDic[target.hashCode + eventParamsCancel.type]) {
                target.addEventListener(eventParamsCancel.type, this.onTouchReleaseCancel, this);
                this.eventDic[target.hashCode + eventParamsCancel.type] = eventParamsCancel;
            }
            var eventParamsOutSide = {};
            eventParamsOutSide.target = target;
            eventParamsOutSide.type = egret.TouchEvent.TOUCH_RELEASE_OUTSIDE;
            eventParamsOutSide.thisObject = thisObject;
            eventParamsOutSide.callFunc = this.onTouchReleaseOutSide;
            eventParamsOutSide.thisCall = this;
            if (target && !this.eventDic[target.hashCode + eventParamsOutSide.type]) {
                target.addEventListener(eventParamsOutSide.type, this.onTouchReleaseOutSide, this);
                this.eventDic[target.hashCode + eventParamsOutSide.type] = eventParamsOutSide;
            }
        };
        /**
         * @description 当点击开始
         */
        DisplayUtils.onTouchBegin = function (evt) {
            if (this.touchBeginTaret && this.touchBeginTaret == evt.target) {
                return;
            }
            if ((egret.getTimer() - this.lastTime) < 300) {
                return;
            }
            this.touchBeginTaret = evt.target;
            this.lastTime = egret.getTimer();
            egret.Tween.get(evt.target).to({ scaleX: 1.1, scaleY: 1.1 }, 50);
            qmr.Ticker.getInstance().registerTick(this.longPress, this, 300);
        };
        /**
         * @description 当点击结束
         */
        DisplayUtils.onTouchEnd = function (evt) {
            var t = this;
            var target = evt.target;
            if (this.touchBeginTaret != target)
                return;
            this.touchBeginTaret = null;
            egret.Tween.get(target).to({ scaleX: 1, scaleY: 1 }, 50).call(function () {
                for (var key in t.eventDic) {
                    var eventParams = t.eventDic[key];
                    if (eventParams.target == target && eventParams.type == egret.TouchEvent.TOUCH_END) {
                        eventParams.callBack.call(eventParams.thisObject);
                    }
                }
            }, this);
            qmr.Ticker.getInstance().unRegisterTick(this.longPress, this);
        };
        /**
         * @description 当点击结束的时候，按钮不在被点击的对象上
         */
        DisplayUtils.onTouchReleaseCancel = function (evt) {
            if (this.touchBeginTaret != evt.currentTarget)
                return;
            this.touchBeginTaret && egret.Tween.removeTweens(this.touchBeginTaret);
            this.touchBeginTaret = null;
            evt.currentTarget.scaleX = 1;
            evt.currentTarget.scaleY = 1;
        };
        /**
         * @description 当点击结束的时候，按钮不在被点击的对象上
         */
        DisplayUtils.onTouchReleaseOutSide = function (evt) {
            if (this.touchBeginTaret != evt.target)
                return;
            this.touchBeginTaret && egret.Tween.removeTweens(this.touchBeginTaret);
            this.touchBeginTaret = null;
            evt.target.scaleX = 1;
            evt.target.scaleY = 1;
        };
        DisplayUtils.longPress = function () {
            var t = this;
            for (var key in t.eventDic) {
                var eventParams = t.eventDic[key];
                if (eventParams.target == this.touchBeginTaret && eventParams.longPressCallBack) {
                    eventParams.longPressCallBack.call(eventParams.thisObject);
                }
            }
        };
        /**
         * 发光某个对象
         */
        DisplayUtils.setGlow = function (obj, isGrey) {
            if (isGrey) {
                if (!obj.filters || obj.filters.length == 0) {
                    obj.filters = [qmr.FilterUtil.glowFilter];
                }
            }
            else {
                obj.filters = [];
            }
        };
        /**
         * 置灰某个对象,设置按钮不用滤镜了，用setBtnGray 方法
         */
        DisplayUtils.setGrey = function (obj, isGrey, isSetEnabled) {
            if (isSetEnabled === void 0) { isSetEnabled = true; }
            if (obj instanceof eui.Button && isSetEnabled) {
                obj.enabled = !isGrey;
                return;
            }
            if (isGrey) {
                if (!obj.filters || obj.filters.length == 0) {
                    obj.filters = [qmr.FilterUtil.grayFilter];
                }
                if (isSetEnabled)
                    obj.touchEnabled = false;
            }
            else {
                obj.filters = [];
                if (isSetEnabled)
                    obj.touchEnabled = true;
            }
        };
        /**
         * 置灰某个对象
         */
        DisplayUtils.setBtnGray = function (obj, isGray, isSetEnabled, btnSkinType) {
            if (isSetEnabled === void 0) { isSetEnabled = true; }
            if (btnSkinType === void 0) { btnSkinType = 1; }
            if (isGray) {
                if (isSetEnabled) {
                    obj.currentState = "disabled";
                    obj.touchEnabled = false;
                }
                else
                    obj.skinName = DisplayUtils.getBtnSkin(btnSkinType, isGray);
            }
            else {
                if (isSetEnabled)
                    obj.currentState = "up";
                else
                    obj.skinName = DisplayUtils.getBtnSkin(btnSkinType, isGray);
                obj.touchEnabled = true;
            }
        };
        DisplayUtils.getBtnSkin = function (btnSkinType, isGray) {
            var skin = "ButtonYellowSkin";
            switch (btnSkinType) {
                case qmr.BtnSkinType.Type_1:
                    skin = isGray ? "ButtonYellowDisabledSkin" : "ButtonYellowSkin";
                    break;
                case qmr.BtnSkinType.Type_2:
                    skin = isGray ? "ButtonYellowDisabledSkin1" : "ButtonYellowSkin1";
                    break;
            }
            return skin;
        };
        /**
          * 置灰一组对象
          */
        DisplayUtils.setGreyGoup = function (objGoup, isGrey) {
            var _this = this;
            objGoup.forEach(function (element) {
                _this.setGrey(element, isGrey);
            });
        };
        /**
         * 设置不可选
         */
        DisplayUtils.setDisable = function (obj, isDisable) {
            this.setGrey(obj, isDisable);
            obj.touchEnabled = !isDisable;
        };
        //设置一个对象为相对于上个容器位置
        DisplayUtils.LoadResByNameAndWH = function (obj, objParent, width, height, x, y) {
            if (x === void 0) { x = 50; }
            if (y === void 0) { y = 50; }
            obj.width = width;
            obj.height = height;
            obj.anchorOffsetX = obj.width / 2;
            obj.anchorOffsetY = obj.height / 2;
            obj.x = (objParent.width / 100) * x;
            obj.y = (objParent.height / 100) * y;
            return obj;
        };
        /**
         * 更新星星方法
         * max-星星组
         * lightNum-当前要亮的星数
         */
        DisplayUtils.updateStar = function (starGroup, lightNum) {
            var num = starGroup.numChildren;
            var star;
            for (var i = 0; i < num; i++) {
                star = starGroup.getChildAt(i);
                if (i < lightNum)
                    star.imgStar.visible = true;
                else
                    star.imgStar.visible = false;
            }
        };
        /**
         * 获取一个对象全局坐标点
         */
        DisplayUtils.getGlobelPoint = function (target) {
            if (target.parent) {
                return target.parent.localToGlobal(target.x, target.y);
            }
            return null;
        };
        return DisplayUtils;
    }());
    qmr.DisplayUtils = DisplayUtils;
    __reflect(DisplayUtils.prototype, "qmr.DisplayUtils");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var FilterUtil = (function () {
        function FilterUtil() {
        }
        /**
         * 灰态
         */
        FilterUtil.grayFilter = new egret.ColorMatrixFilter([
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ]);
        FilterUtil.glowFilter = new egret.GlowFilter(0xfff200, 0.8, 35, 35, 2, 3 /* HIGH */, false, false);
        return FilterUtil;
    }());
    qmr.FilterUtil = FilterUtil;
    __reflect(FilterUtil.prototype, "qmr.FilterUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var HtmlUtil = (function () {
        function HtmlUtil() {
        }
        /**主要处理了\n  读表\n读取有问题 */
        //解析工具已经做了，这里不用搞了
        HtmlUtil.getHtmlString = function (msg) {
            if (msg.indexOf('\\n') > -1) {
                var s = msg.split("\\n").join("\n");
                return HtmlUtil.htmlParse.parse(s);
            }
            return HtmlUtil.htmlParse.parse(msg);
        };
        HtmlUtil.getHtmlTextElement = function (msg, color, isUnderLine, href, strokeColor, stroke) {
            if (isUnderLine === void 0) { isUnderLine = false; }
            var msgStr = '<font color=' + color;
            if (href) {
                msgStr += " href=event:" + href;
            }
            if (isUnderLine) {
                msgStr += " u='true'";
            }
            if (strokeColor) {
                msgStr += " strokecolor=" + strokeColor;
            }
            if (stroke) {
                msgStr += " stroke=" + stroke;
            }
            msgStr += ">" + msg + '</font>';
            return HtmlUtil.getHtmlString(msgStr);
        };
        /**
         * @desc 返回对应颜色的html字符串
         */
        HtmlUtil.getHtmlText = function (msg, color, isUnderLine, href) {
            if (isUnderLine === void 0) { isUnderLine = false; }
            if (href && isUnderLine)
                return '<font color=' + color + " href=event:" + href + " u='true'>" + msg + '</font>';
            if (href)
                return '<font color=' + color + " href=event:" + href + ">" + msg + '</font>';
            if (isUnderLine)
                return '<font color=' + color + " u='true'>" + msg + '</font>';
            return '<font color=' + color + ">" + msg + '</font>';
        };
        HtmlUtil.getColorSize = function (msg, color, size) {
            if (size)
                return '<font color=' + color + " size=" + size + ">" + msg + '</font>';
            return '<font color=' + color + ">" + msg + '</font>';
        };
        /**
         * @desc 返回对应颜色的html字符串
         */
        HtmlUtil.getHtmlTexts = function (data) {
            var temp = [];
            for (var i = 0; i < data.length; i++) {
                temp.push(this.getHtmlText(data[i][1], data[i][0], data[i][2], data[i][3]));
            }
            return temp.join("");
        };
        /**
         * @desc 针对道具类特殊的html字符串返回
         * @param itemDataId道具配置Id
         * @param count数量
         */
        HtmlUtil.getItemHtmlText = function (itemDataId, count) {
            var msg = "";
            // let itemData:ItemData = SingleModel.getInstance().packModel.getItemData(itemDataId);
            // if(itemData){
            // 	msg+='<font color='+ColorUtil.getColorByQuality(itemData.color)+'>'+itemData.name+'</font>';
            // 	msg+='<font color='+ColorConst.COLOR_WHITE+'>'+" x "+count+'</font>';
            // }else{
            // 	msg="未知道具Id["+itemDataId+"]";
            // }
            return msg;
        };
        HtmlUtil.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var backStr = "args:";
            for (var i in args) {
                if (!qmr.PlatformConfig.isDebug || !args)
                    return;
                backStr += args[i] + "\n";
            }
            return backStr;
        };
        HtmlUtil.htmlParse = new egret.HtmlTextParser();
        return HtmlUtil;
    }());
    qmr.HtmlUtil = HtmlUtil;
    __reflect(HtmlUtil.prototype, "qmr.HtmlUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *  初始化图片工具类
     */
    var ImageUtil = (function () {
        function ImageUtil() {
        }
        /**
         *  设置道具icon显示
         */
        ImageUtil.setItemIcon = function (icon, iconRes, pageType, bIsGray) {
            if (bIsGray === void 0) { bIsGray = false; }
            if (!iconRes || iconRes == "")
                return;
            icon.source = null;
            if (bIsGray == true) {
                iconRes += "_g";
            }
            qmr.ResManager.getRes(qmr.SystemPath.itemIcon + iconRes + ".png", function (texture) {
                if (icon) {
                    //icon.source = null;
                    icon.source = texture;
                }
            }, this, qmr.LoadPriority.HIGH, RES.ResourceItem.TYPE_IMAGE);
        };
        /** 设置位图icon显示 */
        ImageUtil.setBmpIcon = function (icon, url) {
            qmr.ResManager.getRes(url, function (texture) {
                if (icon) {
                    icon.texture = texture;
                }
            }, this, qmr.LoadPriority.HIGH, RES.ResourceItem.TYPE_IMAGE);
        };
        /** 给路径加上变灰路径 */
        ImageUtil.decoratePathForGray = function (path) {
            var pathArray = path.split(".png");
            path = pathArray[0] + "_g.png";
            return path;
        };
        /** 设置image显示 */
        ImageUtil.setImageIcon = function (icon, url) {
            if (url == "" || url == null || icon == null || icon.source == url) {
                return;
            }
            icon.source = null;
            qmr.ResManager.getRes(url, function (texture) {
                if (icon) {
                    //icon.source = null;
                    icon.source = texture;
                }
            }, this, qmr.LoadPriority.HIGH, RES.ResourceItem.TYPE_IMAGE);
        };
        //--------------以下字段游戏中暂时没用到，用到时候提到上面去----------------
        /**
         * @description 给图片设置滤镜变灰的效果
         */
        ImageUtil.setFilter = function (img) {
            var colorMaxtrix = [
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFilter = new egret.ColorMatrixFilter(colorMaxtrix);
            for (var i = 0; i < img.length; i++) {
                img[i].filters = [colorFilter];
            }
        };
        return ImageUtil;
    }());
    qmr.ImageUtil = ImageUtil;
    __reflect(ImageUtil.prototype, "qmr.ImageUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * coler
     * int64方法
     */
    var Int64Util = (function () {
        function Int64Util() {
        }
        Int64Util.getNumber = function (d) {
            if (d == null || d == "" || isNaN(d))
                return 0;
            if (typeof d == 'number')
                return d;
            return parseFloat(d.toString());
        };
        Int64Util.getNumberArr = function (any) {
            var arr = new Array();
            if (any) {
                var value = void 0;
                for (var i = 0; i < any.length; i++) {
                    value = Int64Util.getNumber(any[i]);
                    arr.push(value);
                }
            }
            return arr;
        };
        return Int64Util;
    }());
    qmr.Int64Util = Int64Util;
    __reflect(Int64Util.prototype, "qmr.Int64Util");
    function getNumber(d) {
        if (d == null)
            return 0;
        if (typeof d == 'number')
            return d;
        return parseFloat(d.toString());
    }
    qmr.getNumber = getNumber;
    function getServerNumber(playerId) {
        var server = playerId % 10000;
        return server;
    }
    qmr.getServerNumber = getServerNumber;
    function getServerNickName(playerId, name) {
        var id = getNumber(playerId);
        var server = getServerNumber(id);
        return "S" + server + "." + name;
    }
    qmr.getServerNickName = getServerNickName;
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var JsUtil = (function () {
        function JsUtil() {
        }
        //获取QueryString的数组 
        JsUtil.getQueryString = function () {
            var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
            for (var i = 0; i < result.length; i++) {
                result[i] = result[i].substring(1);
            }
            return result;
        };
        //根据QueryString参数名称获取值
        JsUtil.getQueryStringByName = function (name) {
            var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        };
        //根据QueryString参数索引获取值 
        JsUtil.getQueryStringByIndex = function (index) {
            if (index == null) {
                return "";
            }
            var queryStringList = JsUtil.getQueryString();
            if (index >= queryStringList.length) {
                return "";
            }
            var result = queryStringList[index];
            var startIndex = result.indexOf("=") + 1;
            result = result.substring(startIndex);
            return result;
        };
        /**
         * limit=1&h5limit=2
         * @param valueName
         * @param params
         */
        JsUtil.getValueFromParams = function (valueName, params) {
            var reg = new RegExp("(^|&)" + valueName + "=([^&]*)(&|$)", "i");
            if (params) {
                var r = params.match(reg);
                if (r) {
                    return decodeURIComponent(r[2]); //unescape
                }
            }
            return null;
        };
        return JsUtil;
    }());
    qmr.JsUtil = JsUtil;
    __reflect(JsUtil.prototype, "qmr.JsUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var LabelTip = (function () {
        function LabelTip() {
        }
        LabelTip.getInstance = function () {
            if (!LabelTip.instance) {
                LabelTip.instance = new LabelTip();
            }
            return LabelTip.instance;
        };
        return LabelTip;
    }());
    qmr.LabelTip = LabelTip;
    __reflect(LabelTip.prototype, "qmr.LabelTip");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var LabelUtil = (function () {
        function LabelUtil() {
        }
        LabelUtil.addInputListener = function (textInput, thisObject) {
            textInput.addEventListener(egret.FocusEvent.FOCUS_IN, LabelUtil.focusInTxtHandler, thisObject);
            textInput.addEventListener(egret.FocusEvent.FOCUS_OUT, LabelUtil.focusInTxtHandler, thisObject);
        };
        LabelUtil.removeInputListener = function (textInput, thisObject) {
            textInput.addEventListener(egret.FocusEvent.FOCUS_IN, LabelUtil.focusInTxtHandler, thisObject);
            textInput.addEventListener(egret.FocusEvent.FOCUS_OUT, LabelUtil.focusInTxtHandler, thisObject);
        };
        LabelUtil.focusInTxtHandler = function () {
            var inputFocus = function () {
                if (document && document.body) {
                    setTimeout(function () {
                        if (window.scrollTo) {
                            window.scrollTo(0, document.body.clientHeight);
                        }
                    }, 400);
                }
            };
            inputFocus();
        };
        return LabelUtil;
    }());
    qmr.LabelUtil = LabelUtil;
    __reflect(LabelUtil.prototype, "qmr.LabelUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * 实现一个简单的链表结构
     */
    var LinkedList = (function () {
        function LinkedList() {
            this.nodeLen = 0; //节点长度
        }
        /**
         * 添加一个节点
         */
        LinkedList.prototype.append = function (element) {
            var node = new LinkNode(element);
            var current;
            if (!this._head) {
                this._head = node;
            }
            else {
                current = this._head;
                while (current.next) {
                    current = current.next;
                }
                current.next = node; //放到链表尾
            }
            this.nodeLen += 1;
        };
        /**获取节点索引*/
        LinkedList.prototype.indexOf = function (element) {
            if (!this._head)
                return -1;
            var index = -1;
            var current = this._head;
            while (current) {
                index += 1;
                if (current.current === element) {
                    return index;
                }
                current = current.next;
            }
            return -1;
        };
        /**
         * 移除某个索引位置的节点
         */
        LinkedList.prototype.removeAt = function (pos) {
            if (!this._head)
                return;
            if (pos > -1 && pos < this.size) {
                if (pos == 0) {
                    this._head = this._head.next;
                }
                else {
                    var currentNode = this.getNodeAt(pos);
                    var prevNode = this.getNodeAt(pos - 1);
                    if (currentNode && prevNode) {
                        prevNode.next = currentNode.next;
                    }
                }
                this.nodeLen -= 1;
            }
        };
        /**
         * 获取某个索引下的节点
         */
        LinkedList.prototype.getNodeAt = function (index) {
            if (!this._head)
                return null;
            var current = this._head;
            var ind = -1;
            while (current) {
                ind += 1;
                if (ind === index) {
                    return current;
                }
                current = current.next;
            }
            return null;
        };
        Object.defineProperty(LinkedList.prototype, "head", {
            /**获取一个头节点*/
            get: function () {
                return this._head;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "size", {
            /**节点长度*/
            get: function () {
                return this.nodeLen;
            },
            enumerable: true,
            configurable: true
        });
        return LinkedList;
    }());
    qmr.LinkedList = LinkedList;
    __reflect(LinkedList.prototype, "qmr.LinkedList");
    /**
     * 链表中的节点
     */
    var LinkNode = (function () {
        function LinkNode(element) {
            this.current = element;
        }
        return LinkNode;
    }());
    qmr.LinkNode = LinkNode;
    __reflect(LinkNode.prototype, "qmr.LinkNode");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var LogUtil = (function () {
        function LogUtil() {
        }
        /**
         * @description 打印普通日志
         */
        LogUtil.log = function (msg) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            if (qmr.PlatformConfig.isDebug) {
                console.log.apply(console, [msg].concat(optionalParams));
            }
        };
        /** 保存并且打印日志 */
        LogUtil.saveLogAndShowLog = function (logKey, msg) {
            LogUtil.reportLogData["logKey"] = msg;
            egret.log(msg);
        };
        /**
         * @description 打印战斗日志
         */
        LogUtil.logF = function (msg) {
            if (qmr.GlobalConfig.isDebugF) {
                egret.log(msg);
            }
        };
        /**
         * @description 打印warn日志
         */
        LogUtil.warn = function (msg) {
            if (qmr.PlatformConfig.isDebug) {
                egret.warn(msg);
            }
        };
        /**
         * @description 打印error日志
         */
        LogUtil.error = function (msg) {
            if (qmr.PlatformConfig.isDebug) {
                egret.error(msg);
            }
        };
        /**  @description 打印Slow 添加的log日志, */
        LogUtil.slowLog = function (msg) {
            if (qmr.GlobalConfig.bIsShowSlowLog) {
                console.log(msg);
            }
        };
        LogUtil.errorLogUrl = "v1/artisan/uploadlog";
        LogUtil.reportLogData = {};
        return LogUtil;
    }());
    qmr.LogUtil = LogUtil;
    __reflect(LogUtil.prototype, "qmr.LogUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var MathUtil = (function () {
        function MathUtil() {
        }
        /**
         * 曼哈顿启发函数<br/>
         * 用此启发函数在八向寻路中找到的并不是最优路径,因为它的运算结果可能远远大于开始结点到目标结点的距离,
         * 但是此启发函数的运算速度非常快
         * @param x1 节点1x
         * @param y1 节点1y
         * @param x2 节点2x
         * @param y2 节点2y
         * @return
         *
         */
        MathUtil.manhattan = function (x1, y1, x2, y2) {
            return ((x1 > x2 ? x1 - x2 : x2 - x1)
                +
                    (y1 > y2 ? y1 - y2 : y2 - y1)) * 100;
        };
        /**
         * @description 获取两个对象之间的直线距离
         */
        MathUtil.distance = function (source, target) {
            if (target && source) {
                return Math.sqrt(Math.pow(source.x - target.x, 2) + Math.pow(source.y - target.y, 2));
            }
            return 0;
        };
        /**获取2点的角度 item -> ItemPre*/
        MathUtil.getAngle = function (itemPre, item) {
            var dx = item.x - itemPre.x;
            var dy = item.y - itemPre.y;
            return Math.atan2(dy, dx) * 180 / Math.PI;
        };
        /**
         * @description 比较两个64位的数字是否相等
         */
        MathUtil.equal = function (a, b) {
            if (a && b) {
                if (a["high"] && b["high"]) {
                    if (a.high == b.high && a.low == b.low) {
                        return true;
                    }
                }
                else {
                    if (a * 1000 / 1000 == b * 1000 / 1000) {
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         * @description 获取两个数之间的
         */
        MathUtil.randomCount = function (min, max) {
            return min + Math.round(Math.random() * (max - min));
        };
        /**
         * @description 获取目标对象相对源对象之间的方向,八方向
         */
        MathUtil.dir = function (source, target) {
            if (target) {
                if (Math.abs(target.y - source.y) < 10) {
                    if (target.x > source.x) {
                        return qmr.DirUtil.RIGHT;
                    }
                    else {
                        return qmr.DirUtil.LEFT;
                    }
                }
                else {
                    if (target.y < source.y) {
                        if (Math.abs(target.x - source.x) < 10) {
                            return qmr.DirUtil.UP;
                        }
                        else {
                            if (target.x > source.x) {
                                return qmr.DirUtil.RIGHT_UP;
                            }
                            else {
                                return qmr.DirUtil.LEFT_UP;
                            }
                        }
                    }
                    else {
                        if (Math.abs(target.x - source.x) < 10) {
                            return qmr.DirUtil.DOWN;
                        }
                        else {
                            if (target.x > source.x) {
                                return qmr.DirUtil.RIGHT_DOWN;
                            }
                            else {
                                return qmr.DirUtil.LEFT_DOWN;
                            }
                        }
                    }
                }
            }
            return 1;
        };
        //@description 定义几个随机点，用于温泉泡澡的ab区域游泳
        MathUtil.getRodomPos = function (area) {
            var arrayA = [[1040, 1122], [997, 1283], [870, 1033], [1124, 969], [1216, 1407]];
            var arrayB = [[1470, 1260], [1394, 1068], [1432, 1241], [1537, 1035,], [1473, 1308]];
            var array = (area == 1) ? arrayA : arrayB;
            var random = Math.round(Math.random() * (array.length - 1));
            return { x: array[random][0], y: array[random][1] };
        };
        /** 获得一定范围的高斯随机数 */
        MathUtil.getGaussianPoint = function (xRange, yRange) {
            var res = new egret.Point();
            res.x = Math.random() * (xRange / 2) + Math.random() * (xRange / 2);
            res.y = Math.random() * (yRange / 2) + Math.random() * (yRange / 2);
            return res;
        };
        return MathUtil;
    }());
    qmr.MathUtil = MathUtil;
    __reflect(MathUtil.prototype, "qmr.MathUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var Md5Util = (function () {
        function Md5Util() {
            this.hexcase = 0;
            /* hex output format. 0 - lowercase; 1 - uppercase        */
            this.b64pad = "";
        }
        /**
         * @description 获取单例
         */
        Md5Util.getInstance = function () {
            if (Md5Util.instance == null) {
                Md5Util.instance = new Md5Util();
            }
            return Md5Util.instance;
        };
        /* base-64 pad character. "=" for strict RFC compliance   */
        /*
         * These are the privates you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        Md5Util.prototype.hex_md5 = function (s) {
            return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s)));
        };
        Md5Util.prototype.b64_md5 = function (s) {
            return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s)));
        };
        Md5Util.prototype.any_md5 = function (s, e) {
            return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e);
        };
        Md5Util.prototype.hex_hmac_md5 = function (k, d) {
            return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)));
        };
        Md5Util.prototype.b64_hmac_md5 = function (k, d) {
            return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)));
        };
        Md5Util.prototype.any_hmac_md5 = function (k, d, e) {
            return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e);
        };
        /*
         * Perform a simple t-test to see if the VM is working
         */
        Md5Util.prototype.md5_vm_test = function () {
            return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
        };
        /*
         * Calculate the MD5 of a raw string
         */
        Md5Util.prototype.rstr_md5 = function (s) {
            return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
        };
        /*
         * Calculate the HMAC-MD5, of a key and some data (raw strings)
         */
        Md5Util.prototype.rstr_hmac_md5 = function (key, data) {
            var bkey = this.rstr2binl(key);
            if (bkey.length > 16)
                bkey = this.binl_md5(bkey, key.length * 8);
            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }
            var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
            return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
        };
        /*
         * Convert a raw string to a hex string
         */
        Md5Util.prototype.rstr2hex = function (input) {
            try {
                this.hexcase;
            }
            catch (e) {
                this.hexcase = 0;
            }
            var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F)
                    + hex_tab.charAt(x & 0x0F);
            }
            return output;
        };
        /*
         * Convert a raw string to a base-64 string
         */
        Md5Util.prototype.rstr2b64 = function (input) {
            try {
                this.b64pad;
            }
            catch (e) {
                this.b64pad = '';
            }
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16)
                    | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                    | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8)
                        output += this.b64pad;
                    else
                        output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
                }
            }
            return output;
        };
        /*
         * Convert a raw string to an arbitrary string encoding
         */
        Md5Util.prototype.rstr2any = function (input, encoding) {
            var divisor = encoding.length;
            var i, j, q, x, quotient;
            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }
            /*
             * Repeatedly perform a long division. The binary array forms the dividend,
             * the length of the encoding is the divisor. Once computed, the quotient
             * forms the dividend for the next step. All remainders are stored for later
             * use.
             */
            var full_length = Math.ceil(input.length * 8 /
                (Math.log(encoding.length) / Math.log(2)));
            var remainders = Array(full_length);
            for (j = 0; j < full_length; j++) {
                quotient = Array();
                x = 0;
                for (i = 0; i < dividend.length; i++) {
                    x = (x << 16) + dividend[i];
                    q = Math.floor(x / divisor);
                    x -= q * divisor;
                    if (quotient.length > 0 || q > 0)
                        quotient[quotient.length] = q;
                }
                remainders[j] = x;
                dividend = quotient;
            }
            /* Convert the remainders to the output string */
            var output = "";
            for (i = remainders.length - 1; i >= 0; i--)
                output += encoding.charAt(remainders[i]);
            return output;
        };
        /*
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */
        Md5Util.prototype.str2rstr_utf8 = function (input) {
            var output = "";
            var i = -1;
            var x, y;
            while (++i < input.length) {
                /* Decode utf-16 surrogate pairs */
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }
                /* Encode output as utf-8 */
                if (x <= 0x7F)
                    output += String.fromCharCode(x);
                else if (x <= 0x7FF)
                    output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
                else if (x <= 0xFFFF)
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
                else if (x <= 0x1FFFFF)
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            }
            return output;
        };
        /*
         * Encode a string as utf-16
         */
        Md5Util.prototype.str2rstr_utf16le = function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
            return output;
        };
        Md5Util.prototype.str2rstr_utf16be = function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
            return output;
        };
        /*
         * Convert a raw string to an array of little-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        Md5Util.prototype.rstr2binl = function (input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
            return output;
        };
        /*
         * Convert an array of little-endian words to a string
         */
        Md5Util.prototype.binl2rstr = function (input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
            return output;
        };
        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length.
         */
        Md5Util.prototype.binl_md5 = function (x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = this.safe_add(a, olda);
                b = this.safe_add(b, oldb);
                c = this.safe_add(c, oldc);
                d = this.safe_add(d, oldd);
            }
            return [a, b, c, d];
        };
        /*
         * These privates implement the four basic operations the algorithm uses.
         */
        Md5Util.prototype.md5_cmn = function (q, a, b, x, s, t) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
        };
        Md5Util.prototype.md5_ff = function (a, b, c, d, x, s, t) {
            return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        };
        Md5Util.prototype.md5_gg = function (a, b, c, d, x, s, t) {
            return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        };
        Md5Util.prototype.md5_hh = function (a, b, c, d, x, s, t) {
            return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        };
        Md5Util.prototype.md5_ii = function (a, b, c, d, x, s, t) {
            return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        };
        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        Md5Util.prototype.safe_add = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        Md5Util.prototype.bit_rol = function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        };
        return Md5Util;
    }());
    qmr.Md5Util = Md5Util;
    __reflect(Md5Util.prototype, "qmr.Md5Util");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * <p> <code>Pool</code> 是对象池类，用于对象的存储、重复使用。</p>
     * <p>合理使用对象池，可以有效减少对象创建的开销，避免频繁的垃圾回收，从而优化游戏流畅度。</p>
     */
    var Pool = (function () {
        function Pool() {
        }
        /**
         * 根据对象类型标识字符，获取对象池。
         * @param sign 对象类型标识字符。
         * @return 对象池。
         */
        Pool.getPoolBySign = function (sign) {
            return Pool._poolDic[sign] || (Pool._poolDic[sign] = []);
        };
        /**
         * 清除对象池的对象。
         * @param sign 对象类型标识字符。
         */
        Pool.clearBySign = function (sign) {
            if (Pool._poolDic[sign])
                Pool._poolDic[sign].length = 0;
        };
        /**
         * 返回类的唯一标识
         */
        Pool._getClassSign = function (cla) {
            var className = cla["name"];
            if (className == "" || className == undefined) {
                cla["name"] = className = this.getGID() + "";
            }
            return className;
        };
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则根据传入的类型，创建一个新的对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param cls 用于创建该类型对象的类。
         * @return 此类型标识的一个对象。
         */
        Pool.getItemByClass = function (sign, cls) {
            if (!this._poolDic[sign])
                return new cls();
            var pool = this.getPoolBySign(sign);
            if (pool && pool.length) {
                var rst = pool.pop();
                rst[this.POOLSIGN] = false;
            }
            else {
                rst = new cls();
            }
            return rst;
        };
        /**
         * 将对象放到对应类型标识的对象池中。
         * @param sign 对象类型标识字符。
         * @param item 对象。
         */
        Pool.recover = function (sign, item) {
            if (!item)
                return;
            if (item[this.POOLSIGN])
                return;
            item[this.POOLSIGN] = true;
            this.getPoolBySign(sign).push(item);
        };
        Pool.isInPool = function (item) {
            if (item && item[this.POOLSIGN])
                return true;
            return false;
        };
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则使用传入的创建此类型对象的函数，新建一个对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param createFun 用于创建该类型对象的方法。
         * @param caller this对象
         * @return 此类型标识的一个对象。
         */
        Pool.getItemByCreateFun = function (sign, createFun, caller) {
            if (caller === void 0) { caller = null; }
            var pool = this.getPoolBySign(sign);
            var rst = pool.length ? pool.pop() : createFun.call(caller);
            rst[this.POOLSIGN] = false;
            return rst;
        };
        /**
         * 根据传入的对象类型标识字符，获取对象池中已存储的此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         * @param sign 对象类型标识字符。
         * @return 对象池中此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         */
        Pool.getItem = function (sign) {
            var pool = this.getPoolBySign(sign);
            var rst = pool.length ? pool.pop() : null;
            if (rst) {
                rst[this.POOLSIGN] = false;
            }
            return rst;
        };
        /**获取一个全局唯一ID。*/
        Pool.getGID = function () {
            return this._gid++;
        };
        /**@private 唯一标志 */
        Pool.POOLSIGN = "__InPool";
        /**@private  对象存放池。*/
        Pool._poolDic = {};
        /**@private */
        Pool._gid = 1;
        return Pool;
    }());
    qmr.Pool = Pool;
    __reflect(Pool.prototype, "qmr.Pool");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var ResPathUtil = (function () {
        function ResPathUtil() {
        }
        /** 获取bg图路径 */
        ResPathUtil.getBgUrl = function (resName) {
            return qmr.SystemPath.bgPath + resName + ".png";
        };
        /** 地图资源路径 */
        ResPathUtil.getMapUrl = function (mapName) {
            return qmr.SystemPath.mapPath + mapName + ".jpg";
        };
        return ResPathUtil;
    }());
    qmr.ResPathUtil = ResPathUtil;
    __reflect(ResPathUtil.prototype, "qmr.ResPathUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * @description 系统设置的一个工具类
     */
    var SettingUtil = (function () {
        function SettingUtil() {
            this.sVariantType = 0;
            var flag = egret.localStorage.getItem(qmr.PlatformConfig.channelId + "zgmrsetting" + qmr.GlobalConfig.userId);
            if (flag && flag != "undefined") {
                this.sVariantType = parseInt(flag);
            }
        }
        /**
         * @description 获取单例对象
         */
        SettingUtil.getInstance = function () {
            if (SettingUtil.instance == null) {
                SettingUtil.instance = new SettingUtil();
            }
            return SettingUtil.instance;
        };
        /**
         * @description 根据类型获取是否是屏蔽状态
         */
        SettingUtil.prototype.getForbidState = function (bit) {
            return qmr.BitUtil.checkAvalibe(this.sVariantType, bit);
        };
        /**
         * @description 设置某一位的屏蔽状态
         */
        SettingUtil.prototype.setForbidState = function (bit, value) {
            this.sVariantType = qmr.BitUtil.changeBit(this.sVariantType, bit, value);
            egret.localStorage.setItem(qmr.PlatformConfig.channelId + "zgmrsetting" + qmr.GlobalConfig.userId, this.sVariantType + "");
        };
        return SettingUtil;
    }());
    qmr.SettingUtil = SettingUtil;
    __reflect(SettingUtil.prototype, "qmr.SettingUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var StageUtil = (function () {
        function StageUtil() {
        }
        Object.defineProperty(StageUtil, "stageWidth", {
            /**
             * @description 获取舞台宽度
             */
            get: function () {
                return StageUtil.stage.stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageUtil, "stageHeight", {
            /**
             * @description 获取舞台高度
             */
            get: function () {
                return StageUtil.stage.stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
         * @param value 设置舞台帧频
         */
        StageUtil.setStageFrameRate = function (value) {
            StageUtil.stage.frameRate = value;
        };
        StageUtil.getStageFrameRate = function () {
            return StageUtil.stage.frameRate;
        };
        StageUtil.init = function (stage) {
            StageUtil.stage = stage;
            var t = StageUtil;
            t.maxStageWidth = Math.floor(t.DESIGN_HEIGHT / t.MIN_HW_RATIO);
            t.maxStageHeight = Math.floor(t.DESIGN_WIDTH * t.MAX_HW_RATIO);
            t.setStageFrameRate(t.FRAME_RATE);
            if (qmr.PlatformManager.instance.platform.canResizeStage) {
                t.changeStageSize();
                window.addEventListener("resize", t.changeStageSize);
            }
        };
        /**
         * @description 注册舞台事件
         */
        StageUtil.changeStageSize = function () {
            var t = StageUtil;
            var updateStageScaleMode = function () {
                var scaleMode = "";
                var contentWidth = 0;
                var contentHeight = 0;
                var hwRatio = window.innerHeight / window.innerWidth;
                if (hwRatio >= t.MAX_HW_RATIO) {
                    scaleMode = egret.StageScaleMode.SHOW_ALL;
                    contentWidth = t.DESIGN_WIDTH;
                    contentHeight = t.maxStageHeight;
                }
                else if (hwRatio >= t.STANDARD_RATIO) {
                    scaleMode = egret.StageScaleMode.FIXED_WIDTH;
                    contentWidth = t.DESIGN_WIDTH;
                    contentHeight = t.DESIGN_HEIGHT;
                }
                else if (hwRatio > t.MIN_HW_RATIO) {
                    scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
                    contentWidth = t.DESIGN_WIDTH;
                    contentHeight = t.DESIGN_HEIGHT;
                }
                else {
                    scaleMode = egret.StageScaleMode.SHOW_ALL;
                    contentWidth = t.maxStageWidth;
                    contentHeight = t.DESIGN_HEIGHT;
                }
                // console.log("舞台 scaleMode=" + scaleMode + " contentWidth=" + contentWidth + " contentHeight=" + contentHeight);
                t.stage.scaleMode = scaleMode;
                t.stage.setContentSize(contentWidth, contentHeight);
                qmr.NotifyManager.sendNotification(StageUtil.STAGE_RESIZE);
            };
            updateStageScaleMode();
            if (egret.Capabilities.os.toUpperCase() == "IOS") {
                egret.setTimeout(updateStageScaleMode, this, 100);
            }
            // console.log("舞台 stageWidth=" + StageUtil.stageWidth + " stageHeight" + StageUtil.stageHeight);
        };
        /**
         * @description 操作stage的舞台可点事件和非可点事件
         */
        StageUtil.stageEnable = function (value) {
            if (this.stage) {
                this.stage.touchChildren = value;
            }
        };
        /**
         * 是否是电脑登录
         */
        StageUtil.isPC = function () {
            var userAgentInfo = navigator.userAgent.toString();
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        };
        /**游戏帧频 */
        StageUtil.FRAME_RATE = 60;
        StageUtil.STAGE_RESIZE = "stage_resize"; //舞台尺寸发生变化
        StageUtil.STAGE_ACTIVE = "stage_active"; //当舞台获得焦点
        StageUtil.STAGE_DEACTIVATE = "stage_deactivate"; //当舞台失去焦点
        StageUtil.DESIGN_WIDTH = 750; //舞台默认宽度
        StageUtil.DESIGN_HEIGHT = 1334; //舞台默认高度
        StageUtil.STANDARD_RATIO = 1.78; //标准比例
        /**可适配的最大高宽比，值会与平台配置文件覆盖，但当配置值大于默认值时使用默认值 */
        StageUtil.MAX_HW_RATIO = 2.16;
        /**可适配的最小高宽比，值会被平台配置文件覆盖，但当配置值小于默认值时使用默认值 */
        StageUtil.MIN_HW_RATIO = 1.333;
        StageUtil.maxStageWidth = 0;
        StageUtil.maxStageHeight = 0;
        return StageUtil;
    }());
    qmr.StageUtil = StageUtil;
    __reflect(StageUtil.prototype, "qmr.StageUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var StringUtilsBase = (function () {
        function StringUtilsBase() {
        }
        /**
         * {0}{1}....
         *
         */
        StringUtilsBase.getmsg = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            var s = arg.shift();
            for (var key in arg) {
                var value = arg[key];
                s = s.replace(/\{\d+\}/, value);
            }
            return s;
        };
        return StringUtilsBase;
    }());
    qmr.StringUtilsBase = StringUtilsBase;
    __reflect(StringUtilsBase.prototype, "qmr.StringUtilsBase");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     *
     * @description 系统路径类枚举
     *
     */
    var SystemPath = (function () {
        function SystemPath() {
        }
        Object.defineProperty(SystemPath, "loginPath", {
            get: function () {
                return qmr.PlatformConfig.webRoot + "resourceLogin/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SystemPath, "mapPath", {
            get: function () {
                return qmr.PlatformConfig.webRoot + "map/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SystemPath, "defaultPath", {
            get: function () {
                return "resourceLogin/animation/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SystemPath, "rolePath", {
            get: function () {
                return qmr.PlatformConfig.webRoot + "animation/role/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SystemPath, "roleUiPath", {
            get: function () {
                return qmr.PlatformConfig.webRoot + "animation/uiRole/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SystemPath, "bgPath", {
            get: function () {
                return qmr.PlatformConfig.webRoot + "unpack/bg/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SystemPath, "weaponPath", {
            get: function () {
                return qmr.PlatformConfig.webRoot + "animation/weapon/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SystemPath, "horsePath", {
            get: function () {
                return qmr.PlatformConfig.webRoot + "animation/horse/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SystemPath, "wingPath", {
            get: function () {
                return qmr.PlatformConfig.webRoot + "animation/wing/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SystemPath, "bg_music", {
            get: function () {
                return qmr.PlatformConfig.webRoot + "sound/music/";
            },
            enumerable: true,
            configurable: true
        });
        SystemPath.getEffect_musicUrl = function (musicName) {
            var dirUrl = qmr.PlatformConfig.webRoot + "sound/effect/";
            return dirUrl + musicName + ".mp3";
        };
        Object.defineProperty(SystemPath, "itemIcon", {
            get: function () {
                return qmr.PlatformConfig.webRoot + "icon/item/";
            },
            enumerable: true,
            configurable: true
        });
        return SystemPath;
    }());
    qmr.SystemPath = SystemPath;
    __reflect(SystemPath.prototype, "qmr.SystemPath");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /**
     * 功能：文本框显示宽度固定。
     * 根据字符数量控制文本框的宽度和scale
     */
    var TextFixWidthUtil = (function () {
        function TextFixWidthUtil() {
        }
        TextFixWidthUtil.getInstance = function () {
            if (this._instance == null) {
                this._instance = new TextFixWidthUtil();
            }
            return this._instance;
        };
        TextFixWidthUtil.prototype.strlen = function (str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                //单字节加1   
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    len++;
                }
                else {
                    len += 2;
                }
            }
            return len;
        };
        TextFixWidthUtil.prototype.fixTextBox = function (fixWidth, label) {
            if (label.textWidth > fixWidth) {
                var scale = (fixWidth) / label.textWidth;
                label.width = Math.ceil(label.textWidth);
                label.scaleX = scale;
                return true;
            }
            return false;
        };
        return TextFixWidthUtil;
    }());
    qmr.TextFixWidthUtil = TextFixWidthUtil;
    __reflect(TextFixWidthUtil.prototype, "qmr.TextFixWidthUtil");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    var TickTool = (function () {
        /**
         * label 更改的文本
         * des 描述
         * thisObj 对象
         */
        function TickTool(label, des, thisObj) {
            if (label === void 0) { label = null; }
            if (des === void 0) { des = null; }
            this.label = label;
            this.des = des;
            this.thisObj = thisObj;
        }
        /** 按钮描述 */
        TickTool.prototype.setDes = function (des) {
            this.des = des;
        };
        TickTool.prototype.startTick = function (count, gap) {
            if (gap === void 0) { gap = 1000; }
            this.runing = true;
            this.count = count;
            qmr.Ticker.getInstance().registerTick(this.tick, this, gap);
            this.showMsg();
        };
        TickTool.prototype.tick = function () {
            if (this.count-- < 1) {
                this.stopTick();
                if (this.backFun) {
                    this.backFun.call(this.thisObj);
                }
                return;
            }
            if (this.updateFun) {
                this.updateFun.call(this.thisObj);
            }
            this.showMsg();
        };
        TickTool.prototype.showMsg = function () {
            if (this.label) {
                if (this.des) {
                    this.label.text = qmr.CommonTool.getMsg(this.des, this.count);
                }
            }
            if (this.btn) {
                if (this.des) {
                    this.btn.label = qmr.CommonTool.getMsg(this.des, this.count);
                }
            }
        };
        TickTool.prototype.stopTick = function () {
            if (!this.runing) {
                return;
            }
            this.runing = false;
            qmr.Ticker.getInstance().unRegisterTick(this.tick, this);
        };
        return TickTool;
    }());
    qmr.TickTool = TickTool;
    __reflect(TickTool.prototype, "qmr.TickTool");
})(qmr || (qmr = {}));
var qmr;
(function (qmr) {
    /*
    * name;
    */
    var TimeUtil = (function () {
        function TimeUtil() {
        }
        /**
         * 获取服务器时间，返回当前秒数(本机时间，所有活动计算时差请用getZoneOffsetSeverSecond方法)
         * @return
         *
         */
        TimeUtil.getServerSecond = function () {
            return Math.floor((egret.getTimer() + this.tickOffset) / 1000);
        };
        Object.defineProperty(TimeUtil, "serverTime", {
            /**
             *  获取服务器时间，返回毫秒
             * @return
             */
            get: function () {
                return (egret.getTimer() + this.tickOffset);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获得服务器Unix时间，返回Date
         */
        TimeUtil.getSeverDate = function () {
            return (new Date(this.getServerSecond() * 1000));
        };
        /**
         * 获得服务器显示时间
         */
        TimeUtil.getZoneOffsetSeverDate = function () {
            return new Date(this.getZoneOffsetSeverSecond() * 1000);
        };
        /**
         * 获得服务器，显示秒
         */
        TimeUtil.getZoneOffsetSeverSecond = function () {
            return this.getServerSecond();
        };
        TimeUtil.syncServerTime = function (timeStamp) {
            this.tickOffset = timeStamp - egret.getTimer();
            // console.log("tickOffset:",this.tickOffset);
            // console.log("serverTime:",new Date(timeStamp).toString());
            // console.log("ServerSecond:",this.getServerSecond());
        };
        /**
         * 根据时间返回字符串时间
         * */
        TimeUtil.getTimeBySecond = function (second) {
            var str = "";
            if (second >= 60) {
                str = this.dateStringFillZero(Math.floor(second / 60)) + ":";
            }
            str += this.dateStringFillZero(Math.floor(second % 60));
            return str;
        };
        TimeUtil.getDateByTimer = function (time) {
            if (!TimeUtil.date) {
                TimeUtil.date = new Date();
            }
            TimeUtil.date.setTime(time);
            var year = TimeUtil.date.getFullYear();
            var month = TimeUtil.date.getMonth() + 1;
            var day = TimeUtil.date.getDate();
            var hour = TimeUtil.date.getHours();
            var min = TimeUtil.date.getMinutes();
            var sec = TimeUtil.date.getSeconds();
            var monthStr = month < 10 ? ("0" + month) : month.toString();
            var dayStr = day < 10 ? ("0" + day) : day.toString();
            var hourStr = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr = min < 10 ? ("0" + min) : min.toString();
            var secStr = sec < 10 ? ("0" + sec) : sec.toString();
            return year + "-" + month + "-" + day + " " + hourStr + ":" + minStr + ":" + secStr;
        };
        /**
         * 根据时间戳返回字符串 xxxx-xx-xx 00:00:00
         * @time 秒
         */
        TimeUtil.getDateByTimerSecond = function (time) {
            return TimeUtil.getDateByTimer(time * 1000);
        };
        /**
         * 获取当前时间到明天00:00:00还有多少秒
         */
        TimeUtil.getDayOverTime = function () {
            var date = this.getSeverDate();
            var toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
            return (toDate.getTime() - date.getTime()) / 1000;
        };
        /**
         * 获取当前时间点
         */
        TimeUtil.getDayTime = function () {
            var date = this.getSeverDate();
            var toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return (date.getTime() - toDate.getTime()) / 1000;
        };
        /**
         * 转换成今天的时间点
         */
        TimeUtil.getTimeToNow = function (time) {
            var date = new Date(time);
            var toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return (date.getTime() - toDate.getTime()) / 1000;
        };
        /**
         * 根据时间返回字符串 00:00:00
         */
        TimeUtil.formatDate = function (date) {
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getMilliseconds();
            var hourStr = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr = min < 10 ? ("0" + min) : min.toString();
            var secStr = sec < 10 ? ("0" + sec) : sec.toString();
            return hourStr + ":" + minStr + ":" + secStr;
        };
        /**
         * 根据时间返回字符串 00:00:00,超过24小时，只会显示超过的时间
         */
        TimeUtil.formatTime = function (second) {
            var hour = Math.floor(second / 60 / 60) % 24;
            var min = Math.floor(second / 60) % 60;
            var sec = Math.floor(second % 60);
            var hourStr = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr = min < 10 ? ("0" + min) : min.toString();
            var secStr = sec < 10 ? ("0" + sec) : sec.toString();
            return hourStr + ":" + minStr + ":" + secStr;
        };
        /**
         * 根据时间返回字符串 00:00:00
         */
        TimeUtil.formatTime1 = function (second) {
            var hour = Math.floor(second / 60 / 60);
            var min = Math.floor(second / 60) % 60;
            var sec = Math.floor(second % 60);
            var hourStr = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr = min < 10 ? ("0" + min) : min.toString();
            var secStr = sec < 10 ? ("0" + sec) : sec.toString();
            return hourStr + ":" + minStr + ":" + secStr;
        };
        /**
         * 小时分钟
         * @param second
         * @return
         */
        TimeUtil.formatTime4 = function (second) {
            var hour = Math.floor(second / 60 / 60) % 24;
            var min = Math.floor(second / 60) % 60;
            var hourStr = hour < 10 ? ("" + hour) : hour.toString();
            var minStr = min < 10 ? ("" + min) : min.toString();
            return hourStr + this.CN_HOUR + minStr + this.CN_MIN;
        };
        /**
             *根据时间返回字符串 00分00秒
         */
        TimeUtil.formatTime5 = function (second) {
            var hour = Math.floor(second / 60 / 60) % 24;
            var min = Math.floor(second / 60) % 60;
            var sec = Math.floor(second % 60);
            var hourStr = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr = min < 10 ? ("0" + min) : min.toString();
            var secStr = sec < 10 ? ("0" + sec) : sec.toString();
            if (hour > 0) {
                return hourStr + this.CN_HOUR + minStr + this.CN_MIN + secStr + this.CN_SEC;
            }
            return minStr + this.CN_MIN + " " + secStr + this.CN_SEC;
        };
        /**
         * 根据时间返回字符串 00:00
         */
        TimeUtil.formatTime2 = function (second) {
            var min = Math.floor(second / 60) % 60;
            var sec = Math.floor(second % 60);
            var minStr = min < 10 ? ("0" + min) : min.toString();
            var secStr = sec < 10 ? ("0" + sec) : sec.toString();
            return (minStr + ":" + secStr);
        };
        /**
         * 根据时间返回字符串 00:00:00
         */
        TimeUtil.formatTime3 = function (second) {
            var day = Math.floor(second / 60 / 60 / 24);
            var hour = Math.floor(second / 60 / 60) % 24 + day * 24;
            var min = Math.floor(second / 60) % 60;
            var sec = Math.floor(second % 60);
            var hourStr = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr = min < 10 ? ("0" + min) : min.toString();
            var secStr = sec < 10 ? ("0" + sec) : sec.toString();
            return hourStr + ":" + minStr + ":" + secStr;
        };
        /**
         * 根据时间返回字符串 xx分xx秒
         */
        TimeUtil.formatTime6 = function (second) {
            var min = Math.floor(second / 60) % 60;
            var sec = Math.floor(second % 60);
            var minStr = min < 10 ? ("0" + min) : min.toString();
            var secStr = sec < 10 ? ("0" + sec) : sec.toString();
            return (minStr + "分" + secStr + "秒");
        };
        /** 00:00 一天当中的多少小时分钟 */
        TimeUtil.formatTime7 = function (second) {
            var date = new Date(second);
            var min = date.getMinutes();
            var hour = date.getHours();
            var hourStr = hour < 10 ? ("0" + hour) : hour.toString();
            var minStr = min < 10 ? ("0" + min) : min.toString();
            return hourStr + ":" + minStr;
        };
        /**
         * 格式化数据网格列日期 MM-DD JJ:NN
         */
        TimeUtil.formatColumnDate = function (tempDate) {
            var m = ((tempDate.getMonth() + 1 < 10) ? "0" : "") + (tempDate.getMonth() + 1);
            var day = ((tempDate.getDate() < 10) ? "0" : "") + tempDate.getDate();
            var rect = "";
            rect += m + "-" + day + " ";
            rect += ((tempDate.getHours() < 10) ? "0" : "") + tempDate.getHours();
            rect += ":";
            rect += ((tempDate.getMinutes() < 10) ? "0" : "") + tempDate.getMinutes();
            return rect;
        };
        /**
         *
         * @param date
         * @return
         * 2012/12/12 12:12
         */
        TimeUtil.formatDate1 = function (date) {
            var year = date.getFullYear().toString();
            var month = ((date.getMonth() + 1 < 10) ? "0" : "") + (date.getMonth() + 1);
            var day = ((date.getDate() < 10) ? "0" : "") + date.getDate();
            var hour = date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours().toString();
            var min = date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes().toString();
            return year + "/" + month + "/" + day + " " + hour + ":" + min;
        };
        /**
         * XX年XX月XX日
         */
        TimeUtil.formatYMD = function (date) {
            var time = date.getFullYear() + this.CN_YEAR
                + (date.getMonth() + 1) + this.CN_MONTH
                + date.getDate() + this.CN_SUN;
            return time;
        };
        /**
         * 显示时间（英文格式）月/日/年
         * @return
         */
        TimeUtil.formatYMDForEn = function (date) {
            var time = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
            return time;
        };
        /**
         * 年/月/日（例：2012/12/12）
         */
        TimeUtil.formatYMD1 = function (date) {
            var time = date.getFullYear() + "/"
                + (date.getMonth() + 1) + "/"
                + date.getDate() + "/";
            return time;
        };
        /**
         * XX天XX时XX分XX秒
         */
        TimeUtil.formatRemain = function (second) {
            var day = Math.floor(second / 60 / 60 / 24);
            var hour = Math.floor(second / 60 / 60) % 24;
            var min = Math.floor(second / 60) % 60;
            var sec = Math.floor(second % 60);
            return day + this.CN_DAY + " " + hour + this.CN_HOUR + " " + min + this.CN_MIN + " " + sec + this.CN_SEC;
        };
        /**
         * XX天XX时XX分
         */
        TimeUtil.formatRemain1 = function (second) {
            var day = Math.floor(second / 60 / 60 / 24);
            var hour = Math.floor(second / 60 / 60) % 24;
            var min = Math.floor(second / 60) % 60;
            return day + this.CN_DAY + hour + this.CN_HOUR + min + this.CN_MIN;
        };
        TimeUtil.formatRemain3 = function (second) {
            var hour = Math.floor(second / 60 / 60) % 24;
            var min = Math.floor(second / 60) % 60;
            return hour + " " + this.CN_HOUR + " " + min + " " + this.CN_MIN;
        };
        /**
         *
         * @param second
         * @return [day,hour,min]
         *
         */
        TimeUtil.formatRemain2 = function (second) {
            var day = Math.floor(second / 60 / 60 / 24);
            var hour = Math.floor(second / 60 / 60) % 24;
            var min = Math.floor(second / 60) % 60;
            var sec = Math.floor(second % 60);
            return [day, hour, min];
        };
        /**
         * 返回不为0的格式
         */
        TimeUtil.formatRemain4 = function (second) {
            var str = "";
            var getZeroize = TimeUtil.getZeroize;
            var day = Math.floor(second / 60 / 60 / 24);
            if (day != 0) {
                str += getZeroize(day) + this.CN_DAY;
            }
            var hour = Math.floor(second / 60 / 60) % 24;
            if (hour != 0) {
                str += getZeroize(hour) + this.CN_HOUR;
            }
            var min = Math.floor(second / 60) % 60;
            if (min != 0) {
                str += getZeroize(min) + this.CN_MIN;
            }
            var sec = Math.floor(second % 60);
            if (sec != 0) {
                str += getZeroize(sec) + this.CN_SEC;
            }
            return str;
        };
        /**
         * xxd,xxh,xxm,xxs
         */
        TimeUtil.formatRemain5 = function (second) {
            var day = Math.floor(second / 60 / 60 / 24);
            if (day != 0) {
                return day + "d";
            }
            var hour = Math.floor(second / 60 / 60) % 24;
            if (hour != 0) {
                return hour + "h";
            }
            var min = Math.floor(second / 60) % 60;
            if (min != 0) {
                return min + "m";
            }
            var sec = Math.floor(second % 60);
            if (sec != 0) {
                return sec + "s";
            }
            return "";
        };
        /**
         *  xd 00:00:00
         */
        TimeUtil.formatRemain6 = function (second) {
            var str = "";
            var getZeroize = TimeUtil.getZeroize;
            var day = Math.floor(second / 60 / 60 / 24);
            if (day != 0) {
                str += day + this.CN_DAY + " ";
            }
            var hour = Math.floor(second / 60 / 60) % 24;
            if (hour != 0) {
                str += getZeroize(hour) + ":";
            }
            else {
                str += "00" + ":";
            }
            var min = Math.floor(second / 60) % 60;
            if (min != 0) {
                str += getZeroize(min) + ":";
            }
            else {
                str += "00" + ":";
            }
            var sec = Math.floor(second % 60);
            if (sec != 0) {
                str += getZeroize(sec);
            }
            else {
                str += "00";
            }
            return str;
        };
        /**
         *  xd 00:00:00 / 00:00
         */
        TimeUtil.formatRemain7 = function (second) {
            var str = "";
            var getZeroize = TimeUtil.getZeroize;
            var day = Math.floor(second / 60 / 60 / 24);
            if (day != 0) {
                str += day + this.CN_DAY + " ";
            }
            var hour = Math.floor(second / 60 / 60) % 24;
            if (hour != 0) {
                str += getZeroize(hour) + ":";
            }
            var min = Math.floor(second / 60) % 60;
            if (min != 0) {
                str += getZeroize(min) + ":";
            }
            else {
                str += "00" + ":";
            }
            var sec = Math.floor(second % 60);
            if (sec != 0) {
                str += getZeroize(sec);
            }
            else {
                str += "00";
            }
            return str;
        };
        /**
         * 返回不为0的格式X天X小时X分钟X秒
         */
        TimeUtil.formatRemain8 = function (second) {
            var str = "";
            var getZeroize = TimeUtil.getZeroize;
            var day = Math.floor(second / 60 / 60 / 24);
            if (day != 0) {
                str += day + this.CN_DAY;
            }
            var hour = Math.floor(second / 60 / 60) % 24;
            if (hour != 0) {
                str += hour + this.CN_HOUR;
            }
            var min = Math.floor(second / 60) % 60;
            if (min != 0) {
                str += min + this.CN_MIN + "钟";
            }
            var sec = Math.floor(second % 60);
            if (sec != 0) {
                str += sec + this.CN_SEC;
            }
            return str;
        };
        /**
         * 00:00:00
         */
        TimeUtil.formatRemainForEn = function (second) {
            var day = Math.floor(second / 60 / 60 / 24);
            var hour = Math.floor(second / 60 / 60) % 24;
            var totalH = (day * 24 + hour);
            var min = Math.floor(second / 60) % 60;
            var sec = Math.floor(second % 60);
            var hourStr = totalH < 10 ? ("0" + totalH) : totalH.toString();
            var minStr = min < 10 ? ("0" + min) : min.toString();
            var secStr = sec < 10 ? ("0" + sec) : sec.toString();
            return hourStr + ":" + minStr + ":" + secStr;
        };
        /**
         * 获取两个时间之间的相差（天、时、分、秒）
         * @param time1:Number 时间1(ms)
         * @param time2:Number 时间2(ms)
         * @return Array = [天,时,分,秒]
         */
        TimeUtil.getTimeDifference = function (time1, time2) {
            var res = [0, 0, 0, 0];
            var val = time2 - time1;
            res[0] = Math.floor(val / 86400000);
            res[1] = Math.floor(val % 86400000 / 3600000);
            res[2] = Math.floor(val % 86400000 % 3600000 / 60000);
            res[3] = Math.floor(val % 86400000 % 3600000 % 60000 / 1000);
            return res;
        };
        TimeUtil.prototype.timeStrToDate = function (timeStr) {
            var arr = timeStr.split(" ");
            var yearArr = (arr[0]).split("-");
            var timeArr = (arr[1]).split("-");
            var date = new Date(yearArr[0], yearArr[1], yearArr[2], timeArr[0], timeArr[1], timeArr[2]);
            return date;
        };
        /**
         * 不够两位的补零
         */
        TimeUtil.dateStringFillZero = function (num) {
            return (num >= 10 ? ((num * 0.1) >> 0).toString() : "0") + (num % 10).toString();
        };
        TimeUtil.gettodayTimeByHour = function (hour) {
            var data = this.getZoneOffsetSeverDate();
            data.setHours(hour);
            data.setMinutes(0);
            data.setSeconds(0);
            return data.getTime() / 1000;
        };
        /**
         * 获取时分秒
         * @param _second
         * @return
         *
         */
        TimeUtil.changeServerTimeToSeconds = function (_second) {
            var date = new Date(_second);
            var seconds = (date.getHours() * 3600) + (date.getMinutes() * 60) + date.getSeconds();
            return seconds;
        };
        /**
         * 将当日时间(非时间戳)转为毫秒
         * @param hours 小时
         * @param minutes 分钟
         * @param seconds 秒
         * @return 当日时间毫秒数
         */
        TimeUtil.timeToMilSeconds = function (hours, minutes, seconds) {
            if (hours === void 0) { hours = 0; }
            if (minutes === void 0) { minutes = 0; }
            if (seconds === void 0) { seconds = 0; }
            var time = (hours * 3600 + minutes * 60 + seconds) * 1000;
            return time;
        };
        /**
         * 获取一个指定月日时分秒时间戳（毫秒）
         */
        TimeUtil.getTimeStamp2 = function (month, day, hours, minutes, seconds) {
            if (month === void 0) { month = 0; }
            if (day === void 0) { day = 0; }
            if (hours === void 0) { hours = 0; }
            if (minutes === void 0) { minutes = 0; }
            if (seconds === void 0) { seconds = 0; }
            var date = new Date(TimeUtil.serverTime);
            date.setMonth(month - 1);
            date.setDate(day);
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(seconds);
            date.setMilliseconds(0);
            return date.getTime();
        };
        /**
         * 获取一个指定年月日时分秒时间戳（毫秒）
         */
        TimeUtil.getTimeStamp3 = function (year, month, day, hours, minutes, seconds) {
            if (year === void 0) { year = 0; }
            if (month === void 0) { month = 0; }
            if (day === void 0) { day = 0; }
            if (hours === void 0) { hours = 0; }
            if (minutes === void 0) { minutes = 0; }
            if (seconds === void 0) { seconds = 0; }
            var date = new Date();
            date.setFullYear(year);
            date.setMonth(month - 1);
            date.setDate(day);
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(seconds);
            date.setMilliseconds(0);
            return date.getTime();
        };
        /**
         * 获取当前服务器时间是周几
         */
        TimeUtil.getCurDay = function () {
            var date = new Date(TimeUtil.serverTime);
            var day = date.getDay();
            if (day == 0)
                day = 7;
            return day;
        };
        /**
        * 获取指定时 分 服务器所在的时间戳(毫秒)
        * @param hour
        * @param minutes
        */
        TimeUtil.getTimeStamp = function (hour, minutes) {
            var date = new Date(TimeUtil.serverTime);
            date.setHours(hour);
            date.setMinutes(minutes);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date.getTime();
        };
        /**
         * 获取距离当前时间间隔天数的时间戳
         */
        TimeUtil.getDayTimeStamp = function (addDay) {
            var timeStamp = TimeUtil.serverTime + addDay * 24 * 60 * 60 * 1000;
            return timeStamp;
        };
        /**
        * 获取指定时 分 指定时间点所在的时间戳(毫秒)
        * @param hour
        * @param minutes
        */
        TimeUtil.getTimeStampByTime = function (timeStamp, hour, minutes) {
            var date = new Date(timeStamp);
            date.setHours(hour);
            date.setMinutes(minutes);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date.getTime();
        };
        /**
         *获取日期之间相距的天数
         * @param startDate
         * @param endDate
         * @return
         *
         */
        TimeUtil.getBetweenDays = function (endTime, startTime) {
            return this.getTotalDaysByTime(endTime) - this.getTotalDaysByTime(startTime);
        };
        /**
        *获取经过的总天数。距离 1970 年 1 月 1 日
        * @param date
        * @return
        *
        */
        TimeUtil.getTotalDays = function (date) {
            var localTimeZone = -8;
            return Math.floor(date.getTime() - localTimeZone * 60 * 60 * 1000) / (24 * 60 * 60 * 1000);
        };
        /**
         *获取经过的总天数。距离 1970 年 1 月 1 日
         * @param time	毫秒级时间
         * @return
         *
         */
        TimeUtil.getTotalDaysByTime = function (time) {
            var localTimeZone = -8;
            return Math.floor((time - localTimeZone * 60 * 60 * 1000) / (24 * 60 * 60 * 1000));
        };
        /**
         * 把一个时间戳转化为年月日
         */
        TimeUtil.getTimeNoHourSecond = function (time) {
            var date = new Date(time);
            var toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return toDate.getTime();
        };
        /** 不足两位补0 */
        TimeUtil.getZeroize = function (time) {
            return (time < 10) ? "0" + time : time + "";
        };
        /** 去掉小时，分，秒今天的时间戳 */
        TimeUtil.getTodayStartTime = function () {
            return TimeUtil.getTimeNoHourSecond(TimeUtil.serverTime);
        };
        /**
         * 时间格式拆分返回
         * timeStr  --"2018-10-19 19:07:00"
         */
        TimeUtil.getTimesplit = function (timeStr) {
            var timeObj = {};
            var timeArr = timeStr.split(" ");
            var timeStr1 = timeArr[0];
            var timeStr2 = timeArr[1];
            var timeStr1Arr = timeStr1.split("-");
            timeObj["year"] = parseInt(timeStr1Arr[0]);
            timeObj["month"] = parseInt(timeStr1Arr[1]);
            timeObj["day"] = parseInt(timeStr1Arr[2]);
            var timeStr2Arr = timeStr2.split(":");
            timeObj["hour"] = parseInt(timeStr2Arr[0]);
            timeObj["minute"] = parseInt(timeStr2Arr[1]);
            timeObj["second"] = parseInt(timeStr2Arr[2]);
            return timeObj;
        };
        /**
         * 获取今天凌晨的时间戳（昨晚12点）
         */
        TimeUtil.fun10 = function () {
            var today = new Date();
            return today.getTime() - today.getHours() * 60 * 60 * 1000 - today.getMinutes() * 60 * 1000 - today.getSeconds() * 1000 - today.getMilliseconds();
        };
        /** 根据年月日获取星期几 0表示星期日,1表示星期一*/
        TimeUtil.getWeekByTime = function (year, month, day) {
            if (month == 1 || month == 2) {
                month += 12;
                --year;
            }
            var week = (day + 2 * month + Math.floor(3 * (month + 1) / 5) + year +
                Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) + 1) % 7;
            return week;
        };
        /** 根据年月日获取星期几 0表示星期日,1表示星期一*/
        TimeUtil.getWeekByTimeStr = function (year, month, day) {
            var week = TimeUtil.getWeekByTime(year, month, day);
            var weekStr = "";
            switch (week) {
                case 1:
                    weekStr = "星期一";
                    break;
                case 2:
                    weekStr = "星期二";
                    break;
                case 3:
                    weekStr = "星期三";
                    break;
                case 4:
                    weekStr = "星期四";
                    break;
                case 5:
                    weekStr = "星期五";
                    break;
                case 6:
                    weekStr = "星期六";
                    break;
                case 0:
                    weekStr = "星期日";
                    break;
            }
            return weekStr;
        };
        /** 一天的毫秒数 **/
        TimeUtil.DAY_MICRO_SECONDS = 24 * 3600 * 1000;
        /** 一小时的毫秒数 **/
        TimeUtil.HOUR_MICRO_SECONDS = 3600 * 1000;
        /** 一分钟的毫秒数 **/
        TimeUtil.MINUTE_MICRO_SECONDS = 60 * 1000;
        /** 一秒钟的毫秒数 **/
        TimeUtil.SECOND_MICRO_SECONDS = 1000;
        /** 年 **/
        TimeUtil.CN_YEAR = "年";
        /** 月 **/
        TimeUtil.CN_MONTH = "月";
        /** 日 **/
        TimeUtil.CN_SUN = "日";
        /** 天 **/
        TimeUtil.CN_DAY = "天";
        /** 小时 **/
        TimeUtil.CN_HOUR = "小时";
        /** 分 **/
        TimeUtil.CN_MIN = "分";
        /** 秒 **/
        TimeUtil.CN_SEC = "秒";
        /**
         *时间误差，精确到毫秒
         */
        TimeUtil.tickOffset = 0;
        return TimeUtil;
    }());
    qmr.TimeUtil = TimeUtil;
    __reflect(TimeUtil.prototype, "qmr.TimeUtil");
})(qmr || (qmr = {}));
var TimeUtil = qmr.TimeUtil;
var qmr;
(function (qmr) {
    /**
     * @description 浏览器工具类
     */
    var WebBrowerUtil = (function () {
        function WebBrowerUtil() {
        }
        /**初始化系统信息 */
        WebBrowerUtil.initSysInfo = function () {
            this.initMd();
        };
        WebBrowerUtil.initMd = function () {
            console.log("运行系统:" + egret.Capabilities.os);
            var MobileDetect = window["MobileDetect"];
            if (MobileDetect) {
                var device_type = navigator.userAgent; //获取userAgent信息 
                var md = new MobileDetect(device_type); //初始化mobile-detect
                var os = md.os(); //获取系统 
                var model = ""; //获取手机型号
                if (os == "iOS") {
                    model = md.mobile();
                }
                else if (os == "AndroidOS") {
                    var sss = device_type.split(";");
                    var i = this.contains(sss, "Build/");
                    if (i > -1) {
                        model = sss[i].substring(0, sss[i].indexOf("Build/"));
                    }
                    else {
                        model = md.mobile();
                    }
                }
                this.model = model;
                this.OS = os;
                egret.log("md:" + JSON.stringify(md));
                egret.log("操作系统:" + os);
                egret.log("手机型号:" + model);
            }
        };
        //判断数组中是否包含某字符串 
        WebBrowerUtil.contains = function (strArr, needle) {
            for (var i in strArr) {
                if (strArr[i].indexOf(needle) > 0)
                    return Number(i);
            }
            return -1;
        };
        return WebBrowerUtil;
    }());
    qmr.WebBrowerUtil = WebBrowerUtil;
    __reflect(WebBrowerUtil.prototype, "qmr.WebBrowerUtil");
})(qmr || (qmr = {}));
