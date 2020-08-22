module qmr
{
	/**
	 *
	 * @description 登陆通信控制器
	 *
	 */
	export class LoginController extends BaseController
	{
		private static _instance: LoginController;
		/**  获取单例对象  */
		public static get instance(): LoginController
		{
			if (this._instance == null) { this._instance = new LoginController(); }
			return this._instance;
		}

		constructor()
		{
			super();
		}

		protected initListeners(): void
		{
		}

		public isEnterGame:boolean = false;
		public async onEnterGame()
		{
			this.isEnterGame = true;
			this.destoryLoginRes();
			/**
			 * 非常重要：
			 * 这里是进入游戏之前加载完成必须加载
			 * 进入游戏所需要资源必须在这里先加载完成后才允许执行游戏渲染逻辑
			 * */
			// GameLoadManager.instance.loadGameResAfterLogin();
			// await GameLoadManager.instance.waitGameResLoaded();
			// EntryAfterLogin.onEnterGame();
		}

		private destoryLoginRes()
		{
			var preLoadBg = document.getElementById("preLoadBg");
			if (preLoadBg && preLoadBg.parentNode){
				preLoadBg.parentNode.removeChild(preLoadBg);
			}
			ModuleManager.hideModule(ModuleNameLogin.LOGIN_VIEW, true);
		}
	}
}
