module qmr
{
	export class LoginModel
	{
		public constructor()
		{
		}

		private static _instance: LoginModel;
		public static get instance(): LoginModel
		{
			if (this._instance == null) { this._instance = new LoginModel; }
			return this._instance;
		}

	}
}
