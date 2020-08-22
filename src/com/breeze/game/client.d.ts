declare module qmr {
	class EntryAfterLogin 
	{
		public static setup();
	}

	class EntryCreateRole
    {
        public static setup();
    }
    
	export class RechargeCfg
	{
		/**ID*/
        id:number;
        /**爱微游
        渠道商品ID*/
        product_id:number;
        /**类型 
        1充值 
        2月卡 
        3四倍返利  
        4成长基金 
        5投资返利*/
        type:number;
        /**档位 */
        level:number;
        /**名称*/
        name:string;
        /**充值元宝数*/
        rechargeVal:number;
        /**累计充值数*/
        cumulVal:number;
        /**累计充值数*/
        icon:number;
        /**是否元宝购买
        如果是元宝购买则消耗档位那一栏的元宝数量*/
        isYB:number;
        /**根据类型来选择格式：
        有目标的：奖励目标1,奖励目标2
        月卡：总天数*/
        target:string;
        /**根据类型来选择格式：
        有目标的：达成目标1奖励掉落id，达成目标2的奖励掉落id
        月卡：每天奖励掉落id 
        一元限购：奖励物品拼接*/
        targeReward:string;
        /**额外奖励(掉落id)*/
        extraBouns:string;
        /**直购礼包展示的价值*/
        directPayment:number;

	}

	export class ItemConfigCfg
	{

    }

	class GuildModel
	{
		public ownGuildId: number;
		public guildName: string;
	}

	class HeroModel
	{
		/**玩家编号*/
		public playerId: number;
		/**玩家名字*/
		public name: string;
		/**金币*/
		public money: number;
		/**等级*/
		public level: number;
		/**钻石*/
		public diamond: number;
		/**VIP等级*/
		public vipLevel: number;
		/** 创角时间, 单位秒 */
		public createTime: number;
		/**个人总战力*/
		public fightVal: number;

	}

	class MessageID 
	{
		public static init();
		public static getMsgNameById(id: number): string;
	}

	class ProtoMsgIdMap
	{
		public static instance: ProtoMsgIdMap;
		public msgIdMap: any;
	}

	class TSHelper {
		public handleHeroCfgJson(target: any);
		public static instance: TSHelper;
	}
}