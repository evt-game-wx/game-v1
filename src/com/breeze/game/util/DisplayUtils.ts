module qmr
{
	export class DisplayUtils
	{
		public static removeAllChild(dis: egret.DisplayObjectContainer): void
		{
			if (!dis) return;
			while (dis.numChildren)
			{
				var c = dis.removeChildAt(0);
			}
		}

		public static removeDisplay(dis: egret.DisplayObject, parent: egret.DisplayObjectContainer = null): void
		{
			if (!dis) return;
			if (!parent)
			{
				parent = dis.parent;
			}
			if (!parent) return;
			parent.removeChild(dis);
		}

		public static addDisplayToTop(dis: egret.DisplayObject, parent: egret.DisplayObjectContainer = null): void
		{
			if (!dis) return;
			if (!parent)
			{
				parent = dis.parent;
			}
			if (!parent) return;
			parent.addChild(dis);
		}

		public static removeClick(target: egret.EventDispatcher): void
		{
			let tempEvent;
			for (let name in this.eventDic)
			{
				tempEvent = this.eventDic[name];
				if (tempEvent.target == target)
				{
					tempEvent.target.removeEventListener(tempEvent.type, tempEvent.callBack, tempEvent.thisObject);
					tempEvent.target.removeEventListener(tempEvent.type, tempEvent.callFunc, tempEvent.thisCall);
					delete this.eventDic[name];
					break;
				}
			}
		}

		private static eventDic: any;
		private static touchBeginTaret: any;

		private static lastTime: number;

		public static removeAllEvent(target: egret.EventDispatcher): void
		{
			let code = target.hashCode;
			delete this.eventDic[code + egret.TouchEvent.TOUCH_BEGIN];
			delete this.eventDic[code + egret.TouchEvent.TOUCH_END];
			delete this.eventDic[code + egret.TouchEvent.TOUCH_CANCEL];
			delete this.eventDic[code + egret.TouchEvent.TOUCH_RELEASE_OUTSIDE];
		}

		public static addClick(target: egret.EventDispatcher, callBack: Function, thisObject: any, longPressCallBack: Function = null): void
		{
			if (!target) return;
			if (this.eventDic == null)
			{
				this.eventDic = {};
			}
			if (target instanceof eui.Group)
			{
				target.touchChildren = false;
			}
			var eventParams: any = {};
			eventParams.target = target;
			eventParams.type = egret.TouchEvent.TOUCH_BEGIN;
			eventParams.thisObject = thisObject;
			eventParams.callFunc = this.onTouchBegin;
			eventParams.longPressCallBack = longPressCallBack;
			eventParams.thisCall = this;
			if (target && !this.eventDic[target.hashCode + eventParams.type])
			{
				target.addEventListener(eventParams.type, this.onTouchBegin, this);
				this.eventDic[target.hashCode + eventParams.type] = eventParams;
			}
			var eventParamsEnd: any = {};
			eventParamsEnd.target = target;
			eventParamsEnd.type = egret.TouchEvent.TOUCH_END;
			eventParamsEnd.callBack = callBack;
			eventParamsEnd.thisObject = thisObject;
			eventParamsEnd.callFunc = this.onTouchEnd;
			eventParamsEnd.thisCall = this;
			if (target && !this.eventDic[target.hashCode + eventParamsEnd.type])
			{
				target.addEventListener(eventParamsEnd.type, this.onTouchEnd, this);
				this.eventDic[target.hashCode + eventParamsEnd.type] = eventParamsEnd;
			}

			var eventParamsCancel: any = {};
			eventParamsCancel.target = target;
			eventParamsCancel.type = egret.TouchEvent.TOUCH_CANCEL;
			eventParamsCancel.callBack = callBack;
			eventParamsCancel.thisObject = thisObject;
			eventParamsCancel.callFunc = this.onTouchReleaseCancel;
			eventParamsCancel.thisCall = this;
			if (target && !this.eventDic[target.hashCode + eventParamsCancel.type])
			{
				target.addEventListener(eventParamsCancel.type, this.onTouchReleaseCancel, this);
				this.eventDic[target.hashCode + eventParamsCancel.type] = eventParamsCancel;
			}

			var eventParamsOutSide: any = {};
			eventParamsOutSide.target = target;
			eventParamsOutSide.type = egret.TouchEvent.TOUCH_RELEASE_OUTSIDE;
			eventParamsOutSide.thisObject = thisObject;
			eventParamsOutSide.callFunc = this.onTouchReleaseOutSide;
			eventParamsOutSide.thisCall = this;
			if (target && !this.eventDic[target.hashCode + eventParamsOutSide.type])
			{
				target.addEventListener(eventParamsOutSide.type, this.onTouchReleaseOutSide, this);
				this.eventDic[target.hashCode + eventParamsOutSide.type] = eventParamsOutSide;
			}
		}
		/**
		 * @description 当点击开始
		 */
		private static onTouchBegin(evt: egret.TouchEvent): void
		{
			if (this.touchBeginTaret && this.touchBeginTaret == evt.target)
			{
				return;
			}
			if ((egret.getTimer() - this.lastTime) < 300)
			{
				return;
			}
			this.touchBeginTaret = evt.target;
			this.lastTime = egret.getTimer();
			egret.Tween.get(evt.target).to({ scaleX: 1.1, scaleY: 1.1 }, 50);
			Ticker.getInstance().registerTick(this.longPress, this, 300);
		}
		/**
		 * @description 当点击结束
		 */
		private static onTouchEnd(evt: egret.TouchEvent): void
		{
			let t: any = this;
			let target: any = evt.target;
			if (this.touchBeginTaret != target) return;
			this.touchBeginTaret = null;
			egret.Tween.get(target).to({ scaleX: 1, scaleY: 1 }, 50).call(function ()
			{
				for (let key in t.eventDic)
				{
					let eventParams: any = t.eventDic[key];
					if (eventParams.target == target && eventParams.type == egret.TouchEvent.TOUCH_END)
					{
						eventParams.callBack.call(eventParams.thisObject);
					}
				}
			}, this);

			Ticker.getInstance().unRegisterTick(this.longPress, this);
		}
		/**
		 * @description 当点击结束的时候，按钮不在被点击的对象上
		 */
		private static onTouchReleaseCancel(evt: egret.TouchEvent): void
		{
			if (this.touchBeginTaret != evt.currentTarget) return;
			this.touchBeginTaret && egret.Tween.removeTweens(this.touchBeginTaret);
			this.touchBeginTaret = null;
			evt.currentTarget.scaleX = 1;
			evt.currentTarget.scaleY = 1;
		}
		/**
		 * @description 当点击结束的时候，按钮不在被点击的对象上
		 */
		private static onTouchReleaseOutSide(evt: egret.TouchEvent): void
		{
			if (this.touchBeginTaret != evt.target) return;
			this.touchBeginTaret && egret.Tween.removeTweens(this.touchBeginTaret);
			this.touchBeginTaret = null;
			evt.target.scaleX = 1;
			evt.target.scaleY = 1;
		}

		private static longPress(): void
		{
			let t: any = this;
			for (let key in t.eventDic)
			{
				let eventParams: any = t.eventDic[key];
				if (eventParams.target == this.touchBeginTaret && eventParams.longPressCallBack)
				{
					eventParams.longPressCallBack.call(eventParams.thisObject);
				}
			}
		}

		/**
		 * 发光某个对象
		 */
		public static setGlow(obj: egret.DisplayObject, isGrey: boolean)
		{
			if (isGrey)
			{
				if (!obj.filters || obj.filters.length == 0)
				{
					obj.filters = [FilterUtil.glowFilter];
				}
			}
			else
			{
				obj.filters = [];
			}
		}

		/**
		 * 置灰某个对象,设置按钮不用滤镜了，用setBtnGray 方法
		 */
		public static setGrey(obj: egret.DisplayObject, isGrey: boolean, isSetEnabled: boolean = true)
		{
			if (obj instanceof eui.Button && isSetEnabled)
			{
				obj.enabled = !isGrey;
				return;
			}
			if (isGrey)
			{
				if (!obj.filters || obj.filters.length == 0)
				{
					obj.filters = [FilterUtil.grayFilter];
				}
				if (isSetEnabled) obj.touchEnabled = false;
			}
			else
			{
				obj.filters = [];
				if (isSetEnabled) obj.touchEnabled = true;
			}
		}

		/**
		 * 置灰某个对象
		 */
		public static setBtnGray(obj: eui.Button, isGray: boolean, isSetEnabled: boolean = true, btnSkinType: BtnSkinType = 1)
		{
			if (isGray)
			{
				if (isSetEnabled)
				{
					obj.currentState = "disabled";
					obj.touchEnabled = false;
				}
				else obj.skinName = DisplayUtils.getBtnSkin(btnSkinType, isGray);
			}
			else
			{
				if (isSetEnabled) obj.currentState = "up";
				else obj.skinName = DisplayUtils.getBtnSkin(btnSkinType, isGray);
				obj.touchEnabled = true;
			}
		}

		private static getBtnSkin(btnSkinType: BtnSkinType, isGray: boolean): string
		{
			let skin: string = "ButtonYellowSkin";
			switch (btnSkinType)
			{
				case BtnSkinType.Type_1:
					skin = isGray ? "ButtonYellowDisabledSkin" : "ButtonYellowSkin";
					break;
				case BtnSkinType.Type_2:
					skin = isGray ? "ButtonYellowDisabledSkin1" : "ButtonYellowSkin1";
					break;
			}
			return skin;
		}


		/**
		  * 置灰一组对象
		  */
		public static setGreyGoup(objGoup: egret.DisplayObject[], isGrey: boolean): void
		{
			objGoup.forEach(element =>
			{
				this.setGrey(element, isGrey);
			});
		}

		/**
		 * 设置不可选
		 */
		public static setDisable(obj: egret.DisplayObject, isDisable: boolean): void
		{
			this.setGrey(obj, isDisable);
			obj.touchEnabled = !isDisable;
		}

		//设置一个对象为相对于上个容器位置
		public static LoadResByNameAndWH(obj: egret.DisplayObject, objParent: egret.DisplayObject, width: number, height: number, x: number = 50, y: number = 50)
		{
			obj.width = width;
			obj.height = height;
			obj.anchorOffsetX = obj.width / 2;
			obj.anchorOffsetY = obj.height / 2;
			obj.x = (objParent.width / 100) * x;
			obj.y = (objParent.height / 100) * y;
			return obj;
		}

		/**
		 * 更新星星方法
		 * max-星星组
		 * lightNum-当前要亮的星数
		 */
		public static updateStar(starGroup: eui.Group, lightNum: number): void
		{
			var num: number = starGroup.numChildren;
			var star;
			for (var i: number = 0; i < num; i++)
			{
				star = starGroup.getChildAt(i);
				if (i < lightNum) star.imgStar.visible = true;
				else star.imgStar.visible = false;
			}
		}

		/**
		 * 获取一个对象全局坐标点
		 */
		public static getGlobelPoint(target: any): egret.Point
		{
			if (target.parent)
			{
				return target.parent.localToGlobal(target.x, target.y);
			}
			return null;
		}
	}
}