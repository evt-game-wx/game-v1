module qmr
{
	/**
	 * <p> <code>Pool</code> 是对象池类，用于对象的存储、重复使用。</p>
	 * <p>合理使用对象池，可以有效减少对象创建的开销，避免频繁的垃圾回收，从而优化游戏流畅度。</p>
	 */
	export class Pool
	{
		/**@private 唯一标志 */
		private static POOLSIGN: string = "__InPool";
		/**@private  对象存放池。*/
		private static _poolDic: Object = {};
		/**@private */
		private static _gid: number = 1;

		/**
		 * 根据对象类型标识字符，获取对象池。
		 * @param sign 对象类型标识字符。
		 * @return 对象池。
		 */
		public static getPoolBySign(sign: string): any[]
		{
			return Pool._poolDic[sign] || (Pool._poolDic[sign] = []);
		}

		/**
		 * 清除对象池的对象。
		 * @param sign 对象类型标识字符。
		 */
		public static clearBySign(sign: string): void
		{
			if (Pool._poolDic[sign]) Pool._poolDic[sign].length = 0;
		}

		/**
		 * 返回类的唯一标识
		 */
		private static _getClassSign(cla: any): string
		{
			var className: string = cla["name"];
			if (className == "" || className == undefined)
			{
				cla["name"] = className = this.getGID() + "";
			}
			return className;
		}

		/**
		 * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
		 * <p>当对象池中无此类型标识的对象时，则根据传入的类型，创建一个新的对象返回。</p>
		 * @param sign 对象类型标识字符。
		 * @param cls 用于创建该类型对象的类。
		 * @return 此类型标识的一个对象。
		 */
		public static getItemByClass(sign: string, cls: any): any
		{
			if (!this._poolDic[sign]) return new cls();

			var pool: any[] = this.getPoolBySign(sign);
			if (pool && pool.length)
			{
				var rst: Object = pool.pop();
				rst[this.POOLSIGN] = false;
			} else
			{
				rst = new cls();
			}
			return rst;
		}

		/**
		 * 将对象放到对应类型标识的对象池中。
		 * @param sign 对象类型标识字符。
		 * @param item 对象。
		 */
		public static recover(sign: string, item: Object): void
		{
			if (!item) return;
			if (item[this.POOLSIGN]) return;
			item[this.POOLSIGN] = true;
			this.getPoolBySign(sign).push(item);
		}

		public static isInPool(item: Object): boolean
		{
			if (item && item[this.POOLSIGN]) return true;
			return false;
		}

		/**
		 * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
		 * <p>当对象池中无此类型标识的对象时，则使用传入的创建此类型对象的函数，新建一个对象返回。</p>
		 * @param sign 对象类型标识字符。
		 * @param createFun 用于创建该类型对象的方法。
		 * @param caller this对象
		 * @return 此类型标识的一个对象。
		 */
		public static getItemByCreateFun(sign: string, createFun: Function, caller: any = null): any
		{
			var pool: any[] = this.getPoolBySign(sign);
			var rst: Object = pool.length ? pool.pop() : createFun.call(caller);
			rst[this.POOLSIGN] = false;
			return rst;
		}

		/**
		 * 根据传入的对象类型标识字符，获取对象池中已存储的此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
		 * @param sign 对象类型标识字符。
		 * @return 对象池中此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
		 */
		public static getItem(sign: string): any
		{
			var pool: any[] = this.getPoolBySign(sign);
			var rst: Object = pool.length ? pool.pop() : null;
			if (rst)
			{
				rst[this.POOLSIGN] = false;
			}
			return rst;
		}

		/**获取一个全局唯一ID。*/
		public static getGID(): number
		{
			return this._gid++;
		}
	}

}