module qmr
{
	export class StageUtil
	{
		/**游戏帧频 */
		public static FRAME_RATE:number = 60;
		private static lastOrientation: string | number;
		public static STAGE_RESIZE: string = "stage_resize";           //舞台尺寸发生变化
		public static STAGE_ACTIVE: string = "stage_active";           //当舞台获得焦点
		public static STAGE_DEACTIVATE: string = "stage_deactivate";   //当舞台失去焦点
		public static DESIGN_WIDTH: number = 750;           //舞台默认宽度
		public static DESIGN_HEIGHT: number = 1334;           //舞台默认高度
		public static STANDARD_RATIO: number = 1.78;//标准比例
		/**可适配的最大高宽比，值会与平台配置文件覆盖，但当配置值大于默认值时使用默认值 */
		public static MAX_HW_RATIO: number = 2.16;
		/**可适配的最小高宽比，值会被平台配置文件覆盖，但当配置值小于默认值时使用默认值 */
		public static MIN_HW_RATIO: number = 1.333;
		public static stage: egret.Stage;
		public static maxStageWidth: number = 0;
		public static maxStageHeight: number = 0;

		/**
		 * @description 获取舞台宽度
		 */
		public static get stageWidth()
		{
			return StageUtil.stage.stageWidth;
		}
		/**
		 * @description 获取舞台高度
		 */
		public static get stageHeight(): number
		{
			return StageUtil.stage.stageHeight;
		}

		/**
		 * 
		 * @param value 设置舞台帧频
		 */
		public static setStageFrameRate(value:number):void
		{
			StageUtil.stage.frameRate = value;
		}

		public static getStageFrameRate():number
		{
			return StageUtil.stage.frameRate;
		}
		public static init(stage): void
		{
			StageUtil.stage = stage;
			let t = StageUtil;
			t.maxStageWidth = Math.floor(t.DESIGN_HEIGHT/t.MIN_HW_RATIO);
			t.maxStageHeight = Math.floor(t.DESIGN_WIDTH*t.MAX_HW_RATIO);
			t.setStageFrameRate(t.FRAME_RATE);
			if(PlatformManager.instance.platform.canResizeStage)
			{
				t.changeStageSize();
				window.addEventListener("resize", t.changeStageSize);
			}
		}

		/**
		 * @description 注册舞台事件
		 */
		public static changeStageSize(): void
		{
			let t = StageUtil;
			let updateStageScaleMode = function ()
			{
				let scaleMode: string = "";
				let contentWidth: number = 0;
				let contentHeight: number = 0;
				let hwRatio: number = window.innerHeight / window.innerWidth;
				if(hwRatio >= t.MAX_HW_RATIO)
				{
					scaleMode = egret.StageScaleMode.SHOW_ALL;
					contentWidth = t.DESIGN_WIDTH;
					contentHeight = t.maxStageHeight;
				} else if(hwRatio >= t.STANDARD_RATIO){
					scaleMode = egret.StageScaleMode.FIXED_WIDTH;
					contentWidth = t.DESIGN_WIDTH;
					contentHeight = t.DESIGN_HEIGHT;
				} else if(hwRatio > t.MIN_HW_RATIO) {
					scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
					contentWidth = t.DESIGN_WIDTH;
					contentHeight = t.DESIGN_HEIGHT;
				} else {
					scaleMode = egret.StageScaleMode.SHOW_ALL;
					contentWidth = t.maxStageWidth;
					contentHeight = t.DESIGN_HEIGHT;
				}
				// console.log("舞台 scaleMode=" + scaleMode + " contentWidth=" + contentWidth + " contentHeight=" + contentHeight);
				t.stage.scaleMode = scaleMode;
				t.stage.setContentSize(contentWidth, contentHeight);
				NotifyManager.sendNotification(StageUtil.STAGE_RESIZE);
			}
			updateStageScaleMode();
			if(egret.Capabilities.os.toUpperCase() == "IOS")
			{
				egret.setTimeout(updateStageScaleMode, this, 100);
			} 
			// console.log("舞台 stageWidth=" + StageUtil.stageWidth + " stageHeight" + StageUtil.stageHeight);
		}
		/**
		 * @description 操作stage的舞台可点事件和非可点事件
		 */
		public static stageEnable(value: boolean): void
		{
			if (this.stage)
			{
				this.stage.touchChildren = value;
			}
		}

		/**
		 * 是否是电脑登录
		 */
		public static isPC(): boolean
		{
			var userAgentInfo: string = navigator.userAgent.toString();
			var Agents: string[] = ["Android", "iPhone",
				"SymbianOS", "Windows Phone",
				"iPad", "iPod"];
			var flag: boolean = true;
			for (var v = 0; v < Agents.length; v++)
			{
				if (userAgentInfo.indexOf(Agents[v]) > 0)
				{
					flag = false;
					break;
				}
			}
			return flag;
		}
	}
}
