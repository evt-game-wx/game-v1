module qmr
{
	/**
	 * <code>Dictionary</code> 是一个字典型的数据存取类。
	 */
	export class Dictionary
	{
		private _values: any[] = [];
		private _keys: any = [];

		/**
		 * 获取所有的子元素列表。
		 */
		public get values(): any[]
		{
			return this._values;
		}

		public set values(v: any[])
		{
			this._values = v;
		}

		/**
		 * 获取所有的子元素键名列表。
		 */
		public get keys(): any[]
		{
			return this._keys;
		}
		public set keys(v: any[])
		{
			this._keys = v;
		}

		/**
		 * 给指定的键名设置值。
		 * @param	key 键名。
		 * @param	value 值。
		 */
		public set(key: any, value: any): void
		{
			var index: number = this.indexOf(key);
			if (index >= 0)
			{
				this._values[index] = value;
				return;
			}
			this._keys.push(key);
			this._values.push(value);
		}
		
		/** 紧限于解析配置时使用 */
		public setConf(key: any, value: any): void
		{
			this._keys.push(key);
			this._values.push(value);
		}

		/**
		 * 获取指定对象的键名索引。
		 * @param	key 键名对象。
		 * @return 键名索引。
		 */
		public indexOf(key: Object): number
		{
			var index: number = this._keys.indexOf(key);
			if (index >= 0) return index;
			key = (key instanceof String) ? Number(key) : ((key instanceof Number) ? key.toString() : key);
			return this._keys.indexOf(key);
		}

		/**
		 * 返回指定键名的值。
		 * @param	key 键名对象。
		 * @return 指定键名的值。
		 */
		public get(key: any): any
		{
			var index: number = this.indexOf(key);
			return index < 0 ? null : this._values[index];
		}

		/**
		 * 是否有这个键
		 */
		public has(key: any): any
		{
			var index: number = this.indexOf(key);
			return index >= 0;
		}

		/**
		 * 数据长度
		 */
		public get length(): number
		{
			return this.keys.length;
		}

		/**
		 * 移除指定键名的值。
		 * @param	key 键名对象。
		 * @return 是否成功移除。
		 */
		public remove(key: any): Boolean
		{
			var index: number = this.indexOf(key);
			if (index >= 0)
			{
				this._keys.splice(index, 1);
				this._values.splice(index, 1);
				return true;
			}
			return false;
		}

		/**
		 * 清除此对象的键名列表和键值列表。
		 */
		public clear(): void
		{
			this._values.length = 0;
			this._keys.length = 0;
		}
	}
}
