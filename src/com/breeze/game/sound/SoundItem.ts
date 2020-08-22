module qmr
{
	/**
	 *
	 * @desc 单个sound存储
	 *
	 */
	export class SoundItem
	{
		public sound: egret.Sound;
		public soundChannel: egret.SoundChannel;
		public isPlay: boolean;
		public type: string;
		public constructor(sound: egret.Sound = null, type: string = egret.Sound.EFFECT)
		{
			this.sound = sound;
			this.isPlay = false;
			this.type = type;
			if (sound != null)
			{
				this.sound.type = type;
			}
		}
		/**
		 * 播放声音
		 */
		public play(startTime: number, loops: number = 0): void
		{
			if (this.sound != null)
			{
				this.isPlay = true;
				this.soundChannel = this.sound.play(startTime, loops);
				this.soundChannel.once(egret.Event.SOUND_COMPLETE, this.onPlayerEnd, this);
				if (this.sound.type == egret.Sound.MUSIC)
				{
					this.soundChannel.volume = 0.7;
				}
			}
		}

		private onPlayerEnd(): void
		{
			this.isPlay = false;
		}

		/**
		 * 停止播放
		 */
		public stop(): void
		{
			if (this.sound != null)
			{
				this.isPlay = false;
				if (this.soundChannel != null)
				{
					this.soundChannel.stop();
				}
			}
		}
		/**
		 * @desc 当前播放位置
		 */
		public get position(): number
		{
			if (this.soundChannel)
			{
				return this.soundChannel.position;
			}
			return 0;
		}
	}
}
