module qmr {
	/**
	 * coler
	 * byteArray对象池
	 */
	export class ByteArrayPool {
		private static _instance: ByteArrayPool;
		private byteList: Array<egret.ByteArray>;

		public constructor() {
			this.byteList = [];
			for (let i: number = 0; i < 20; i++) {
				let byte: egret.ByteArray = new egret.ByteArray();
				byte.endian = egret.Endian.BIG_ENDIAN;
				this.byteList.push(byte);
			}
		}

		/**
		 *  获取单例
		 */
		public static getInstance(): ByteArrayPool {
			if (ByteArrayPool._instance == null) {
				ByteArrayPool._instance = new ByteArrayPool();
			}
			return ByteArrayPool._instance;
		}
		/**
		 *  获取一个byteArrary
		 */
		public createByte(): egret.ByteArray {
			if (this.byteList.length > 0) {
				return this.byteList.shift();
			}
			let byte: egret.ByteArray = new egret.ByteArray();
			byte.endian = egret.Endian.BIG_ENDIAN;
			return byte;
		}
		/**
		 *  回收一个byteArrary
		 */
		public recycleByte(byte: egret.ByteArray): void {
			byte.clear();
			this.byteList.push(byte);
		}
	}
}