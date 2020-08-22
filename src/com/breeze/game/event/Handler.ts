module qmr
{
	/**
	 * 事件处理器类
	 * dear_H
	 */
	export class Handler
	{
		/**@private handler对象池*/
		private static _pool: any[] = [];
		protected _id: number = 0;
		/**@private */
		private static _gid: number = 1;

		/** 执行域*/
		public caller: any;
		/** 处理方法。*/
		public method: Function;
		/** 参数。*/
		public args: Array<any>;
		/** 表示是否只执行一次。如果为true，回调后执行recover()进行回收，回收后会被再利用，默认为false 。*/
		public once: boolean;

		/**
		 * 根据指定的属性值，创建一个 <code>Handler</code> 类的实例。
		* @param	caller 执行域。
		* @param	method 处理函数。
		* @param	args 函数参数。
		* @param	once 是否只执行一次。
		*/
		public constructor(caller?: any, method?: Function, args?: Array<any>, once?: boolean)
		{
			this.setTo(caller, method, args, once);
		}

		/**
		 * 设置此对象的指定属性值。
		 * @param	caller 执行域(this)。
		 * @param	method 回调方法。
		 * @param	args 携带的参数。
		 * @param	once 是否只执行一次，如果为true，执行后执行recover()进行回收。
		 * @return  返回 handler 本身。
		 */
		public setTo(caller: any, method: Function, args: Array<any>, once: boolean): Handler
		{
			this._id = Handler._gid++;
			this.caller = caller;
			this.method = method;
			this.args = args;
			this.once = once;
			return this;
		}

		/**执行处理器。*/
		public run(): any
		{
			if (this.method == null) return null;
			var id: number = this._id;
			var result: any = this.method.apply(this.caller, this.args);
			this._id === id && this.once && this.recover();
			return result;
		}

		/**执行处理器，携带额外数据。 */
		public runWith(data: any): any
		{
			if (this.method == null) return null;
			var id: number = this._id;
			var result: any
			if (this.args) result = this.method.apply(this.caller, this.args.concat(data));
			else result = this.method.apply(this.caller, data);
			this._id === id && this.once && this.recover();
			return result;
		}

		/**
		 * 回收
		 */
		public recover(): void
		{
			if (this._id > 0)
			{
				this._id = 0;
				Handler._pool.push(this.clear());
			}
		}

		/**
		 * 从对象池内创建一个Handler，默认会执行一次并立即回收，如果不需要自动回收，设置once参数为false。
		 * @param	caller 执行域(this)。
		 * @param	method 回调方法。
		 * @param	args 携带的参数。
		 * @param	once 是否只执行一次，如果为true，回调后执行recover()进行回收，默认为true。
		 * @return  返回创建的handler实例。
		 */
		public static create(caller: any, method: Function, args: any[] = null, once: boolean = true): Handler
		{
			if (this._pool.length) return this._pool.pop().setTo(caller, method, args, once);
			return new Handler(caller, method, args, once);
		}

		/**清理对象引用。 */
		public clear(): Handler
		{
			this.caller = null;
			this.method = null;
			this.args = null;
			return this;
		}

	}
}