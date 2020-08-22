module qmr
{
	export class TickTool
	{
		public backFun: Function;
		public updateFun: Function;
		public thisObj: any;
		private label: eui.Label;
		private des: string;
		private count: number;
		private runing: boolean;
		public btn: eui.Button;

		/**
		 * label 更改的文本
		 * des 描述
		 * thisObj 对象
		 */
		public constructor(label: eui.Label = null, des: string = null, thisObj:any)
		{
			this.label = label;
			this.des = des;
			this.thisObj = thisObj;
		}

		/** 按钮描述 */
		public setDes(des: string)
		{
			this.des = des;
		}

		public startTick(count: number, gap: number = 1000): void
		{
			this.runing = true;
			this.count = count;
			Ticker.getInstance().registerTick(this.tick, this, gap);
			this.showMsg();
		}

		private tick(): void
		{
			if (this.count-- < 1)
			{
				this.stopTick();
				if (this.backFun)
				{
					this.backFun.call(this.thisObj);
				}
				return;
			}
			if (this.updateFun)
			{
				this.updateFun.call(this.thisObj);
			}
			this.showMsg();
		}

		private showMsg(): void
		{
			if (this.label)
			{
				if (this.des)
				{
					this.label.text = CommonTool.getMsg(this.des, this.count);
				}
			}
			if (this.btn)
			{
				if (this.des)
				{
					this.btn.label = CommonTool.getMsg(this.des, this.count);
				}
			}
		}

		public stopTick(): void
		{
			if (!this.runing)
			{
				return;
			}
			this.runing = false;
			Ticker.getInstance().unRegisterTick(this.tick, this);
		}
	}
}