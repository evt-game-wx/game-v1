module qmr {
	/**
	 *
	 * @description 游戏loading
	 *
	 */
    export class GameLoading extends eui.Group {
        private static inttance: GameLoading;
        private _txProgress: eui.Label;
        private _loadingRun: eui.Image;
        private rect: eui.Rect;
        public constructor() {
            super();
            let t = this;
            t.addEventListener(egret.Event.REMOVED_FROM_STAGE, () => {
                if (t.hasEventListener(egret.Event.ENTER_FRAME)) {
                    t.removeEventListener(egret.Event.ENTER_FRAME, t.runLoading, t);
                }
            }, t);
            t.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
                t.setProgress(0, 1);
                t.addEventListener(egret.Event.ENTER_FRAME, t.runLoading, t);
            }, t);
            t.touchEnabled = true;
        }

        private onTouch(evt: egret.TouchEvent): void {
            evt.stopImmediatePropagation();
        }

        private runLoading(evt: egret.Event) {
            if (this._loadingRun) {
                this._loadingRun.rotation += 3;
            }
        }
		/**
		 * @description 获取loading单例对象
		 */
        public static getInstance(): GameLoading {
            if (GameLoading.inttance == null) {
                GameLoading.inttance = new GameLoading();
            }
            return GameLoading.inttance;
        }
        public createChildren() {
            super.createChildren();
            this.rect = new eui.Rect();
            this.rect.fillColor = 0x0;
            this.rect.fillAlpha = 0.2;
            this.addChild(this.rect);
            this.rect.touchEnabled = true;
            this.rect.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
            this._loadingRun = new eui.Image(RES.getRes("preloading_loading_png"));
            this.addChild(this._loadingRun);
            this._txProgress = new eui.Label;
            this.addChild(this._txProgress);
            this.updateSize();
        }
        /**
         * @description 更新尺寸
         */
        private updateSize(): void {
            this._loadingRun.verticalCenter = 0;
            this._loadingRun.horizontalCenter = 0;
            this._txProgress.verticalCenter = 0;
            this._txProgress.horizontalCenter = 0;
            this._txProgress.size = 20;
            // this._txProgress.stroke = 1;
            // this._txProgress.strokeColor = 0;
            this.rect.width = StageUtil.stageWidth;
            this.rect.height = StageUtil.stageHeight;
        }
        /**
         * @description 设置加载进度
         */
        private vitureCount: number = 0;
        public setProgress(itemsLoaded: number, itemsTotal: number): void {
            LayerManager.instance.addDisplay(this, LayerConst.TOP);
            if (this._txProgress) {
                this._txProgress.text = Math.round(itemsLoaded / itemsTotal * 100) + "%";
                if (itemsLoaded == 0) {
                    this.vitureCount = 1;
                    Ticker.getInstance().registerTick(this.onTimer, this, 50);
                } else {
                    Ticker.getInstance().unRegisterTick(this.onTimer, this);
                }
            }
        }
        private onTimer(): void {
            this.vitureCount++;
            if (this.vitureCount < 100) {
                this._txProgress.text = Math.round(this.vitureCount) + "%";
            }
        }
        /**
         * @description 设置loading提示
         */
        public setLoadingTip(msg: string): void {
            Ticker.getInstance().unRegisterTick(this.onTimer, this);
            NotifyManager.registerNotify(StageUtil.STAGE_RESIZE, this.updateSize, this);
            LayerManager.instance.addDisplay(this, LayerConst.TOP);
            if (this._txProgress) {
                this._txProgress.text = msg;
            }
        }
        /**
         * @description 关闭loading
         */
        public close(): void {
            NotifyManager.unRegisterNotify(StageUtil.STAGE_RESIZE, this.updateSize, this);
            Ticker.getInstance().unRegisterTick(this.onTimer, this);
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }
    }
}
