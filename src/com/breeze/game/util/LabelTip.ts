module qmr
{
	export class LabelTip
	{
		private label: eui.Label


		private static instance: LabelTip;

		private constructor()
		{

		}

		public static getInstance(): LabelTip
		{
			if (!LabelTip.instance)
			{
				LabelTip.instance = new LabelTip();
			}

			return LabelTip.instance;
		}



		// public showTips(str: string): void
		// {
		// 	if (GlobalConfig.bIsReportLog == true)
		// 	{
		// 		let label = new eui.Label(str);
		// 		label.width = 500;
		// 		label.y = 800;
		// 		label.x = 100;
		// 		label.textColor = 0x000000;

		// 		qmr.StageUtil.stage.addChild(label);
		// 		egret.Tween.get(label).to({ y: 200 }, 5000).call(() =>
		// 		{
		// 			qmr.StageUtil.stage.removeChild(label);
		// 		}, this);
		// 	}
		// }

	}

}