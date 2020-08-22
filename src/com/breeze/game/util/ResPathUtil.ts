module qmr
{
	export class ResPathUtil
	{
		/** 获取bg图路径 */
		public static getBgUrl(resName: string)
		{
			return SystemPath.bgPath + resName + ".png";
		}

		/** 地图资源路径 */
		public static getMapUrl(mapName: string)
		{
			return SystemPath.mapPath + mapName + ".jpg";
		}
	}
}