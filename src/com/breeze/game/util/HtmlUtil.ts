module qmr
{
	export class HtmlUtil
	{
		public static htmlParse: egret.HtmlTextParser = new egret.HtmlTextParser();
		public constructor()
		{
		}

		/**主要处理了\n  读表\n读取有问题 */
		//解析工具已经做了，这里不用搞了
		public static getHtmlString(msg: string): egret.ITextElement[]
		{
			if (msg.indexOf('\\n') > -1)
			{
				let s: any = msg.split("\\n").join("\n");
				return HtmlUtil.htmlParse.parse(s);
			}
			return HtmlUtil.htmlParse.parse(msg);
		}

		public static getHtmlTextElement(msg: string, color: number, isUnderLine: boolean = false, href?: string, strokeColor?: number, stroke?: number): egret.ITextElement[]
		{
			let msgStr = '<font color=' + color;
			if (href) 
			{
				msgStr += " href=event:" + href;
			}
			if (isUnderLine) 
			{
				msgStr += " u='true'";
			}
			if (strokeColor) 
			{
				msgStr += " strokecolor=" + strokeColor;
			}
			if (stroke) 
			{
				msgStr += " stroke=" + stroke;
			}
			msgStr += ">" + msg + '</font>'
			return HtmlUtil.getHtmlString(msgStr);
		}

		/**
		 * @desc 返回对应颜色的html字符串
		 */
		public static getHtmlText(msg: string, color: number, isUnderLine: boolean = false, href?: string): string
		{
			if (href && isUnderLine) return '<font color=' + color + " href=event:" + href + " u='true'>" + msg + '</font>';
			if (href) return '<font color=' + color + " href=event:" + href + ">" + msg + '</font>';
			if (isUnderLine) return '<font color=' + color + " u='true'>" + msg + '</font>';
			return '<font color=' + color + ">" + msg + '</font>';
		}

		public static getColorSize(msg: string, color: number, size?: number): string
		{
			if (size) return '<font color=' + color + " size=" + size + ">" + msg + '</font>';
			return '<font color=' + color + ">" + msg + '</font>';
		}

		/**
		 * @desc 返回对应颜色的html字符串
		 */
		public static getHtmlTexts(data: Array<Array<any>>): any
		{
			var temp = [];
			for (let i = 0; i < data.length; i++)
			{
				temp.push(this.getHtmlText(data[i][1], data[i][0], data[i][2], data[i][3]));
			}
			return temp.join("");
		}
		/**
		 * @desc 针对道具类特殊的html字符串返回
		 * @param itemDataId道具配置Id
		 * @param count数量
		 */
		public static getItemHtmlText(itemDataId: number, count: number): string
		{
			let msg: string = "";
			// let itemData:ItemData = SingleModel.getInstance().packModel.getItemData(itemDataId);
			// if(itemData){
			// 	msg+='<font color='+ColorUtil.getColorByQuality(itemData.color)+'>'+itemData.name+'</font>';
			// 	msg+='<font color='+ColorConst.COLOR_WHITE+'>'+" x "+count+'</font>';
			// }else{
			// 	msg="未知道具Id["+itemDataId+"]";
			// }
			return msg;
		}

		public static log(...args): string
		{
			var backStr: string = "args:";
			for (var i in args)
			{
				if (!qmr.PlatformConfig.isDebug || !args) return;
				backStr += args[i] + "\n";
			}
			return backStr
		}

	}
}