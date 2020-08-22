module qmr {
	
	//灰质按钮皮肤类型
	export enum BtnSkinType
	{
		Type_1 = 1,//ButtonYellowSkin, ButtonYellowDisabledSkin
		Type_2 = 2,//ButtonYellowSkin1，ButtonYellowDisabledSkin1
	}

	//消息频道	1系统信息/公告  2世界聊天  3组队聊天  4私聊  5帮会聊天	6跨服聊天
	export enum CHAT_CHANNELID
	{
		SYSTEM = 1,
		WORLD = 2,
		TEAM = 3,
		SELF = 4,
		UNION = 5,
		CROSS = 6
	}
}