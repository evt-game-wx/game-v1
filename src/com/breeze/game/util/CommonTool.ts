module qmr {
	export class CommonTool {
		public constructor() {
		}

		public static getMsg(...arg):string
		{
			var s:string = arg.shift();
			for (var key in arg)
			{
				var value:any = arg[key];
				s = s.replace(/\{\d+\}/,value);
			}
			return s;
		}
	}
}