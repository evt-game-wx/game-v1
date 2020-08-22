module qmr {
	export class GameMain {
		
		public static async setup(stage) 
		{
			WebBrowerUtil.initSysInfo();
			//初始化平台配置文件
			await PlatformConfig.init();
			StageUtil.init(stage);
        	egret.ImageLoader.crossOrigin = "anonymous";
			//注入自定义的素材解析器
			egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
			egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
			//在最开始将AssetsManager的默认版本控制替换掉
			RES.registerVersionController(new VersionController());
			MessageIDLogin.init();
			LayerManager.instance.setup(StageUtil.stage);
			ModuleManager.setupClass();
			LoginController.instance;//登录协议注册
			SystemController.instance;//系统协议注册
			GameLifecycleManger.instance.init();
			//this.stage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF;
			this.initLocalStorage();
			await GameLoadManager.instance.loadLoginRes();

			await LoginManager.showLoginView();
		}

		/** 读取缓存 */
		private static initLocalStorage()
		{
			let isCloseBgSound = egret.localStorage.getItem("bgSoundIsOpen") == "0";
			let isCloseEffectSound = egret.localStorage.getItem("effectSoundIsOpen") == "0";
			
			console.log("背景音乐是否关闭：" + isCloseBgSound);
			console.log("音效是否关闭：" + isCloseEffectSound);
			
			SoundManager.getInstance().isMusicSoundOpen = !isCloseBgSound;
			SoundManager.getInstance().isEffectSoundOpen = !isCloseEffectSound;
		}

	}
}