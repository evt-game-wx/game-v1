module qmr {
	/**游戏服务器登录流程控制类 */
	export class LoginManager 
	{
		public static async showLoginView()
		{
			ModuleManager.showModule(ModuleNameLogin.LOGIN_VIEW);
		}
	}
}