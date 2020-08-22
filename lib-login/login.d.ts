declare module qmr {
    class UIComponent extends eui.Component {
        protected isSkinLoaded: boolean;
        private _data;
        private _eventDic;
        private _unpackDic;
        private _unpackDynamic;
        private _notifyDic;
        private _touchBeginTaret;
        constructor();
        /**
         * 组件初始化完毕
         */
        protected onCreationComplete(evt: eui.UIEvent): void;
        protected initUnpackRes(container: egret.DisplayObjectContainer): void;
        protected initStatesUnpackRes(skin: eui.Skin, container: egret.DisplayObjectContainer): void;
        private addUnpackRef(source, child);
        protected addedToStage(evt: egret.Event): void;
        protected removeFromStage(evt: egret.Event): void;
        /**
         * 初始化组件,需被子类继承
         */
        protected initComponent(): void;
        /**
        * 初始化数据
        */
        protected initData(): void;
        /**
         * @description 获取当前属于这个模块的数据
         */
        /**
         * @description 获取当前属于这个模块的数据
         */
        data: any;
        /**
         * 初始化事件监听器,需被子类继承
         */
        protected initListener(): void;
        protected onStageResize(): void;
        /**
         * @description 注册一个消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        registerNotify(type: string, callBack: Function, thisObject?: any): void;
        /**
         * @description 取消一个注册消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        unRegisterNotify(type: string, callBack: Function, thisObject?: any): void;
        unRegisterAllNotify(): void;
        /**
         * @description 发送一个消息通知
         */
        dispatch(type: string, params?: any): void;
        /**
         * 事件注册，所有事件的注册都需要走这里
         */
        addEvent(target: egret.EventDispatcher, type: string, callBack: Function, thisObject?: any): void;
        /**
         * @description 添加点击函数
         */
        protected addClickEvent(target: egret.EventDispatcher, callBack: Function, thisObject?: any): void;
        /**
         * @description 当点击开始
         */
        private onTouchBegin(evt);
        /**
         * @description 当点击结束
         */
        private onTouchEnd(evt);
        /**
         * @description 当点击结束的时候，按钮不在被点击的对象上
         */
        private onTouchReleaseOutSide(evt);
        /**
         * 统一移除所有事件
         */
        removeAllEvent(): void;
        /**
         * 更新标题
         */
        updateTitle(title: string, ruleId: number): void;
        /**
         * 播放音效
         */
        protected loadAndPlayEffect(soundType: string, loops?: number, isOneKey?: boolean): void;
        /**
         * 停止音效
         */
        protected stopSoundEffect(soundType: string): void;
        /** 每次initData执行一次 ,动态增加引用计数 */
        addUnpackRes(unpack: string | string[]): void;
        /** 每次dispose执行一次 ,清引用*/
        protected destoryUnpackRes(): void;
        /**
         * 资源释放
         * @$isDispos 是否彻底释放资源
         */
        dispose($isDispos?: boolean): void;
    }
}
declare module qmr {
    /**
     *
     * @description 所有模块的基类
     *
     */
    class SuperBaseModule extends UIComponent {
        preModule: SuperBaseModule;
        /**界面标题*/
        title: string;
        ruleId: number;
        /**使用时间*/
        useTime: number;
        /** 模块引用的资源组 */
        protected _groupName: string;
        /** 皮肤名 */
        protected _qmrSkinName: string;
        /** 是否可以点击背景黑幕来关闭面板 */
        isClickHide: boolean;
        /** 是否需要半透明遮罩 */
        isNeedMask: boolean;
        /** 是否需要全透明遮罩 */
        isNeedAlpha0Mask: boolean;
        /** 是否需要弹出效果 */
        isPopupEffect: boolean;
        /** 是否居中显示，居中显示不做屏幕大小适配 */
        isCenter: boolean;
        /** 是否适配屏幕状态栏（刘海屏） */
        needAdaptStatusBar: boolean;
        /** 是否显示中 */
        private _isShow;
        /** 遮罩 */
        maskSprite: LayerMaskSprite;
        /**关闭后要打开的界面*/
        closeOpenPanel: string;
        closeOpenPanelData: any;
        offsetY: number;
        /** 打开在某一层 */
        layer: LayerConst;
        constructor();
        /** 设置资源组名字,需要在构造函数里面调用 */
        groupName: string;
        /** 设置皮肤名字 */
        qmrSkinName: string;
        /** 初始化组件 */
        protected initComponent(): void;
        /** 刷新界面指引 */
        updateGuide(): void;
        protected resetPos(): void;
        /** 初始化事件 */
        protected initListener(): void;
        /** 对象是否有效 */
        getEffective(now: number, maxAliveTime: number): boolean;
        /**关闭界面 不满意子类重写*/
        protected onPageBgCloseView(): void;
        protected addedToStage(evt: egret.Event): void;
        protected onStageResize(evt?: egret.Event): void;
        /**
         * 打开模块
         * @param data 打开模块时，需要向这个模块传递的一些数据
         */
        show(data?: any): void;
        /** 获取当前模块的显示状态 */
        isShow: boolean;
        /** 界面初始化之后布局 */
        protected layout(): void;
        /** 获取模块中某个控件在舞台中的位置 */
        getComponentGlobalPoint(componentName: string): any;
        /** 隐藏界面 */
        hide(): void;
        /** 弹出对话框效果*/
        popupEffect(): void;
        /** 关闭对话框效果*/
        closeEffect(): void;
        /** 执行打开弹出框 */
        doOpenOver(): void;
        /** 执行关闭弹出框 */
        doCloseOver(): void;
        /** 关闭位置 */
        private _closePos;
        closePos: egret.Point;
        /** 打开位置 */
        private _openPos;
        openPos: egret.Point;
        /** 资源释放 */
        dispose(): void;
        /**
         * 关闭自身
         */
        protected closeView(): void;
    }
}
declare module qmr {
    class AnimateClip extends egret.Bitmap {
        private animateData;
        private resName;
        private callBack;
        private thisObject;
        private isDirLoad;
        private actList;
        private curFrame;
        isBody: boolean;
        constructor(callBack?: Function, thisObject?: any);
        /**
         * @description 动态设置是否是分方向加载
         */
        setIsDirLoad(value: boolean): void;
        /**
         * @description 获取是否是分方向加载
         */
        getIsDirLoad(): boolean;
        /**
         * @description 设置该动画片段包含的动作组
         */
        setActs(acts: string): void;
        /**
         * @description 该动画片段是否包含该动作
         */
        containsAct(act: string): boolean;
        /**
         * @description 加载
         * @param path 文件的相对路径
         * @param resName 当前动画片段的名字
         * @param animationName 动画片段属于的动画的名字
         * @param dir 有些动画会带方向的
          @param act 动作名
         */
        load(path: string, resName: string, dir?: number): void;
        /**
         * @description 重置，防止夸帧
         */
        reset(): void;
        /**
         * @description 渲染第几帧
         */
        render(frame: number): void;
        private _scale;
        private _offsetX;
        private _offsetY;
        offsetX: number;
        offsetY: number;
        scale: number;
        /** 用于设置特效宽度，设置之后无需设置scaleX */
        private _effectWidth;
        effectWidth: number;
        /**获取第一帧的高度*/
        readonly firstFrameHeight: number;
        /** 获取总帧数 */
        readonly totalFrames: number;
        /**获取帧频*/
        readonly frameRate: number;
        /**  资源释放   */
        dispos(): void;
    }
}
declare module qmr {
    class BaseBean {
        key: string;
        protected d: any;
        constructor(d: any);
        /** 用于两个值相merge */
        merge(bean: any, rate?: number): void;
        setRate(rate: number): void;
    }
}
declare module qmr {
    class LoginViewUI extends SuperBaseModule {
        labContent: eui.Label;
        btnClose: eui.Image;
        btnReturn: eui.Image;
        constructor();
    }
}
declare module qmr {
    /**
     *
     * @description 方便发送接收消息
     *
     */
    class BaseNotify {
        constructor();
        protected initListeners(): void;
        /**
         * @description 发送一个消息通知
         */
        dispatch(type: string, params?: any): void;
        /**
        * @description 注册一个消息
        * @param type 消息类型
        * @param callBack 回调函数
        * @param thisObject 当前作用域对象
        */
        registerNotify(type: string, callBack: Function, thisObject: any): void;
        /**
         * @description 取消一个注册消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        unRegisterNotify(type: string, callBack: Function, thisObject: any): void;
    }
}
declare module qmr {
    /**
     * 平台基类类，此类禁止对特殊子平台的逻辑处理，一律在子平台类中处理
     */
    abstract class BasePlatform {
        /**平台sdk*/
        sdk: any;
        /**平台sdk_ios_web:http://h5.dyhyyx.com/themes/simplebootx/Public/js/hgame.js?ver=20170516*/
        lq: any;
        /**平台数据*/
        data: any;
        /**登陆服平台验证地址*/
        loginServerUrl: string;
        /**最近登录服请求地址*/
        loginServer: string;
        /**联调服域名*/
        ltServerDomain: string;
        /**选服列表请求地址（外网平台根据联调服或者正式服切换地址）*/
        serverListServer: string;
        /**提审版本选服列表请求地址*/
        tsServerListServer: string;
        /**获取充值订单号请求地址*/
        rechargeOrderIdServer: string;
        /**登陆前打点服务器地址*/
        markPointUrlBeforeLogin: string;
        /**登陆后打点服务器地址*/
        markPointUrl: string;
        /**最近登录服请求地址*/
        lastLoginServerReqUrl: string;
        /**提审服最近登录服请求地址*/
        tsLastLoginServerReqUrl: string;
        /**屏蔽字检测地址*/
        dirtyWordCheckUrl: string;
        /**公告获取地址*/
        NoticeUrl: string;
        /**后端登录验签地址 */
        verifyUrl: string;
        /**订单号 */
        orderId: number;
        /**是否验证通过*/
        isVerify: boolean;
        /**是否拉取到了平台参数，根据状态决定是否打点*/
        isGetPlatformInfo: boolean;
        /**订单请求后的返回数据 */
        orderResultData: any;
        protected abstract initGetOption(): void;
        /**登陆接口*/
        protected abstract login(): Promise<any>;
        /**sdk支付*/
        protected abstract pay(payInfo: RechargeCfg): Promise<any>;
        /**该平台是否拥有清理缓存接口 */
        abstract canClearResCache: boolean;
        /**第一个加载背景是否移除 */
        protected firstLoadBgHide: boolean;
        constructor();
        /**该平台是否拥有重置窗口大小的能力 */
        readonly canResizeStage: boolean;
        /**请求登录 */ reqLogin(): Promise<void>;
        /**请求支付 */ reqPay(payInfo: RechargeCfg): void;
        /**
         * 设置加载进度
         * @param  {number} vlaue 0-100
         * @returns void
         */
        setLoadingProgress(vlaue: number): void;
        /**登出接口*/
        logout(): void;
        /**创角成功并获取角色信息后上报*/
        reportRegister(): void;
        /**登陆成功并获取角色信息之后上报*/
        reportLogin(): void;
        /**角色升级上报*/
        reportUpLevel(): void;
        /**排行榜战力上报*/
        reportFightPower(value: number): void;
        /**分享游戏 */
        shareGame(totalCount: number, hadCount: number, leaveTime: number): void;
        /**分享游戏 */
        onShareBack(): void;
        /**分享接口*/
        share(): void;
        /**收藏到桌面*/
        addToDesk(): void;
        /**
         * 尝试重新加载游戏，否则退出游戏
         * @param  {boolean} clearCache? 是否清除缓存，微信、qq等平台等需要
         * @returns void
         */
        reloadGame(clearCache?: boolean): void;
        setLoadingStatus(msg?: string): void;
    }
}
declare module qmr {
    /**
     *
     * @description 和服务器通信的基类,所有的通信类都要继承这个类
     *
     */
    class BaseController {
        private _reqDic;
        constructor();
        protected initListeners(): void;
        /**
         * msg:发送消息
         * isLog:是否显示发送日志
         */
        sendCmd(msg: any, msgId: number, isLog?: boolean): void;
        /**
         * @description 发送一个消息通知
         */
        dispatch(type: string, params?: any): void;
        /**
        * @description 注册一个消息
        * @param type 消息类型
        * @param callBack 回调函数
        * @param thisObject 当前作用域对象
        */
        registerNotify(type: string, callBack: Function, thisObject: any): void;
        /**
         * @description 取消一个注册消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        unRegisterNotify(type: string, callBack: Function, thisObject: any): void;
        /**
         * @description 发送带回调的消息
         */
        rpc(eventMsgId: number, cmd: any, msgId: number, callBack: Function, thisObject: any, timeOutCallBack?: Function, timeOut?: number, isLog?: boolean): void;
        /**
         * @description 添加事件监听
         */
        protected addSocketListener(msgId: number, callBack: Function, thisObject: any, isLog?: boolean): void;
        /**
         * @description 移除监听
         */
        protected removeSocketListener(msgId: number, callBack: Function, thisObject: any): void;
        /**
         * 播放特效
         */
        loadAndPlayEffect(soundType: string, loops?: number, isOneKey?: boolean): void;
        /** 检查是否还在锁定状态 */
        checIsLock(rankId: number): boolean;
        /** 设置锁定状态,默认15秒 */
        setReqLock(rankId: number, time?: number): void;
        resetLock(): void;
        /**
         * @description 移除所有监听
         */
        removeAllListener(): void;
    }
}
declare module qmr {
    /**
     * <code>Dictionary</code> 是一个字典型的数据存取类。
     */
    class Dictionary {
        private _values;
        private _keys;
        /**
         * 获取所有的子元素列表。
         */
        values: any[];
        /**
         * 获取所有的子元素键名列表。
         */
        keys: any[];
        /**
         * 给指定的键名设置值。
         * @param	key 键名。
         * @param	value 值。
         */
        set(key: any, value: any): void;
        /** 紧限于解析配置时使用 */
        setConf(key: any, value: any): void;
        /**
         * 获取指定对象的键名索引。
         * @param	key 键名对象。
         * @return 键名索引。
         */
        indexOf(key: Object): number;
        /**
         * 返回指定键名的值。
         * @param	key 键名对象。
         * @return 指定键名的值。
         */
        get(key: any): any;
        /**
         * 是否有这个键
         */
        has(key: any): any;
        /**
         * 数据长度
         */
        readonly length: number;
        /**
         * 移除指定键名的值。
         * @param	key 键名对象。
         * @return 是否成功移除。
         */
        remove(key: any): Boolean;
        /**
         * 清除此对象的键名列表和键值列表。
         */
        clear(): void;
    }
}
declare module qmr {
    class MessageIDLogin {
        /**
         *
         */
        /** 映射协议ID对应的协议名 */
        private static MSG_KEYS;
        /** 游戏初始化调用 */
        static init(): void;
        /** 通过本类的协议ID映射协议名字 */
        static getMsgNameById(id: number): string;
        /**  异常消息 */
        static S_EXCEPTION_MSG: number;
        /**  登录 */
        static C_USER_LOGIN: number;
        /**  登录成功 */
        static S_USER_LOGIN: number;
        /** 注册 */
        static C_LOGIN_REGISTER: number;
        /** 登出 */
        static C_USER_LOGOUT: number;
        static S_USER_LOGOUT: number;
        /** 同步时间 */
        static C_SYNC_TIME: number;
        /** 同步时间 */
        static S_SYNC_TIME: number;
        static C_SEND_SDK_DATA: number;
        static S_SEND_SDK_DATA: number;
    }
}
declare module qmr {
    /**
     *
     * @description 动作状态枚举
     *
     */
    class Status {
        static IDLE: string;
        static ATTACK: string;
        static ATTACK2: string;
        static MOVE: string;
        static FLY: string;
        static DEAD: string;
        static SKILL: string;
        static SKILL2: string;
        static IDLE_RIDE: string;
        static MOVE_RIDE: string;
        static ATTACK_RIDE: string;
        static JUMP: string;
        static JUMP_ATTACK: string;
        static STAND: string;
        static PICK: string;
        static UI_SHOW: string;
        static UI_SHOW1: string;
        static UI_IDLE: string;
    }
}
declare class AssetAdapter implements eui.IAssetAdapter {
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    getAsset(source: string, compFunc: Function, thisObject: any): void;
}
declare module qmr {
    /**
     *
     * @description 动画片段数据，比如某个动画组中的待机动画
     *
     */
    class AnimateData {
        private _totalFrames;
        private _frameRate;
        private framesList;
        private resJson;
        private spriteSheet;
        private autoParseTexture;
        private autoHalfTexture;
        constructor(resJson: any, spriteSheet: egret.SpriteSheet, autoParseTexture?: boolean, autoHalfTexture?: boolean);
        /**
         * @description 解析数据
         */
        parseClip(spriteJson: any): void;
        /**
         * @description 通过起始帧解析数据
         */
        parseClipByStartAndEnd(spriteJson: any, start: number, end: number): void;
        /**
         * @description 获取某一帧texture
         */
        getTextureByFrame(frame: number): egret.Texture;
        /**
         * @description 获取某一帧偏移值
         */
        getOffset(frame: number): any;
        /**
         * @description 获取总的帧数
         */
        readonly totalFrames: number;
        /**
         * 是方法一倍
         */
        readonly halfTexture: boolean;
        /**
         * @description 获取帧频         */
        readonly frameRate: number;
        /**
         * @description 资源释放
         */
        dispos(): void;
    }
}
declare module qmr {
    /**
     *
     * @description 所有序列帧动画的管理器 draw到300就差不多了
     *
     */
    class AnimateManager {
        private static instance;
        private animaDic;
        private maxAliveTime;
        constructor();
        /**
         * @descripion 获取单例
         */
        static getInstance(): AnimateManager;
        /**
         * @description 析对应序列帧动画
         */
        parseSpriteSheet(resName: string, url: string, jsonData: any, texture: egret.Texture, dir?: number, autoParseTexture?: boolean): void;
        /**
         * @description 根据对应的动画名和标名获取序列帧数据
         * @param resName 资源名
         * @param dir 方向
         */
        getAnimalData(resName: string, dir: number): AnimateData;
        /**
         * @description 释放资源，其实是释放对应animaion的引用计数
         */
        dispos(resName: string): void;
        /**
         * @description 清理过期资源
         */
        clear(now: number): void;
    }
}
declare module qmr {
    /**
     * @description 翅膀动画片段
     */
    class AnimateWing extends AnimateClip {
        private _wingFrame;
        private _wingFrameIndex;
        constructor(callBack?: Function, thisObject?: any);
        /**
         * @description 渲染第几帧 8-10[1-8,1-8]
         */
        render(frame: number): void;
        reset(): void;
    }
}
declare module qmr {
    /**
     *
     * @description 序列帧动画基类,所有的序列帧动画都要继承此类
     *
     */
    class MovieClip extends egret.DisplayObjectContainer {
        protected currentFrame: number;
        protected totalFrame: number;
        private isStopped;
        private passedTime;
        private frameIntervalTime;
        private lastTime;
        private eventDic;
        private _frameRate;
        private playeTimes;
        private mainClip;
        private loopCallBack;
        private thisObject;
        private _timeScale;
        constructor();
        /**
         * @description 加载素材资源
         */
        load(path: string, resName: string, loopCallBack: Function, thisObject: any, playeTimes?: number): void;
        /**
         * @description 资源加载完毕,需被子类继承        */
        protected onLoaded(): void;
        /**
         * @description 注册一个帧事件         */
        registerFrameEvent(frame: number, callBack: Function, thisObject: any): void;
        /**
         * @description 取消一个帧事件         */
        unRegisterFrameEvent(frame: number): void;
        /**
         * @description 帧频调用         */
        private advanceTime(timeStamp);
        /**
         * @description 检测帧事件         */
        private checkFrameEvent();
        /**
         * @description 清除回调
         */
        clearCallBack(): void;
        /**
         * @description 渲染 需被子类继承*/
        protected render(): void;
        /**
         * @description 设置帧频         */
        frameRate: number;
        /**
         * @description 设置timescale
         */
        timeScale: number;
        /**
         * @description 获取总帧数
         */
        readonly totalFrames: number;
        /**
         * @description 停止在某帧
         */
        gotoAndStop(frame: number): void;
        /**
            * @private
            *
            * @param value
            */
        setIsStopped(value: boolean): void;
        /**
         * @description 清除
         */
        clear(): void;
        /**
         * @description 资源释放         */
        dispos(): void;
    }
}
declare module qmr {
    class CommonTip extends UIComponent {
        private content;
        private common_g;
        private lbl_tipMsg;
        private bgd;
        img_icon: eui.Image;
        private iscompleted;
        private isSeted;
        constructor();
        protected initComponent(): void;
        protected initData(): void;
        onStageResize(): void;
        /**
         * @description显示操作成功与失败的普通提示
         */
        showTip(data: any): void;
        setTip(): void;
        /**
         * @desc onFlyEnd
         */
        dispose(): void;
    }
}
declare module qmr {
    class ConfigManagerBase {
        private static cfgDic;
        private static zipDic;
        /**默认的资源包名称 */
        private static WHOLE_CONFIG_NAME;
        private static BASE_CONFIG_NAME;
        /**
         * @description 根据Id获取当前行数对象
         * ConfigEnum
         */
        static getConf(jsonName: string, confId: any): any;
        static getBean(fileName: string): Dictionary;
        /**从zip中解析一张表*/
        private static parseConfigFromZip(fileName);
        private static getZip(resName);
        private static getkey(cfg, cfgValue);
    }
}
declare module qmr {
    class GlobalConfig {
        /** 是否上报日志到reportLogUrl服务器上 */
        static reportLogData: {};
        static reportLogUrl: string;
        /** 是否开启Slow个人日志 */
        static bIsShowSlowLog: boolean;
        static loginInitFinish: boolean;
        static isDebugF: boolean;
        static loginPort: number;
        static userId: number | Long;
        static signature: string;
        static unverifysvr: number;
        static platLoginTime: string;
        /**平台拉取的服务器列表*/
        static serverList: any[];
        /**我最近登陆的服务器列表 */
        static recentLoginServerList: any[];
        /**登陆服下发后端参数(直接透传给后端)*/
        static sparam: any;
        static nickName: string;
        static loginProxyServer: string;
        /** 是否是sdk登出状态 */
        static isSDKLogout: boolean;
        /**客户端注册用户英雄id */
        static registerAccountHeroId: number;
        /**游戏登陆账号 */
        static account: string;
        static token: string;
        /**服务器id */
        static sid: string;
        static sName: string;
        /**客户端登录游戏秘钥 */
        static loginKey: string;
        /**QOS打点服务器秘钥 */
        static qosKey: string;
        /**用户唯一id */
        static uid: string;
        /**登录服务器 */
        static loginServer: string;
        /**是否是全新用户 */
        static isFirstNewUser: boolean;
        /**客户端ip*/
        static clientIp: string;
        /**本次登录是否请求了创建角色 */
        static isCreatRoleEnterGame: boolean;
        /**登录服下发前端参数(fcm-防沉迷标记,charge-充值标记(1-充值开启, false-充值关闭 qosurl-打点URL.(当此接口为空时表示不需要打点)))*/
        static cdata: any;
        /**登录时间 */
        static logintime: number;
        /**是否开放充值 */
        static readonly isOpenRecharge: boolean;
        /**
         * 是否ios系统
         */
        static readonly isSysIos: boolean;
    }
}
declare module qmr {
    class BaseConfigKeys {
        /**名字*/
        static PlayerName: boolean;
        /**消息*/
        static CodeCfg: boolean;
        /**音效*/
        static Music: boolean;
        /**中文配置*/
        static ClientCn: boolean;
    }
}
declare module qmr {
    class PlayerNameCfg extends BaseBean {
        /**ID*/
        readonly id: number;
        /**姓*/
        readonly name_xing: string;
        /**男名*/
        readonly name_ming_nan: string;
        /**女名*/
        readonly name_ming_nv: string;
        constructor(element: any);
    }
    class CodeCfgCfg extends BaseBean {
        /**ID*/
        readonly id: number;
        /**消息描述*/
        readonly msg: string;
        /**消息类型*/
        readonly type: number;
        constructor(element: any);
    }
    class MusicCfg extends BaseBean {
        /**音效key*/
        readonly soundType: string;
        /**音效名字*/
        readonly soundName: string;
        /**是否同时播放*/
        readonly isPlaySameTime: number;
        constructor(element: any);
    }
    class ClientCnCfg extends BaseBean {
        /**键*/
        readonly id: string;
        /**值*/
        readonly value: string;
        /**颜色:1：绿色，0：红色 --默认不填不设置颜色*/
        readonly colerType: number;
        constructor(element: any);
    }
}
declare module qmr {
    class ConfigEnumBase {
        /**名字*/
        static PLAYERNAME: string;
        /**消息*/
        static CODECFG: string;
        /**音效*/
        static MUSIC: string;
        /**中文配置*/
        static CLIENTCN: string;
    }
}
declare module qmr {
    enum BtnSkinType {
        Type_1 = 1,
        Type_2 = 2,
    }
    enum CHAT_CHANNELID {
        SYSTEM = 1,
        WORLD = 2,
        TEAM = 3,
        SELF = 4,
        UNION = 5,
        CROSS = 6,
    }
}
declare module qmr {
    enum MusicType {
        BG_MUSIC = 1,
        EFFECT_MUSIC = 2,
    }
    /**主角武将id枚举*/
    enum WarriorRole {
        ROLE_MALE = 101,
        ROLE_FEMALE = 102,
    }
    enum ColorQualityConst {
        COLOR_G = 9067563,
        COLOR_GREEN = 632328,
        COLOR_BLUE = 2197196,
        COLOR_VIOLET = 16722152,
        COLOR_CADMIUM = 15095046,
        COLOR_RED = 14489856,
        COLOR_DIAMOND = 4758466,
    }
    enum BagType {
        TIEM = 0,
        HERO = 1,
        EQUIP = 2,
    }
    enum ActorSizeType {
        small = 0,
        mid = 1,
        big = 2,
        UI = 3,
    }
}
declare module qmr {
    class NotifyConstBase {
        constructor();
    }
}
declare module qmr {
    /**
     *
     * @description 消息通知的常量,登录模块的消息通知常量都写在这里
     *
     */
    class NotifyConstLogin {
        /** 错误日志 */
        static S_ERROR_CODE: string;
        static S_USER_LOGIN: string;
        static S_USER_LOGIN_REPEAT: string;
        static S_LOGIN_OFFLINE_HANGUP_PUSH: string;
        static S_USER_LOGOUT: string;
        static TAB_VIEW_ADDPAGE: string;
        static TAB_VIEW_REMOVEPAGE: string;
        static TAB_VIEW_CHANGE_TAB: string;
        static UPDATE_OPEN_TITLE: string;
        static UPDATE_MODULE_TITLE: string;
        static OPEN_PANEL_LAYER: string;
        static CLOSE_PANEL_LAYER: string;
        static OPEN_PANEL_VIEW: string;
        static CLOSE_PANEL_VIEW: string;
        static SCNY_ONE_SERVER_TIME: string;
        static CROSS_DAY: string;
        static CHANGE_MODEL_VIEW: string;
        static TO_HIDE_VIP_VIEW: string;
        static TO_REQUEST_SHARE_REWARD: string;
    }
}
declare module qmr {
    /**
     * 事件处理器类
     * dear_H
     */
    class Handler {
        /**@private handler对象池*/
        private static _pool;
        protected _id: number;
        /**@private */
        private static _gid;
        /** 执行域*/
        caller: any;
        /** 处理方法。*/
        method: Function;
        /** 参数。*/
        args: Array<any>;
        /** 表示是否只执行一次。如果为true，回调后执行recover()进行回收，回收后会被再利用，默认为false 。*/
        once: boolean;
        /**
         * 根据指定的属性值，创建一个 <code>Handler</code> 类的实例。
        * @param	caller 执行域。
        * @param	method 处理函数。
        * @param	args 函数参数。
        * @param	once 是否只执行一次。
        */
        constructor(caller?: any, method?: Function, args?: Array<any>, once?: boolean);
        /**
         * 设置此对象的指定属性值。
         * @param	caller 执行域(this)。
         * @param	method 回调方法。
         * @param	args 携带的参数。
         * @param	once 是否只执行一次，如果为true，执行后执行recover()进行回收。
         * @return  返回 handler 本身。
         */
        setTo(caller: any, method: Function, args: Array<any>, once: boolean): Handler;
        /**执行处理器。*/
        run(): any;
        /**执行处理器，携带额外数据。 */
        runWith(data: any): any;
        /**
         * 回收
         */
        recover(): void;
        /**
         * 从对象池内创建一个Handler，默认会执行一次并立即回收，如果不需要自动回收，设置once参数为false。
         * @param	caller 执行域(this)。
         * @param	method 回调方法。
         * @param	args 携带的参数。
         * @param	once 是否只执行一次，如果为true，回调后执行recover()进行回收，默认为true。
         * @return  返回创建的handler实例。
         */
        static create(caller: any, method: Function, args?: any[], once?: boolean): Handler;
        /**清理对象引用。 */
        clear(): Handler;
    }
}
declare module qmr {
    /**
     *
     * @description 做一些Http请求封装类
     *
     */
    class HttpRequest {
        /** 发送信息作为日志 */
        /**
         * @description 发送post请求
         */
        static sendPost(url: string, args: any, callback?: Function, thisObject?: any): void;
        /**
         * @description 发送GET请求
         */
        static sendGet(url: string, callback: Function, thisObject: any): void;
    }
}
declare namespace qmr {
    class LayerConst {
        static readonly MAP_LAYER: string;
        static readonly FIGTH_UI: string;
        static readonly TOOLBAR: string;
        static readonly BASE_UI: string;
        static readonly UI_EFFECT: string;
        static readonly ALERT: string;
        static readonly TIP: string;
        static readonly LOADING: string;
        static readonly TOP: string;
    }
}
declare namespace qmr {
    import DisplayObjectContainer = egret.DisplayObjectContainer;
    class LayerManager {
        private static _instance;
        private _parent;
        private layerList;
        private layerDic;
        private layerIndex;
        static readonly instance: LayerManager;
        setup(container: DisplayObjectContainer): void;
        private addLayer(layerName, mouseEnabled);
        getLayer(type: string): DisplayObjectContainer;
        addChild(dis: DisplayObjectContainer, type: string): DisplayObjectContainer;
        addChildAt(dis: DisplayObjectContainer, _arg2: string, _arg3?: number): DisplayObjectContainer;
        removeChild(window: DisplayObjectContainer): DisplayObjectContainer;
        setCenter(window: DisplayObjectContainer): void;
        layersVisible: boolean;
        /**
         * @description 添加显示对象
         * @param disPlay 要添加的显示对象
         * @param layer 显示对象的层级
         */
        addDisplay(disPlay: egret.DisplayObject, layerType: string, zIndex?: number): void;
    }
}
declare module qmr {
    /**资源加载管理器 */
    class ResManager {
        /**该等级及以下最多占用的加载进程数 */
        private static LOW_PRIORITY_MAX_COUNT;
        /**该等级及以下最多占用的加载进程数 */
        private static HIGH_PRIORITY_MAX_COUNT;
        /**正在加载的loader个数 */
        private static _loadingCount;
        /**等待加载的队列 */
        private static _loaderQueue;
        /**相同地址的加载信息存储 */
        private static _sameResInfoDic;
        /**加载资源组 */
        static loadGroup(source: string, compFunc?: Function, thisObject?: any, priority?: number, progFunc?: Function): void;
        /**加载单个资源 */
        static getRes(source: string, compFunc: Function, thisObject: any, priority?: number, type?: string): void;
        /**添加一个加载器 */
        private static addLoader(source, compFunc, thisObject, priority?, type?, isGroup?, progFunc?);
        /**检查并处理相同资源地址加载器的优先级 */
        private static checkSameLoaderPriority(source, priority);
        /**检测加载下一个 */
        private static checkToLoadNext();
        /**启动一个加载器 */
        private static startLoader(loader);
        /**加载器完成或者错误回调 */
        private static loaderCompleted(loader, isSuccess, data);
        /**回调至加载发起者 */
        private static callbackLoader(loader, data);
    }
    enum LoadPriority {
        LOW = -1,
        HIGH = 0,
        IMMEDIATELY = 1,
    }
}
declare module qmr {
    /**
     *
     * 游戏激活触发事件
     * coler
     *
     */
    class GameLifecycleManger {
        static readonly instance: GameLifecycleManger;
        private static _instance;
        private static bgSoundIsOpen;
        private static effectSoundIsOpen;
        /**共计后台运行的次数 */
        onHideCount: number;
        constructor();
        init(): void;
        /** 游戏重现获得焦点触发 */
        onResume(): void;
        /** 焦点失去时触发 */
        onPause(): void;
    }
}
declare namespace qmr {
    /**
     * 游戏资源加载管理方案
     * 1-加载登陆资源配置
     * 2-加载登录资源
     * 3-登陆成功之后加载其他资源
     */
    class GameLoadManager extends BaseNotify {
        private loadingViewparams;
        /**游戏资源是否加载完成（登录后资源） */
        private isGameResAfterLoginLoaded;
        /**游戏资源是否加载中 */
        private isGameResAfterLoginLoading;
        /**进入游戏回调函数 */
        private gameResAfterLoginLoadedCall;
        constructor();
        /**加载基础资源*/
        loadLoginRes(): Promise<void>;
        /**
        * @description 加载创角资源
        */
        loadcreateRes(): Promise<{}>;
        /**
         * 加载登录后游戏资源
        */
        loadGameResAfterLogin(): Promise<void>;
        /**等待登录界面后台资源加载完成 */
        waiGameResAfterLoginLoaded(): Promise<void>;
        /**等待资源加载完成 */
        waitGameResLoaded(): Promise<{}>;
        private setLoadingViewParams(...arg);
        private showLoadingView();
        private updateTotalProgress(progress);
        /** 添加预加载资源引用 */
        private loaderSilentResource(resArr, completeFunc?, priority?);
        /**
         * 预加载加载动画模型资源，优先级为低
         */
        preLoadAnimation(path: string, resName: string, priority?: number, callback?: Function, callbackObj?: any, harf?: boolean): void;
        /**
        * @description 加载前期资源
        */
        private loadPreloadingGroup();
        /** 加载登录后皮肤文件 */
        private loadCreateRoleThmJs();
        /** 加载登录后皮肤文件 */
        private loadDefaultThmJs();
        /**  加载资源配置文件 */
        private loadResJson(configName, resourceRootRalative?);
        /**加载皮肤配置 */
        private loadThmJson(url, resourceRootRalative?);
        /**
        * @description 加载游戏配置文件
        */
        private loadConfigGroup();
        /**
        * @description 加载公共资源文件
        */
        private loadCommonGroup();
        /**
        * @description 预加载模型/技能资源
        */
        private loadPreModel();
        private static _instance;
        static readonly instance: GameLoadManager;
    }
}
declare module qmr {
    class LayerMaskSprite {
        private mask;
        private _isAlpha0;
        constructor();
        static getLayerMaskSprite(): LayerMaskSprite;
        static recovryLayerMaskSprite(card: LayerMaskSprite): void;
        addMask(layer: string, isAlpha0?: boolean): void;
        private onClickMaskHandler(evt);
        private tweenAddMask();
        tweenRemoveMask(): void;
        onStageResize(): void;
        private removeMask();
        private readonly stageWidth;
        private readonly stageHeight;
        private reset();
        private dispose();
    }
}
declare namespace qmr {
    class LoaderManager {
        private static _instance;
        static readonly instance: LoaderManager;
        /**无引用计数后的最大存活时间，单位毫秒 */
        maxLivingTime: number;
        private groupNameDic;
        private postFlag;
        constructor();
        /**
         * addRef
         */
        addGroupRef(groupName: string): void;
        /** 直接删除资源引用计数，而不是清理一次引用【慎用】 */
        removeGroupRef(groupName: string): void;
        /**
         * 释放资源名
         * groupName：释放的资源组/unpack url
         * force:是否立即释放资源组
         */
        destoryGroup(groupName: string, force?: boolean): void;
        protected clearGroupTick(): void;
    }
}
declare module qmr {
    /**游戏服务器登录流程控制类 */
    class LoginManager {
        static showLoginView(): Promise<void>;
    }
}
declare module qmr {
    class SystemController extends BaseController {
        private static _instance;
        /**是否同步过一次 */
        isSyncOne: boolean;
        /**  获取单例对象 */
        static readonly instance: SystemController;
        private isStartSysn;
        private timeKey;
        private timeFlag;
        constructor();
        protected initListeners(): void;
        /**
         * 启动心跳包
         */
        startHeart(): void;
        clearHeart(): void;
        /**
         * ---同步心跳包---
         */
        private reqgetSystemTime();
        /**
         * ===同步心跳包===
         */
        private onRecsynSystem(s);
        /**
         * ===错误码===
         */
        private onRecExceptionMsg(s);
    }
}
declare module qmr {
    class TipManagerCommon {
        private static instance;
        /**
         * @desc 获取一个单例
         */
        static getInstance(): TipManagerCommon;
        private commonMessInfo;
        private isConmmoning;
        private commonTips;
        private commonTipCdTime;
        constructor();
        /**
         * ----------------------------添加飘字内容-------------------------------
         * 添加了新的背景，所有的颜色只能用白色  2017-04-01 by Don
         */
        createCommonTip(msg: string, msgColor?: number, yPos?: number, itemcfg?: ItemConfigCfg): void;
        /**成功飘绿色的/失败飘红色*/
        createCommonColorTip(msg: string, isSuccess?: boolean, yPos?: number, itemcfg?: ItemConfigCfg): void;
        recycleCommonTip(commonTip: CommonTip): void;
        /**
         * 在界面显示飘字内容
         */
        private showCommonTip();
    }
}
declare module qmr {
    class VersionManager {
        /**系统当前使用的资源版本号 */
        static resVersion: string;
        static versionConfig: any;
        /**默认版本号 */
        static defaultVer: any;
        /**默认版本控制目录 */
        static defaultDir: string;
        constructor();
        static initGameVersion(v: string): Promise<{}>;
        /**获取带版本号的资源路径 */
        static getPathWithGameVersion(resPath: string): string;
    }
    class VersionController implements RES.IVersionController {
        init(): Promise<any>;
        getVirtualUrl(url: string): string;
        /**
         * 获得版本控制之后的路径信息
         */
        getResUrlByVersion(url: string): string;
    }
}
declare namespace qmr {
    class ModuleManager {
        /** 映射class */
        private static _classAppMap;
        private static _cacheAppMap;
        private static _currView;
        /** 需要手动关闭 */
        static _NO_TRIGGER_MODULE: any[];
        /**重置未开放时不显示的视图 */
        static NO_RECHARGE_HIDE_VIEW: any[];
        static openPanelFromBattle: boolean;
        constructor();
        static clearModuleTick(now: number, maxAliveTime: number): void;
        static popModule(className: string, data?: any, layer?: string, closeAll?: boolean, isShowClose?: boolean): void;
        /**
         * 显示一个界面
         * @className   打开的窗口实例
         * @data        携带数据
         * @layer       打开的窗口父级
         * @closeAll    是否关闭其它窗口
         * @isShowClose 是打开状态，要不要关闭
         * @closeOpenPanel 关闭后要打开的界面
         */
        static showModule(className: string, data?: any, layer?: string, closeAll?: boolean, isShowClose?: boolean, closeOpenPanel?: string, closeOpenPanelData?: any, preModule?: SuperBaseModule): void;
        /** 一个模块是否在显示中 */
        static isShowModule(className: string): boolean;
        /** 关闭一个界面 */
        static hideModule(className: string | SuperBaseModule, isHideEffect?: boolean): void;
        /** 关闭所有界面 */
        static closeAllWindow(): void;
        static getCurrentView(): SuperBaseModule;
        /** 关闭当前界面 */
        static closeCurrentModule(): void;
        /** 根据类获取缓存实例 */
        static getAppByClass(appClass: string): SuperBaseModule;
        /** 获取在舞台中的指定显示对象,若在舞台中返回该实例，否则返回null */
        static getSuperBaseModuleByClass(appClass: string): SuperBaseModule;
        /**
         *  获取模块中某个控件在舞台中的位置
         */
        static getComponentGlobalPoint(moduleName: string, componentName: string): any;
        private static addMask(layer, isAlpha0?);
        private static disposWin(win);
        private static sendToTop();
        /** 20190921 */
        private static sendToTopEvent();
        /**
         * 根据模块名删除一个模块引用,一般用于一次性界面
         */
        static deleteModule(moduleName: string): void;
        static setupClass(): void;
        static registerClass(name: string, appClass: any): void;
        private static getClassName(name);
    }
}
declare module qmr {
    class ModuleNameLogin {
        static LOGIN_VIEW: string;
        static GAME_LOADING_VIEW: string;
    }
}
declare class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {
    constructor();
    private textField;
    private createView();
    onProgress(current: number, total: number): void;
}
declare class Main extends eui.UILayer {
    protected createChildren(): void;
}
declare module qmr {
    /**
     *
     * @description 游戏loading
     *
     */
    class GameLoading extends eui.Group {
        private static inttance;
        private _txProgress;
        private _loadingRun;
        private rect;
        constructor();
        private onTouch(evt);
        private runLoading(evt);
        /**
         * @description 获取loading单例对象
         */
        static getInstance(): GameLoading;
        createChildren(): void;
        /**
         * @description 更新尺寸
         */
        private updateSize();
        /**
         * @description 设置加载进度
         */
        private vitureCount;
        setProgress(itemsLoaded: number, itemsTotal: number): void;
        private onTimer();
        /**
         * @description 设置loading提示
         */
        setLoadingTip(msg: string): void;
        /**
         * @description 关闭loading
         */
        close(): void;
    }
}
declare module qmr {
    class GameLoadingProgressBar extends eui.Component {
        imgProgressBg: eui.Image;
        imgProgress: eui.Image;
        imgCloud: eui.Image;
        labHint: eui.Label;
        constructor();
        showProgressRate(rateNum: number, isShowTween?: boolean): void;
        setLoadingTip(txt: string): void;
        dispose(): void;
    }
}
declare module qmr {
    /**
     * 游戏大加载进度条
     */
    class GameLoadingView extends SuperBaseModule {
        private static _instance;
        static getInstance(): GameLoadingView;
        private static bgName;
        progressBar1: qmr.GameLoadingProgressBar;
        progressBar2: qmr.GameLoadingProgressBar;
        labRefresh: eui.Label;
        imgBg: eui.Image;
        private currentProgress;
        private maxProgress;
        private fromProgressTotal;
        private dProgressTotal;
        private tid;
        readonly HREF: string;
        constructor();
        protected initComponent(): void;
        /**
         * 初始化事件监听器,需被子类继承
         */
        protected initListener(): void;
        protected addedToStage(evt: egret.Event): void;
        showSelf(msg: string, showVitureProgress?: boolean, fromProgress?: number, toProgress?: number, isShowTween?: boolean): void;
        hideSelf(): void;
        updateTotalProgress(progress: number, isShowTween?: boolean): void;
        /**
         * 跑虚拟进度
         */
        private showVitureProgress();
        /**
         * @description 关闭进度条
         */
        closeVitureProgress(): void;
        private updateAutoLoading();
        private onRefresh(evt);
        setPrelMessage(tips: string): void;
        setTotalMessage(tips: string): void;
        /**
         * 总进度
         */
        showTotalProgress(rateNum: number, isShowTween?: boolean): void;
        /**
         * 单进度
         */
        showPreProgress(rateNum: number, isShowTween?: boolean): void;
        /**
         *  资源释放
         */
        dispose(): void;
    }
}
declare module qmr {
    /**
     *
     * @description 登陆通信控制器
     *
     */
    class LoginController extends BaseController {
        private static _instance;
        /**  获取单例对象  */
        static readonly instance: LoginController;
        constructor();
        protected initListeners(): void;
        isEnterGame: boolean;
        onEnterGame(): Promise<void>;
        private destoryLoginRes();
    }
}
declare module qmr {
    class LoginModel {
        constructor();
        private static _instance;
        static readonly instance: LoginModel;
    }
}
declare module qmr {
    class LoginView extends LoginViewUI {
        constructor();
        /**
         * @description 初始化事件
         */
        protected initListener(): void;
        private onCloseClick();
        protected addedToStage(evt: egret.Event): void;
        private onBgResBack();
        /**
        * @description 初始化数据,需被子类继承
        */
        protected initData(): void;
        dispose(): void;
    }
}
/**
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
interface Platform {
    getUserInfo(): Promise<any>;
    login(): Promise<any>;
}
declare class DebugPlatform implements Platform {
    getUserInfo(): Promise<{
        nickName: string;
    }>;
    login(): Promise<void>;
}
declare let platform: Platform;
interface Window {
    platform: Platform;
}
interface Window {
    wx: any;
    qq: any;
    qg: any;
}
declare module qmr {
    /** 登录信息 */
    class LoginInfoVo {
        code: string;
        proxyServer: string;
        loginServerPort: string;
        loginServerIP: string;
        constructor();
    }
}
declare module qmr {
    class GameMain {
        static setup(stage: any): Promise<void>;
        /** 读取缓存 */
        private static initLocalStorage();
    }
}
declare module qmr {
    /**
     *
     * 根据消息MessageID自动生成，请勿修改
     *
     */
    class ProtoMsgIdMapLogin {
        private static _instance;
        msgIdMap: any;
        /**
        *  获取单例
        */
        static readonly instance: ProtoMsgIdMapLogin;
        constructor();
    }
}
declare class ThemeAdapter implements eui.IThemeAdapter {
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param onSuccess 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param onError 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    getTheme(url: string, onSuccess: Function, onError: Function, thisObject: any): void;
}
declare var generateEUI: {
    paths: string[];
    skins: any;
};
declare var generateEUI2: {
    paths: string[];
    skins: any;
};
declare var generateJSON: {
    paths: string[];
    skins: any;
};
declare module qmr {
    /**
     *
     * @description 消息通知管理器
     *
     */
    class NotifyManager {
        private static typeDic;
        static splitTypeDic: any[];
        private static logDic;
        constructor();
        /**
         * @description 注册一个消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        static registerNotify(type: string, callBack: Function, thisObject: any): void;
        /**
         * @description 取消一个注册消息
         * @param type 消息类型
         * @param callBack 回调函数
         * @param thisObject 当前作用域对象
         */
        static unRegisterNotify(type: string, callBack: Function, thisObject: any): void;
        /** 慎用，除非自己特有的事情类型 */
        static unRegisterNotifyByType(type: string): void;
        static hasNotification(type: string): boolean;
        /**
         * @description 发送一个消息通知
         */
        static sendNotification(type: string, params?: any): void;
        /** 分批次处理事件 */
        static sendNotificationSplit(type: string, params?: any): void;
        /**
         * @description 移除对应thisObject的所有消息
         */
        static removeThisObjectNofity(thisObject: any): void;
        /**
         * @description 打印下
         */
        static test(): void;
    }
}
declare module qmr {
    /**
     *
     * @description 角色部件枚举
     *
     */
    class ActorPart {
        static BODY: number;
        static WEAPON: number;
        static WING: number;
        static HORSE: number;
        static HORSE_UP: number;
        static SHIELD: number;
        static DEFAULT: number;
    }
}
declare module qmr {
    class PlatformConfig {
        /**当前游戏参数配置 */
        static GAME_CONFIG: any;
        /**默认平台id为星灵互动的 */
        static platformId: number;
        /** 平台标识(用于oss的上报日志、获取公告)*/
        static platform: string;
        /** 平台标记号 拼接api的url使用，用于请求后端接口*/
        static platformSign: string;
        /**平台处理类的类型，当同一平台有多个sdk解析方式时区分，比如西游网的h5和apk大混服 */
        static platformClassType: string;
        /**游戏ID,统一用字符串格式存储 */
        static appIdStr: string;
        /**游戏 key */
        static appKey: string;
        /**渠道id */
        static channelId: string;
        /**是否需要打点 */
        static isNeedMarkPoint: boolean;
        /** 是否连接提审服务器*/
        static isTSVersion: boolean;
        /** 是否屏蔽提审需要屏蔽的内容*/
        static isShildTSV: boolean;
        /** 是否屏蔽苹果商业化版本 */
        static isShieldIOSBusiness: boolean;
        /** 是否打开GM */
        static isOpenGM: boolean;
        static isShowNotice: boolean;
        /**是否是wss连接  */
        static isWSS: boolean;
        /**扩展参数 */
        static extendsParams: string;
        /**是否是调试状态，改为读取配置，这里赋值没有用 */
        static isDebug: boolean;
        /**系统当前使用的资源版本号 */
        static resVersion: string;
        /**是否使用外网cdn资源版本 */
        static useCdnRes: boolean;
        static baseRoot: string;
        static webUrl: string;
        static webRoot: string;
        /**平台域名*/
        static serverDomain: string;
        /**平台提审域名*/
        static ts_serverDomain: string;
        /** 打点域名 */
        static markPointDomain: string;
        /**oss域名 */
        static ossDoamin: string;
        static init(): Promise<void>;
    }
}
declare module qmr {
    /**
     * 平台id枚举
     * dear_H
     */
    enum PlatformEnum {
        /**星灵互动(默认平台)*/
        P_SLOGAME_DEBUG = 0,
        P_SLOGAME_WEB = 100,
        /**大雁互娱_IOS*/
        P_DYHY_IOS = 6,
        /**大雁互娱_quick*/
        P_DYHY_QUICK = 7,
        /**大雁互娱_米壳*/
        P_DYHY_MK = 8,
        /** 西游手QQ小游戏*/
        P_XIYOU_SQQ = 9,
        /**大雁互娱_IOS_WEB 和安卓apk*/
        P_DYHY_IOS_WEB = 10,
        /** 微信小游戏 */
        P_WX = 11,
        /**大雁互娱_IOS_WD*/
        P_DYHY_IOS_WEB_crown = 120,
        /** 6kw 自出安卓母包*/
        P_6kwAndriod = 130,
        /**9377 */
        P_9377 = 12,
        /**7477 */
        P_7477 = 13,
        /**西游网H5 */
        P_XIYOU_H5 = 14,
        /**游民星空 */
        P_YMXK = 15,
        /**OPPO */
        P_OPPO = 16,
        /** 懒猫*/
        L_CAT = 1000,
    }
}
declare module qmr {
    /**
    * 平台工厂
    * dear_H
    */
    class PlatformFactory {
        constructor();
        /**
         * 创建一个平台
         */
        static creatPlatform(platformId: number): BasePlatform;
    }
}
declare module qmr {
    /**
     * 平台代理类，此类禁止对特殊子平台的逻辑处理，一律在子平台类中处理
     * dear_H
     */
    class PlatformManager {
        private _platform;
        constructor();
        /**
         * 注册上报
         */
        reportRegister(): void;
        /**
         * 登录上报
         */
        reportLogin(): void;
        /**
         * 请求支付
         */
        reqPay(payInfo: any): void;
        /**
         * 升级上报
         */
        reportUpLevel(): void;
        /**
         * 分享游戏
         */
        shareGame(totalCount: number, hadCount: number, leaveTime: number): void;
        /**
         * 当前平台对象
         */
        readonly platform: BasePlatform;
        /**是否外部平台 */
        readonly isOutNetPlatForm: boolean;
        /**
         * 是否拉取到了平台参数，根据状态决定是否打点
         */
        readonly isGetPlatformInfo: boolean;
        private static _instance;
        static readonly instance: PlatformManager;
    }
}
declare module qmr {
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
    class PlatformUrlConsont {
        /** 充值生成订单ID接口 */
        static ORDER_URL: string;
        /** 开服列表接口 */
        static SVRLISTOP_URL: string;
        /** 提审服列表接口 */
        static TS_SVRLISTOP_URL: string;
        /** 查询角色接口 */
        static QUERY_URL: string;
        /** 封禁/禁言账号 */
        static FORBIDDEN_URL: string;
        /** 最近登录 */
        static LASTLOGIN_URL: string;
        /** 登录 */
        static LOGIN_URL: string;
        /** 屏蔽词 */
        static WORD_URL: string;
        /** 公告 */
        static NOTICE_URL: string;
        /** 用户验签 */
        static VERIFY_URL: string;
    }
}
declare module qmr {
    class CommonGamePlatform extends BasePlatform {
        /**该平台是否拥有清理缓存接口 */
        canClearResCache: boolean;
        constructor();
        protected initGetOption(): void;
        protected login(): Promise<{}>;
        /**请求支付 */
        reqPay(payInfo: any): void;
        protected pay(payInfo: any): Promise<void>;
    }
}
declare module qmr {
    /**
     * 各个部位对应的资源加载地址
     */
    class ActorPartResourceDic {
        partDic: any;
        constructor();
        private static _instance;
        static getInstance(): ActorPartResourceDic;
    }
}
declare module qmr {
    import ByteArray = egret.ByteArray;
    class BufferGid {
        static KEY: string;
        static ADD_L: number;
        private static byteHead;
        constructor();
        /** 处理服务端推送信息*/
        static parseMsg(reciveBuff: ByteArray): void;
        /**
         *
         * 向服务器发送信息
         * msg:构造的com.message.***proto消息
         * isLog:是否显示发送日志
         *
         */
        static getSendMsg(msg: any, msgId: number, isLog?: boolean): egret.ByteArray;
        static encryptForDis(data: Uint8Array, byteLen: number): egret.ByteArray;
        /**
        * 位移解密
        */
        static decryptForDis(data: ByteArray): ByteArray;
    }
}
declare module qmr {
    /**
     * coler
     * byteArray对象池
     */
    class ByteArrayPool {
        private static _instance;
        private byteList;
        constructor();
        /**
         *  获取单例
         */
        static getInstance(): ByteArrayPool;
        /**
         *  获取一个byteArrary
         */
        createByte(): egret.ByteArray;
        /**
         *  回收一个byteArrary
         */
        recycleByte(byte: egret.ByteArray): void;
    }
}
declare module qmr {
    /**
     *
     * @description 全局计数器，协议发送用的，每用一次，数字递增一次
     *
     */
    class PbGlobalCounter {
        private static instance;
        static maxReconnectCount: number;
        private _counter;
        constructor();
        /**
         * @description 获取单例对象
         */
        static getInstance(): PbGlobalCounter;
        /**
         * @description 获取当前序列号
         */
        getCountter(): number;
        /**
         * @description 重置序列号
         */
        resetCounter(): void;
    }
}
declare module qmr {
    /**
     *
     * @description 请求对象
     *
     */
    class RequestHandler {
        callBack: Function;
        timeOutCallBack: Function;
        timeOut: number;
        thisObject: any;
        isRpc: boolean;
        isLog: boolean;
        sendTime: number;
        clientData: any;
        constructor();
    }
}
declare module qmr {
    import ByteArray = egret.ByteArray;
    /**
     *
     * @description websocket的rpc回调实现
     *
     */
    class Rpc {
        private static instance;
        private loginSocket;
        private eventPool;
        private callbackPool;
        constructor();
        /**
         * @description 获取单例对象
         */
        static getInstance(): Rpc;
        /**
         * @description 添加协议监听
         */
        addSocketListener(msgId: number, callBack: Function, thisObject: any, isLog?: boolean): void;
        /**
         * @description 移除协议监听
         */
        removeSocketListener(msgId: number, callBack: Function, thisObject: any): void;
        /**
         * @description 以host和port的方式链接
         */
        connect(host: string, port: number, connectCallBack: Function, thisObject: any): void;
        /**
         * @description 发送协议，不带回调的
         */
        sendCmd(cmd: any, msgId: number, isLog?: boolean): void;
        /**
        * 带rpc回调的发送
        * @eventMsgId 返回的消息协议号
        * @callBack 收到服务器返回后的处理函数
        * @thisObject 函数引用的对象
        * @timeOutCallBack 发送协议超时还未返回后的处理函数
        * @timeOut 协议超时时间，默认是10秒
        */
        rpcCMD(eventMsgId: number, cmd: any, msgId: number, callBack: Function, thisObject: any, timeOutCallBack?: Function, timeOut?: number, isLog?: boolean): void;
        /**
         * @description 当有数据过来的时候
         */
        onDataIn(msgId: number, data: ByteArray): void;
        /**
        *  判断是否链接上了
        */
        readonly isconnect: boolean;
        /**
        * @description 当链接关闭的时候调用
        */
        private onConnectClose();
        /**
        *  关闭一个socket（目前游戏使用一个socket就可以了）
        */
        close(): void;
        /**
        *  超时检测
        */
        private checkTimeOut();
    }
}
declare module qmr {
    /**
     *
     * @description websocket类
     *
     */
    class WebSocket {
        private connectCallBack;
        private connectCloseBack;
        private connectErrorBack;
        private thisObject;
        private websocket;
        private _isConnect;
        private tid;
        private WEB_KEY;
        constructor();
        /**
         * @description 以host和port的方式链接
         */
        connect(host: string, port: number, connectCallBack: Function, connectCloseBack: Function, connectErrorBack: Function, thisObject: any): void;
        /**
         * @description 10秒链接不上超时
         */
        private onTimeOut();
        /**
         * @description 当服务器连接上
         */
        private onSocketConnected(evt);
        /**
         * @description 当服务器连接关闭
         */
        private onSocketClose(evt);
        /**
         * @description 当有数据过来
         */
        private onDataIn(evt);
        /**
         * @description socket连接发生IO错误
         */
        private onIoError(evt);
        /**
         * msg:发送协议
         * msgId:MessageID里面的协议
         * isLog:是否显示发送日志
         */
        sendCmd(msg: any, msgId: number, isLog?: boolean): void;
        /**
         *  返回socket是否连接上
         */
        readonly isconnected: boolean;
        private clearConTimeout();
        /**
         *  资源释放
         */
        dispos(): void;
    }
}
declare module qmr {
    /**
     *
     * @desc 单个sound存储
     *
     */
    class SoundItem {
        sound: egret.Sound;
        soundChannel: egret.SoundChannel;
        isPlay: boolean;
        type: string;
        constructor(sound?: egret.Sound, type?: string);
        /**
         * 播放声音
         */
        play(startTime: number, loops?: number): void;
        private onPlayerEnd();
        /**
         * 停止播放
         */
        stop(): void;
        /**
         * @desc 当前播放位置
         */
        readonly position: number;
    }
}
declare module qmr {
    /**
     *
     * @desc 音效音乐管理器
     *
     */
    class SoundManager {
        private static instance;
        static getInstance(): SoundManager;
        private _soundPool;
        private _bgSoundItem;
        private _isEffectSoundOpen;
        private _isMusicSoundOpen;
        private _isMusicLifecycleOpen;
        private _lastMusicName;
        private _musicName;
        constructor();
        /**
         * 获取soundpool
         */
        readonly soundPool: any;
        /**
         * 获取特效音乐是否打开
         */
        /**
         * 设置是否打开特效音乐
         */
        isEffectSoundOpen: boolean;
        /**
         * 获取背景音乐是否打开
         */
        /**
         * 设置是否打开背景音乐
         */
        isMusicSoundOpen: boolean;
        /**
         * 播放特效
         */
        loadAndPlayEffect(soundType: string, loops?: number, isOneKey?: boolean): void;
        /** 停止音效 */
        stopSoundEffect(soundType: string): void;
        /**
         * 播放背景音乐,一般都是无限循环的
         */
        loadAndPlayMusic(musicName: string): void;
        private _soundCfgDic;
        private getMusicName(soundType);
        private getMusicIsPlaySameTime(soundType);
        private getSoundCfg(soundType);
        /**
         * @description 加载背景音乐
         */
        private loadBgMusic(soundType);
        /**
         * 关闭背景音乐
         */
        stopMusic(): void;
        /**
         * 重新恢复背景音乐
         */
        reStartMusic(): void;
    }
}
declare module qmr {
    /**
     *
     * @description 一个自定义的FightTimer封装类,具有时间缩放功能,用于战斗
     *
     */
    class FightTimer {
        private static _instance;
        private eventList;
        private _running;
        /** 时针缩放。*/
        scale: number;
        constructor();
        static readonly instance: FightTimer;
        /**
         *  开始运转
         */
        start(): void;
        /**
         * Timer以60FPS频率刷新此方法
         */
        private update(timeStamp);
        /**
         * @description 停止
         */
        stop(): void;
        /**
         * @description 获取是否正在运转
         */
        readonly running: boolean;
        /**
         * @description 注册tick
         */
        registerTick(callback: Function, thisObject: any, delay?: number, repeatCount?: number, params?: any): void;
        /**
         * @description 取消tick
         */
        unRegisterTick(callback: Function, thisObject: any): void;
        /** 移除所有事件侦听 */
        clearAllTick(): void;
        test(): void;
    }
}
declare module qmr {
    /**
     *
     * @description 一个自定义的tick封装类
     *
     */
    class Ticker {
        private static instance;
        private eventList;
        private _running;
        constructor();
        /**
         * 获取单例
         */
        static getInstance(): Ticker;
        /**
         * 开始运转
         */
        start(): void;
        /**
         * Ticker以60FPS频率刷新此方法
         */
        private update(timeStamp);
        /**
         * @description 停止
         */
        stop(): void;
        /**
         * @description 获取是否正在运转
         */
        readonly running: boolean;
        /**
         * @description 注册tick
         */
        registerTick(callback: Function, thisObject: any, delay?: number, repeatCount?: number): void;
        /**
         * @description 取消tick
         */
        unRegisterTick(callback: Function, thisObject: any): void;
        test(): void;
    }
}
declare module qmr {
    /**
     * @description 位操作类
     */
    class BitUtil {
        constructor();
        /**
         * @description 检测一个int值的某一位是否有效，1代表有效，0代表无效
         */
        static checkAvalibe(code: number, bit: number): boolean;
        /**
         * @description 改变某个int值的某一位,并返回修改后的int值
         */
        static changeBit(code: number, bit: number, value: number): number;
        /**
         * @description 整型转化为byte数组
         */
        private static inToBytes(value);
    }
}
declare module qmr {
    class ChannelUtil {
        constructor();
        /**
         * 动态加载js文件
         * @param scriptUrl 文件地址
         * @param isDecode  是否需要解码
         * @param callFunc  文件载入完成后的回调
         */
        static loadScript(scriptUrl: string, isDecode: boolean, callFunc: Function): void;
    }
}
declare module qmr {
    class ColorUtil {
        /**
         * @desc 根据品质返回对应颜色
         */
        static getColorByQuality(quality: number): number;
        /**
         * 若类型为8，则1=绿品，2=蓝品，3=紫品，4=金品，5=红品
         * @desc 根据subType返回日常任务品质颜色
         */
        static getColorBySubType(subType: number): number;
        static getTipColorByType(colorType: number): number;
    }
}
declare module qmr {
    class CommonTool {
        constructor();
        static getMsg(...arg: any[]): string;
    }
}
declare module qmr {
    /**
     * @date 2016.12.01
     * @description 带动画和移动操作的角色类,默认是待机状态,idle
     */
    class BaseActor extends egret.DisplayObjectContainer {
        protected currentFrame: number;
        protected totalFrame: number;
        protected partDic: any;
        protected partIdDic: any;
        private isStopped;
        private passedTime;
        private frameIntervalTime;
        private lastTime;
        private eventDic;
        private actDic;
        private dir;
        private isDirLoaded;
        private loopCallBack;
        private loopThisObject;
        private loadCallBack;
        private loadThisObject;
        private _act;
        private _resourcePath;
        private _frameRate;
        private _timeScale;
        private _isNoRendering;
        constructor(resourcePath: string, loadCallBack: Function, loadThisObject: any, defaultAct?: string);
        protected addToStage(): void;
        protected removeToStage(): void;
        isNoRendering: boolean;
        /**
         * @description 设置是否是分方向加载
         */
        setIsDirLoad(value: boolean): void;
        /**
         * @description 添加部件
         * @param part部件位置，参考ActorPart
         * @param partId 部件的Id
         * @param partIndex 部件层级位置,数字越大层级越高
         */
        addPartAt(part: number, partId: number, partIndex?: number, dir?: number, isDirLoad?: boolean, resPath?: string, isShowDefault?: boolean): void;
        private addPartTo(part, partId, partIndex?, dir?, isDirLoad?, resPath?);
        setPartVisible(part: number, show: boolean): void;
        /**
         * @description 移除部件
         * @param part部件位置，参考ActorPart
         */
        removePart(part: number | string): void;
        getPart(part?: number): AnimateClip;
        /**
         * @description 设置该部位包含的动作
         */
        setPartActs(part: number, acts: string): void;
        /**
         * @description 跳转并播放
         */
        gotoAndPlay(act: string, dir: number, loopCallBack?: Function, loopThisObject?: any, force?: boolean): void;
        /**
         * @description 清除回调
         */
        clearCallBack(): void;
        /**
         * @description 调整方向
         */
        changeDir(dir: number): void;
        /**
         * @description 跳转并停止在某一帧
         */
        gotoAndStop(frame: number): void;
        /**
        * @description 资源加载完毕
        */
        private onLoadedDefault(isFromCache, resName);
        /**
         * @description 其它部位加载完毕
         */
        private onLoadedOther(isFromCache);
        private onLoaded(isFromCache, resName);
        /**
         * @description 获取第一帧裸体的高度
         */
        readonly firstBodyFrameHeight: number;
        /**
         * @description 注册一个帧事件         */
        registerFrameEvent(frame: number, callBack: Function, thisObject: any): void;
        /**
         * @description 取消一个帧事件         */
        unRegisterFrameEvent(frame: number): void;
        /**
         * @description 清除帧事件注册
         */
        clearFrameEvent(): void;
        /**
         * @description 帧频调用         */
        private advanceTime(timeStamp);
        /**
         * @description 检测帧事件         */
        private checkFrameEvent();
        /**
         * @description 渲染*/
        private render();
        /**
         * @description 设置帧频         */
        frameRate: number;
        /**
         * @description 获取总帧数
         */
        getTotalFrame(): number;
        /**
         * @description 获取timescale
         */
        /**
         * @description 设置timescale
         */
        timeScale: number;
        /**
         * @description 获取timescale
         */
        act: string;
        /**
         * @description 获取timescale
         */
        resourcePath: string;
        /**
            * @private
            *
            * @param value
            */
        setIsStopped(value: boolean): void;
        getDir(): number;
        /**
         * @description 清除资源
         */
        clear(): void;
        /**
         * @description 资源释放         */
        dispos(isRemoveFromParent?: boolean): void;
    }
}
declare module qmr {
    class DirtyWordsUtils {
        /**
         * 是否有敏感词
         * @param content    要检测的文字
         * @return        true为有敏感词，false为没有敏感词
         */
        static hasDirtywords(content: string, callbackF: Function, thisObj: any): void;
    }
}
declare module qmr {
    class DirUtil {
        static UP: number;
        static RIGHT_UP: number;
        static RIGHT: number;
        static RIGHT_DOWN: number;
        static DOWN: number;
        static LEFT_DOWN: number;
        static LEFT: number;
        static LEFT_UP: number;
        constructor();
        /**
         * @description 获取真实的5方向
         */
        static getDir(dir: number): number;
    }
}
declare module qmr {
    class DisplayUtils {
        static removeAllChild(dis: egret.DisplayObjectContainer): void;
        static removeDisplay(dis: egret.DisplayObject, parent?: egret.DisplayObjectContainer): void;
        static addDisplayToTop(dis: egret.DisplayObject, parent?: egret.DisplayObjectContainer): void;
        static removeClick(target: egret.EventDispatcher): void;
        private static eventDic;
        private static touchBeginTaret;
        private static lastTime;
        static removeAllEvent(target: egret.EventDispatcher): void;
        static addClick(target: egret.EventDispatcher, callBack: Function, thisObject: any, longPressCallBack?: Function): void;
        /**
         * @description 当点击开始
         */
        private static onTouchBegin(evt);
        /**
         * @description 当点击结束
         */
        private static onTouchEnd(evt);
        /**
         * @description 当点击结束的时候，按钮不在被点击的对象上
         */
        private static onTouchReleaseCancel(evt);
        /**
         * @description 当点击结束的时候，按钮不在被点击的对象上
         */
        private static onTouchReleaseOutSide(evt);
        private static longPress();
        /**
         * 发光某个对象
         */
        static setGlow(obj: egret.DisplayObject, isGrey: boolean): void;
        /**
         * 置灰某个对象,设置按钮不用滤镜了，用setBtnGray 方法
         */
        static setGrey(obj: egret.DisplayObject, isGrey: boolean, isSetEnabled?: boolean): void;
        /**
         * 置灰某个对象
         */
        static setBtnGray(obj: eui.Button, isGray: boolean, isSetEnabled?: boolean, btnSkinType?: BtnSkinType): void;
        private static getBtnSkin(btnSkinType, isGray);
        /**
          * 置灰一组对象
          */
        static setGreyGoup(objGoup: egret.DisplayObject[], isGrey: boolean): void;
        /**
         * 设置不可选
         */
        static setDisable(obj: egret.DisplayObject, isDisable: boolean): void;
        static LoadResByNameAndWH(obj: egret.DisplayObject, objParent: egret.DisplayObject, width: number, height: number, x?: number, y?: number): egret.DisplayObject;
        /**
         * 更新星星方法
         * max-星星组
         * lightNum-当前要亮的星数
         */
        static updateStar(starGroup: eui.Group, lightNum: number): void;
        /**
         * 获取一个对象全局坐标点
         */
        static getGlobelPoint(target: any): egret.Point;
    }
}
declare module qmr {
    class FilterUtil {
        /**
         * 灰态
         */
        static grayFilter: egret.ColorMatrixFilter;
        static glowFilter: egret.GlowFilter;
    }
}
declare module qmr {
    class HtmlUtil {
        static htmlParse: egret.HtmlTextParser;
        constructor();
        /**主要处理了\n  读表\n读取有问题 */
        static getHtmlString(msg: string): egret.ITextElement[];
        static getHtmlTextElement(msg: string, color: number, isUnderLine?: boolean, href?: string, strokeColor?: number, stroke?: number): egret.ITextElement[];
        /**
         * @desc 返回对应颜色的html字符串
         */
        static getHtmlText(msg: string, color: number, isUnderLine?: boolean, href?: string): string;
        static getColorSize(msg: string, color: number, size?: number): string;
        /**
         * @desc 返回对应颜色的html字符串
         */
        static getHtmlTexts(data: Array<Array<any>>): any;
        /**
         * @desc 针对道具类特殊的html字符串返回
         * @param itemDataId道具配置Id
         * @param count数量
         */
        static getItemHtmlText(itemDataId: number, count: number): string;
        static log(...args: any[]): string;
    }
}
declare module qmr {
    /**
     *  初始化图片工具类
     */
    class ImageUtil {
        /**
         *  设置道具icon显示
         */
        static setItemIcon(icon: eui.Image, iconRes: any, pageType?: BagType, bIsGray?: boolean): void;
        /** 设置位图icon显示 */
        static setBmpIcon(icon: egret.Bitmap, url: string): void;
        /** 给路径加上变灰路径 */
        static decoratePathForGray(path: string): string;
        /** 设置image显示 */
        static setImageIcon(icon: eui.Image, url: string): void;
        /**
         * @description 给图片设置滤镜变灰的效果
         */
        static setFilter(img: Array<any>): void;
    }
}
declare module qmr {
    /**
     * coler
     * int64方法
     */
    class Int64Util {
        static getNumber(d: any): number;
        static getNumberArr(any: (any)[]): number[];
    }
    function getNumber(d: any): number;
    function getServerNumber(playerId: number): number;
    function getServerNickName(playerId: any, name: string): string;
}
declare module qmr {
    class JsUtil {
        static getQueryString(): RegExpMatchArray;
        static getQueryStringByName(name: any): string;
        static getQueryStringByIndex(index: any): string;
        /**
         * limit=1&h5limit=2
         * @param valueName
         * @param params
         */
        static getValueFromParams(valueName: any, params: any): string;
    }
}
declare module qmr {
    class LabelTip {
        private label;
        private static instance;
        private constructor();
        static getInstance(): LabelTip;
    }
}
declare module qmr {
    class LabelUtil {
        static addInputListener(textInput: eui.TextInput, thisObject: any): void;
        static removeInputListener(textInput: eui.TextInput, thisObject: any): void;
        static focusInTxtHandler(): void;
    }
}
declare module qmr {
    /**
     * 实现一个简单的链表结构
     */
    class LinkedList {
        private _head;
        private nodeLen;
        constructor();
        /**
         * 添加一个节点
         */
        append(element: any): void;
        /**获取节点索引*/
        indexOf(element: any): number;
        /**
         * 移除某个索引位置的节点
         */
        removeAt(pos: number): void;
        /**
         * 获取某个索引下的节点
         */
        getNodeAt(index: number): LinkNode;
        /**获取一个头节点*/
        readonly head: LinkNode;
        /**节点长度*/
        readonly size: number;
    }
    /**
     * 链表中的节点
     */
    class LinkNode {
        /**当前自身信息*/
        current: any;
        /**下个节点*/
        next: LinkNode;
        constructor(element: any);
    }
}
declare module qmr {
    class LogUtil {
        static errorLogRequest: egret.HttpRequest;
        static errorLogUrl: string;
        static reportLogData: {};
        /**
         * @description 打印普通日志
         */
        static log(msg: any, ...optionalParams: any[]): void;
        /** 保存并且打印日志 */
        static saveLogAndShowLog(logKey: any, msg: any): void;
        /**
         * @description 打印战斗日志
         */
        static logF(msg: any): void;
        /**
         * @description 打印warn日志
         */
        static warn(msg: any): void;
        /**
         * @description 打印error日志
         */
        static error(msg: any): void;
        /**  @description 打印Slow 添加的log日志, */
        static slowLog(msg: any): void;
    }
}
declare module qmr {
    class MathUtil {
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
        static manhattan(x1: number, y1: number, x2: number, y2: number): number;
        /**
         * @description 获取两个对象之间的直线距离
         */
        static distance(source: any, target: any): number;
        /**获取2点的角度 item -> ItemPre*/
        static getAngle(itemPre: any, item: any): number;
        /**
         * @description 比较两个64位的数字是否相等
         */
        static equal(a: any, b: any): boolean;
        /**
         * @description 获取两个数之间的
         */
        static randomCount(min: number, max: number): number;
        /**
         * @description 获取目标对象相对源对象之间的方向,八方向
         */
        static dir(source: any, target: any): number;
        static getRodomPos(area: number): {
            x: number;
            y: number;
        };
        /** 获得一定范围的高斯随机数 */
        static getGaussianPoint(xRange: number, yRange: number): egret.Point;
    }
}
declare module qmr {
    class Md5Util {
        private static instance;
        /**
         * @description 获取单例
         */
        static getInstance(): Md5Util;
        private hexcase;
        private b64pad;
        hex_md5(s: string): string;
        private b64_md5(s);
        private any_md5(s, e);
        private hex_hmac_md5(k, d);
        private b64_hmac_md5(k, d);
        private any_hmac_md5(k, d, e);
        private md5_vm_test();
        private rstr_md5(s);
        private rstr_hmac_md5(key, data);
        private rstr2hex(input);
        private rstr2b64(input);
        private rstr2any(input, encoding);
        private str2rstr_utf8(input);
        private str2rstr_utf16le(input);
        private str2rstr_utf16be(input);
        private rstr2binl(input);
        private binl2rstr(input);
        private binl_md5(x, len);
        private md5_cmn(q, a, b, x, s, t);
        private md5_ff(a, b, c, d, x, s, t);
        private md5_gg(a, b, c, d, x, s, t);
        private md5_hh(a, b, c, d, x, s, t);
        private md5_ii(a, b, c, d, x, s, t);
        private safe_add(x, y);
        private bit_rol(num, cnt);
    }
}
declare module qmr {
    /**
     * <p> <code>Pool</code> 是对象池类，用于对象的存储、重复使用。</p>
     * <p>合理使用对象池，可以有效减少对象创建的开销，避免频繁的垃圾回收，从而优化游戏流畅度。</p>
     */
    class Pool {
        /**@private 唯一标志 */
        private static POOLSIGN;
        /**@private  对象存放池。*/
        private static _poolDic;
        /**@private */
        private static _gid;
        /**
         * 根据对象类型标识字符，获取对象池。
         * @param sign 对象类型标识字符。
         * @return 对象池。
         */
        static getPoolBySign(sign: string): any[];
        /**
         * 清除对象池的对象。
         * @param sign 对象类型标识字符。
         */
        static clearBySign(sign: string): void;
        /**
         * 返回类的唯一标识
         */
        private static _getClassSign(cla);
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则根据传入的类型，创建一个新的对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param cls 用于创建该类型对象的类。
         * @return 此类型标识的一个对象。
         */
        static getItemByClass(sign: string, cls: any): any;
        /**
         * 将对象放到对应类型标识的对象池中。
         * @param sign 对象类型标识字符。
         * @param item 对象。
         */
        static recover(sign: string, item: Object): void;
        static isInPool(item: Object): boolean;
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则使用传入的创建此类型对象的函数，新建一个对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param createFun 用于创建该类型对象的方法。
         * @param caller this对象
         * @return 此类型标识的一个对象。
         */
        static getItemByCreateFun(sign: string, createFun: Function, caller?: any): any;
        /**
         * 根据传入的对象类型标识字符，获取对象池中已存储的此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         * @param sign 对象类型标识字符。
         * @return 对象池中此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         */
        static getItem(sign: string): any;
        /**获取一个全局唯一ID。*/
        static getGID(): number;
    }
}
declare module qmr {
    class ResPathUtil {
        /** 获取bg图路径 */
        static getBgUrl(resName: string): string;
        /** 地图资源路径 */
        static getMapUrl(mapName: string): string;
    }
}
declare module qmr {
    /**
     * @description 系统设置的一个工具类
     */
    class SettingUtil {
        private static instance;
        private sVariantType;
        constructor();
        /**
         * @description 获取单例对象
         */
        static getInstance(): SettingUtil;
        /**
         * @description 根据类型获取是否是屏蔽状态
         */
        getForbidState(bit: number): boolean;
        /**
         * @description 设置某一位的屏蔽状态
         */
        setForbidState(bit: number, value: number): void;
    }
}
declare module qmr {
    class StageUtil {
        /**游戏帧频 */
        static FRAME_RATE: number;
        private static lastOrientation;
        static STAGE_RESIZE: string;
        static STAGE_ACTIVE: string;
        static STAGE_DEACTIVATE: string;
        static DESIGN_WIDTH: number;
        static DESIGN_HEIGHT: number;
        static STANDARD_RATIO: number;
        /**可适配的最大高宽比，值会与平台配置文件覆盖，但当配置值大于默认值时使用默认值 */
        static MAX_HW_RATIO: number;
        /**可适配的最小高宽比，值会被平台配置文件覆盖，但当配置值小于默认值时使用默认值 */
        static MIN_HW_RATIO: number;
        static stage: egret.Stage;
        static maxStageWidth: number;
        static maxStageHeight: number;
        /**
         * @description 获取舞台宽度
         */
        static readonly stageWidth: number;
        /**
         * @description 获取舞台高度
         */
        static readonly stageHeight: number;
        /**
         *
         * @param value 设置舞台帧频
         */
        static setStageFrameRate(value: number): void;
        static getStageFrameRate(): number;
        static init(stage: any): void;
        /**
         * @description 注册舞台事件
         */
        static changeStageSize(): void;
        /**
         * @description 操作stage的舞台可点事件和非可点事件
         */
        static stageEnable(value: boolean): void;
        /**
         * 是否是电脑登录
         */
        static isPC(): boolean;
    }
}
declare module qmr {
    class StringUtilsBase {
        /**
         * {0}{1}....
         *
         */
        static getmsg(...arg: any[]): string;
    }
}
declare module qmr {
    /**
     *
     * @description 系统路径类枚举
     *
     */
    class SystemPath {
        static readonly loginPath: string;
        static readonly mapPath: string;
        static readonly defaultPath: string;
        static readonly rolePath: string;
        static readonly roleUiPath: string;
        static readonly bgPath: string;
        static readonly weaponPath: string;
        static readonly horsePath: string;
        static readonly wingPath: string;
        static readonly bg_music: string;
        static getEffect_musicUrl(musicName: string): string;
        static readonly itemIcon: string;
    }
}
declare module qmr {
    /**
     * 功能：文本框显示宽度固定。
     * 根据字符数量控制文本框的宽度和scale
     */
    class TextFixWidthUtil {
        private static _instance;
        constructor();
        static getInstance(): TextFixWidthUtil;
        strlen(str: string): number;
        fixTextBox(fixWidth: number, label: eui.Label): boolean;
    }
}
declare module qmr {
    class TickTool {
        backFun: Function;
        updateFun: Function;
        thisObj: any;
        private label;
        private des;
        private count;
        private runing;
        btn: eui.Button;
        /**
         * label 更改的文本
         * des 描述
         * thisObj 对象
         */
        constructor(label: eui.Label, des: string, thisObj: any);
        /** 按钮描述 */
        setDes(des: string): void;
        startTick(count: number, gap?: number): void;
        private tick();
        private showMsg();
        stopTick(): void;
    }
}
declare module qmr {
    class TimeUtil {
        /** 一天的毫秒数 **/
        static DAY_MICRO_SECONDS: number;
        /** 一小时的毫秒数 **/
        static HOUR_MICRO_SECONDS: number;
        /** 一分钟的毫秒数 **/
        static MINUTE_MICRO_SECONDS: number;
        /** 一秒钟的毫秒数 **/
        static SECOND_MICRO_SECONDS: number;
        /** 年 **/
        static readonly CN_YEAR: string;
        /** 月 **/
        static readonly CN_MONTH: string;
        /** 日 **/
        static readonly CN_SUN: string;
        /** 天 **/
        static readonly CN_DAY: string;
        /** 小时 **/
        static readonly CN_HOUR: string;
        /** 分 **/
        static readonly CN_MIN: string;
        /** 秒 **/
        static readonly CN_SEC: string;
        /**
         *时间误差，精确到毫秒
         */
        private static tickOffset;
        constructor();
        /**
         * 获取服务器时间，返回当前秒数(本机时间，所有活动计算时差请用getZoneOffsetSeverSecond方法)
         * @return
         *
         */
        static getServerSecond(): number;
        /**
         *  获取服务器时间，返回毫秒
         * @return
         */
        static readonly serverTime: number;
        /**
         * 获得服务器Unix时间，返回Date
         */
        static getSeverDate(): Date;
        /**
         * 获得服务器显示时间
         */
        static getZoneOffsetSeverDate(): Date;
        /**
         * 获得服务器，显示秒
         */
        static getZoneOffsetSeverSecond(): number;
        static syncServerTime(timeStamp: number): void;
        /**
         * 根据时间返回字符串时间
         * */
        static getTimeBySecond(second: number): string;
        /**
         * 根据时间戳返回字符串 xxxx-xx-xx 00:00:00
         * @time 毫秒
         */
        private static date;
        static getDateByTimer(time: number): string;
        /**
         * 根据时间戳返回字符串 xxxx-xx-xx 00:00:00
         * @time 秒
         */
        static getDateByTimerSecond(time: number): string;
        /**
         * 获取当前时间到明天00:00:00还有多少秒
         */
        static getDayOverTime(): number;
        /**
         * 获取当前时间点
         */
        static getDayTime(): number;
        /**
         * 转换成今天的时间点
         */
        static getTimeToNow(time: number): number;
        /**
         * 根据时间返回字符串 00:00:00
         */
        static formatDate(date: Date): string;
        /**
         * 根据时间返回字符串 00:00:00,超过24小时，只会显示超过的时间
         */
        static formatTime(second: number): string;
        /**
         * 根据时间返回字符串 00:00:00
         */
        static formatTime1(second: number): string;
        /**
         * 小时分钟
         * @param second
         * @return
         */
        static formatTime4(second: number): string;
        /**
             *根据时间返回字符串 00分00秒
         */
        static formatTime5(second: number): string;
        /**
         * 根据时间返回字符串 00:00
         */
        static formatTime2(second: number): string;
        /**
         * 根据时间返回字符串 00:00:00
         */
        static formatTime3(second: number): string;
        /**
         * 根据时间返回字符串 xx分xx秒
         */
        static formatTime6(second: number): string;
        /** 00:00 一天当中的多少小时分钟 */
        static formatTime7(second: number): string;
        /**
         * 格式化数据网格列日期 MM-DD JJ:NN
         */
        static formatColumnDate(tempDate: Date): string;
        /**
         *
         * @param date
         * @return
         * 2012/12/12 12:12
         */
        static formatDate1(date: Date): string;
        /**
         * XX年XX月XX日
         */
        static formatYMD(date: Date): string;
        /**
         * 显示时间（英文格式）月/日/年
         * @return
         */
        static formatYMDForEn(date: Date): string;
        /**
         * 年/月/日（例：2012/12/12）
         */
        static formatYMD1(date: Date): string;
        /**
         * XX天XX时XX分XX秒
         */
        static formatRemain(second: number): string;
        /**
         * XX天XX时XX分
         */
        static formatRemain1(second: number): string;
        static formatRemain3(second: number): string;
        /**
         *
         * @param second
         * @return [day,hour,min]
         *
         */
        static formatRemain2(second: number): Array<any>;
        /**
         * 返回不为0的格式
         */
        static formatRemain4(second: number): string;
        /**
         * xxd,xxh,xxm,xxs
         */
        static formatRemain5(second: number): string;
        /**
         *  xd 00:00:00
         */
        static formatRemain6(second: number): string;
        /**
         *  xd 00:00:00 / 00:00
         */
        static formatRemain7(second: number): string;
        /**
         * 返回不为0的格式X天X小时X分钟X秒
         */
        static formatRemain8(second: number): string;
        /**
         * 00:00:00
         */
        static formatRemainForEn(second: number): string;
        /**
         * 获取两个时间之间的相差（天、时、分、秒）
         * @param time1:Number 时间1(ms)
         * @param time2:Number 时间2(ms)
         * @return Array = [天,时,分,秒]
         */
        static getTimeDifference(time1: number, time2: number): Array<any>;
        timeStrToDate(timeStr: string): Date;
        /**
         * 不够两位的补零
         */
        static dateStringFillZero(num: number): string;
        static gettodayTimeByHour(hour: number): number;
        /**
         * 获取时分秒
         * @param _second
         * @return
         *
         */
        static changeServerTimeToSeconds(_second: number): number;
        /**
         * 将当日时间(非时间戳)转为毫秒
         * @param hours 小时
         * @param minutes 分钟
         * @param seconds 秒
         * @return 当日时间毫秒数
         */
        static timeToMilSeconds(hours?: number, minutes?: number, seconds?: number): number;
        /**
         * 获取一个指定月日时分秒时间戳（毫秒）
         */
        static getTimeStamp2(month?: number, day?: number, hours?: number, minutes?: number, seconds?: number): number;
        /**
         * 获取一个指定年月日时分秒时间戳（毫秒）
         */
        static getTimeStamp3(year?: number, month?: number, day?: number, hours?: number, minutes?: number, seconds?: number): number;
        /**
         * 获取当前服务器时间是周几
         */
        static getCurDay(): number;
        /**
        * 获取指定时 分 服务器所在的时间戳(毫秒)
        * @param hour
        * @param minutes
        */
        static getTimeStamp(hour: number, minutes: number): number;
        /**
         * 获取距离当前时间间隔天数的时间戳
         */
        static getDayTimeStamp(addDay: number): number;
        /**
        * 获取指定时 分 指定时间点所在的时间戳(毫秒)
        * @param hour
        * @param minutes
        */
        static getTimeStampByTime(timeStamp: number, hour: number, minutes: number): number;
        /**
         *获取日期之间相距的天数
         * @param startDate
         * @param endDate
         * @return
         *
         */
        static getBetweenDays(endTime: number, startTime: number): number;
        /**
        *获取经过的总天数。距离 1970 年 1 月 1 日
        * @param date
        * @return
        *
        */
        static getTotalDays(date: Date): number;
        /**
         *获取经过的总天数。距离 1970 年 1 月 1 日
         * @param time	毫秒级时间
         * @return
         *
         */
        static getTotalDaysByTime(time: number): number;
        /**
         * 把一个时间戳转化为年月日
         */
        static getTimeNoHourSecond(time: number): number;
        /** 不足两位补0 */
        static getZeroize(time: number): string;
        /** 去掉小时，分，秒今天的时间戳 */
        static getTodayStartTime(): number;
        /**
         * 时间格式拆分返回
         * timeStr  --"2018-10-19 19:07:00"
         */
        static getTimesplit(timeStr: string): Object;
        /**
         * 获取今天凌晨的时间戳（昨晚12点）
         */
        static fun10(): number;
        /** 根据年月日获取星期几 0表示星期日,1表示星期一*/
        static getWeekByTime(year: number, month: number, day: number): number;
        /** 根据年月日获取星期几 0表示星期日,1表示星期一*/
        static getWeekByTimeStr(year: number, month: number, day: number): string;
    }
}
import TimeUtil = qmr.TimeUtil;
declare module qmr {
    /**
     * @description 浏览器工具类
     */
    class WebBrowerUtil {
        static md: any;
        /**操作系统*/
        static OS: string;
        /**手机型号*/
        static model: string;
        constructor();
        /**初始化系统信息 */
        static initSysInfo(): void;
        private static initMd();
        private static contains(strArr, needle);
    }
}
