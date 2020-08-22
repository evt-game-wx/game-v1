module qmr
{
	/**
	 * 
	 * 游戏激活触发事件
	 * coler
	 * 
	 */
	export class GameLifecycleManger
	{
		public static get instance(): GameLifecycleManger
		{
			if (this._instance == null) { this._instance = new GameLifecycleManger; }
			return this._instance;
		}
		private static _instance: GameLifecycleManger;
		private static bgSoundIsOpen = true;
		private static effectSoundIsOpen = true;
		

		/**共计后台运行的次数 */
		public onHideCount: number = 0;

		public constructor()
		{
		}
		
		public init() {
            egret.lifecycle.onPause = () =>
            {
                this.onPause();
                // egret.ticker.pause();
            }

            egret.lifecycle.onResume = () =>
            {
                this.onResume();
                // egret.ticker.resume();
            }
		}

		/** 游戏重现获得焦点触发 */
		public onResume()
		{
			LogUtil.log("焦点触发");
			SoundManager.getInstance().isMusicSoundOpen = GameLifecycleManger.bgSoundIsOpen;
			SoundManager.getInstance().isEffectSoundOpen = GameLifecycleManger.effectSoundIsOpen;
			/** 开启背景音乐 */
			// SoundManager.getInstance().reStartMusic();
			// egret.ticker.resume();
			PlatformManager.instance.platform.onShareBack();
		}

		/** 焦点失去时触发 */
		public onPause()
		{
			LogUtil.log("焦点失去");
			//记录后台运行次数
			GameLifecycleManger.instance.onHideCount ++;
			/** 关闭背景音乐 */
			// SoundManager.getInstance().stopMusic();
			// egret.ticker.pause();

			GameLifecycleManger.bgSoundIsOpen = SoundManager.getInstance().isMusicSoundOpen;
			GameLifecycleManger.effectSoundIsOpen = SoundManager.getInstance().isEffectSoundOpen;
			SoundManager.getInstance().isMusicSoundOpen = false;
			SoundManager.getInstance().isEffectSoundOpen = false;
			
		}
	}
}