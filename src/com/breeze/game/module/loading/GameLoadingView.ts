module qmr
{
	/**
	 * 游戏大加载进度条
	 */
	export class GameLoadingView extends SuperBaseModule
	{
		private static _instance: GameLoadingView;
		public static getInstance(): GameLoadingView
		{
			if(!GameLoadingView._instance){
				GameLoadingView._instance = <GameLoadingView>ModuleManager.getAppByClass(ModuleNameLogin.GAME_LOADING_VIEW);
			}
			return GameLoadingView._instance;
		}

		private static bgName: string; 

		public progressBar1: qmr.GameLoadingProgressBar;
		public progressBar2: qmr.GameLoadingProgressBar;
		public labRefresh: eui.Label;
		public imgBg: eui.Image;
        private currentProgress: number = 0;       //当前进度
        private maxProgress: number = 100;         //最大进度
        private fromProgressTotal: number = 0;
        private dProgressTotal: number = 1;
        private tid: number;
		readonly HREF: string = "event_refresh_game";

		public constructor()
		{
			super();
            this.needAdaptStatusBar = false;
			this.skinName = "GameLoadingViewSkin"; 
			this.progressBar1.visible = true;
			this.progressBar2.visible = true;
		}

		protected initComponent()
		{
			super.initComponent();
			let actionName: string = " 刷新游戏";
			if(PlatformManager.instance.platform.canClearResCache)
			{
				actionName = " 清除缓存";
			}
			let arr1:egret.ITextElement[] = HtmlUtil.getHtmlTextElement("若长时间加载不成功，请点击", 0xffffff);
			let arr2: egret.ITextElement[] = HtmlUtil.getHtmlTextElement(actionName, 0x31FF2C, true, this.HREF, 0x1D4810, 1);
			this.labRefresh.textFlow = arr1.concat(arr2);
			this.labRefresh.touchEnabled = true;
		}

		/**
         * 初始化事件监听器,需被子类继承
         */
		protected initListener(): void
		{
			super.initListener();
			this.addEvent(this.labRefresh, egret.TextEvent.LINK, this.onRefresh, this);
		}

		protected addedToStage(evt: egret.Event): void
		{
			super.addedToStage(evt);
		}

		public showSelf(msg: string, showVitureProgress: boolean = true, fromProgress: number = 0, toProgress: number = 1, isShowTween: boolean = true): void {
			if(!ModuleManager.isShowModule(ModuleNameLogin.GAME_LOADING_VIEW)) {
                ModuleManager.showModule(ModuleNameLogin.GAME_LOADING_VIEW, null, LayerConst.LOADING, false);
            }
			this.setPrelMessage(msg);
			if(this.fromProgressTotal >= 0.99){
				showVitureProgress = false;
				isShowTween = false;
			}
            if(showVitureProgress){
                this.showVitureProgress();
            } else{
                this.closeVitureProgress();
            }
            this.fromProgressTotal = fromProgress;
            this.dProgressTotal = toProgress - fromProgress;
            this.updateTotalProgress(0, isShowTween);
		}

		public hideSelf(): void {
            this.currentProgress = 0;
			if(ModuleManager.isShowModule(ModuleNameLogin.GAME_LOADING_VIEW)) {
                ModuleManager.hideModule(ModuleNameLogin.GAME_LOADING_VIEW);
            }
		}

        public updateTotalProgress(progress: number, isShowTween: boolean = false){
            if(this.isShow) {
				if(this.fromProgressTotal >= 0.99){
					this.closeVitureProgress();
					isShowTween = false;
				}
                this.showTotalProgress(this.fromProgressTotal + progress*this.dProgressTotal, isShowTween);
            }
        }

        /**
         * 跑虚拟进度
         */
        private showVitureProgress(): void {
            if (!this.tid) {
                this.tid = setInterval(() => {
                    this.updateAutoLoading();
                }, 50);
                this.updateAutoLoading();
            }
        }

        /**
         * @description 关闭进度条
         */
        public closeVitureProgress(): void {
            if (this.tid) {
                clearInterval(this.tid);
                this.tid = null;
            }
			this.showPreProgress(1);
        }
        
        private updateAutoLoading(): void {
            if (this.currentProgress < this.maxProgress) {
                this.currentProgress += 10;
            }
            else {
                this.currentProgress = 0;
            }
			this.showPreProgress(this.currentProgress / this.maxProgress);
        }

		private onRefresh(evt: egret.TextEvent): void
		{
			PlatformManager.instance.platform.reloadGame(PlatformManager.instance.platform.canClearResCache);
		}

		public setPrelMessage(tips: string): void
		{
			this.progressBar1.setLoadingTip(tips);
		}

		public setTotalMessage(tips: string): void
		{
			this.progressBar2.setLoadingTip(tips);
		}

		/**
		 * 总进度
		 */
		public showTotalProgress(rateNum: number, isShowTween: boolean = false): void
		{
			this.progressBar2.showProgressRate(rateNum, isShowTween);
		}

		/**
		 * 单进度
		 */
		public showPreProgress(rateNum: number, isShowTween: boolean = false): void
		{
			this.progressBar1.showProgressRate(rateNum, isShowTween);
		}

		/**
         *  资源释放
         */
		public dispose(): void
		{
            this.currentProgress = 0;
            this.closeVitureProgress();
			super.dispose();
			LoaderManager.instance.destoryGroup("serverlist_loginBg_jpg");
		}
	}
}