module qmr {
	export class PlayerNameCfg extends BaseBean
	{
		/**ID*/
	get id():number
	{			
		return this.d["id"];			
	}
	/**姓*/
	get name_xing():string
	{			
		return this.d["name_xing"];			
	}
	/**男名*/
	get name_ming_nan():string
	{			
		return this.d["name_ming_nan"];			
	}
	/**女名*/
	get name_ming_nv():string
	{			
		return this.d["name_ming_nv"];			
	}

		constructor(element)
		{				
			super(element)
		this.key="id";
		}
	}

	export class CodeCfgCfg extends BaseBean
	{
		/**ID*/
	get id():number
	{			
		return this.d["id"];			
	}
	/**消息描述*/
	get msg():string
	{			
		return this.d["msg"];			
	}
	/**消息类型*/
	get type():number
	{			
		return this.d["type"];			
	}

		constructor(element)
		{				
			super(element)
		this.key="id";
		}
	}

	export class MusicCfg extends BaseBean
	{
		/**音效key*/
	get soundType():string
	{			
		return this.d["soundType"];			
	}
	/**音效名字*/
	get soundName():string
	{			
		return this.d["soundName"];			
	}
	/**是否同时播放*/
	get isPlaySameTime():number
	{			
		return this.d["isPlaySameTime"];			
	}

		constructor(element)
		{				
			super(element)
		this.key="soundType";
		}
	}

	export class ClientCnCfg extends BaseBean
	{
		/**键*/
	get id():string
	{			
		return this.d["id"];			
	}
	/**值*/
	get value():string
	{			
		return this.d["value"];			
	}
	/**颜色:1：绿色，0：红色 --默认不填不设置颜色*/
	get colerType():number
	{			
		return this.d["colerType"];			
	}

		constructor(element)
		{				
			super(element)
		this.key="id";
		}
	}

}