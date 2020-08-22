module qmr
{
	/**
	 *
	 * @description 所有模块的基类
	 *
	 */
	export class SuperBaseModule extends UIComponent
	{
		public preModule: SuperBaseModule;
		/**界面标题*/
		public title: string;
		public ruleId: number;
		/**使用时间*/
		public useTime: number;
		/** 模块引用的资源组 */
		protected _groupName: string;
		/** 皮肤名 */
		protected _qmrSkinName: string;

		/** 是否可以点击背景黑幕来关闭面板 */
		public isClickHide: boolean = true;
		/** 是否需要半透明遮罩 */
		public isNeedMask: boolean = false;
		/** 是否需要全透明遮罩 */
		public isNeedAlpha0Mask: boolean = false;
		/** 是否需要弹出效果 */
		public isPopupEffect: boolean = false;
		/** 是否居中显示，居中显示不做屏幕大小适配 */
		public isCenter: boolean = false;
		/** 是否适配屏幕状态栏（刘海屏） */
		public needAdaptStatusBar: boolean = true;
		/** 是否显示中 */
		private _isShow: boolean = false;
		/** 遮罩 */
		public maskSprite: LayerMaskSprite;
		/**关闭后要打开的界面*/
		public closeOpenPanel: string;
		public closeOpenPanelData: any;
		public offsetY: number = 0;//弹出界面位置偏移
		/** 打开在某一层 */
		public layer: LayerConst;

		public constructor()
		{
			super();
		}

		/** 设置资源组名字,需要在构造函数里面调用 */
		public set groupName(value: string)
		{
			this._groupName = value;
		}

		public get groupName(): string
		{
			return this._groupName;
		}

		/** 设置皮肤名字 */
		public set qmrSkinName(value: string)
		{
			this._qmrSkinName = value;
		}

		/** 初始化组件 */
		protected initComponent(): void
		{
			super.initComponent();
			this.resetPos();
			this.initUnpackRes(this);
		}

		/** 刷新界面指引 */
		public updateGuide():void{

		}

		protected resetPos()
		{
			if (this.isPopupEffect || this.isCenter)
			{
				this.anchorOffsetX = this.width >> 1;
				this.anchorOffsetY = (this.height >> 1) + this.offsetY;
				this.x = StageUtil.stageWidth >> 1;
				this.y = StageUtil.stageHeight >> 1;
			}
		}

		/** 初始化事件 */
		protected initListener(): void
		{
			let t = this;
			if (t.numChildren > 0)
			{
				// let panelBg = t.getChildAt(0);
				// if (panelBg && panelBg instanceof PanelBgUI)
				// {
				// 	t._panelBg = panelBg;
				// 	t.addClickEvent(panelBg.btnClose, t.onPageBgCloseView, t);
				// }
				// else if (panelBg && panelBg instanceof PanelPopBgUI)
				// {
				// 	t.addClickEvent(panelBg.btnClose, t.onPageBgCloseView, t);
				// }
				// else if (panelBg instanceof egret.DisplayObjectContainer)
				// {
				// 	if (panelBg.numChildren > 0)
				// 	{
				// 		let child = panelBg.getChildAt(0);
				// 		if (child && child instanceof PanelPopBgUI)
				// 		{
				// 			t.addClickEvent(child.btnClose, t.onPageBgCloseView, t);
				// 		}
				// 	}
				// }
			}
			t.registerNotify(StageUtil.STAGE_RESIZE, t.onStageResize, t);
			super.initListener();
		}

		/** 对象是否有效 */
		public getEffective(now: number, maxAliveTime: number): boolean
		{
			if (this.isShow)
			{
				return true;
			}
			if (this.useTime && now - this.useTime >= maxAliveTime)
			{
				return false;
			}
			return true;
		}

		/**关闭界面 不满意子类重写*/
		protected onPageBgCloseView(): void
		{
			this.hide();
		}

		protected addedToStage(evt: egret.Event): void
		{
			super.addedToStage(evt);
			egret.callLater(this.popupEffect, this);
		}

		protected onStageResize(evt?: egret.Event): void
		{
			let t = this;
			if (!(t.isPopupEffect || t.isCenter))
			{
				t.width = StageUtil.stageWidth;
				//刘海屏适配？临时处理
				if(StageUtil.stageHeight > 1400 && t.needAdaptStatusBar) {
					t.height = StageUtil.stageHeight - 50;
					t.y = 50;
				} else {
					t.height = StageUtil.stageHeight;
					t.y = 0;
				}
			}
			t.resetPos();
			t.layout();
			if(t.maskSprite) {
				t.maskSprite.onStageResize();
			}
		}
		/**
		 * 打开模块
		 * @param data 打开模块时，需要向这个模块传递的一些数据
		 */
		public show(data?: any): void
		{
			let t = this;
			t.data = data;
			if (!t.isSkinLoaded)
			{
				if (t._qmrSkinName)
				{
					t.skinName = t._qmrSkinName;
				}
			} else
			{
				t.initListener();
				egret.callLater(t.initData, t);
			}
			t.isShow = true;
		}

		/** 获取当前模块的显示状态 */
		public get isShow(): boolean
		{
			return this._isShow;
		}

		public set isShow(flag: boolean)
		{
			this._isShow = flag;
		}

		/** 界面初始化之后布局 */
		protected layout(): void
		{

		}

		/** 获取模块中某个控件在舞台中的位置 */
		public getComponentGlobalPoint(componentName: string): any
		{
			let component: egret.DisplayObject = this[componentName];
			if (component)
			{
				if (component.parent)
				{
					return component.parent.localToGlobal(component.x, component.y);
				} else
				{
					return component.localToGlobal(component.x, component.y);
				}
			}
			return { x: 0, y: 0 };
		}

		/** 隐藏界面 */
		public hide(): void
		{
			if (this.isPopupEffect)
			{
				this.closeEffect();
			}
			else
			{
				ModuleManager.hideModule(this);
			}
		}

		/** 弹出对话框效果*/
		public popupEffect(): void
		{
			let t = this;
			if (!t.isPopupEffect) return;
			t.alpha = 0.2;
			t.scaleX = 0.2; t.scaleY = 0.2;
			let toX: number, toY: number;
			if (t.openPos)
			{
				toX = t.openPos.x;
				toY = t.openPos.y;
			}
			else
			{
				toX = (StageUtil.stageWidth) >> 1;
				toY = (StageUtil.stageHeight) >> 1;
			}
			egret.Tween.get(t).to({ scaleX: 1, scaleY: 1, alpha: 1, x: toX, y: toY }, 200, egret.Ease.backOut).call(t.doOpenOver, t);
		}

		/** 关闭对话框效果*/
		public closeEffect(): void
		{
			let toX: number = 0;
			let toY: number = 0;
			if (this._closePos)
			{
				toX = this._closePos.x;
				toY = this._closePos.y;
			}
			else
			{
				toX = (StageUtil.stageWidth) >> 1;
				toY = (StageUtil.stageHeight) >> 1;
			}
			egret.Tween.get(this).to({ scaleX: 0.3, scaleY: .3, alpha: 0, x: toX, y: toY }, 180, egret.Ease.cubicOut).call(this.doCloseOver, this);
		}

		/** 执行打开弹出框 */
		public doOpenOver(): void
		{

		}

		/** 执行关闭弹出框 */
		public doCloseOver(): void
		{
			ModuleManager.hideModule(this);
		}

		/** 关闭位置 */
		private _closePos: egret.Point;
		public set closePos(value: egret.Point)
		{
			this._closePos = value;
		}

		public get closePos(): egret.Point
		{
			return this._closePos;
		}

		/** 打开位置 */
		private _openPos: egret.Point;
		public set openPos(value: egret.Point)
		{
			this._openPos = value;
		}

		public get openPos(): egret.Point
		{
			return this._openPos;
		}

		/** 资源释放 */
		public dispose(): void
		{
			super.dispose();
			this.isShow = false;
			this.useTime = egret.getTimer();
			if (this.title)
			{
				this.updateTitle("", 0);
			}
			let groupName = this.groupName;
			if (groupName != undefined && groupName != "")
			{
				LoaderManager.instance.destoryGroup(groupName);
			}
		}

		/**
		 * 关闭自身
		 */
		protected closeView(): void
		{
			qmr.ModuleManager.hideModule(this);
		}
	}
}