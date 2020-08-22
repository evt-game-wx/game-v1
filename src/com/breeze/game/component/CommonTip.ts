module qmr
{
	export class CommonTip extends UIComponent
	{
		private content: eui.Group;
		private common_g: eui.Group;
		private lbl_tipMsg: eui.Label;
		private bgd: eui.Image;
		public img_icon:eui.Image;
		private iscompleted: boolean = false;
		private isSeted: boolean = false;
		public constructor()
		{
			super();
			this.skinName = "CommonTipSkin";
			this.touchEnabled = this.touchChildren = false;
		}
		
		protected initComponent(): void
		{
			super.initComponent();
			this.iscompleted = true;
		}
		
		protected initData()
		{
			super.initData();
			this.setTip();
		}

		public onStageResize(): void
		{
			super.onStageResize();
			this.x = (StageUtil.stageWidth - 640) / 2;
		}
		/**
		 * @description显示操作成功与失败的普通提示
		 */
		public showTip(data: any): void
		{
			this.data = data;
			if (this.iscompleted)
			{
				this.setTip();
			}
		}
		public setTip(): void
		{
			if (!this.data) return;
			if (this.isSeted) return;
			this.x = (StageUtil.stageWidth - 640) / 2;
			this.isSeted = true;
			this.alpha = 1;
			if (this.data.color)
			{
				this.lbl_tipMsg.text = this.data.mess;
				this.lbl_tipMsg.textColor = this.data.color;
			}
			else
			{
				this.lbl_tipMsg.textFlow = HtmlUtil.getHtmlString(this.data.mess);
			}
			if(this.data.itemcfg)
			{
				ImageUtil.setItemIcon(this.img_icon, this.data.itemcfg.icon, this.data.itemcfg.page);
			}
			this.y = StageUtil.stageHeight / 2 - this.height / 2 + this.data.yPos;
			this.common_g.width = this.lbl_tipMsg.width + 200;
			egret.Tween.get(this)
				.to({ y: StageUtil.stageHeight / 3 + 50 + this.data.yPos }, 1500)
				.to({ y: StageUtil.stageHeight / 3 + this.data.yPos, alpha: 0 }, 800)
				.call(this.dispose, this);
		}
		/**
		 * @desc onFlyEnd
		 */
		public dispose(): void
		{
			this.data = null;
			this.isSeted = false;
			this.lbl_tipMsg.text = "";
			this.img_icon.source = null;
			egret.Tween.removeTweens(this);
			super.dispose();
			TipManagerCommon.getInstance().recycleCommonTip(this);
		}
	}
}