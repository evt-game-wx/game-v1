module qmr {
	/**
	 *
	 * @description 动作状态枚举
	 *
	 */
	export class Status {
		public static IDLE:string="idle";                   //待机状态
		public static ATTACK:string="attack";               //攻击状态
		public static ATTACK2:string="attack2";             //攻击状态2
		public static MOVE:string="move"                    //行走状态
		public static FLY:string="move"                    	//飞行状态
		public static DEAD:string="death";                  //死亡状态
		public static SKILL:string="skill";                 //释法动作1
		public static SKILL2:string="skill2";                 //释法动作2
        public static IDLE_RIDE: string ="idle_ride";       //坐骑待机状态
        public static MOVE_RIDE: string ="move_ride";       //坐骑行走状态
		public static ATTACK_RIDE:string="attack_ride";     //坐骑攻击状态
		public static JUMP:string = "fly";                   //跳跃状态
		public static JUMP_ATTACK:string="jump_attack";		//跳斩,没有坐骑状态的跳斩
		public static STAND:string="stand";					//站立展示的，用于在面板上显示
		public static PICK:string="pick";					//拾取状态
		public static UI_SHOW:string="ui_show";				//ui上面的式神跳舞动画
		public static UI_SHOW1:string="ui_show_1";			//ui上面的式神升级跳舞动画
		public static UI_IDLE:string="ui_idle";				//ui上面的式神待机动画
	}
}
