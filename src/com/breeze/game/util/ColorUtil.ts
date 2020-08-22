module qmr
{
	export class ColorUtil
	{

		/**
		 * @desc 根据品质返回对应颜色
		 */
		public static getColorByQuality(quality: number): number
		{
			switch (quality)
			{
				case 1:
					return ColorQualityConst.COLOR_G;//默认颜色改成默认颜色试试
				//return ColorConst.COLOR_WHITE;
				case 2:
					return ColorQualityConst.COLOR_GREEN;
				case 3:
					return ColorQualityConst.COLOR_BLUE;
				case 4:
					return ColorQualityConst.COLOR_VIOLET;
				case 5:
					return ColorQualityConst.COLOR_CADMIUM;
				case 6:
					return ColorQualityConst.COLOR_RED;
				case 7:
					return ColorQualityConst.COLOR_DIAMOND;
			}
			return ColorQualityConst.COLOR_G;
		}

		/**
		 * 若类型为8，则1=绿品，2=蓝品，3=紫品，4=金品，5=红品
		 * @desc 根据subType返回日常任务品质颜色
		 */
		public static getColorBySubType(subType: number): number
		{
			switch (subType)
			{
				case 2:
					return ColorQualityConst.COLOR_GREEN;
				case 3:
					return ColorQualityConst.COLOR_BLUE;
				case 4:
					return ColorQualityConst.COLOR_VIOLET;
				case 5:
					return ColorQualityConst.COLOR_CADMIUM;
				case 6:
					return ColorQualityConst.COLOR_RED;
			}
			return ColorQualityConst.COLOR_G;
		}

		public static getTipColorByType(colorType: number): number
		{
			switch (colorType)
			{
				case 0:
					return 0xFF0000;//红色
				case 1:
					return 0x09a608;//绿色
			}
			return 0xffffff;//白色
		}

	}
}