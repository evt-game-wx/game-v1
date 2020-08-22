module qmr {
	/**
	 * coler
	 * int64方法
	 */
	export class Int64Util {
		public static getNumber(d:any):number
		{
			if(d == null || d == "" || isNaN(d)) return 0;
			if(typeof d == 'number') return d;
			return parseFloat(d.toString());
		}

		public static getNumberArr(any:(any)[]):number[]
		{
			let arr:number[] = new Array<number>();
			if(any)
			{
				let value:number;
				for(let i =0; i < any.length; i++)
				{
					value = Int64Util.getNumber(any[i]);
					arr.push(value);
				}
			}
			return arr;
		}
	}

	export function getNumber(d:any):number{
		if(d == null) return 0;
		if(typeof d == 'number') return d;
		return parseFloat(d.toString());
	}
	
	export function getServerNumber(playerId:number):number{
		let server = playerId%10000;
		return server;
	}

	export function getServerNickName(playerId:any, name:string):string{
		let id = getNumber(playerId);
		let server = getServerNumber(id);
		return "S" + server + "." + name;
	}
}