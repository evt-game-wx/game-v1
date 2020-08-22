module qmr {
	export class StringUtilsBase {
		/**
		 * {0}{1}....
		 * 
		 */
		public static getmsg(...arg): string
		{
			var s: string = arg.shift();
			for (var key in arg)
			{
				var value: any = arg[key];
				s = s.replace(/\{\d+\}/, value);
			}
			return s;
		}

	}
}