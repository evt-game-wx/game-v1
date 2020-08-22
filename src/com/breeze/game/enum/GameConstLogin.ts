module qmr{
	//音乐类型
	export enum MusicType
	{
		BG_MUSIC = 1,			  //背景音乐
		EFFECT_MUSIC = 2,			//特效音乐
	}

	/**主角武将id枚举*/
	export enum WarriorRole
	{
		ROLE_MALE = 101, //主角男
		ROLE_FEMALE = 102, //主角女
	}

	export enum ColorQualityConst
	{
		COLOR_G = 0x8a5c2b,//咖啡色
		COLOR_GREEN = 0x09a608,//绿色
		COLOR_BLUE = 0x2186cc,//蓝色
		COLOR_VIOLET = 0xff28e8,//紫色0x7f1981
		COLOR_CADMIUM = 0xe65506,//金色bb870c
		COLOR_RED = 0xdd1900,//红色
		COLOR_DIAMOND = 0x489bc2,//钻石
	}

	//背包类型
	export enum BagType
	{
		TIEM = 0,			//道具
		HERO = 1,			//神将
		EQUIP = 2			//装备
	}

	//角色类型
	export enum ActorSizeType
	{
		small = 0,			//基础卡牌
		mid = 1,			//中等卡牌
		big = 2,			//BOSS卡牌
		UI = 3,				//主界面用
	}
	

}


