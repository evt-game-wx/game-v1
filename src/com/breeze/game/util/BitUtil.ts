module qmr {
	/**
	 * @description 位操作类
	 */
	export class BitUtil {
		public constructor() {
		}
		/**
		 * @description 检测一个int值的某一位是否有效，1代表有效，0代表无效
		 */
		public static checkAvalibe(code:number,bit:number):boolean{
			let result:boolean=false;
			if(((code>>bit-1)&1)==1){
				result=true;
			}
			return result;
		}
		/**
		 * @description 改变某个int值的某一位,并返回修改后的int值
		 */
		public static changeBit(code:number,bit:number,value:number):number{
			let pow: number = Math.pow(2, (bit - 1));
			if(code&pow){
				if(!value){
					code=code-pow;
				}
			}else{
				if(value){
					code=code+pow;
				}
			}
			return code;
		}

		/**
		 * @description 整型转化为byte数组
		 */
        private static inToBytes(value: number): Array<number> {
            let byte: Array<number> = [];
            byte[0] = (value >> 24) & 0xFF;
            byte[1] = (value >> 16) & 0xFF;
            byte[2] = (value >> 8) & 0xFF;
            byte[3] = value & 0xFF;
            return byte;
        }
	}
}