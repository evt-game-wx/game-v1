module qmr
{
	/**
	 *
	 * @description 全局计数器，协议发送用的，每用一次，数字递增一次
	 *
	 */
	export class PbGlobalCounter
	{
		private static instance: PbGlobalCounter;
		public static maxReconnectCount: number = 3;
		private _counter: number = -1;
		public constructor()
		{
		}
		/**
		 * @description 获取单例对象
		 */
		public static getInstance(): PbGlobalCounter
		{
			if (PbGlobalCounter.instance == null)
			{
				PbGlobalCounter.instance = new PbGlobalCounter();
			}
			return PbGlobalCounter.instance;
		}
		/**
		 * @description 获取当前序列号
		 */
		public getCountter(): number
		{
			this._counter += 1
			return this._counter;
		}
		/**
		 * @description 重置序列号
		 */
		public resetCounter(): void
		{
			this._counter = -1;
		}
	}
}
