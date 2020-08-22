
module qmr
{
	/**
 	* 平台工厂
	* dear_H
 	*/
	export class PlatformFactory
	{
		public constructor()
		{

		}

		/**
		 * 创建一个平台
		 */
		public static creatPlatform(platformId: number): BasePlatform
		{
			let basePlatform: BasePlatform;
			switch (platformId)
			{
				case PlatformEnum.P_SLOGAME_DEBUG:
					basePlatform = new CommonGamePlatform();
					break;
				
			}
			return basePlatform;
		}
	}
}