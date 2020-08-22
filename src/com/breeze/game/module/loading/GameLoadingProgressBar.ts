module qmr
{
	export class GameLoadingProgressBar extends eui.Component
	{
		public imgProgressBg: eui.Image;
		public imgProgress: eui.Image;
		public imgCloud: eui.Image;
		public labHint: eui.Label;

		public constructor()
		{
			super();
			this.skinName = "GameLoadingProgressBarSkin";
			this.touchEnabled = this.touchChildren = false;
		}

		public showProgressRate(rateNum: number, isShowTween: boolean = false): void
		{
			let rate: number = rateNum;
			if (rate <= 0) rate = 0;
			if (rate >= 1) rate = 1;
			let progressWidth: number = rate * 528;
			egret.Tween.removeTweens(this.imgProgress);
			if (!isShowTween)
			{
				this.imgProgress.width = progressWidth;
			}
			else
			{
				egret.Tween.get(this.imgProgress).to({ width: progressWidth }, 300);
			}
			this.imgCloud.x = progressWidth;
		}

		public setLoadingTip(txt: string): void
		{
			this.labHint.text = txt;
		}

		public dispose(): void
		{
			egret.Tween.removeTweens(this.imgProgress);
		}
	}
}