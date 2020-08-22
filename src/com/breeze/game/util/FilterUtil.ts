module qmr
{
	export class FilterUtil
	{
		/**
		 * 灰态
		 */
		public static grayFilter: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0, 0, 0, 1, 0
		]);
		public static glowFilter: egret.GlowFilter = new egret.GlowFilter(
			0xfff200, 0.8, 35, 35, 2, egret.BitmapFilterQuality.HIGH, false, false
		);
	}
}