module qmr {
	export class LayerMaskSprite {
		private mask: egret.Sprite;
		private _isAlpha0: boolean;

		public constructor() {
			this.mask = new egret.Sprite();
		}

		public static getLayerMaskSprite(): LayerMaskSprite {
			var card: LayerMaskSprite = Pool.getItemByClass("LayerMaskSprite", LayerMaskSprite);
			return card;
		}

		public static recovryLayerMaskSprite(card: LayerMaskSprite): void {
			Pool.recover("LayerMaskSprite", card);
		}

		public addMask(layer: string, isAlpha0: boolean = false): void {
			this._isAlpha0 = isAlpha0;
			if (!this.mask) {
				this.mask = new egret.Sprite();
			}
			this.onStageResize();
			this.mask.touchEnabled = true;
			this.mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMaskHandler, this);
			LayerManager.instance.getLayer(layer).addChild(this.mask);
			if (!isAlpha0) this.tweenAddMask();
		}

		private onClickMaskHandler(evt: any): void {
			if (this.mask && this.mask.parent) {
				let count = this.mask.parent.numChildren;
				if (count > 1) {
					let win = this.mask.parent.getChildAt(count - 1);
					if (win instanceof SuperBaseModule) {
						if (win.isClickHide) {
							win.hide();
						}
					}
				}
			}
		}

		private tweenAddMask() {
			if (this.mask && this.mask.parent) {
				egret.Tween.resumeTweens(this.mask);
				egret.Tween.get(this.mask).to({ alpha: 1 }, 120);
			}
		}

		public tweenRemoveMask() {
			let mask = this.mask;
			if (mask && mask.parent) {
				if (mask.alpha > 0) {
					mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMaskHandler, this);
					egret.Tween.resumeTweens(mask);
					egret.Tween.get(mask).to({ alpha: 0 }, 100).call(this.removeMask, this);
				}
				else {
					this.removeMask();
				}
			}
		}

		public onStageResize(): void
		{
			let w = this.stageWidth;
			let h = this.stageHeight;
			this.mask.graphics.clear();
			this.mask.graphics.beginFill(0x000000, this._isAlpha0 ? 0 : 0.6);
			this.mask.graphics.drawRect(0, 0, w, h);
			this.mask.graphics.endFill();
			this.mask.width = w;
			this.mask.height = h;
		}

		private removeMask(): void {
			let mask = this.mask;
			if (mask && mask.parent) {
				mask.graphics.clear();
				mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMaskHandler, this);
				mask.parent.removeChild(mask);
			}
			this.dispose();
		}

		private get stageWidth(): number {
			return StageUtil.stageWidth;
		}

		private get stageHeight(): number {
			return StageUtil.stageHeight;
		}

		private reset() {
		}

		private dispose() {
			this.reset();
			LayerMaskSprite.recovryLayerMaskSprite(this);
		}
	}
}