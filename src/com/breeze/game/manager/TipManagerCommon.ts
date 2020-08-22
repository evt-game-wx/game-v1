module qmr
{
	export class TipManagerCommon
	{
		private static instance: TipManagerCommon;
		/**
		 * @desc 获取一个单例
		 */
		public static getInstance(): TipManagerCommon
		{
			if (TipManagerCommon.instance == null)
			{
				TipManagerCommon.instance = new TipManagerCommon();
			}
			return TipManagerCommon.instance;
		}

		private commonMessInfo: Array<{ mess: string, color: number, yPos: number, itemcfg: ItemConfigCfg }>;	/** 同上 */

		private isConmmoning: boolean;

		/*------操作上的提示--带背景-----*/
		private commonTips: Array<CommonTip>;
		//多个飘字的间隔时间
		private commonTipCdTime: number = 500;

		public constructor()
		{
			this.commonMessInfo = [];

			this.isConmmoning = false;

			this.commonTips = [];
		}

		/**
		 * ----------------------------添加飘字内容-------------------------------
		 * 添加了新的背景，所有的颜色只能用白色  2017-04-01 by Don
		 */
		public createCommonTip(msg: string, msgColor: number = 0xffffff, yPos: number = 0, itemcfg: ItemConfigCfg = null): void
		{
			let flag: boolean = false;
			for (let item of this.commonMessInfo)
			{
				if (item.mess == msg)
				{
					flag = true;
					break;
				}
			}
			if (!flag)
			{
				this.commonMessInfo.push({ mess: msg, color: msgColor, yPos: yPos, itemcfg: itemcfg });
			}
			if (!this.isConmmoning)
			{
				this.isConmmoning = true;
				this.showCommonTip();
			}
		}

		/**成功飘绿色的/失败飘红色*/
		public createCommonColorTip(msg: string, isSuccess: boolean = false, yPos: number = 0, itemcfg: ItemConfigCfg = null): void
		{
			this.createCommonTip(msg, isSuccess ? 0x09a608 : 0xFF0000, yPos, itemcfg);
		}

		public recycleCommonTip(commonTip: CommonTip): void
		{
			this.commonTips.push(commonTip);
		}

		/**
		 * 在界面显示飘字内容
		 */
		private showCommonTip(): void
		{
			if (!this.isConmmoning) return;
			let messInfo = this.commonMessInfo.shift();
			if (!messInfo) return;
			let commonTip: CommonTip = this.commonTips.shift();
			if (!commonTip)
			{
				commonTip = new CommonTip();
			}
			LayerManager.instance.addDisplay(commonTip, LayerConst.TIP);
			commonTip.showTip(messInfo);
			egret.setTimeout(() =>
			{
				if (!this.commonMessInfo.length)
				{
					this.isConmmoning = false;
				} else
				{
					this.showCommonTip();
				}
			}, this, this.commonTipCdTime);
		}
	}
}